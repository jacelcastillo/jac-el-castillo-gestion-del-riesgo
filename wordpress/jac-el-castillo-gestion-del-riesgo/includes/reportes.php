<?php
defined('ABSPATH') || exit;

const GR_TIPOS_REPORTE = [
    'deslizamiento' => 'Deslizamiento',
    'inundacion' => 'Inundación',
    'incendio' => 'Incendio',
    'sismo' => 'Sismo',
    'vendaval' => 'Vendaval',
    'electrico' => 'Riesgo eléctrico',
    'otro' => 'Otro',
];
const GR_GRAVEDADES = ['baja', 'media', 'alta'];
const GR_AFECTADOS = ['si' => 'Sí', 'no' => 'No', 'no_se' => 'No se sabe'];
const GR_ESTADOS = ['recibido' => 'Recibido', 'en_atencion' => 'En atención', 'cerrado' => 'Cerrado'];
const GR_CAPS_COMITE = ['edit_gr_reportes', 'edit_others_gr_reportes', 'edit_private_gr_reportes', 'read_private_gr_reportes'];
const GR_CAPS_ADMIN = [
    'edit_gr_reportes', 'edit_others_gr_reportes', 'edit_private_gr_reportes', 'edit_published_gr_reportes',
    'read_private_gr_reportes', 'publish_gr_reportes',
    'delete_gr_reportes', 'delete_others_gr_reportes', 'delete_private_gr_reportes', 'delete_published_gr_reportes',
];

add_action('init', 'gr_registrar_tipo_reporte');
add_filter('wp_insert_post_data', 'gr_forzar_reporte_privado');

function gr_registrar_tipo_reporte(): void {
    register_post_type('gr_reporte', [
        'labels' => ['name' => 'Reportes de riesgo', 'singular_name' => 'Reporte de riesgo', 'menu_name' => 'Reportes de riesgo', 'edit_item' => 'Reporte de riesgo', 'search_items' => 'Buscar reportes', 'not_found' => 'No hay reportes'],
        'public' => false,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'show_in_rest' => false,
        'show_ui' => true,
        'show_in_nav_menus' => false,
        'has_archive' => false,
        'rewrite' => false,
        'query_var' => false,
        'supports' => false,
        'menu_icon' => 'dashicons-warning',
        'capability_type' => ['gr_reporte', 'gr_reportes'],
        'map_meta_cap' => true,
        'capabilities' => ['create_posts' => 'do_not_allow'],
    ]);
}

function gr_forzar_reporte_privado(array $datos): array {
    if (($datos['post_type'] ?? '') === 'gr_reporte' && !in_array($datos['post_status'] ?? '', ['trash', 'auto-draft'], true)) {
        $datos['post_status'] = 'private';
    }
    return $datos;
}

function gr_titulo_reporte(string $tipo, string $gravedad): string {
    return (GR_TIPOS_REPORTE[$tipo] ?? 'Otro') . ', gravedad ' . $gravedad;
}

function gr_url_mapa(mixed $lat, mixed $lng): string {
    return sprintf('https://www.google.com/maps?q=%.6F,%.6F', (float) $lat, (float) $lng);
}

function gr_buscar_reporte(string $id_cliente): ?int {
    $ids = get_posts([
        'post_type' => 'gr_reporte',
        'post_status' => ['private', 'trash'],
        'meta_query' => [['key' => 'gr_id_cliente', 'value' => $id_cliente]],
        'fields' => 'ids',
        'posts_per_page' => 1,
        'no_found_rows' => true,
    ]);
    return $ids ? (int) $ids[0] : null;
}

/** @param array<string, mixed> $d */
function gr_crear_reporte(array $d): int|WP_Error {
    $ahora = gmdate('c');
    $meta = [
        'gr_id_cliente' => $d['id'],
        'gr_estado' => 'recibido',
        'gr_estado_actualizado' => $ahora,
        'gr_tipo' => $d['tipo'],
        'gr_gravedad' => $d['gravedad'],
        'gr_afectados' => $d['afectados'],
        'gr_descripcion' => $d['descripcion'],
        'gr_direccion' => $d['direccion'],
        'gr_referencia' => $d['referencia'],
        'gr_anonimo' => $d['anonimo'] ? '1' : '0',
        'gr_nombre' => $d['nombre'],
        'gr_telefono' => $d['telefono'],
        'gr_creado_celular' => $d['creado'],
    ];
    foreach (['lat', 'lng', 'precision'] as $clave) {
        if ($d[$clave] !== null) {
            $meta['gr_' . $clave] = (string) $d[$clave];
        }
    }

    return wp_insert_post([
        'post_type' => 'gr_reporte',
        'post_status' => 'private',
        'post_title' => gr_titulo_reporte($d['tipo'], $d['gravedad']),
        'meta_input' => array_map('wp_slash', $meta),
    ], true);
}

/** @param array<string, mixed> $d */
function gr_avisar_reporte(int $post_id, array $d): void {
    $destino = gr_correo_avisos();
    if ($destino === '') {
        return;
    }

    $lineas = [
        'Tipo: ' . (GR_TIPOS_REPORTE[$d['tipo']] ?? 'Otro'),
        'Gravedad: ' . $d['gravedad'],
        'Personas afectadas: ' . (GR_AFECTADOS[$d['afectados']] ?? ''),
        'Descripción: ' . $d['descripcion'],
    ];
    if ($d['direccion'] !== '') {
        $lineas[] = 'Dirección: ' . $d['direccion'];
    }
    if ($d['referencia'] !== '') {
        $lineas[] = 'Referencia: ' . $d['referencia'];
    }
    if ($d['lat'] !== null && $d['lng'] !== null) {
        $lineas[] = 'Mapa: ' . gr_url_mapa($d['lat'], $d['lng']);
    }
    $lineas[] = '';
    // get_edit_post_link() sale vacío aquí: el usuario de la app no puede editar reportes.
    $lineas[] = 'Ver el reporte: ' . admin_url('post.php?post=' . $post_id . '&action=edit');

    $asunto = '[Gestión del riesgo] Nuevo reporte: ' . gr_titulo_reporte($d['tipo'], $d['gravedad']);
    wp_mail($destino, $asunto, implode("\n", $lineas));
}
