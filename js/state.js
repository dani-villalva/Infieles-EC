// Estado compartido entre módulos. Un solo objeto mutable, importado
// donde se necesite, para no depender de variables globales sueltas.
export const appState = {
    staticData: { ciudades: [], categorias: [], historias_ig: [] },
    posts: [],              // se llena en tiempo real desde Firestore (colección "posts")
    activeCategory: 'todo',
    activeCity: 'Todas',
    storyTimer: null,
    activePostId: null,     // post abierto actualmente en el detalle
    commentsUnsub: null,    // función para cancelar el listener de comentarios al cerrar el detalle
    clientId: (function () {
        // Identificador anónimo por dispositivo/navegador, solo para no
        // auto-notificarnos cuando publicamos algo nosotros mismos.
        let id = localStorage.getItem('infielesec_client_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('infielesec_client_id', id);
        }
        return id;
    })()
};
