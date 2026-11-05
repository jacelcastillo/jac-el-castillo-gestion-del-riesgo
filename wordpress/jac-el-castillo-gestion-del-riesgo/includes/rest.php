<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', 'gr_registrar_ruta');

function gr_registrar_ruta(): void {
    register_rest_route('jac-gr/v1', '/contenido', [
        'methods' => 'GET',
        'callback' => 'gr_contenido',
        'permission_callback' => '__return_true',
    ]);
}

function gr_contenido(): WP_REST_Response {
    $respuesta = new WP_REST_Response([
        'alerta' => gr_alerta_publica(),
        'avisos' => gr_avisos_publicos(),
        'contactos' => gr_contactos_publicos(),
        'puntos' => gr_puntos_publicos(),
    ]);
    $respuesta->header('Cache-Control', 'public, max-age=60');
    return $respuesta;
}

function gr_alerta_publica(): ?array {
    $alerta = get_option('gr_alerta', []);
    $alerta = is_array($alerta) ? $alerta : [];
    $nivel = gr_enum($alerta['nivel'] ?? '', GR_NIVELES, '');
    if ($nivel === '') {
        return null;
    }
    return [
        'nivel' => $nivel,
        'titulo' => gr_plano($alerta['titulo'] ?? ''),
        'descripcion' => gr_plano($alerta['descripcion'] ?? ''),
        'fuente' => gr_plano($alerta['fuente'] ?? ''),
        'actualizada' => gr_plano($alerta['actualizada'] ?? ''),
    ];
}

function gr_meta(int $id, string $clave): string {
    return gr_plano(get_post_meta($id, $clave, true));
}

function gr_avisos_publicos(): array {
    $consulta = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'has_password' => false,
        'category_name' => GR_CATEGORIA_SLUG,
        'posts_per_page' => 20,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
        'ignore_sticky_posts' => true,
    ]);

    $avisos = [];
    foreach ($consulta->posts as $post) {
        $avisos[] = [
            'id' => $post->ID,
            'titulo' => gr_plano(get_the_title($post)),
            'resumen' => gr_plano($post->post_excerpt),
            'link' => (string) get_permalink($post),
            'publicada' => (string) get_the_date('c', $post),
            'evento' => [
                'tipo' => gr_enum(gr_meta($post->ID, 'gr_evento_tipo'), GR_EVENTO_TIPOS, 'comunicado'),
                'fecha' => gr_fecha_evento(gr_meta($post->ID, 'gr_evento_fecha')),
                'lugar' => gr_texto(gr_meta($post->ID, 'gr_evento_lugar'), 120),
            ],
        ];
    }
    return $avisos;
}

function gr_publicados(string $tipo, array $extra = []): array {
    return get_posts($extra + [
        'post_type' => $tipo,
        'post_status' => 'publish',
        'has_password' => false,
        'posts_per_page' => 200,
        'suppress_filters' => false,
    ]);
}

function gr_contactos_publicos(): array {
    $posts = gr_publicados('gr_contacto', ['orderby' => ['menu_order' => 'ASC', 'title' => 'ASC']]);
    return array_map(static fn(WP_Post $p): array => [
        'id' => $p->ID,
        'nombre' => gr_plano(get_the_title($p)),
        'grupo' => gr_enum(gr_meta($p->ID, 'gr_grupo'), GR_GRUPOS, 'junta'),
        'cargo' => gr_texto(gr_meta($p->ID, 'gr_cargo'), 80),
        'sector' => gr_texto(gr_meta($p->ID, 'gr_sector'), 80),
        'telefono' => gr_telefono(gr_meta($p->ID, 'gr_telefono')),
    ], $posts);
}

function gr_puntos_publicos(): array {
    $posts = gr_publicados('gr_punto', ['orderby' => ['menu_order' => 'ASC', 'title' => 'ASC']]);
    return array_map(static fn(WP_Post $p): array => [
        'id' => $p->ID,
        'tipo' => gr_enum(gr_meta($p->ID, 'gr_tipo'), GR_TIPOS_PUNTO, 'encuentro'),
        'nombre' => gr_plano(get_the_title($p)),
        'descripcion' => gr_parrafo(gr_meta($p->ID, 'gr_descripcion'), 300),
        'referencia' => gr_texto(gr_meta($p->ID, 'gr_referencia'), 120),
        'coordenadas' => gr_parsear_coordenadas(get_post_meta($p->ID, 'gr_coordenadas', true)),
    ], $posts);
}
