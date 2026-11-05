<?php
defined('ABSPATH') || exit;

const GR_EVENTO_TIPOS = ['comunicado', 'simulacro', 'taller'];

add_action('init', 'gr_registrar_meta_evento');
add_action('add_meta_boxes_post', 'gr_agregar_caja_evento');
add_action('save_post_post', 'gr_guardar_evento');

function gr_registrar_meta_evento(): void {
    $comun = [
        'object_subtype' => 'post',
        'type' => 'string',
        'single' => true,
        'show_in_rest' => false,
        'auth_callback' => static fn(bool $ok, string $clave, int $id): bool => current_user_can('edit_post', $id),
    ];
    register_post_meta('post', 'gr_evento_tipo', $comun + [
        'default' => 'comunicado',
        'sanitize_callback' => static fn($v): string => gr_enum($v, GR_EVENTO_TIPOS, 'comunicado'),
    ]);
    register_post_meta('post', 'gr_evento_fecha', $comun + [
        'default' => '',
        'sanitize_callback' => 'gr_fecha_evento',
    ]);
    register_post_meta('post', 'gr_evento_lugar', $comun + [
        'default' => '',
        'sanitize_callback' => static fn($v): string => gr_texto($v, 120),
    ]);
}

function gr_agregar_caja_evento(): void {
    add_meta_box('gr_evento', 'Evento (gestión del riesgo)', 'gr_pintar_caja_evento', 'post', 'side');
}

function gr_pintar_caja_evento(WP_Post $post): void {
    wp_nonce_field('gr_evento_guardar', 'gr_evento_nonce');
    $tipo = (string) get_post_meta($post->ID, 'gr_evento_tipo', true);
    $fecha = (string) get_post_meta($post->ID, 'gr_evento_fecha', true);
    $lugar = (string) get_post_meta($post->ID, 'gr_evento_lugar', true);
    $etiquetas = ['comunicado' => 'Comunicado', 'simulacro' => 'Simulacro', 'taller' => 'Taller'];
    ?>
    <p class="description">Llénalo solo si la entrada anuncia un simulacro, taller o evento.</p>
    <p>
        <label for="gr_evento_tipo"><strong>Tipo</strong></label><br>
        <select id="gr_evento_tipo" name="gr_evento_tipo" class="widefat">
            <?php foreach ($etiquetas as $valor => $etiqueta) : ?>
                <option value="<?php echo esc_attr($valor); ?>" <?php selected($tipo, $valor); ?>><?php echo esc_html($etiqueta); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="gr_evento_fecha"><strong>Fecha y hora</strong></label><br>
        <input type="datetime-local" id="gr_evento_fecha" name="gr_evento_fecha" class="widefat" value="<?php echo esc_attr($fecha); ?>">
    </p>
    <p>
        <label for="gr_evento_lugar"><strong>Lugar</strong></label><br>
        <input type="text" id="gr_evento_lugar" name="gr_evento_lugar" class="widefat" maxlength="120" value="<?php echo esc_attr($lugar); ?>">
    </p>
    <?php
}

function gr_guardar_evento(int $id): void {
    if (!gr_guardar_caja($id, 'gr_evento_guardar', 'gr_evento_nonce')) {
        return;
    }
    foreach (['gr_evento_tipo', 'gr_evento_fecha', 'gr_evento_lugar'] as $clave) {
        $valor = isset($_POST[$clave]) ? wp_unslash($_POST[$clave]) : '';
        update_post_meta($id, $clave, $valor);
    }
}
