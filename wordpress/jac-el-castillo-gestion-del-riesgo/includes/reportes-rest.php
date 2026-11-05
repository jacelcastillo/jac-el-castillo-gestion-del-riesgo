<?php
defined('ABSPATH') || exit;

const GR_LIMITE_REPORTES = 5;
const GR_VENTANA_LIMITE = 600;
const GR_UUID_PATRON = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

add_action('rest_api_init', 'gr_registrar_rutas_reportes');

// La validación va en el callback porque WP valida los args antes del permission_callback y un 400 taparía el 401.
function gr_registrar_rutas_reportes(): void {
    register_rest_route('jac-gr/v1', '/reportes', [
        'methods' => 'POST',
        'callback' => 'gr_recibir_reporte',
        'permission_callback' => 'gr_puede_enviar_reportes',
    ]);
    register_rest_route('jac-gr/v1', '/reportes/estado', [
        'methods' => 'POST',
        'callback' => 'gr_consultar_estados',
        'permission_callback' => 'gr_puede_enviar_reportes',
    ]);
}

function gr_puede_enviar_reportes(): bool|WP_Error {
    if (!is_user_logged_in()) {
        return new WP_Error('gr_no_autenticado', 'Falta la autenticación.', ['status' => 401]);
    }
    if (!current_user_can('gr_enviar_reportes')) {
        return new WP_Error('gr_sin_permiso', 'Este usuario no puede enviar reportes.', ['status' => 403]);
    }
    return true;
}

function gr_error_datos(string $mensaje): WP_Error {
    return new WP_Error('rest_invalid_param', 'Datos inválidos: ' . $mensaje, ['status' => 400]);
}

/** @return array<string, mixed> */
function gr_esquema_reporte(): array {
    return [
        'type' => 'object',
        'required' => ['id', 'type', 'location', 'description', 'severity', 'peopleAffected', 'contact', 'consent'],
        'properties' => [
            'id' => ['type' => 'string', 'pattern' => GR_UUID_PATRON],
            'createdAt' => ['type' => 'string', 'format' => 'date-time'],
            'type' => ['type' => 'string', 'enum' => array_keys(GR_TIPOS_REPORTE)],
            'location' => [
                'type' => 'object',
                'required' => ['mode'],
                'properties' => [
                    'mode' => ['type' => 'string', 'enum' => ['gps', 'manual']],
                    'latitude' => ['type' => 'number', 'minimum' => -90, 'maximum' => 90],
                    'longitude' => ['type' => 'number', 'minimum' => -180, 'maximum' => 180],
                    'accuracy' => ['type' => 'number', 'minimum' => 0],
                    'address' => ['type' => 'string', 'maxLength' => 200],
                    'reference' => ['type' => 'string', 'maxLength' => 160],
                ],
            ],
            'description' => ['type' => 'string'],
            'severity' => ['type' => 'string', 'enum' => GR_GRAVEDADES],
            'peopleAffected' => ['type' => 'string', 'enum' => array_keys(GR_AFECTADOS)],
            'contact' => [
                'type' => 'object',
                'required' => ['anonymous'],
                'properties' => [
                    'anonymous' => ['type' => 'boolean'],
                    'name' => ['type' => 'string', 'maxLength' => 80],
                    'phone' => ['type' => 'string', 'maxLength' => 30],
                ],
            ],
            'consent' => ['type' => 'boolean'],
        ],
    ];
}

/** @return array<string, mixed>|WP_Error */
function gr_normalizar_reporte(mixed $cuerpo): array|WP_Error {
    if (!is_array($cuerpo)) {
        return gr_error_datos('el cuerpo debe ser un objeto JSON.');
    }
    $valido = rest_validate_value_from_schema($cuerpo, gr_esquema_reporte(), 'body');
    if (is_wp_error($valido)) {
        return gr_error_datos($valido->get_error_message());
    }

    if (($cuerpo['consent'] ?? null) !== true) {
        return gr_error_datos('consent debe ser true.');
    }

    $descripcion = trim(sanitize_textarea_field((string) $cuerpo['description']));
    $largo = mb_strlen($descripcion);
    if ($largo < 10 || $largo > 600) {
        return gr_error_datos('description debe tener entre 10 y 600 caracteres.');
    }

    $ubicacion = $cuerpo['location'];
    $direccion = gr_texto($ubicacion['address'] ?? '', 200);
    $tiene_coordenadas = isset($ubicacion['latitude'], $ubicacion['longitude']);
    $con_gps = $ubicacion['mode'] === 'gps' && $tiene_coordenadas;
    if (!$con_gps && mb_strlen($direccion) < 4) {
        return gr_error_datos('location necesita coordenadas con mode gps o una dirección de al menos 4 caracteres.');
    }

    $contacto = $cuerpo['contact'];
    $anonimo = $contacto['anonymous'] === true;
    $nombre = '';
    $telefono = '';
    if (!$anonimo) {
        $nombre = gr_texto($contacto['name'] ?? '', 80);
        $telefono = preg_replace('/\D/', '', (string) ($contacto['phone'] ?? '')) ?? '';
        if (mb_strlen($nombre) < 2) {
            return gr_error_datos('contact.name debe tener al menos 2 caracteres.');
        }
        if (!preg_match('/^(3\d{9}|60\d{8})$/', $telefono)) {
            return gr_error_datos('contact.phone no es un teléfono colombiano válido.');
        }
    }

    $creado = isset($cuerpo['createdAt']) ? rest_parse_date((string) $cuerpo['createdAt']) : false;

    return [
        'id' => strtolower((string) $cuerpo['id']),
        'creado' => $creado ? gmdate('c', $creado) : '',
        'tipo' => (string) $cuerpo['type'],
        'gravedad' => (string) $cuerpo['severity'],
        'afectados' => (string) $cuerpo['peopleAffected'],
        'descripcion' => $descripcion,
        'lat' => $tiene_coordenadas ? (float) $ubicacion['latitude'] : null,
        'lng' => $tiene_coordenadas ? (float) $ubicacion['longitude'] : null,
        'precision' => isset($ubicacion['accuracy']) ? (float) $ubicacion['accuracy'] : null,
        'direccion' => $direccion,
        'referencia' => gr_texto($ubicacion['reference'] ?? '', 160),
        'anonimo' => $anonimo,
        'nombre' => $nombre,
        'telefono' => $telefono,
    ];
}

function gr_ip_visitante(WP_REST_Request $peticion): string {
    $ip = trim((string) $peticion->get_header('x_gr_ip'));
    if (filter_var($ip, FILTER_VALIDATE_IP)) {
        return $ip;
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '');
}

function gr_clave_limite(string $ip): string {
    return 'gr_lim_' . hash_hmac('sha256', $ip, wp_salt('auth'));
}

/** @return array{n: int, hasta: int} */
function gr_leer_limite(string $clave): array {
    $actual = get_transient($clave);
    $actual = is_array($actual) ? $actual : [];
    return ['n' => (int) ($actual['n'] ?? 0), 'hasta' => (int) ($actual['hasta'] ?? 0)];
}

function gr_contar_nuevo_reporte(string $clave): void {
    $actual = gr_leer_limite($clave);
    $hasta = $actual['hasta'] > time() ? $actual['hasta'] : time() + GR_VENTANA_LIMITE;
    set_transient($clave, ['n' => $actual['n'] + 1, 'hasta' => $hasta], $hasta - time());
}

function gr_recibir_reporte(WP_REST_Request $peticion): WP_REST_Response|WP_Error {
    $cuerpo = $peticion->get_json_params();
    if (!is_array($cuerpo)) {
        $texto = $peticion->get_param('datos');
        $cuerpo = is_string($texto) ? json_decode($texto, true) : null;
    }
    $datos = gr_normalizar_reporte($cuerpo);
    if (is_wp_error($datos)) {
        return $datos;
    }

    $existente = gr_buscar_reporte($datos['id']);
    if ($existente !== null) {
        return new WP_REST_Response(['id' => $datos['id'], 'estado' => gr_estado_reporte($existente)], 200);
    }

    $clave = gr_clave_limite(gr_ip_visitante($peticion));
    $limite = gr_leer_limite($clave);
    if ($limite['n'] >= GR_LIMITE_REPORTES) {
        return new WP_Error('gr_limite', 'Demasiados reportes en poco tiempo. Intenta de nuevo en unos minutos.', ['status' => 429]);
    }

    $archivo = $peticion->get_file_params()['foto'] ?? null;
    if (is_array($archivo)) {
        $foto = gr_guardar_foto($archivo);
        if (is_wp_error($foto)) {
            return $foto;
        }
        $datos['foto'] = $foto;
    }

    $id_post = gr_crear_reporte($datos);
    if (is_wp_error($id_post)) {
        if (!empty($datos['foto'])) {
            unlink(gr_carpeta_fotos() . '/' . $datos['foto']);
        }
        return new WP_Error('gr_no_guardado', 'No se pudo guardar el reporte.', ['status' => 500]);
    }

    gr_contar_nuevo_reporte($clave);
    gr_avisar_reporte($id_post, $datos);
    return new WP_REST_Response(['id' => $datos['id'], 'estado' => 'recibido'], 201);
}

function gr_estado_reporte(int $id_post): string {
    return gr_enum(get_post_meta($id_post, 'gr_estado', true), array_keys(GR_ESTADOS), 'recibido');
}

function gr_consultar_estados(WP_REST_Request $peticion): array|WP_Error {
    $cuerpo = $peticion->get_json_params();
    $esquema = [
        'type' => 'object',
        'required' => ['ids'],
        'properties' => ['ids' => [
            'type' => 'array',
            'minItems' => 1,
            'maxItems' => 50,
            'items' => ['type' => 'string', 'pattern' => GR_UUID_PATRON],
        ]],
    ];
    $valido = is_array($cuerpo) ? rest_validate_value_from_schema($cuerpo, $esquema, 'body') : false;
    if ($valido !== true) {
        return gr_error_datos(is_wp_error($valido) ? $valido->get_error_message() : 'ids debe ser una lista.');
    }

    $ids = array_values(array_unique(array_map('strtolower', $cuerpo['ids'])));
    $posts = get_posts([
        'post_type' => 'gr_reporte',
        'post_status' => 'private',
        'meta_query' => [['key' => 'gr_id_cliente', 'value' => $ids, 'compare' => 'IN']],
        'posts_per_page' => 50,
        'no_found_rows' => true,
    ]);

    return array_map(static function (WP_Post $p): array {
        $actualizado = (string) get_post_meta($p->ID, 'gr_estado_actualizado', true);
        return [
            'id' => (string) get_post_meta($p->ID, 'gr_id_cliente', true),
            'estado' => gr_estado_reporte($p->ID),
            'actualizado' => $actualizado !== '' ? $actualizado : get_post_time('c', true, $p),
        ];
    }, $posts);
}
