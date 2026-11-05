# Gestión del Riesgo · JAC El Castillo

Sitio Next.js que lee su contenido de un plugin de WordPress (`wordpress/jac-el-castillo-gestion-del-riesgo`) por la ruta REST `/wp-json/jac-gr/v1/contenido`.

## Probar todo en local

Necesitas Docker y pnpm.

1. `pnpm wp:up`: levanta WordPress y la base de datos en http://localhost:8080.
2. `pnpm wp:setup`: instala WordPress, activa el plugin y carga los datos de prueba. Se puede repetir sin duplicar nada.
3. `pnpm wp:check`: revisa el contrato de la ruta, los reportes, la migración y que las entradas de riesgo no se vean en el WordPress viejo.
4. `WP_URL=http://localhost:8080 pnpm dev`: corre el sitio nuevo leyendo ese WordPress. Para enviar reportes, agrega `WP_APP_USER=app-gestion-riesgo` y `WP_APP_PASSWORD` con una contraseña de aplicación local (`docker compose -f wordpress/compose.yml run --rm -T wpcli wp user application-password create app-gestion-riesgo next-local --porcelain`).
5. `pnpm wp:zip`: arma `dist/jac-el-castillo-gestion-del-riesgo.zip` para subirlo desde wp-admin (Plugins, Añadir nuevo, Subir plugin).

Desde la versión 0.3 del plugin, la foto de un reporte se guarda en `wp-content/uploads/gr-reportes`, una carpeta bloqueada por `.htaccess` con nombres al azar. Solo se ve en wp-admin, para quien puede editar el reporte. Si borras un reporte definitivamente, también se borra su foto.

Los correos de aviso de reportes no salen a internet: en local los recoge Mailpit en http://localhost:8025. El correo de destino se cambia en Ajustes, Gestión del riesgo, campo "Correo para avisos de reportes".

Las entradas de la categoría Gestión del riesgo no se muestran en el sitio viejo (inicio, feed, búsqueda ni archivo): quien abre una de ellas llega al sitio nuevo con una redirección. La dirección se cambia en Ajustes, Gestión del riesgo, campo "URL del sitio nuevo" (por defecto https://web.jacelcastillo.com.co). La ruta REST sigue devolviéndolas.

En Vercel el sitio necesita `WP_URL`, `WP_APP_USER` y `WP_APP_PASSWORD` (esta última como Sensitive). La contraseña es una contraseña de aplicación del usuario `app-gestion-riesgo`, con perfil "App Gestión del Riesgo": solo puede enviar reportes y consultar su estado.

Para revisar producción sin escribir nada: `node scripts/check-wp.mjs https://jacelcastillo.com.co --prod`.

El sitio funciona sin señal después de la primera visita: el celular guarda el inicio, Aprende, Reportar, Contactos, Avisos, Mis reportes, Prepárate, Sobre la JAC, la privacidad y cada riesgo (lista en `lib/precache.ts`). Lo que no está guardado muestra la página "Sin conexión". Cada despliegue trae una versión nueva (`VERCEL_GIT_COMMIT_SHA`) y el celular reemplaza su copia guardada al abrir el sitio con señal.
