<?php
defined('ABSPATH') || exit;

const GR_GRUPOS = ['junta', 'lider', 'comite'];
const GR_TIPOS_PUNTO = ['encuentro', 'ruta', 'riesgo'];
const GR_FORMATOS_RECURSO = ['pdf' => 'PDF', 'word' => 'Word', 'excel' => 'Excel', 'powerpoint' => 'PowerPoint', 'imagen' => 'Imagen'];
const GR_MIMES_RECURSO = [
    'application/pdf' => 'pdf',
    'application/msword' => 'word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'word',
    'application/vnd.ms-excel' => 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'excel',
    'application/vnd.ms-powerpoint' => 'powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'powerpoint',
    'image/jpeg' => 'imagen',
    'image/png' => 'imagen',
    'image/webp' => 'imagen',
];

add_action('init', 'gr_registrar_tipos');
add_action('add_meta_boxes', 'gr_agregar_cajas_tipos');
add_action('admin_enqueue_scripts', 'gr_cargar_ubicacion_punto');
add_action('admin_enqueue_scripts', 'gr_cargar_recurso_archivo');
add_action('save_post_gr_contacto', 'gr_guardar_contacto');
add_action('save_post_gr_punto', 'gr_guardar_punto');
add_action('save_post_gr_recurso', 'gr_guardar_recurso');
add_filter('manage_gr_recurso_posts_columns', 'gr_columnas_recurso');
add_action('manage_gr_recurso_posts_custom_column', 'gr_pintar_columna_recurso', 10, 2);

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
    register_post_type('gr_recurso', $comun + [
        'labels' => ['name' => 'Recursos de riesgo', 'singular_name' => 'Recurso de riesgo'],
        'menu_icon' => 'dashicons-media-document',
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

    $registrar('gr_recurso', 'gr_archivo_id', static fn($v): string => absint(is_scalar($v) ? $v : 0) > 0 ? (string) absint($v) : '');
    $registrar('gr_recurso', 'gr_descripcion', static fn($v): string => gr_parrafo($v, 300));
}

function gr_cargar_ubicacion_punto(string $pantalla): void {
    if (!in_array($pantalla, ['post.php', 'post-new.php'], true) || get_current_screen()?->post_type !== 'gr_punto') {
        return;
    }
    wp_enqueue_script(
        'gr-ubicacion-punto',
        plugins_url('assets/ubicacion-punto.js', dirname(__DIR__) . '/jac-el-castillo-gestion-del-riesgo.php'),
        [],
        GR_VERSION,
        true
    );
}

function gr_cargar_recurso_archivo(string $pantalla): void {
    if (!in_array($pantalla, ['post.php', 'post-new.php'], true) || get_current_screen()?->post_type !== 'gr_recurso') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script(
        'gr-recurso-archivo',
        plugins_url('assets/recurso-archivo.js', dirname(__DIR__) . '/jac-el-castillo-gestion-del-riesgo.php'),
        [],
        GR_VERSION,
        true
    );
}

function gr_agregar_cajas_tipos(): void {
    add_meta_box('gr_contacto_datos', 'Datos del contacto', 'gr_pintar_caja_contacto', 'gr_contacto', 'normal', 'high');
    add_meta_box('gr_punto_datos', 'Datos del punto', 'gr_pintar_caja_punto', 'gr_punto', 'normal', 'high');
    add_meta_box('gr_recurso_datos', 'Archivo', 'gr_pintar_caja_recurso', 'gr_recurso', 'normal', 'high');
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
        <span class="description">Un par latitud,longitud por línea. Por ejemplo: 4.6097,-74.0817. Las líneas que no sean válidas se descartan. Estando en el lugar, usa el botón Agregar mi ubicación.</span>
    </p>
    <p>
        <button type="button" class="button" id="gr_agregar_ubicacion">Agregar mi ubicación</button>
        <span id="gr_ubicacion_estado" class="description" aria-live="polite"></span>
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

/** @return array{id: int, url: string, tamano: int, formato: string, nombre: string}|null */
function gr_archivo_recurso(int $post_id): ?array {
    $id = absint(get_post_meta($post_id, 'gr_archivo_id', true));
    if ($id === 0 || get_post_type($id) !== 'attachment') {
        return null;
    }
    $formato = GR_MIMES_RECURSO[(string) get_post_mime_type($id)] ?? '';
    $ruta = get_attached_file($id);
    $url = wp_get_attachment_url($id);
    $tamano = $ruta && is_file($ruta) ? (int) filesize($ruta) : 0;
    if ($formato === '' || !$url || $tamano <= 0) {
        return null;
    }
    return ['id' => $id, 'url' => $url, 'tamano' => $tamano, 'formato' => $formato, 'nombre' => wp_basename($ruta)];
}

function gr_resumen_archivo(?array $archivo): string {
    return $archivo === null ? '' : GR_FORMATOS_RECURSO[$archivo['formato']] . ', ' . size_format($archivo['tamano']);
}

function gr_pintar_caja_recurso(WP_Post $post): void {
    wp_nonce_field('gr_recurso_guardar', 'gr_recurso_nonce');
    $archivo = gr_archivo_recurso($post->ID);
    ?>
    <p class="description">El título es el nombre que se muestra. El orden se define con el campo Orden de la caja Atributos: los números menores van primero. Lo que es solo para leer va mejor en PDF.</p>
    <p>
        <input type="hidden" id="gr_archivo_id" name="gr_archivo_id" value="<?php echo esc_attr($archivo ? (string) $archivo['id'] : ''); ?>">
        <button type="button" class="button" id="gr_elegir_archivo"
            data-mimes="<?php echo esc_attr(wp_json_encode(array_keys(GR_MIMES_RECURSO))); ?>"
            data-formatos="<?php echo esc_attr(wp_json_encode(array_map(static fn(string $f): string => GR_FORMATOS_RECURSO[$f], GR_MIMES_RECURSO))); ?>">Elegir o subir archivo</button>
        <button type="button" class="button-link-delete" id="gr_quitar_archivo"<?php echo $archivo ? '' : ' hidden'; ?>>Quitar</button>
    </p>
    <p id="gr_archivo_estado" aria-live="polite"><?php
        echo $archivo
            ? esc_html($archivo['nombre'] . ' (' . gr_resumen_archivo($archivo) . ')')
            : 'Todavía no hay archivo. Formatos permitidos: PDF, Word, Excel, PowerPoint e imágenes (JPG, PNG, WebP).';
    ?></p>
    <p>
        <label for="gr_descripcion"><strong>Descripción</strong></label><br>
        <textarea id="gr_descripcion" name="gr_descripcion" class="large-text" rows="3" maxlength="300"><?php echo esc_textarea((string) get_post_meta($post->ID, 'gr_descripcion', true)); ?></textarea>
    </p>
    <?php
}

function gr_guardar_recurso(int $id): void {
    if (!gr_guardar_caja($id, 'gr_recurso_guardar', 'gr_recurso_nonce')) {
        return;
    }
    $adjunto = isset($_POST['gr_archivo_id']) ? absint(wp_unslash($_POST['gr_archivo_id'])) : 0;
    $valido = $adjunto > 0 && get_post_type($adjunto) === 'attachment' && isset(GR_MIMES_RECURSO[(string) get_post_mime_type($adjunto)]);
    update_post_meta($id, 'gr_archivo_id', $valido ? $adjunto : '');
    gr_guardar_campos($id, ['gr_descripcion']);
}

function gr_columnas_recurso(array $columnas): array {
    return [
        'cb' => $columnas['cb'] ?? '',
        'title' => $columnas['title'] ?? 'Título',
        'gr_col_archivo' => 'Archivo',
        'date' => $columnas['date'] ?? 'Fecha',
    ];
}

function gr_pintar_columna_recurso(string $columna, int $id): void {
    if ($columna === 'gr_col_archivo') {
        $archivo = gr_archivo_recurso($id);
        echo $archivo === null ? 'Sin archivo' : esc_html(gr_resumen_archivo($archivo));
    }
}
