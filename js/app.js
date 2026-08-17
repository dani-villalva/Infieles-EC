// ==========================================================
// ORQUESTADOR: solo arranca cada módulo en orden. No contiene
// lógica de negocio — eso vive en feed.js / submit.js / comments.js / notifications.js
// ==========================================================
import { appState } from './state.js';
import { renderStories, renderFilters, initFeed, closeStory } from './feed.js';
import { populateCitySelect, renderCategoriesModal, initSubmitPanel } from './submit.js';
import { initComments } from './comments.js';
import { initNotifications } from './notifications.js';

async function initApp() {
    try {
        const response = await fetch('data/db.json');
        appState.staticData = await response.json();

        // Parte inicial (lo que se ve al entrar)
        renderStories();
        renderFilters();
        initFeed();

        // Panel de publicar (independiente del feed)
        renderCategoriesModal();
        populateCitySelect();
        initSubmitPanel();

        // Detalle + comentarios
        initComments();

        // Notificaciones de contenido nuevo
        initNotifications();

        // Visor de historias (cerrar)
        document.getElementById('closeStoryViewer').addEventListener('click', closeStory);
    } catch (error) {
        console.error('Error inicializando la app:', error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
