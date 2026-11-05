<?php
defined('ABSPATH') || exit;

add_action('phpmailer_init', static function ($phpmailer): void {
    $phpmailer->isSMTP();
    $phpmailer->Host = 'mailpit';
    $phpmailer->Port = 1025;
    $phpmailer->SMTPAuth = false;
    $phpmailer->SMTPAutoTLS = false;
});

add_filter('wp_mail_from', static fn(): string => 'wordpress@example.invalid');
