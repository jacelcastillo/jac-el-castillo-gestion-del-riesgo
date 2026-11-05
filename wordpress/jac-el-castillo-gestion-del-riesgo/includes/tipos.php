<?php
defined('ABSPATH') || exit;

const GR_GRUPOS = ['junta', 'lider', 'comite'];
const GR_TIPOS_PUNTO = ['encuentro', 'ruta', 'riesgo'];

add_action('init', 'gr_registrar_tipos');
add_action('add_meta_boxes', 'gr_agregar_cajas_tipos');
add_action('save_post_gr_contacto', 'gr_guardar_contacto');
add_action('save_post_gr_punto', 'gr_guardar_punto');

function gr_registrar_tipos(): void {
    $comun = [
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => false,
        'supports' => ['title', 'page-attributes'],
        'capability_type' => 'post',
    ];
    register_post_type('gr_contacto', $comun + [
        'labels' => ['name' => 'Contactos de riesgo', 'singular_name' => 'Contacto de riesgo'],
        'menu_icon' => 'dashicons-phone',
    ]);
    register_post_type('gr_punto', $comun + [
        'labels' => ['name' => 'Puntos del mapa', 'singular_name' => 'Punto del mapa'],
        'menu_icon' => 'dashicons-location',
    ]);

    $meta = [
        'type' => 'string',
        'single' => true,
        'show_in_rest' => false,
        'default' => '',
        'auth_callback' => static fn(bool $ok, string $clave, int $id): bool => current_user_can('edit_post', $id),
    ];
    $registrar = static function (string $tipo, string $clave, callable $sanear) use ($meta): void {
        register_post_meta($tipo, $clave, $meta + ['object_subtype' => $tipo, 'sanitize_callback' => $sanear]);
    };

    $registrar('gr_contacto', 'gr_grupo', static fn($v): string => gr_enum($v, GR_GRUPOS, 'junta'));
    $registrar('gr_contacto', 'gr_cargo', static fn($v): string => gr_texto($v, 80));
    $registrar('gr_contacto', 'gr_sector', static fn($v): string => gr_texto($v, 80));
    $registrar('gr_contacto', 'gr_telefono', 'gr_telefono');

    $registrar('gr_punto', 'gr_tipo', static fn($v): string => gr_enum($v, GR_TIPOS_PUNTO, 'encuentro'));
    $registrar('gr_punto', 'gr_descripcion', static fn($v): string => gr_parrafo($v, 300));
    $registrar('gr_punto', 'gr_referencia', static fn($v): string => gr_texto($v, 120));
    $registrar('gr_punto', 'gr_coordenadas', 'gr_coordenadas');
}

function gr_agregar_cajas_tipos(): void {
    add_meta_box('gr_contacto_datos', 'Datos del contacto', 'gr_pintar_caja_contacto', 'gr_contacto', 'normal', 'high');
    add_meta_box('gr_punto_datos', 'Datos del punto', 'gr_pintar_caja_punto', 'gr_punto', 'normal', 'high');
}

function gr_pintar_caja_contacto(WP_Post $post): void {
    wp_nonce_field('gr_contacto_guardar', 'gr_contacto_nonce');
    $grupo = (string) get_post_meta($post->ID, 'gr_grupo', true);
    $grupos = ['junta' => 'Junta', 'lider' => 'Líder de sector', 'comite' => 'Comité'];
    ?>
    <p class="description">El título es el nombre que se muestra. El orden se define con el campo Orden de la caja Atributos: los números menores van primero.</p>
    <p>
        <label for="gr_grupo"><strong>Grupo</strong></label><br>
        <select id="gr_grupo" name="gr_grupo">
            <?php foreach ($grupos as $valor => $etiqueta) : ?>
                <option value="<?php echo esc_attr($valor); ?>" <?php selected($grupo, $valor); ?>><?php echo esc_html($etiqueta); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="gr_cargo"><strong>Cargo</strong></label><br>
        <input type="text" id="gr_cargo" name="gr_cargo" class="regular-text" maxlength="80" value="<?php echo esc_attr((string) get_post_meta($post->ID, 'gr_cargo', true)); ?>">
    </p>
    <p>
        <label for="gr_sector"><strong>Sector</strong></label><br>
        <input type="text" id="gr_sector" name="gr_sector" class="regular-text" maxlength="80" value="<?php echo esc_attr((string) get_post_meta($post->ID, 'gr_sector', true)); ?>">
    </p>
    <p>
        <label for="gr_telefono"><strong>Teléfono</strong></label><br>
        <input type="text" id="gr_telefono" name="gr_telefono" maxlength="20" value="<?php echo esc_attr((string) get_post_meta($post->ID, 'gr_telefono', true)); ?>">
        <span class="description">Solo números, espacios y un + al inicio.</span>
    </p>
    <?php
}

function gr_pintar_caja_punto(WP_Post $post): void {
    wp_nonce_field('gr_punto_guardar', 'gr_punto_nonce');
    $tipo = (string) get_post_meta($post->ID, 'gr_tipo', true);
    $tipos = ['encuentro' => 'Punto de encuentro', 'ruta' => 'Ruta de evacuación', 'riesgo' => 'Zona de riesgo'];
    ?>
    <p>
        <label for="gr_tipo"><strong>Tipo</strong></label><br>
        <select id="gr_tipo" name="gr_tipo">
            <?php foreach ($tipos as $valor => $etiqueta) : ?>
                <option value="<?php echo esc_attr($valor); ?>" <?php selected($tipo, $valor); ?>><?php echo esc_html($etiqueta); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="gr_descripcion"><strong>Descripción</strong></label><br>
        <textarea id="gr_descripcion" name="gr_descripcion" class="large-text" rows="3" maxlength="300"><?php echo esc_textarea((string) get_post_meta($post->ID, 'gr_descripcion', true)); ?></textarea>
    </p>
    <p>
        <label for="gr_referencia"><strong>Referencia</strong></label><br>
        <input type="text" id="gr_referencia" name="gr_referencia" class="regular-text" maxlength="120" value="<?php echo esc_attr((string) get_post_meta($post->ID, 'gr_referencia', true)); ?>">
    </p>
    <p>
        <label for="gr_coordenadas"><strong>Coordenadas</strong></label><br>
        <textarea id="gr_coordenadas" name="gr_coordenadas" class="large-text code" rows="5"><?php echo esc_textarea((string) get_post_meta($post->ID, 'gr_coordenadas', true)); ?></textarea>
        <span class="description">Un par latitud,longitud por línea. Por ejemplo: 4.6097,-74.0817. Las líneas que no sean válidas se descartan.</span>
    </p>
    <?php
}

function gr_guardar_campos(int $id, array $claves): void {
    foreach ($claves as $clave) {
        $valor = isset($_POST[$clave]) ? wp_unslash($_POST[$clave]) : '';
        update_post_meta($id, $clave, $valor);
    }
}

function gr_guardar_contacto(int $id): void {
    if (gr_guardar_caja($id, 'gr_contacto_guardar', 'gr_contacto_nonce')) {
        gr_guardar_campos($id, ['gr_grupo', 'gr_cargo', 'gr_sector', 'gr_telefono']);
    }
}

function gr_guardar_punto(int $id): void {
    if (gr_guardar_caja($id, 'gr_punto_guardar', 'gr_punto_nonce')) {
        gr_guardar_campos($id, ['gr_tipo', 'gr_descripcion', 'gr_referencia', 'gr_coordenadas']);
    }
}
