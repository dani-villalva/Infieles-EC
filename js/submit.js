// ==========================================================
// PANEL DE PUBLICAR: todo lo relacionado a crear una nueva confesión.
// ==========================================================
import { db } from './firebase-init.js';
import {
    collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';

export function populateCitySelect() {
    const select = document.getElementById('postCity');
    appState.staticData.ciudades.forEach(city => {
        if (city === "Todas") return;
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
}

export function renderCategoriesModal() {
    const container = document.getElementById('modalCategorySelector');
    const inputCat = document.getElementById('selectedCatInput');

    appState.staticData.categorias.forEach(cat => {
        if (cat.id === 'todo') return;
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

// NUEVA FUNCIÓN PARA SUBIR A CLOUDFLARE R2
async function uploadToR2(file) {
    // 🚨 PON LA URL EXACTA DE TU WORKER AQUÍ ADENTRO DE LAS COMILLAS
    const workerUrl = "https://r2-uploader.appcvinc.workers.dev"; 
    
    const response = await fetch(`${workerUrl}?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file
    });
    
    if (!response.ok) throw new Error('Error subiendo archivo a R2');
    const data = await response.json();
    return data.url;
}

export function initSubmitPanel() {
    const modalSubmit = document.getElementById('submitModal');
    const form = document.getElementById('confessionForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    document.getElementById('fab-confess').addEventListener('click', () => {
        modalSubmit.classList.remove('hidden');
    });

    document.getElementById('closeSubmit').addEventListener('click', () => {
        modalSubmit.classList.add('hidden');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const catId = document.getElementById('selectedCatInput').value;
        const city = document.getElementById('postCity').value;
        const title = document.getElementById('postTitle').value.trim();
        const text = document.getElementById('postContent').value.trim();

        // CAPTURAR LOS ARCHIVOS
        const imageFile = document.getElementById('postImage').files[0];
        const audioFile = document.getElementById('postAudio').files[0];

        if (!city || !text) return;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subiendo archivos...';

            // 1. Subir a R2 si el usuario seleccionó archivos
            let imageUrl = null;
            let audioUrl = null;

            if (imageFile) imageUrl = await uploadToR2(imageFile);
            if (audioFile) audioUrl = await uploadToR2(audioFile);

            submitBtn.textContent = 'Publicando en secreto...';

            // 2. Crear objeto y guardar en Firestore
            const newPost = {
                categoria: catId,
                ciudad: city,
                titulo: title,
                texto: text,
                imagen: imageUrl, // URL de R2
                audio: audioUrl,  // URL de R2
                fecha: serverTimestamp(),
                likes: 0,
                sads: 0,
                comentariosCount: 0,
                clientId: appState.clientId 
            };

            await addDoc(collection(db, 'posts'), newPost);

            e.target.reset();
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = '#fff';
                b.style.borderColor = 'rgba(255,255,255,0.1)';
            });
            document.getElementById('selectedCatInput').value = 'confesiones';
            modalSubmit.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error publicando:', error);
            alert('No se pudo publicar. Revisa tu conexión.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Compartir';
        }
    });
}
