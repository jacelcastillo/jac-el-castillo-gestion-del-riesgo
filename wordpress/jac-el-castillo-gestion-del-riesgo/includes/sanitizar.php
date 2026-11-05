<?php
defined('ABSPATH') || exit;

function gr_texto(mixed $valor, int $max): string {
    $texto = sanitize_text_field(is_scalar($valor) ? (string) $valor : '');
    return mb_substr($texto, 0, $max);
}

function gr_parrafo(mixed $valor, int $max): string {
    $texto = sanitize_textarea_field(is_scalar($valor) ? (string) $valor : '');
    return mb_substr($texto, 0, $max);
}

function gr_enum(mixed $valor, array $permitidos, string $defecto): string {
    return is_string($valor) && in_array($valor, $permitidos, true) ? $valor : $defecto;
}

function gr_fecha_evento(mixed $valor): string {
    if (!is_string($valor) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/', $valor, $m)) {
        return '';
    }
    [, $a, $mes, $d, $h, $min] = array_map('intval', $m);
    if (!checkdate($mes, $d, $a) || $h > 23 || $min > 59) {
        return '';
    }
    return $valor;
}

function gr_telefono(mixed $valor): string {
    $texto = is_scalar($valor) ? trim((string) $valor) : '';
    $limpio = preg_replace('/[^\d\s+]/', '', $texto) ?? '';
    $mas = str_starts_with($limpio, '+') ? '+' : '';
    $resto = str_replace('+', '', $limpio);
    return mb_substr($mas . $resto, 0, 20);
}

/** @return list<array{0: float, 1: float}> */
function gr_parsear_coordenadas(mixed $valor): array {
    if (!is_string($valor)) {
        return [];
    }
    $pares = [];
    foreach (preg_split('/\R/', $valor) ?: [] as $linea) {
        if (!preg_match('/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/', $linea, $m)) {
            continue;
        }
        $lat = (float) $m[1];
        $lng = (float) $m[2];
        if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
            continue;
        }
        $pares[] = [$lat, $lng];
        if (count($pares) === 50) {
            break;
        }
    }
    return $pares;
}

function gr_coordenadas(mixed $valor): string {
    return implode("\n", array_map(
        static fn(array $par): string => $par[0] . ',' . $par[1],
        gr_parsear_coordenadas($valor)
    ));
}

function gr_plano(mixed $valor): string {
    $texto = is_scalar($valor) ? html_entity_decode((string) $valor, ENT_QUOTES | ENT_HTML5, 'UTF-8') : '';
    return trim(wp_strip_all_tags($texto));
}

function gr_guardar_caja(int $id, string $nonce_accion, string $nonce_campo): bool {
    if (!isset($_POST[$nonce_campo]) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[$nonce_campo])), $nonce_accion)) {
        return false;
    }
    if (wp_is_post_autosave($id) || wp_is_post_revision($id)) {
        return false;
    }
    return current_user_can('edit_post', $id);
}
