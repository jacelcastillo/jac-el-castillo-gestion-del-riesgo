<?php
/**
 * Plugin Name: JAC El Castillo · Gestión del Riesgo
 * Description: Alerta, avisos, contactos, puntos del mapa y recursos descargables de gestión del riesgo de la JAC El Castillo, publicados por una ruta REST de solo lectura, y reportes de la comunidad recibidos por la app.
 * Version: 0.5.0
 * Requires PHP: 8.1
 * Text Domain: jac-el-castillo-gestion-del-riesgo
 */

defined('ABSPATH') || exit;

const GR_VERSION = '0.5.0';
const GR_CATEGORIA_SLUG = 'gestion-del-riesgo';

require_once __DIR__ . '/includes/migraciones.php';
require_once __DIR__ . '/includes/sanitizar.php';
require_once __DIR__ . '/includes/avisos.php';
require_once __DIR__ . '/includes/ajustes.php';
require_once __DIR__ . '/includes/contexto.php';
require_once __DIR__ . '/includes/tipos.php';
require_once __DIR__ . '/includes/rest.php';
require_once __DIR__ . '/includes/reportes.php';
require_once __DIR__ . '/includes/reportes-fotos.php';
require_once __DIR__ . '/includes/reportes-rest.php';
require_once __DIR__ . '/includes/reportes-admin.php';
