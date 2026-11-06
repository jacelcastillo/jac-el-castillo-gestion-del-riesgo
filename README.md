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

El sitio funciona sin señal después de la primera visita: el celular guarda el inicio, Aprende, Reportar, Contactos, Avisos, Mis reportes, Prepárate, Sobre la JAC, la privacidad, el mapa comunitario (si hay puntos), Recursos y cada riesgo (lista en `lib/precache.ts`). Lo que no está guardado muestra la página "Sin conexión". Cada despliegue trae una versión nueva (`VERCEL_GIT_COMMIT_SHA`) y el celular reemplaza su copia guardada al abrir el sitio con señal.

## Cómo opera la Junta en wp-admin

Todo se hace desde wp-admin, en el WordPress de la JAC. Los cambios llegan al sitio en menos de un minuto.

**Publicar un aviso.** Entradas, Añadir nueva. Elige la categoría Gestión del riesgo, escribe el título y llena el Extracto: es el resumen que se ve en el sitio. Si es un simulacro o un taller, llena la caja Evento (tipo, fecha, hora y lugar). Publica.

**Cambiar la alerta.** Ajustes, Gestión del riesgo. Cambia el nivel, el título y la descripción, y guarda.

**Atender reportes.** Reportes de riesgo. Abre el reporte para ver la descripción, la ubicación y la foto. Cambia el estado cuando lo atiendan: quien reportó lo ve en Mis reportes. Cada reporte nuevo también llega por correo al correo de avisos (Ajustes, Gestión del riesgo), sin la foto: la foto solo se ve dentro del reporte.

**Cargar contactos.** Contactos de riesgo, Añadir nuevo. El título es el nombre. Elige el grupo (Junta, Líder de sector o Comité), el cargo, el sector y el teléfono. El campo Orden de la caja Atributos define quién va primero.

**Cargar puntos del mapa.** Puntos del mapa, Añadir nuevo. Escribe el nombre, elige el tipo (punto de encuentro, ruta de evacuación o zona de riesgo), la descripción y una referencia. Para las coordenadas hay dos caminos:
- Estando en el lugar, toca Agregar mi ubicación y permite la ubicación en el navegador. En un punto de encuentro o una zona de riesgo basta un toque. En una ruta, toca una vez en cada curva, caminando de principio a fin: cada toque agrega una línea. Si dice que la precisión es baja, espera un momento, sal a cielo abierto y toca de nuevo.
- Desde la oficina, abre Google Maps, deja presionado el lugar y copia los números que aparecen (por ejemplo 4.6097, -74.0817). Pégalos en Coordenadas, un par por línea.

El mapa solo aparece en el sitio cuando hay al menos un punto publicado.

**Subir un recurso.** Recursos de riesgo, Añadir nuevo. Escribe el título (es el nombre que se muestra) y la descripción, toca Elegir o subir archivo y elige el documento de la Biblioteca de medios o súbelo desde el celular o el computador. Los formatos permitidos son PDF, Word, Excel, PowerPoint e imágenes (JPG, PNG o WebP). Define el orden con el campo Orden de la caja Atributos y toca Publicar. Un recurso sin archivo, o con un formato no permitido, no aparece en el sitio; la lista de wp-admin dice "Sin archivo" en su columna Archivo. Lo que es solo para leer va mejor en PDF; usa Excel o Word para lo que el vecino debe llenar. Si WordPress rechaza el archivo por su tamaño, hay que comprimirlo. En el sitio, el PDF y la imagen se abren en otra pestaña y los archivos de Office se descargan. La lista se ve sin señal, pero el archivo no: quien lo necesite sin señal debe descargarlo antes.

**Subir una versión nueva del plugin.** Plugins, Añadir nuevo, Subir plugin. Elige el archivo `jac-el-castillo-gestion-del-riesgo.zip` y toca Instalar ahora. WordPress avisa que el plugin ya existe: toca "Reemplazar el actual con el subido". No hace falta activarlo otra vez.

Para quien desarrolla: `pnpm check-urls <url>` revisa las páginas, los encabezados de seguridad y las rutas de la API de un despliegue sin enviar ningún reporte (por defecto http://localhost:3200).
