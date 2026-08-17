// ==========================================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================================
// 1. Ve a https://console.firebase.google.com y crea un proyecto (plan gratuito "Spark").
// 2. Dentro del proyecto: Compilación > Firestore Database > Crear base de datos
//    (elige "modo de producción" y aplica las reglas del archivo firestore.rules incluido).
// 3. Ve a Configuración del proyecto (ícono engranaje) > tus apps > Web (</>) y registra la app.
// 4. Copia el objeto "firebaseConfig" que te muestra Firebase y pégalo abajo, reemplazando
//    estos valores de ejemplo.
// ==========================================================

export const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxxxx"
};
