# Gestión del Riesgo · JAC El Castillo

Sitio Next.js que lee su contenido de un plugin de WordPress (`wordpress/jac-el-castillo-gestion-del-riesgo`) por la ruta REST `/wp-json/jac-gr/v1/contenido`.

## Probar todo en local

Necesitas Docker y pnpm.

1. `pnpm wp:up`: levanta WordPress y la base de datos en http://localhost:8080.
2. `pnpm wp:setup`: instala WordPress, activa el plugin y carga los datos de prueba. Se puede repetir sin duplicar nada.
3. `pnpm wp:check`: revisa el contrato de la ruta, la migración y que las entradas de riesgo no se vean en el WordPress viejo.
4. `WP_URL=http://localhost:8080 pnpm dev`: corre el sitio nuevo leyendo ese WordPress.
5. `pnpm wp:zip`: arma `dist/jac-el-castillo-gestion-del-riesgo.zip` para subirlo desde wp-admin (Plugins, Añadir nuevo, Subir plugin).

Las entradas de la categoría Gestión del riesgo no se muestran en el sitio viejo (inicio, feed, búsqueda ni archivo): quien abre una de ellas llega al sitio nuevo con una redirección. La dirección se cambia en Ajustes, Gestión del riesgo, campo "URL del sitio nuevo" (por defecto https://web.jacelcastillo.com.co). La ruta REST sigue devolviéndolas.

Para revisar producción sin escribir nada: `node scripts/check-wp.mjs https://jacelcastillo.com.co --prod`.
