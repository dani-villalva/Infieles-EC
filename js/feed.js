// ==========================================================
// FEED: historias IG, filtros y listado principal de confesiones.
// ==========================================================
import { db } from './firebase-init.js';
import {
    collection, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';
import { openDetail } from './comments.js';

export function renderStories() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = '';
    appState.staticData.historias_ig.forEach(story => {
        const div = document.createElement('div');
        div.className = 'story';
        div.innerHTML = `<img src="${story.imagen}" alt="User"><span>${story.usuario}</span>`;
        div.onclick = () => openStoryViewer(story.imagen);
        container.appendChild(div);
    });
}

export function openStoryViewer(imageUrl) {
    const viewer = document.getElementById('storyViewer');
    const img = document.getElementById('storyImageFull');
    const bar = document.getElementById('storyProgressBar');

    img.src = imageUrl;
    viewer.classList.remove('hidden');

    let progress = 0;
    bar.style.width = '0%';
    clearInterval(appState.storyTimer);

    appState.storyTimer = setInterval(() => {
        progress += 2;
        bar.style.width = `${progress}%`;
        if (progress >= 100) closeStory();
    }, 100);
}

export function closeStory() {
    document.getElementById('storyViewer').classList.add('hidden');
    clearInterval(appState.storyTimer);
}

export function renderFilters() {
    const catContainer = document.getElementById('categoryFilters');
    const cityContainer = document.getElementById('cityFilters');

    catContainer.innerHTML = '';
    appState.staticData.categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${appState.activeCategory === cat.id ? 'active' : ''}`;
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            appState.activeCategory = cat.id;
            renderFilters();
            applyFilters();
        };
        catContainer.appendChild(btn);
    });

    cityContainer.innerHTML = '';
    appState.staticData.ciudades.forEach(city => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${appState.activeCity === city ? 'active' : ''}`;
        btn.textContent = city;
        btn.onclick = () => {
            appState.activeCity = city;
            renderFilters();
            applyFilters();
        };
        cityContainer.appendChild(btn);
    });
}

export function initFeed() {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = `<p style="text-align:center; color:#D1D5DB;">Cargando confesiones...</p>`;

    const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
    onSnapshot(q, (snapshot) => {
        appState.posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        applyFilters();
    }, (error) => {
        console.error('Error escuchando posts:', error);
        feed.innerHTML = `<p style="text-align:center; color:#D1D5DB;">No se pudo conectar con la base de datos. Revisa tu configuración de Firebase.</p>`;
    });
}

export function applyFilters() {
    let filtradas = appState.posts;
    if (appState.activeCategory !== 'todo') filtradas = filtradas.filter(h => h.categoria === appState.activeCategory);
    if (appState.activeCity !== 'Todas') filtradas = filtradas.filter(h => h.ciudad === appState.activeCity);
    renderFeed(filtradas);
}

function formatFecha(timestamp) {
    if (!timestamp || !timestamp.toDate) return '';
    const d = timestamp.toDate();
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const yy = d.getFullYear().toString().slice(-2);
    return `${hh}:${mm} ${dd}.${mo}.${yy}`;
}

function renderFeed(historias) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    if (historias.length === 0) {
        feed.innerHTML = `<p style="text-align:center; color:#D1D5DB;">No hay secretos con estos filtros.</p>`;
        return;
    }

    historias.forEach(h => {
        const catData = appState.staticData.categorias.find(c => c.id === h.categoria);
        const catName = catData ? catData.nombre : h.categoria;
        const color = catData ? catData.color : '#FDA1CB';

        const post = document.createElement('div');
        post.className = 'post-card';
        post.onclick = () => openDetail(h.id);

        let titleHtml = h.titulo ? `<div class="pc-title">${h.titulo}</div>` : '';

        // Procesar imagen y audio si existen en la BD
        let mediaHtml = '';
        if (h.imagen) {
            mediaHtml += `<img src="${h.imagen}" style="width: 100%; border-radius: 12px; margin-top: 15px; object-fit: cover; max-height: 300px;" loading="lazy" alt="Imagen adjunta">`;
        }
        if (h.audio) {
            mediaHtml += `<div style="margin-top: 15px;" onclick="event.stopPropagation()">
                <audio controls src="${h.audio}" style="width: 100%; height: 40px; border-radius: 20px;"></audio>
            </div>`;
        }

        post.innerHTML = `
            <div class="pc-header">
                <span class="badge-cat" style="background:${color}; color:#000;">${catName}</span>
                <div class="pc-meta">📍 ${h.ciudad} &nbsp;&nbsp; ${formatFecha(h.fecha)}</div>
            </div>
            ${titleHtml}
            <div class="pc-body">
                ${h.texto}
                ${mediaHtml}
            </div>
            <div class="pc-footer">
                <span>🔥 ${h.likes || 0}</span>
                <span>💬 ${h.comentariosCount || 0}</span>
            </div>
        `;
        feed.appendChild(post);
    });
}
