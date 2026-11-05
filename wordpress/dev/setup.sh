#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

until [ -f wp-config.php ]; do sleep 2; done
until wp db check >/dev/null 2>&1; do sleep 2; done

if ! wp core is-installed 2>/dev/null; then
  wp core install \
    --url=http://localhost:8080 \
    --title="JAC El Castillo local" \
    --admin_user=admin \
    --admin_password=admin-local \
    --admin_email=admin@example.invalid \
    --skip-email
fi

wp option update timezone_string America/Bogota
wp rewrite structure '/%postname%/' --hard
wp plugin activate jac-el-castillo-gestion-del-riesgo
wp option update gr_correo_avisos comite@example.invalid

wp eval-file /dev-scripts/datos-prueba.php

USUARIO=app-gestion-riesgo
if ! wp user get "$USUARIO" >/dev/null 2>&1; then
  wp user create "$USUARIO" app-gestion-riesgo@example.invalid --role=gr_app --user_pass="$(head -c 18 /dev/urandom | base64)"
fi

if ! wp user application-password list "$USUARIO" --field=name | grep -qx next-local; then
  echo "Application password de $USUARIO (se muestra una sola vez):"
  wp user application-password create "$USUARIO" next-local --porcelain
else
  echo "Application password next-local ya existe, no se vuelve a mostrar."
fi
