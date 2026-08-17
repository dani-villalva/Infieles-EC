let appState = {
    data: {},
    activeCategory: 'todo',
    activeCity: 'Todas',
    storyTimer: null
};

// 1. Inicialización
async function initApp() {
    try {
        const response = await fetch('data/db.json');
        appState.data = await response.json();
        
        renderStories();
        renderFilters();
        renderCategoriesModal();
        populateCitySelect();
        applyFilters();
        setupEventListeners();
    } catch (error) {
        console.error("Error cargando db.json:", error);
    }
}

// 2. Historias estilo Instagram Funcionales
function renderStories() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = '';
    appState.data.historias_ig.forEach(story => {
        const div = document.createElement('div');
        div.className = 'story';
        div.innerHTML = `<img src="${story.imagen}" alt="User"><span>${story.usuario}</span>`;
        
        // Al tocar la historia, la abre en pantalla completa
        div.onclick = () => openStoryViewer(story.imagen);
        
        container.appendChild(div);
    });
}

function openStoryViewer(imageUrl) {
    const viewer = document.getElementById('storyViewer');
    const img = document.getElementById('storyImageFull');
    const bar = document.getElementById('storyProgressBar');
    
    img.src = imageUrl;
    viewer.classList.remove('hidden');
    
    // Animación de la barra superior de IG
    let progress = 0;
    bar.style.width = '0%';
    clearInterval(appState.storyTimer);
    
    appState.storyTimer = setInterval(() => {
        progress += 2; // Sube 2% cada 100ms (Total 5 segundos)
        bar.style.width = `${progress}%`;
        
        if(progress >= 100) {
            closeStory();
        }
    }, 100);
}

function closeStory() {
    document.getElementById('storyViewer').classList.add('hidden');
    clearInterval(appState.storyTimer);
}

// 3. Filtros Superiores
function renderFilters() {
    const catContainer = document.getElementById('categoryFilters');
    const cityContainer = document.getElementById('cityFilters');
    
    catContainer.innerHTML = '';
    appState.data.categorias.forEach(cat => {
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
    appState.data.ciudades.forEach(city => {
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

// 4. Poblar Selector de Ciudad del Formulario
function populateCitySelect() {
    const select = document.getElementById('postCity');
    appState.data.ciudades.forEach(city => {
        if(city === "Todas") return; // No permitir publicar en "Todas"
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
}

// 5. Feed de publicaciones
function applyFilters() {
    let filtradas = appState.data.historias;
    if (appState.activeCategory !== 'todo') filtradas = filtradas.filter(h => h.categoria === appState.activeCategory);
    if (appState.activeCity !== 'Todas') filtradas = filtradas.filter(h => h.ciudad === appState.activeCity);
    renderFeed(filtradas);
}

function renderFeed(historias) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    if(historias.length === 0){
        feed.innerHTML = `<p style="text-align:center; color:#D1D5DB;">No hay secretos con estos filtros.</p>`;
        return;
    }

    historias.forEach(h => {
        const catData = appState.data.categorias.find(c => c.id === h.categoria);
        const catName = catData ? catData.nombre : h.categoria;
        const color = catData ? catData.color : '#FDA1CB';

        const post = document.createElement('div');
        post.className = 'post-card';
        post.onclick = () => openDetail(h, catName, color);

        let titleHtml = h.titulo ? `<div class="pc-title">${h.titulo}</div>` : '';

        post.innerHTML = `
            <div class="pc-header">
                <span class="badge-cat" style="background:${color}; color:#000;">${catName}</span>
                <div class="pc-meta">📍 ${h.ciudad} &nbsp;&nbsp; ${h.fecha}</div>
            </div>
            ${titleHtml}
            <div class="pc-body">${h.texto}</div>
            <div class="pc-footer">
                <span>🔥 ${h.likes}</span>
                <span>💬 ${h.comentarios}</span>
            </div>
        `;
        feed.appendChild(post);
    });
}

// 6. Modal Categorías del Formulario
function renderCategoriesModal() {
    const container = document.getElementById('modalCategorySelector');
    const inputCat = document.getElementById('selectedCatInput');

    appState.data.categorias.forEach(cat => {
        if(cat.id === 'todo') return; 
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat-btn';
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => { 
                b.style.background = 'transparent'; 
                b.style.color = '#fff'; 
                b.style.borderColor = 'rgba(255,255,255,0.1)'; 
            });
            btn.style.background = cat.color;
            btn.style.color = '#000';
            btn.style.borderColor = cat.color;
            inputCat.value = cat.id;
        };
        container.appendChild(btn);
    });
}

// 7. Eventos, Simulador de BD y Comentarios
function setupEventListeners() {
    const modalSubmit = document.getElementById('submitModal');
    
    // Abrir Formulario
    document.getElementById('fab-confess').addEventListener('click', () => {
        modalSubmit.classList.remove('hidden');
    });

    // Cerrar Formulario
    document.getElementById('closeSubmit').addEventListener('click', () => {
        modalSubmit.classList.add('hidden');
    });

    // Enviar Secreto
    document.getElementById('confessionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const catId = document.getElementById('selectedCatInput').value;
        const city = document.getElementById('postCity').value; // Toma la ciudad seleccionada
        const title = document.getElementById('postTitle').value;
        const text = document.getElementById('postContent').value;
        const date = new Date();
        const fDate = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

        const newPost = {
            id: Date.now(),
            categoria: catId,
            ciudad: city,
            titulo: title,
            texto: text,
            fecha: fDate,
            likes: 0, sads: 0, comentarios: 0
        };

        appState.data.historias.unshift(newPost);
        e.target.reset();
        modalSubmit.classList.add('hidden');
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cerrar Detalle Post
    document.getElementById('closeDetail').addEventListener('click', () => {
        document.getElementById('detailModal').classList.add('hidden');
    });

    // Cerrar Historia IG
    document.getElementById('closeStoryViewer').addEventListener('click', closeStory);

    // Enviar Comentario (Simulador en Tiempo Real)
    document.getElementById('sendCommentBtn').addEventListener('click', () => {
        const input = document.getElementById('newCommentInput');
        const list = document.getElementById('commentsList');
        
        if(input.value.trim() !== '') {
            const div = document.createElement('div');
            div.className = 'comment-card';
            div.innerHTML = `
                <div class="c-head"><span>Anónimo</span> <span>Ahora</span></div>
                <p>${input.value}</p>
            `;
            list.prepend(div); // Lo pone de primero al instante
            input.value = '';
            
            // Sube el contador
            const countElem = document.getElementById('commentCount');
            countElem.textContent = parseInt(countElem.textContent) + 1;
        }
    });
}

// 8. Abrir Detalles del Post
function openDetail(historia, catName, color) {
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailPostContent');
    const list = document.getElementById('commentsList');
    
    document.getElementById('commentCount').textContent = historia.comentarios;

    let titleHtml = historia.titulo ? `<h3 style="margin-bottom:10px; font-size:1.2rem; color:#fff;">${historia.titulo}</h3>` : '';

    content.innerHTML = `
        <div class="detail-post" style="border-left: 3px solid ${color};">
            <div class="pc-header" style="margin-bottom: 20px;">
                <span class="badge-cat" style="background:${color}; color:#000;">${catName}</span>
                <div class="pc-meta">📍 ${historia.ciudad} &nbsp;|&nbsp; ${historia.fecha}</div>
            </div>
            ${titleHtml}
            <div class="pc-body" style="font-size:1.15rem; color:#fff;">${historia.texto}</div>
        </div>
    `;

    // Resetea los comentarios cada vez que abres uno
    list.innerHTML = `
        <div class="comment-card">
            <div class="c-head"><span>Anónimo</span> <span>Ayer</span></div>
            <p>Esa historia me suena conocida... fuerza.</p>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Iniciar app
document.addEventListener('DOMContentLoaded', initApp);
