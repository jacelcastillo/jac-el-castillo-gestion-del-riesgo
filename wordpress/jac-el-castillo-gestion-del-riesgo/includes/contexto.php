<?php
defined('ABSPATH') || exit;

add_action('pre_get_posts', 'gr_ocultar_en_sitio_viejo');
add_action('template_redirect', 'gr_redirigir_al_sitio_nuevo');

function gr_ocultar_en_sitio_viejo(WP_Query $consulta): void {
    // Solo visitas al sitio: WP-CLI y el cron también pasan por aquí con is_admin() en falso.
    if (is_admin() || wp_doing_cron() || (defined('WP_CLI') && WP_CLI) || (defined('REST_REQUEST') && REST_REQUEST) || (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST)) {
        return;
    }

    $tipos = array_filter((array) $consulta->get('post_type'));
    if ($tipos && !array_intersect(['post', 'any'], $tipos)) {
        return;
    }

    if ($consulta->is_main_query() && !$consulta->is_feed() && ($consulta->is_singular() || $consulta->is_category(GR_CATEGORIA_SLUG))) {
        return;
    }

    $categoria = get_category_by_slug(GR_CATEGORIA_SLUG);
    if (!$categoria) {
        return;
    }

    $excluidas = array_map('intval', (array) $consulta->get('category__not_in'));
    $consulta->set('category__not_in', array_values(array_unique([...$excluidas, $categoria->term_id])));
}

function gr_redirigir_al_sitio_nuevo(): void {
    if (is_preview() || is_feed()) {
        return;
    }

    $nuevo = gr_url_sitio_nuevo();
    if (is_singular('post') && has_category(GR_CATEGORIA_SLUG, get_queried_object())) {
        wp_redirect($nuevo . '/' . get_queried_object()->post_name . '/', 302);
        exit;
    }
    if (is_category(GR_CATEGORIA_SLUG)) {
        wp_redirect($nuevo . '/noticias/?categoria=' . GR_CATEGORIA_SLUG, 302);
        exit;
    }
}
