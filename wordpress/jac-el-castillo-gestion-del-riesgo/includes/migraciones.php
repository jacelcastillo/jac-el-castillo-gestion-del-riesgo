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

    if (version_compare($guardada, '0.2.0', '<')) {
        gr_migrar_0_2_0();
    }

    if (version_compare($guardada, '0.3.0', '<')) {
        gr_migrar_0_3_0();
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

function gr_migrar_0_2_0(): void {
    get_role('gr_app')?->add_cap('gr_enviar_reportes');

    add_role('gr_comite', 'Comité de gestión del riesgo', ['read' => true]);
    foreach (GR_CAPS_COMITE as $cap) {
        get_role('gr_comite')?->add_cap($cap);
    }

    foreach (GR_CAPS_ADMIN as $cap) {
        get_role('administrator')?->add_cap($cap);
    }
}

function gr_migrar_0_3_0(): void {
    gr_carpeta_fotos();
}
