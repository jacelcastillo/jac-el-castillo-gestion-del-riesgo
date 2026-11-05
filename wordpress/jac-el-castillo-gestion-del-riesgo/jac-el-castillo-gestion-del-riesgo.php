<?php
/**
 * Plugin Name: JAC El Castillo · Gestión del Riesgo
 * Description: Alerta, avisos, contactos y puntos del mapa de gestión del riesgo de la JAC El Castillo, publicados por una ruta REST de solo lectura.
 * Version: 0.1.0
 * Requires PHP: 8.1
 * Text Domain: jac-el-castillo-gestion-del-riesgo
 */

defined('ABSPATH') || exit;

const GR_VERSION = '0.1.0';
const GR_CATEGORIA_SLUG = 'gestion-del-riesgo';

require_once __DIR__ . '/includes/migraciones.php';
require_once __DIR__ . '/includes/sanitizar.php';
require_once __DIR__ . '/includes/avisos.php';
require_once __DIR__ . '/includes/ajustes.php';
require_once __DIR__ . '/includes/tipos.php';
require_once __DIR__ . '/includes/rest.php';
