# Infieles EC

## Qué cambió en esta versión

1. **Separación de responsabilidades**: cada parte del código ahora vive en su propio módulo dentro de `js/`, en vez de un único `app.js`:
   - `state.js` — estado compartido entre módulos.
   - `firebase-config.js` / `firebase-init.js` — conexión a Firebase.
   - `feed.js` — historias, filtros y el listado principal ("parte inicial").
   - `submit.js` — el panel de publicar una confesión (completamente separado del feed).
   - `comments.js` — vista de detalle y comentarios en tiempo real.
   - `notifications.js` — campanita, panel de notificaciones y toasts.
   - `app.js` — solo arranca los módulos, sin lógica propia.

2. **Firebase (plan gratuito Spark) para datos en tiempo real**:
   - Las confesiones (`posts`) y los comentarios (`comments`) ya no viven en `db.json` ni en memoria: se guardan en **Firestore** y se sincronizan en vivo entre todos los que tengan la app abierta.
   - `data/db.json` ahora solo guarda configuración estática: categorías, ciudades y avatares de historias.

3. **Notificaciones de contenido nuevo**:
   - Cuando alguien publica una confesión nueva, todos los demás ven un **toast** en pantalla, un contador en la **campanita** del header y (si dan permiso) una **notificación nativa del navegador**.
   - No te notifica tus propias publicaciones (se identifican con un `clientId` guardado en `localStorage` de tu navegador).

## Cómo poner en marcha Firebase (gratis)

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto nuevo (queda en el plan gratuito "Spark" por defecto).
2. En el menú lateral: **Compilación → Firestore Database → Crear base de datos**. Elige la región más cercana (ej. `us-central` o `southamerica-east1`) y modo "producción".
3. Ve a **Firestore Database → Reglas** y pega el contenido del archivo `firestore.rules` incluido en este proyecto. Publica los cambios.
4. Ve a **Configuración del proyecto** (ícono de engranaje arriba a la izquierda) → pestaña **General** → sección "Tus apps" → clic en el ícono `</>` (Web) → registra la app (no hace falta hosting).
5. Firebase te muestra un objeto `firebaseConfig`. Cópialo completo y pégalo en `js/firebase-config.js`, reemplazando los valores de ejemplo.
6. Abre `index.html` (con un servidor local, no con doble clic — los módulos de JS necesitan `http://`, no `file://`). Por ejemplo:
   ```bash
   npx serve .
   # o
   python3 -m http.server 8080
   ```
7. Publica una confesión de prueba y ábrela en otra pestaña o en el celular: debería aparecer al instante en ambos, junto con la notificación.

### ⚠️ Índice de Firestore para los comentarios

La consulta de comentarios filtra por `postId` y ordena por `fecha`, lo cual **requiere un índice compuesto**. La primera vez que abras el detalle de un post con comentarios, es probable que la consola del navegador (F12) muestre un error con un enlace tipo `https://console.firebase.google.com/.../firestore/indexes?create_composite=...`. Solo entra a ese enlace, clic en "Crear índice" y espera 1-2 minutos a que quede listo. Después de eso funciona sin problema.

## Límites del plan gratuito a tener en cuenta

- Firestore Spark: 50,000 lecturas y 20,000 escrituras por día, 1 GiB de almacenamiento. Para un proyecto en pruebas o con tráfico moderado es más que suficiente; si crece mucho, tocaría pasar al plan de pago (Blaze), que igual solo cobra lo que excede la capa gratuita.
- Las notificaciones nativas del navegador solo funcionan si el usuario acepta el permiso y mientras la pestaña siga abierta (no son push reales tipo app móvil; eso requeriría Firebase Cloud Messaging + Service Worker, que se puede añadir después si lo necesitas).

## Pendiente / ideas para seguir mejorando

- Autenticación anónima de Firebase (`signInAnonymously`) para poder, por ejemplo, evitar likes duplicados por usuario.
- Moderación de contenido antes de publicar (palabras prohibidas, límite de publicaciones por hora, etc.).
- Subida real de imagen/audio (ahora mismo esos inputs del formulario no están conectados a nada) usando Firebase Storage.
