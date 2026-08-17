let appState = {
    data: {},
    activeCategory: 'todo',
    activeCity: 'Todas'
};

// 1. Inicialización Principal
async function initApp() {
    try {
        const response = await fetch('data/db.json');
        appState.data = await response.json();
        
        renderStories();
        renderFilters();
        renderCategoriesModal();
        applyFilters();
        setupEventListeners();
    } catch (error) {
        console.error("Error cargando db.json:", error);
    }
}

// 2. Renderizar Historias IG
function renderStories() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = '';
    if(appState.data.historias_ig) {
        appState.data.historias_ig.forEach(story => {
            container.innerHTML += `
                <div class="story">
                    <img src="${story.imagen}" alt="User">
                    <span>${story.usuario}</span>
                </div>
            `;
        });
    }
}

// 3. Renderizar Filtros (Pills Superiores)
function renderFilters() {
    const catContainer = document.getElementById('categoryFilters');
    const cityContainer = document.getElementById('cityFilters');
    
    // Filtros de Categorías
    catContainer.innerHTML = '';
    appState.data.categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${appState.activeCategory === cat.id ? 'active' : ''}`;
        btn.textContent = cat.nombre;
        if(appState.activeCategory === cat.id && cat.id !== 'todo') {
            btn.style.backgroundColor = cat.color;
            btn.style.color = '#fff';
        }
        btn.onclick = () => {
            appState.activeCategory = cat.id;
            renderFilters();
            applyFilters();
        };
        catContainer.appendChild(btn);
    });

    // Filtros de Ciudades
    cityContainer.innerHTML = '';
    appState.data.ciudades.forEach(city => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${appState.activeCity === city ? 'active' : ''}`;
        btn.textContent = city;
        if(appState.activeCity === city && city !== 'Todas') {
            btn.style.backgroundColor = '#fff';
            btn.style.color = '#000';
        }
        btn.onclick = () => {
            appState.activeCity = city;
            renderFilters();
            applyFilters();
        };
        cityContainer.appendChild(btn);
    });
}

// 4. Lógica de Filtrado y Renderizado del Feed
function applyFilters() {
    let filtradas = appState.data.historias;

    if (appState.activeCategory !== 'todo') {
        filtradas = filtradas.filter(h => h.categoria === appState.activeCategory);
    }
    if (appState.activeCity !== 'Todas') {
        filtradas = filtradas.filter(h => h.ciudad === appState.activeCity);
    }

    renderFeed(filtradas);
}

function renderFeed(historias) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    if(historias.length === 0){
        feed.innerHTML = `<p style="text-align:center; color:#9E9E9E; margin-top:20px;">No hay secretos con estos filtros.</p>`;
        return;
    }

    historias.forEach(h => {
        const catData = appState.data.categorias.find(c => c.id === h.categoria);
        const color = catData ? catData.color : '#FFF';
        const catName = catData ? catData.nombre : h.categoria;

        const post = document.createElement('div');
        post.className = 'post-card';
        post.style.background = `linear-gradient(90deg, rgba(${hexToRgb(color)}, 0.05) 0%, #1B1B1E 100%)`;
        post.style.borderLeft = `3px solid ${color}`;
        
        post.onclick = () => openDetail(h, catName, color);

        let titleHtml = h.titulo ? `<div class="pc-title">${h.titulo}</div>` : '';

        post.innerHTML = `
            <div class="pc-header">
                <span class="badge-cat" style="background:${color};">${catName}</span>
                <div class="pc-meta">
                    <span>📍 ${h.ciudad}</span>
                    <span>${h.fecha}</span>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            ${titleHtml}
            <div class="pc-body">${h.texto}</div>
            <div class="pc-footer">
                <div class="pc-reactions">
                    <span>🔥 ${h.likes}</span>
                    <span>😢 ${h.sads}</span>
                </div>
                <span><i class="fa-solid fa-comment"></i> ${h.comentarios}</span>
            </div>
        `;
        feed.appendChild(post);
    });
}

// 5. Configurar Modal de Envío de Secreto (Panel de publicación)
function renderCategoriesModal() {
    const container = document.getElementById('modalCategorySelector');
    const inputCat = document.getElementById('selectedCatInput');
    container.innerHTML = '';

    appState.data.categorias.forEach(cat => {
        if(cat.id === 'todo') return; // Evitar "todo" en las opciones de envío
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat-btn';
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => { 
                b.style.background = 'transparent'; 
                b.style.color = '#9E9E9E'; 
                b.style.borderColor = 'rgba(255,255,255,0.08)'; 
            });
            btn.style.background = cat.color;
            btn.style.color = '#fff';
            btn.style.borderColor = cat.color;
            inputCat.value = cat.id;
        };
        container.appendChild(btn);
    });
}

// 6. Event Listeners y Simulación de Base de Datos
function setupEventListeners() {
    const modalSubmit = document.getElementById('submitModal');
    
    // Abrir panel al dar clic al botón flotante
    document.getElementById('fab-confess').addEventListener('click', () => {
        modalSubmit.classList.remove('hidden');
    });

    // Cerrar panel de envío
    document.getElementById('closeSubmit').addEventListener('click', () => {
        modalSubmit.classList.add('hidden');
    });

    // Enviar Secreto (Añadir al Feed)
    document.getElementById('confessionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const catId = document.getElementById('selectedCatInput').value;
        const title = document.getElementById('postTitle').value;
        const text = document.getElementById('postContent').value;
        const date = new Date();
        const fDate = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear().toString().substr(-2)}`;

        const newPost = {
            id: Date.now(),
            categoria: catId,
            ciudad: appState.activeCity === 'Todas' ? 'Anónimo' : appState.activeCity,
            titulo: title,
            texto: text,
            fecha: fDate,
            likes: 0, sads: 0, comentarios: 0
        };

        // Simula base de datos (agrega la historia al inicio)
        appState.data.historias.unshift(newPost);
        
        // Resetear Formulario
        e.target.reset();
        document.querySelectorAll('.cat-btn').forEach(b => { 
            b.style.background = 'transparent'; 
            b.style.color = '#9E9E9E'; 
            b.style.borderColor = 'rgba(255,255,255,0.08)'; 
        });
        modalSubmit.classList.add('hidden');
        
        // Actualizar feed y subir scroll
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cerrar el Detalle del secreto
    document.getElementById('closeDetail').addEventListener('click', () => {
        document.getElementById('detailModal').classList.add('hidden');
    });
}

// 7. Abrir Detalles del Post (Lectura completa)
function openDetail(historia, catName, color) {
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailPostContent');
    
    document.getElementById('commentCount').textContent = historia.comentarios;

    let titleHtml = historia.titulo ? `<h3 style="margin-bottom:10px; font-size:1.2rem; color:#fff;">${historia.titulo}</h3>` : '';

    content.innerHTML = `
        <div class="detail-post" style="border-left: 3px solid ${color};">
            <div class="pc-header" style="margin-bottom: 20px;">
                <span class="badge-cat" style="background:${color}; color:#fff;">${catName}</span>
                <div class="pc-meta">
                    <span>📍 ${historia.ciudad}</span>
                    <span>${historia.fecha}</span>
                </div>
            </div>
            ${titleHtml}
            <div class="pc-body" style="font-size:1.15rem; color:#fff;">${historia.texto}</div>
            
            <div class="big-reactions">
                <span>🔥 ${historia.likes || 0}</span>
                <span>❤️ ${Math.floor(Math.random() * 50)}</span>
                <span>😢 ${historia.sads || 0}</span>
                <span>😂 ${Math.floor(Math.random() * 30)}</span>
                <span>😱 ${Math.floor(Math.random() * 20)}</span>
                <span>👀 ${Math.floor(Math.random() * 100)}</span>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Convertidor de color para fondos transparentes
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255,255,255';
}

// Iniciar app al cargar la página
document.addEventListener('DOMContentLoaded', initApp);
