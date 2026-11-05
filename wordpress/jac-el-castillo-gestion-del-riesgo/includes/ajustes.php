<?php
defined('ABSPATH') || exit;

const GR_NIVELES = ['verde', 'amarilla', 'naranja', 'roja'];

add_action('admin_init', 'gr_registrar_ajustes');
add_action('admin_menu', 'gr_agregar_pagina_ajustes');

function gr_registrar_ajustes(): void {
    register_setting('gr_ajustes', 'gr_alerta', [
        'type' => 'array',
        'sanitize_callback' => 'gr_sanear_alerta',
        'default' => [],
        'show_in_rest' => false,
    ]);
}

function gr_sanear_alerta(mixed $entrada): array {
    $entrada = is_array($entrada) ? $entrada : [];
    $anterior = get_option('gr_alerta', []);
    $anterior = is_array($anterior) ? $anterior : [];

    $nueva = [
        'nivel' => gr_enum($entrada['nivel'] ?? '', GR_NIVELES, ''),
        'titulo' => gr_texto($entrada['titulo'] ?? '', 120),
        'descripcion' => gr_parrafo($entrada['descripcion'] ?? '', 600),
        'fuente' => gr_texto($entrada['fuente'] ?? '', 120),
    ];

    $previos = [];
    foreach (array_keys($nueva) as $clave) {
        $previos[$clave] = is_string($anterior[$clave] ?? null) ? $anterior[$clave] : '';
    }

    $actualizada = $anterior['actualizada'] ?? '';
    if ($nueva !== $previos || !is_string($actualizada) || $actualizada === '') {
        $actualizada = wp_date('c');
    }

    return $nueva + ['actualizada' => $actualizada];
}

function gr_agregar_pagina_ajustes(): void {
    add_options_page('Gestión del riesgo', 'Gestión del riesgo', 'manage_options', 'gr-ajustes', 'gr_pintar_ajustes');
}

function gr_pintar_ajustes(): void {
    if (!current_user_can('manage_options')) {
        return;
    }
    $alerta = get_option('gr_alerta', []);
    $alerta = is_array($alerta) ? $alerta : [];
    $nivel = (string) ($alerta['nivel'] ?? '');
    $etiquetas = ['verde' => 'Verde: sin alerta', 'amarilla' => 'Amarilla', 'naranja' => 'Naranja', 'roja' => 'Roja'];
    ?>
    <div class="wrap">
        <h1>Gestión del riesgo</h1>
        <form method="post" action="options.php">
            <?php settings_fields('gr_ajustes'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="gr_nivel">Nivel de alerta</label></th>
                    <td>
                        <select id="gr_nivel" name="gr_alerta[nivel]">
                            <?php foreach ($etiquetas as $valor => $etiqueta) : ?>
                                <option value="<?php echo esc_attr($valor); ?>" <?php selected($nivel, $valor); ?>><?php echo esc_html($etiqueta); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description">Verde se muestra como "Sin alerta activa". Amarilla, naranja y roja muestran el aviso completo con qué hacer.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="gr_titulo">Título</label></th>
                    <td><input type="text" id="gr_titulo" name="gr_alerta[titulo]" class="regular-text" maxlength="120" value="<?php echo esc_attr((string) ($alerta['titulo'] ?? '')); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="gr_descripcion">Descripción</label></th>
                    <td><textarea id="gr_descripcion" name="gr_alerta[descripcion]" class="large-text" rows="4" maxlength="600"><?php echo esc_textarea((string) ($alerta['descripcion'] ?? '')); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="gr_fuente">Fuente</label></th>
                    <td><input type="text" id="gr_fuente" name="gr_alerta[fuente]" class="regular-text" maxlength="120" value="<?php echo esc_attr((string) ($alerta['fuente'] ?? '')); ?>"></td>
                </tr>
            </table>
            <?php if (!empty($alerta['actualizada']) && is_string($alerta['actualizada'])) : ?>
                <p class="description">Última actualización: <?php echo esc_html($alerta['actualizada']); ?></p>
            <?php endif; ?>
            <?php submit_button('Guardar'); ?>
        </form>
    </div>
    <?php
}
