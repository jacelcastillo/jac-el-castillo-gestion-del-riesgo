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

const fotoMinima = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDHooorhPqD/9k=', 'base64')
const sitioNuevo = 'https://web.jacelcastillo.com.co'
const usuarioApp = 'app-gestion-riesgo'
const mailpit = 'http://localhost:8025/api/v1'

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
  const { res: sinCredenciales } = await pedir('/wp-json/jac-gr/v1/reportes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  check('POST /reportes sin credenciales: 401', sinCredenciales.status === 401, String(sinCredenciales.status))

  // La carpeta sola puede dar 403 sin .htaccess (sin listado de directorios); index.php existe y sin bloqueo da 200.
  const { res: carpetaFotos } = await pedir('/wp-content/uploads/gr-reportes/index.php')
  check('carpeta de fotos de reportes bloqueada (index.php: 403)', carpetaFotos.status === 403, String(carpetaFotos.status))

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

  await revisarReportes()

  const migracion = wp('option', 'delete', 'gr_version')
  const categorias = wp('eval', 'echo count(get_terms(["taxonomy" => "category", "slug" => "gestion-del-riesgo", "hide_empty" => false]));')
  check('migración: la categoría existe una sola vez tras borrar gr_version', migracion.ok && categorias.out.endsWith('1'), categorias.out || categorias.err)
  const version = wp('option', 'get', 'gr_version')
  check('migración: gr_version queda guardada', version.ok && /^\d+\.\d+\.\d+$/.test(version.out), version.out || version.err)

  const roles = wp('role', 'list', '--fields=role', '--format=json')
  check('rol gr_app existe', roles.ok && roles.out.includes('"gr_app"'), roles.out || roles.err)

  wp('eval', 'get_role("gr_app")->remove_cap("gr_enviar_reportes"); remove_role("gr_comite"); get_role("administrator")->remove_cap("edit_gr_reportes");')
  wp('option', 'update', 'gr_version', '0.1.1')
  const roles02 = wp(
    'eval',
    'echo json_encode(["app" => array_keys(array_filter(get_role("gr_app")->capabilities)), "comite" => array_keys(array_filter(get_role("gr_comite")->capabilities ?? [])), "admin" => get_role("administrator")->has_cap("edit_gr_reportes")]);',
  )
  let rolesJson = {}
  try {
    rolesJson = JSON.parse(roles02.out.split('\n').pop() ?? '')
  } catch {}
  check('migración 0.2.0: gr_app tiene exactamente read y gr_enviar_reportes', JSON.stringify([...(rolesJson.app ?? [])].sort()) === JSON.stringify(['gr_enviar_reportes', 'read']), roles02.out || roles02.err)
  const capsComite = rolesJson.comite ?? []
  check(
    'migración 0.2.0: gr_comite existe, solo lee y edita reportes, sin borrar',
    capsComite.includes('read') && capsComite.includes('edit_gr_reportes') && !capsComite.some((c) => c.startsWith('delete_') || c === 'publish_gr_reportes'),
    roles02.out || roles02.err,
  )
  check('migración 0.2.0: administrator recupera las capacidades de reportes', rolesJson.admin === true, roles02.out || roles02.err)

  const carpetaFotos030 = '$c = wp_upload_dir()["basedir"] . "/gr-reportes";'
  wp('eval', `${carpetaFotos030} foreach (["/.htaccess", "/index.php"] as $f) { @unlink($c . $f); } rmdir($c);`)
  wp('option', 'update', 'gr_version', '0.2.0')
  const fotos030 = wp('eval', `${carpetaFotos030} echo json_encode([is_dir($c), file_exists($c . "/.htaccess"), file_exists($c . "/index.php")]);`)
  check('migración 0.3.0: crea la carpeta de fotos con .htaccess e index.php', fotos030.out.endsWith('[true,true,true]'), fotos030.out || fotos030.err)

  const visibles = wp('post', 'list', '--category_name=gestion-del-riesgo', '--post_status=publish', '--format=count')
  check('WP-CLI sigue viendo las entradas de riesgo', visibles.ok && Number(visibles.out) > 0, visibles.out || visibles.err)
  const repetidas = wp('db', 'query', "SELECT meta_value FROM wp_postmeta WHERE meta_key = 'gr_prueba' GROUP BY meta_value HAVING COUNT(*) > 1", '--skip-column-names')
  check('datos de prueba sin duplicados', repetidas.ok && repetidas.out === '', repetidas.out || repetidas.err)

  console.log(`${fallos ? 'FAIL' : 'OK'} ${fallos} fallos`)
  process.exit(fallos ? 1 : 0)
}

function json(cuerpo) {
  return JSON.stringify(cuerpo)
}

function uuid() {
  return crypto.randomUUID()
}

function reporteValido(id, cambios = {}) {
  return {
    id,
    createdAt: new Date().toISOString(),
    type: 'deslizamiento',
    location: { mode: 'gps', latitude: 4.6, longitude: -74.08, accuracy: 12, address: 'Calle 1 con carrera 2' },
    description: 'Se cayó una parte del talud sobre el camino.',
    severity: 'alta',
    peopleAffected: 'no_se',
    contact: { anonymous: false, name: 'Maria Prueba', phone: '3001234567' },
    consent: true,
    ...cambios,
  }
}

function idsPorCliente(idCliente) {
  const r = wp('post', 'list', '--post_type=gr_reporte', '--post_status=any', '--meta_key=gr_id_cliente', `--meta_value=${idCliente}`, '--field=ID')
  return r.out === '' ? [] : r.out.split('\n')
}

async function revisarReportes() {
  const previas = wp('user', 'application-password', 'list', usuarioApp, '--format=json')
  try {
    for (const p of JSON.parse(previas.out)) {
      if (p.name === 'check-wp') wp('user', 'application-password', 'delete', usuarioApp, p.uuid)
    }
  } catch {}
  const clave = wp('user', 'application-password', 'create', usuarioApp, 'check-wp', '--porcelain')
  check('contraseña de aplicación temporal creada', clave.ok && clave.out !== '', clave.err)
  const autorizacion = `Basic ${Buffer.from(`${usuarioApp}:${clave.out}`).toString('base64')}`

  const enviar = (ruta, cuerpo, { ip, auth = true } = {}) =>
    fetch(`${base}/wp-json/jac-gr/v1${ruta}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(auth ? { authorization: autorizacion } : {}), ...(ip ? { 'x-gr-ip': ip } : {}) },
      body: json(cuerpo),
    }).then(async (res) => ({ status: res.status, cuerpo: await res.json().catch(() => null) }))

  const enviarForm = (datos, foto, ip) => {
    const form = new FormData()
    form.append('datos', json(datos))
    if (foto) form.append('foto', foto, 'foto.jpg')
    return fetch(`${base}/wp-json/jac-gr/v1/reportes`, {
      method: 'POST',
      headers: { authorization: autorizacion, 'x-gr-ip': ip },
      body: form,
    }).then(async (res) => ({ status: res.status, cuerpo: await res.json().catch(() => null) }))
  }

  const creados = []
  try {
    wp('transient', 'delete', '--all')
    await fetch(`${mailpit}/messages`, { method: 'DELETE' }).catch(() => {})

    const sinAuth = await enviar('/reportes', reporteValido(uuid()), { auth: false, ip: '10.0.1.1' })
    check('POST /reportes sin credenciales: 401', sinAuth.status === 401, String(sinAuth.status))

    const id = uuid()
    creados.push(id)
    const primero = await enviar('/reportes', reporteValido(id), { ip: '10.0.1.1' })
    check('reporte válido: 201 y estado recibido', primero.status === 201 && primero.cuerpo?.id === id && primero.cuerpo?.estado === 'recibido', json(primero))

    const mensajes = await fetch(`${mailpit}/messages`).then((r) => r.json()).catch(() => ({ messages: [] }))
    check('Mailpit tiene exactamente 1 correo', mensajes.messages?.length === 1, String(mensajes.messages?.length))
    const detalle = mensajes.messages?.[0] ? await fetch(`${mailpit}/message/${mensajes.messages[0].ID}`).then((r) => r.json()).catch(() => ({})) : {}
    const textoCorreo = `${detalle.Subject ?? ''}\n${detalle.Text ?? ''}`
    check('correo: asunto con tipo y gravedad', (detalle.Subject ?? '') === '[Gestión del riesgo] Nuevo reporte: Deslizamiento, gravedad alta', detalle.Subject ?? '')
    check('correo: sin nombre ni teléfono del reportante', textoCorreo.length > 20 && !textoCorreo.includes('Maria Prueba') && !textoCorreo.includes('3001234567'))
    check('correo: enlace al reporte en wp-admin', /Ver el reporte: \S*\/wp-admin\/post\.php\?post=\d+&action=edit/.test(textoCorreo), textoCorreo.split('\n').at(-1) ?? '')

    const repetido = await enviar('/reportes', reporteValido(id), { ip: '10.0.1.1' })
    check('mismo id: 200 sin duplicar', repetido.status === 200 && repetido.cuerpo?.estado === 'recibido' && idsPorCliente(id).length === 1, json(repetido))

    const tipoMalo = await enviar('/reportes', reporteValido(uuid(), { type: 'terremoto' }), { ip: '10.0.3.3' })
    check('tipo inválido: 400', tipoMalo.status === 400 && tipoMalo.cuerpo?.code === 'rest_invalid_param', json(tipoMalo))
    const sinConsentimiento = await enviar('/reportes', reporteValido(uuid(), { consent: false }), { ip: '10.0.3.3' })
    check('consent false: 400', sinConsentimiento.status === 400, json(sinConsentimiento))

    const idAnonimo = uuid()
    creados.push(idAnonimo)
    const anonimo = await enviar('/reportes', reporteValido(idAnonimo, { contact: { anonymous: true, name: 'Pedro Oculto', phone: '3109998888' } }), { ip: '10.0.2.2' })
    check('reporte anónimo: 201', anonimo.status === 201, json(anonimo))
    const idPost = idsPorCliente(idAnonimo)[0]
    const metas = wp('post', 'meta', 'list', idPost ?? '0', '--format=json')
    check('anónimo: no guarda nombre ni teléfono', metas.ok && !/Pedro|3109998888/.test(metas.out), metas.out || metas.err)

    const estados = await enviar('/reportes/estado', { ids: [id, uuid()] }, { ip: '10.0.1.1' })
    check(
      '/reportes/estado devuelve recibido y omite el id desconocido',
      estados.status === 200 && Array.isArray(estados.cuerpo) && estados.cuerpo.length === 1 && estados.cuerpo[0].id === id && estados.cuerpo[0].estado === 'recibido' && !Number.isNaN(Date.parse(estados.cuerpo[0].actualizado)),
      json(estados),
    )
    const demasiados = await enviar('/reportes/estado', { ids: Array.from({ length: 51 }, uuid) }, { ip: '10.0.1.1' })
    check('/reportes/estado con 51 ids: 400', demasiados.status === 400, json(demasiados))

    const { res: privado } = await pedir('/wp-json/wp/v2/gr_reporte')
    check('/wp/v2/gr_reporte: 404', privado.status === 404, String(privado.status))

    wp('transient', 'delete', '--all')
    const estadosLimite = []
    for (let i = 0; i < 6; i++) {
      const nuevo = uuid()
      creados.push(nuevo)
      estadosLimite.push((await enviar('/reportes', reporteValido(nuevo), { ip: '10.0.9.9' })).status)
    }
    const sexto = await enviar('/reportes', reporteValido(uuid()), { ip: '10.0.9.9' })
    check('5 reportes nuevos de una IP: 201', estadosLimite.slice(0, 5).every((c) => c === 201), estadosLimite.join(','))
    check('el 6.º reporte nuevo de la misma IP: 429 gr_limite', estadosLimite[5] === 429 && sexto.status === 429 && sexto.cuerpo?.code === 'gr_limite', `${estadosLimite[5]} ${json(sexto)}`)

    const idFoto = uuid()
    creados.push(idFoto)
    const conFoto = await enviarForm(reporteValido(idFoto), new Blob([fotoMinima], { type: 'image/jpeg' }), '10.0.6.6')
    check('multipart con foto JPEG: 201', conFoto.status === 201 && conFoto.cuerpo?.id === idFoto, json(conFoto))
    const idPostFoto = idsPorCliente(idFoto)[0] ?? '0'
    const nombreFoto = wp('post', 'meta', 'get', idPostFoto, 'gr_foto').out
    check('foto: gr_foto es un nombre de 32 hex y .jpg', /^[0-9a-f]{32}\.jpg$/.test(nombreFoto), nombreFoto)
    const rutaFoto = `file_exists(gr_carpeta_fotos() . "/${nombreFoto}")`
    const existe = wp('eval', `echo ${rutaFoto} ? "si" : "no";`)
    check('foto: el archivo existe en el contenedor', existe.out.endsWith('si'), existe.out || existe.err)

    const textoComoFoto = await enviarForm(reporteValido(uuid()), new Blob(['esto no es una imagen'], { type: 'image/jpeg' }), '10.0.6.6')
    check('foto que es texto plano: 400', textoComoFoto.status === 400, json(textoComoFoto))
    const grande = Buffer.concat([fotoMinima, Buffer.alloc(1_600_000)])
    const fotoGrande = await enviarForm(reporteValido(uuid()), new Blob([grande], { type: 'image/jpeg' }), '10.0.6.6')
    check('foto de 1.6 MB: 413', fotoGrande.status === 413, json(fotoGrande))

    const directa = await fetch(`${base}/wp-content/uploads/gr-reportes/${nombreFoto}`)
    check('URL directa de la foto: 403', directa.status === 403, String(directa.status))
    const indice = await fetch(`${base}/wp-content/uploads/gr-reportes/index.php`)
    check('URL directa de index.php en la carpeta: 403', indice.status === 403, String(indice.status))

    const sinSesion = await fetch(`${base}/wp-admin/admin-post.php?action=gr_foto&id=${idPostFoto}`)
    check('admin-post gr_foto sin sesión: 403 y no es imagen', sinSesion.status === 403 && !(sinSesion.headers.get('content-type') ?? '').startsWith('image/'), `${sinSesion.status} ${sinSesion.headers.get('content-type')}`)

    const login = await fetch(`${base}/wp-login.php`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: 'wordpress_test_cookie=WP Cookie check' },
      body: new URLSearchParams({ log: 'admin', pwd: 'admin-local', 'wp-submit': 'Log In' }),
    })
    const cookie = login.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ')
    const edicion = await fetch(`${base}/wp-admin/post.php?post=${idPostFoto}&action=edit`, { headers: { cookie } })
    const html = await edicion.text()
    const cajaDatos = html.slice(html.indexOf('Datos del reporte'))
    const src = /<img src="([^"]*action=gr_foto[^"]*)"/.exec(cajaDatos)?.[1]?.replaceAll('&#038;', '&').replaceAll('&amp;', '&')
    check('wp-admin: la caja Datos del reporte muestra la foto', Boolean(src), `${login.status} ${edicion.status}`)
    const urlFoto = src ? new URL(src, base) : null
    const conSesion = urlFoto ? await fetch(`${base}${urlFoto.pathname}${urlFoto.search}`, { headers: { cookie } }) : null
    const bytesFoto = conSesion ? Buffer.from(await conSesion.arrayBuffer()) : Buffer.alloc(0)
    check('admin-post gr_foto con sesión de admin: 200 image/jpeg con los mismos bytes', conSesion?.status === 200 && conSesion.headers.get('content-type') === 'image/jpeg' && bytesFoto.equals(fotoMinima), `${conSesion?.status} ${conSesion?.headers.get('content-type')}`)

    const correos = await fetch(`${mailpit}/messages`).then((r) => r.json()).catch(() => ({ messages: [] }))
    const textos = await Promise.all((correos.messages ?? []).map((m) => fetch(`${mailpit}/message/${m.ID}`).then((r) => r.json()).catch(() => ({}))))
    check('correo del reporte con foto: dice "Foto: sí"', textos.some((t) => (t.Text ?? '').includes('Foto: sí') && (t.Attachments ?? []).length === 0))

    const borrado = wp('post', 'delete', idPostFoto, '--force')
    const sigue = wp('eval', `echo ${rutaFoto} ? "si" : "no";`)
    check('borrar el reporte definitivamente borra la foto', borrado.ok && sigue.out.endsWith('no'), sigue.out || sigue.err)
  } finally {
    const todos = creados.flatMap(idsPorCliente)
    if (todos.length) wp('post', 'delete', ...todos, '--force')
    const listadas = wp('user', 'application-password', 'list', usuarioApp, '--format=json')
    try {
      for (const p of JSON.parse(listadas.out)) {
        if (p.name === 'check-wp') wp('user', 'application-password', 'delete', usuarioApp, p.uuid)
      }
    } catch {}
  }
}
