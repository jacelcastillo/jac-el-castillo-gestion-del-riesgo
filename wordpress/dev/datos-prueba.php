<?php
// Datos de prueba solo para desarrollo local. Se ejecuta con: wp eval-file datos-prueba.php

$dir = __DIR__ . '/datos-prueba';
$leer = static fn(string $archivo): array => json_decode(file_get_contents("$dir/$archivo"), true, 512, JSON_THROW_ON_ERROR);

$categoria = get_category_by_slug('gestion-del-riesgo');
if (!$categoria) {
    WP_CLI::error('Falta la categoría gestion-del-riesgo. Activa el plugin primero.');
}

function gr_prueba_existe(string $marca, string $tipo = 'post'): bool {
    return (bool) get_posts([
        'post_type' => $tipo,
        'post_status' => 'any',
        'meta_key' => 'gr_prueba',
        'meta_value' => $marca,
        'fields' => 'ids',
        'posts_per_page' => 1,
    ]);
}

function gr_prueba_crear(array $datos, string $marca, array $meta = []): int {
    if (gr_prueba_existe($marca, $datos['post_type'] ?? 'post')) {
        return 0;
    }
    $id = wp_insert_post($datos + ['post_status' => 'publish'], true);
    if (is_wp_error($id)) {
        WP_CLI::error($id->get_error_message());
    }
    update_post_meta($id, 'gr_prueba', $marca);
    foreach ($meta as $clave => $valor) {
        update_post_meta($id, $clave, $valor);
    }
    return $id;
}

function gr_prueba_hora(string $texto): string {
    if (!preg_match('/^(\d{1,2}):(\d{2})\s*([ap])/i', $texto, $m)) {
        return '00:00';
    }
    $h = (int) $m[1] % 12 + (strtolower($m[3]) === 'p' ? 12 : 0);
    return sprintf('%02d:%s', $h, $m[2]);
}

$a = $leer('alert.json');
update_option('gr_alerta', [
    'nivel' => $a['level'],
    'titulo' => $a['title'],
    'descripcion' => $a['description'],
    'fuente' => $a['source'],
    'actualizada' => $a['updatedAt'],
]);

$ahora = time();
foreach ($leer('notices.json') as $i => $n) {
    $fecha = isset($n['time']) ? $n['date'] . 'T' . gr_prueba_hora($n['time']) : '';
    gr_prueba_crear([
        'post_title' => $n['title'],
        'post_excerpt' => $n['summary'],
        'post_content' => $n['summary'],
        'post_category' => [$categoria->term_id],
        'post_date' => wp_date('Y-m-d H:i:s', $ahora - ($i + 1) * DAY_IN_SECONDS),
    ], 'aviso-' . $n['id'], [
        'gr_evento_tipo' => $n['kind'],
        'gr_evento_fecha' => $fecha,
        'gr_evento_lugar' => $n['place'] ?? '',
    ]);
}

gr_prueba_crear([
    'post_title' => 'Borrador que no debe salir',
    'post_status' => 'draft',
    'post_category' => [$categoria->term_id],
], 'borrador');

gr_prueba_crear([
    'post_title' => 'Entrada de otra categoría que no debe salir',
    'post_category' => [(int) get_option('default_category')],
], 'otra-categoria');

$sucio = gr_prueba_crear([
    'post_title' => 'Aviso con datos sucios',
    'post_category' => [$categoria->term_id],
    'post_date' => wp_date('Y-m-d H:i:s', $ahora - 10 * DAY_IN_SECONDS),
], 'sucio');
if ($sucio) {
    update_post_meta($sucio, 'gr_evento_tipo', '<script>x</script>');
    update_post_meta($sucio, 'gr_evento_fecha', 'mañana');
    update_post_meta($sucio, 'gr_evento_lugar', '<b>Salón</b>');
}

foreach ($leer('contacts.json') as $i => $c) {
    $lider = $c['group'] === 'sector';
    gr_prueba_crear([
        'post_type' => 'gr_contacto',
        'post_title' => $c['name'],
        'menu_order' => $i,
    ], 'contacto-' . $c['id'], [
        'gr_grupo' => $lider ? 'lider' : 'junta',
        'gr_cargo' => $c['role'],
        'gr_sector' => $lider ? $c['name'] : '',
        'gr_telefono' => $c['phone'],
    ]);
}

$coordenada = static fn(array $p): string => round(4.60 + (50 - $p['y']) * 0.0004, 5) . ',' . round(-74.08 + ($p['x'] - 50) * 0.0004, 5);
foreach ($leer('map-points.json') as $i => $p) {
    $puntos = array_map($coordenada, $p['path'] ?? [$p['position']]);
    gr_prueba_crear([
        'post_type' => 'gr_punto',
        'post_title' => $p['name'],
        'menu_order' => $i,
    ], 'punto-' . $p['id'], [
        'gr_tipo' => $p['kind'],
        'gr_descripcion' => $p['description'],
        'gr_referencia' => $p['reference'],
        'gr_coordenadas' => implode("\n", $puntos),
    ]);
}

WP_CLI::success('Datos de prueba cargados.');
