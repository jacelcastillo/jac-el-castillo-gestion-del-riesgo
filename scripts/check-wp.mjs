import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const prod = args.includes('--prod')
const base = (args.find((a) => !a.startsWith('--')) ?? '').replace(/\/$/, '')
if (!base) {
  console.error('Uso: node scripts/check-wp.mjs <baseUrl> [--prod]')
  process.exit(2)
}

const sitioNuevo = 'https://web.jacelcastillo.com.co'

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

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function pedir(ruta, opciones = {}) {
  for (let intento = 1; intento <= 3; intento++) {
    const res = await fetch(`${base}${ruta}`, opciones)
    const texto = await res.text()
    const reto = (res.headers.get('content-type') ?? '').includes('text/html') && texto.includes('One moment, please')
    if (!reto) return { res, texto }
    if (intento < 3) await espera(10_000)
  }
  console.error(`Reto anti-bot del hosting en ${base}${ruta}. Reintenta más tarde o desde otra red.`)
  process.exit(3)
}

const sinRedirigir = { redirect: 'manual' }

const { res, texto: cuerpo } = await pedir('/wp-json/jac-gr/v1/contenido')
check('status 200', res.status === 200, String(res.status))
check('content type JSON', (res.headers.get('content-type') ?? '').includes('application/json'))
if (!prod) check('Cache-Control con max-age=60', /max-age=60/.test(res.headers.get('cache-control') ?? ''), res.headers.get('cache-control') ?? '')

let data = {}
try {
  data = JSON.parse(cuerpo)
} catch {}
check('4 llaves de primer nivel', mismasLlaves(data, ['alerta', 'avisos', 'contactos', 'puntos']), Object.keys(data).join(','))

const prohibidas = llavesProhibidas(data)
check('ninguna llave de autor, correo o usuario', prohibidas.length === 0, prohibidas.join(','))

if (prod) await revisarProduccion()
else await revisarLocal()

async function revisarProduccion() {
  const avisos = Array.isArray(data.avisos) ? data.avisos : []
  if (avisos.length === 0) {
    console.log('SKIP no hay avisos: no se prueba la redirección ni el feed')
  } else {
    const { texto: feed } = await pedir('/feed/')
    for (const a of avisos) {
      const ruta = new URL(a.link).pathname
      const { res: r } = await pedir(ruta, sinRedirigir)
      const esperado = `${sitioNuevo}/${ruta.split('/').filter(Boolean).pop()}/`
      check(`aviso "${a.titulo}": 302 al sitio nuevo`, r.status === 302 && r.headers.get('location') === esperado, `${r.status} ${r.headers.get('location') ?? ''}`)
      check(`aviso "${a.titulo}": ausente del feed`, !feed.includes(a.link))
    }
  }

  const pruebas = [
    ...(data.alerta?.titulo?.includes('[PRUEBA]') ? [`alerta: ${data.alerta.titulo}`] : []),
    ...(data.avisos ?? []).filter((a) => JSON.stringify(a).includes('[PRUEBA]')).map((a) => `aviso: ${a.titulo}`),
    ...(data.contactos ?? []).filter((c) => JSON.stringify(c).includes('[PRUEBA]')).map((c) => `contacto: ${c.nombre}`),
  ]
  for (const p of pruebas) console.log(`AVISO: contenido de prueba publicado (${p})`)
  console.log(`${fallos ? 'FAIL' : 'OK'} producción: ${fallos} fallos`)
  process.exit(fallos ? 1 : 0)
}

async function revisarLocal() {
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

  const riesgo = avisos.find((a) => a.titulo === 'Recomendaciones por temporada de lluvias')
  check('aparece el aviso de riesgo de prueba', Boolean(riesgo))
  const slugRiesgo = new URL(riesgo?.link ?? base).pathname.split('/').filter(Boolean).pop()
  const noEsta = (texto) => !texto.includes(riesgo?.link ?? '\0') && !texto.includes(riesgo?.titulo ?? '\0')

  const { texto: inicio } = await pedir('/')
  check('home vieja no lista la entrada de riesgo', noEsta(inicio))
  check('home vieja sí lista la entrada de otra categoría', inicio.includes('Entrada de otra categoría'))
  const { texto: feed } = await pedir('/feed/')
  check('feed viejo no lista la entrada de riesgo', noEsta(feed))
  check('feed viejo sí lista la entrada de otra categoría', feed.includes('Entrada de otra categoría'))
  const { texto: busqueda } = await pedir(`/?s=${encodeURIComponent('lluvias')}`)
  check('búsqueda vieja no lista la entrada de riesgo', noEsta(busqueda))

  const redirigida = await fetch(riesgo?.link ?? base, sinRedirigir)
  check('permalink de riesgo: 302 al sitio nuevo', redirigida.status === 302 && redirigida.headers.get('location') === `${sitioNuevo}/${slugRiesgo}/`, `${redirigida.status} ${redirigida.headers.get('location') ?? ''}`)
  const archivo = await fetch(`${base}/category/gestion-del-riesgo/`, sinRedirigir)
  check('archivo de la categoría: 302 a noticias del sitio nuevo', archivo.status === 302 && archivo.headers.get('location') === `${sitioNuevo}/noticias/?categoria=gestion-del-riesgo`, `${archivo.status} ${archivo.headers.get('location') ?? ''}`)

  const idCategoria = wp('term', 'get', 'category', 'gestion-del-riesgo', '--by=slug', '--field=term_id')
  const { texto: porRest } = await pedir(`/wp-json/wp/v2/posts?categories=${idCategoria.out}`)
  check('REST /wp/v2/posts sigue devolviendo la entrada de riesgo', idCategoria.ok && porRest.includes(riesgo?.titulo ?? '\0'), idCategoria.out || idCategoria.err)

  const migracion = wp('option', 'delete', 'gr_version')
  const categorias = wp('eval', 'echo count(get_terms(["taxonomy" => "category", "slug" => "gestion-del-riesgo", "hide_empty" => false]));')
  check('migración: la categoría existe una sola vez tras borrar gr_version', migracion.ok && categorias.out.endsWith('1'), categorias.out || categorias.err)
  const version = wp('option', 'get', 'gr_version')
  check('migración: gr_version queda guardada', version.ok && /^\d+\.\d+\.\d+$/.test(version.out), version.out || version.err)

  const roles = wp('role', 'list', '--fields=role', '--format=json')
  check('rol gr_app existe', roles.ok && roles.out.includes('"gr_app"'), roles.out || roles.err)
  const caps = wp('eval', 'echo json_encode(array_keys(array_filter(get_role("gr_app")->capabilities)));')
  check('rol gr_app solo tiene read', caps.out.endsWith('["read"]'), caps.out || caps.err)

  const visibles = wp('post', 'list', '--category_name=gestion-del-riesgo', '--post_status=publish', '--format=count')
  check('WP-CLI sigue viendo las entradas de riesgo', visibles.ok && Number(visibles.out) > 0, visibles.out || visibles.err)
  const repetidas = wp('db', 'query', "SELECT meta_value FROM wp_postmeta WHERE meta_key = 'gr_prueba' GROUP BY meta_value HAVING COUNT(*) > 1", '--skip-column-names')
  check('datos de prueba sin duplicados', repetidas.ok && repetidas.out === '', repetidas.out || repetidas.err)

  console.log(`${fallos ? 'FAIL' : 'OK'} ${fallos} fallos`)
  process.exit(fallos ? 1 : 0)
}
