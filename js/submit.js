import { db } from './firebase-init.js';
import {
    collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';

// ---- (Mantén las funciones populateCitySelect y renderCategoriesModal igual) ----

// Nueva función para subir a Cloudflare R2
async function uploadToR2(file) {
    // REEMPLAZA con la URL de tu Cloudflare Worker
    const workerUrl = "https://r2-uploader.appcvinc.workers.dev";
    
    const response = await fetch(`${workerUrl}?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file
    });
    
    if (!response.ok) throw new Error('Error subiendo archivo');
    const data = await response.json();
    return data.url; // Retorna la URL pública de R2
}

export function initSubmitPanel() {
    const modalSubmit = document.getElementById('submitModal');
    const form = document.getElementById('confessionForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    // ... (Mantén los event listeners de abrir y cerrar igual) ...

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const catId = document.getElementById('selectedCatInput').value;
        const city = document.getElementById('postCity').value;
        const title = document.getElementById('postTitle').value.trim();
        const text = document.getElementById('postContent').value.trim();
        
        // Obtener los archivos
        const imageFile = document.getElementById('postImage').files[0];
        const audioFile = document.getElementById('postAudio').files[0];

        if (!city || !text) return;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subiendo...';

            // 1. Subir archivos a R2 si existen
            let imageUrl = null;
            let audioUrl = null;

            if (imageFile) imageUrl = await uploadToR2(imageFile);
            if (audioFile) audioUrl = await uploadToR2(audioFile);

            // 2. Crear el objeto con las URLs incluidas
            const newPost = {
                categoria: catId,
                ciudad: city,
                titulo: title,
                texto: text,
                imagen: imageUrl, // Nuevo
                audio: audioUrl,  // Nuevo
                fecha: serverTimestamp(),
                likes: 0,
                sads: 0,
                comentariosCount: 0,
                clientId: appState.clientId
            };

            submitBtn.textContent = 'Publicando en Firestore...';
            
            // 3. Guardar en Firestore
            await addDoc(collection(db, 'posts'), newPost);

            e.target.reset();
            // Limpiar categorías...
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
