import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = (process.argv[2] ?? '').replace(/\/$/, '')
if (!base) {
  console.error('Uso: node scripts/check-wp.mjs <baseUrl>')
  process.exit(2)
}

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let fallos = 0

function check(nombre, ok, detalle = '') {
  if (!ok) fallos++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nombre}${!ok && detalle ? `: ${detalle}` : ''}`)
}

const mismasLlaves = (obj, llaves) =>
  obj !== null &&
  typeof obj === 'object' &&
  JSON.stringify(Object.keys(obj).sort()) === JSON.stringify([...llaves].sort())

function wp(...args) {
  const r = spawnSync(
    'docker',
    ['compose', '-f', 'wordpress/compose.yml', 'run', '--rm', '-T', 'wpcli', 'wp', ...args],
    { cwd: raiz, encoding: 'utf8' },
  )
  return { ok: r.status === 0, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim() }
}

function llavesProhibidas(valor, ruta = '$') {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => llavesProhibidas(v, `${ruta}[${i}]`))
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) => [
      ...(/author|autor|email|correo|user|usuario/i.test(k) ? [`${ruta}.${k}`] : []),
      ...llavesProhibidas(v, `${ruta}.${k}`),
    ])
  }
  return []
}

const res = await fetch(`${base}/wp-json/jac-gr/v1/contenido`)
check('status 200', res.status === 200, String(res.status))
check('content type JSON', (res.headers.get('content-type') ?? '').includes('application/json'))
check('Cache-Control con max-age=60', /max-age=60/.test(res.headers.get('cache-control') ?? ''), res.headers.get('cache-control') ?? '')

const data = await res.json().catch(() => ({}))
check('4 llaves de primer nivel', mismasLlaves(data, ['alerta', 'avisos', 'contactos', 'puntos']), Object.keys(data).join(','))

const niveles = ['verde', 'amarilla', 'naranja', 'roja']
check(
  'alerta es null o tiene la forma del contrato',
  data.alerta === null ||
    (mismasLlaves(data.alerta, ['nivel', 'titulo', 'descripcion', 'fuente', 'actualizada']) && niveles.includes(data.alerta.nivel)),
)

const avisos = Array.isArray(data.avisos) ? data.avisos : []
check('hay avisos y no pasan de 20', avisos.length > 0 && avisos.length <= 20, String(avisos.length))
check(
  'cada aviso tiene exactamente las llaves del contrato',
  avisos.every(
    (a) =>
      mismasLlaves(a, ['id', 'titulo', 'resumen', 'link', 'publicada', 'evento']) &&
      mismasLlaves(a.evento, ['tipo', 'fecha', 'lugar']) &&
      ['comunicado', 'simulacro', 'taller'].includes(a.evento.tipo) &&
      /^(|\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(a.evento.fecha),
  ),
)
check('no aparece el borrador', !avisos.some((a) => a.titulo.includes('Borrador que no debe salir')))
check('no aparece la entrada de otra categoría', !avisos.some((a) => a.titulo.includes('otra categoría')))

const sucio = avisos.find((a) => a.titulo === 'Aviso con datos sucios')
check('aparece el aviso con datos sucios', Boolean(sucio))
check('sucio: tipo comunicado', sucio?.evento.tipo === 'comunicado', sucio?.evento.tipo)
check('sucio: fecha vacía', sucio?.evento.fecha === '', JSON.stringify(sucio?.evento.fecha))
check('sucio: lugar Salón sin etiquetas', sucio?.evento.lugar === 'Salón', JSON.stringify(sucio?.evento.lugar))
check('sucio: resumen vacío sin extracto manual', sucio?.resumen === '', JSON.stringify(sucio?.resumen))
check('ningún texto trae etiquetas HTML', !/<[a-z/][^>]*>/i.test(JSON.stringify(data)))

const contactos = Array.isArray(data.contactos) ? data.contactos : []
check(
  'contactos con las llaves del contrato',
  contactos.length > 0 &&
    contactos.every((c) => mismasLlaves(c, ['id', 'nombre', 'grupo', 'cargo', 'sector', 'telefono']) && ['junta', 'lider', 'comite'].includes(c.grupo)),
)

const puntos = Array.isArray(data.puntos) ? data.puntos : []
check(
  'puntos con las llaves del contrato',
  puntos.length > 0 &&
    puntos.every(
      (p) =>
        mismasLlaves(p, ['id', 'tipo', 'nombre', 'descripcion', 'referencia', 'coordenadas']) &&
        ['encuentro', 'ruta', 'riesgo'].includes(p.tipo) &&
        p.coordenadas.every((c) => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite)),
    ),
)

const prohibidas = llavesProhibidas(data)
check('ninguna llave de autor, correo o usuario', prohibidas.length === 0, prohibidas.join(','))

const migracion = wp('option', 'delete', 'gr_version')
const categorias = wp('eval', 'echo count(get_terms(["taxonomy" => "category", "slug" => "gestion-del-riesgo", "hide_empty" => false]));')
check('migración: la categoría existe una sola vez tras borrar gr_version', migracion.ok && categorias.out.endsWith('1'), categorias.out || categorias.err)
const version = wp('option', 'get', 'gr_version')
check('migración: gr_version queda guardada', version.ok && /^\d+\.\d+\.\d+$/.test(version.out), version.out || version.err)

const roles = wp('role', 'list', '--fields=role', '--format=json')
check('rol gr_app existe', roles.ok && roles.out.includes('"gr_app"'), roles.out || roles.err)
const caps = wp('eval', 'echo json_encode(array_keys(array_filter(get_role("gr_app")->capabilities)));')
check('rol gr_app solo tiene read', caps.out.endsWith('["read"]'), caps.out || caps.err)

process.exit(fallos ? 1 : 0)
