<?php
defined('ABSPATH') || exit;

add_filter('manage_gr_reporte_posts_columns', 'gr_columnas_reporte');
add_filter('post_row_actions', 'gr_quitar_edicion_rapida', 10, 2);
add_action('manage_gr_reporte_posts_custom_column', 'gr_pintar_columna_reporte', 10, 2);
add_action('add_meta_boxes_gr_reporte', 'gr_agregar_cajas_reporte');
add_action('save_post_gr_reporte', 'gr_guardar_estado_reporte');

function gr_columnas_reporte(array $columnas): array {
    return [
        'cb' => $columnas['cb'] ?? '',
        'gr_col_fecha' => 'Fecha',
        'gr_col_tipo' => 'Tipo',
        'gr_col_gravedad' => 'Gravedad',
        'gr_col_afectados' => 'Personas afectadas',
        'gr_col_estado' => 'Estado',
        'gr_col_ubicacion' => 'Ubicación',
    ];
}

function gr_quitar_edicion_rapida(array $acciones, WP_Post $post): array {
    if ($post->post_type === 'gr_reporte') {
        unset($acciones['inline hide-if-no-js']);
    }
    return $acciones;
}

function gr_pintar_columna_reporte(string $columna, int $id): void {
    $meta = static fn(string $clave): string => (string) get_post_meta($id, $clave, true);
    switch ($columna) {
        case 'gr_col_fecha':
            $fecha = esc_html(get_the_date('j M Y, H:i', $id));
            $enlace = get_edit_post_link($id);
            echo $enlace ? '<a href="' . esc_url($enlace) . '"><strong>' . $fecha . '</strong></a>' : $fecha;
            break;
        case 'gr_col_tipo':
            echo esc_html(GR_TIPOS_REPORTE[$meta('gr_tipo')] ?? '');
            break;
        case 'gr_col_gravedad':
            echo esc_html(ucfirst($meta('gr_gravedad')));
            break;
        case 'gr_col_afectados':
            echo esc_html(GR_AFECTADOS[$meta('gr_afectados')] ?? '');
            break;
        case 'gr_col_estado':
            echo esc_html(GR_ESTADOS[$meta('gr_estado')] ?? '');
            break;
        case 'gr_col_ubicacion':
            echo esc_html($meta('gr_direccion'));
            if ($meta('gr_lat') !== '' && $meta('gr_lng') !== '') {
                echo ' <a href="' . esc_url(gr_url_mapa($meta('gr_lat'), $meta('gr_lng'))) . '" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>';
            }
            break;
    }
}

function gr_agregar_cajas_reporte(): void {
    add_meta_box('gr_reporte_datos', 'Datos del reporte', 'gr_pintar_datos_reporte', 'gr_reporte', 'normal', 'high');
    add_meta_box('gr_reporte_estado', 'Estado', 'gr_pintar_estado_reporte', 'gr_reporte', 'side', 'high');
}

function gr_pintar_datos_reporte(WP_Post $post): void {
    $meta = static fn(string $clave): string => (string) get_post_meta($post->ID, $clave, true);
    $filas = [
        'Recibido' => get_the_date('j M Y, H:i', $post),
        'Hora del celular' => $meta('gr_creado_celular'),
        'Tipo' => GR_TIPOS_REPORTE[$meta('gr_tipo')] ?? '',
        'Gravedad' => ucfirst($meta('gr_gravedad')),
        'Personas afectadas' => GR_AFECTADOS[$meta('gr_afectados')] ?? '',
        'Descripción' => $meta('gr_descripcion'),
        'Dirección' => $meta('gr_direccion'),
        'Referencia' => $meta('gr_referencia'),
        'Precisión del GPS (m)' => $meta('gr_precision'),
        'Identificador' => $meta('gr_id_cliente'),
    ];
    $anonimo = $meta('gr_anonimo') === '1';
    $filas['Contacto'] = $anonimo ? 'Anónimo' : trim($meta('gr_nombre') . ' ' . $meta('gr_telefono'));
    ?>
    <table class="form-table" role="presentation">
        <?php foreach ($filas as $etiqueta => $valor) : ?>
            <?php if ($valor !== '') : ?>
                <tr>
                    <th scope="row"><?php echo esc_html($etiqueta); ?></th>
                    <td style="white-space: pre-wrap;"><?php echo esc_html($valor); ?></td>
                </tr>
            <?php endif; ?>
        <?php endforeach; ?>
        <?php if (gr_ruta_foto($post->ID) !== '') : ?>
            <tr>
                <th scope="row">Foto</th>
                <td>
                    <img src="<?php echo esc_url(gr_url_foto($post->ID)); ?>" alt="Foto del reporte" style="max-width: 100%; height: auto;">
                    <p><a href="<?php echo esc_url(gr_url_foto($post->ID)); ?>" target="_blank" rel="noopener noreferrer">Abrir la foto</a></p>
                </td>
            </tr>
        <?php endif; ?>
        <?php if ($meta('gr_lat') !== '' && $meta('gr_lng') !== '') : ?>
            <tr>
                <th scope="row">Coordenadas</th>
                <td>
                    <?php echo esc_html($meta('gr_lat') . ', ' . $meta('gr_lng')); ?>
                    <a href="<?php echo esc_url(gr_url_mapa($meta('gr_lat'), $meta('gr_lng'))); ?>" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>
                </td>
            </tr>
        <?php endif; ?>
    </table>
    <?php
}

function gr_pintar_estado_reporte(WP_Post $post): void {
    wp_nonce_field('gr_reporte_estado', 'gr_reporte_estado_nonce');
    $actual = gr_estado_reporte($post->ID);
    $actualizado = (string) get_post_meta($post->ID, 'gr_estado_actualizado', true);
    ?>
    <p>
        <?php foreach (GR_ESTADOS as $valor => $etiqueta) : ?>
            <label style="display: block; margin-bottom: 6px;">
                <input type="radio" name="gr_estado_nuevo" value="<?php echo esc_attr($valor); ?>" <?php checked($actual, $valor); ?>>
                <?php echo esc_html($etiqueta); ?>
            </label>
        <?php endforeach; ?>
    </p>
    <?php if ($actualizado !== '') : ?>
        <p class="description">Actualizado: <?php echo esc_html($actualizado); ?></p>
    <?php endif; ?>
    <p class="description">Pulsa Actualizar para guardar el estado.</p>
    <?php
}

function gr_guardar_estado_reporte(int $id): void {
    if (!gr_guardar_caja($id, 'gr_reporte_estado', 'gr_reporte_estado_nonce')) {
        return;
    }
    $nuevo = gr_enum(isset($_POST['gr_estado_nuevo']) ? sanitize_text_field(wp_unslash($_POST['gr_estado_nuevo'])) : '', array_keys(GR_ESTADOS), '');
    if ($nuevo === '' || $nuevo === gr_estado_reporte($id)) {
        return;
    }
    update_post_meta($id, 'gr_estado', $nuevo);
    update_post_meta($id, 'gr_estado_actualizado', gmdate('c'));
}
