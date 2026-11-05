<?php
defined('ABSPATH') || exit;

add_action('init', 'gr_migrar');

function gr_migrar(): void {
    $guardada = (string) get_option('gr_version', '0');
    if (version_compare($guardada, GR_VERSION, '>=')) {
        return;
    }

    if (version_compare($guardada, '0.1.0', '<')) {
        gr_migrar_0_1_0();
    }

    update_option('gr_version', GR_VERSION);
}

function gr_migrar_0_1_0(): void {
    if (!term_exists(GR_CATEGORIA_SLUG, 'category')) {
        wp_insert_term('Gestión del riesgo', 'category', ['slug' => GR_CATEGORIA_SLUG]);
    }

    if (!get_role('gr_app')) {
        add_role('gr_app', 'App Gestión del Riesgo', ['read' => true]);
    }
}
