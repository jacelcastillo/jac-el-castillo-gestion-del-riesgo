<?php
defined('ABSPATH') || exit;

const GR_FOTO_MAX_BYTES = 1572864;
const GR_FOTO_PATRON = '/^[0-9a-f]{32}\.jpg$/';

add_action('before_delete_post', 'gr_borrar_foto_reporte', 10, 2);
add_action('admin_post_gr_foto', 'gr_servir_foto');
add_action('admin_post_nopriv_gr_foto', 'gr_negar_foto');

function gr_carpeta_fotos(): string {
    $carpeta = wp_upload_dir()['basedir'] . '/gr-reportes';
    if (!is_dir($carpeta)) {
        wp_mkdir_p($carpeta);
    }
    $htaccess = $carpeta . '/.htaccess';
    if (is_dir($carpeta) && !file_exists($htaccess)) {
        file_put_contents($htaccess, "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n");
    }
    if (is_dir($carpeta) && !file_exists($carpeta . '/index.php')) {
        file_put_contents($carpeta . '/index.php', '');
    }
    return $carpeta;
}

function gr_nombre_foto_valido(mixed $nombre): bool {
    return is_string($nombre) && preg_match(GR_FOTO_PATRON, $nombre) === 1;
}

function gr_ruta_foto(int $id_post): string {
    $nombre = get_post_meta($id_post, 'gr_foto', true);
    return gr_nombre_foto_valido($nombre) ? gr_carpeta_fotos() . '/' . $nombre : '';
}

/** @return string|WP_Error nombre guardado en la carpeta privada */
function gr_guardar_foto(array $archivo): string|WP_Error {
    $tmp = (string) ($archivo['tmp_name'] ?? '');
    if (($archivo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || $tmp === '') {
        return gr_error_datos('la foto no se pudo recibir.');
    }
    if ((int) ($archivo['size'] ?? 0) > GR_FOTO_MAX_BYTES) {
        return new WP_Error('gr_foto_grande', 'La foto es muy pesada.', ['status' => 413]);
    }
    $tipo = wp_check_filetype_and_ext($tmp, 'foto.jpg', ['jpg|jpeg' => 'image/jpeg'])['type'] ?? false;
    $info = getimagesize($tmp);
    if ($tipo !== 'image/jpeg' || $info === false || $info[2] !== IMAGETYPE_JPEG) {
        return gr_error_datos('la foto debe ser un JPEG.');
    }

    $nombre = bin2hex(random_bytes(16)) . '.jpg';
    if (!move_uploaded_file($tmp, gr_carpeta_fotos() . '/' . $nombre)) {
        return new WP_Error('gr_no_guardado', 'No se pudo guardar la foto.', ['status' => 500]);
    }
    return $nombre;
}

function gr_borrar_foto_reporte(int $id_post, WP_Post $post): void {
    if ($post->post_type !== 'gr_reporte') {
        return;
    }
    $ruta = gr_ruta_foto($id_post);
    if ($ruta !== '' && file_exists($ruta)) {
        unlink($ruta);
    }
}

function gr_url_foto(int $id_post): string {
    return admin_url('admin-post.php?action=gr_foto&id=' . $id_post . '&_wpnonce=' . wp_create_nonce('gr_foto_' . $id_post));
}

function gr_negar_foto(): never {
    wp_die('', '', ['response' => 403]);
}

function gr_servir_foto(): void {
    $id = absint($_GET['id'] ?? 0);
    $nonce = isset($_GET['_wpnonce']) ? sanitize_text_field(wp_unslash($_GET['_wpnonce'])) : '';
    if (
        !wp_verify_nonce($nonce, 'gr_foto_' . $id)
        || get_post_type($id) !== 'gr_reporte'
        || !current_user_can('edit_post', $id)
    ) {
        gr_negar_foto();
    }
    $ruta = gr_ruta_foto($id);
    if ($ruta === '' || !is_file($ruta)) {
        gr_negar_foto();
    }

    header('Content-Type: image/jpeg');
    header('Content-Length: ' . filesize($ruta));
    header('Cache-Control: private, no-store');
    header('X-Content-Type-Options: nosniff');
    readfile($ruta);
    exit;
}
