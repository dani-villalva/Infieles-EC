// ==========================================================
// PANEL DE PUBLICAR: modificado para guardar en GITHUB
// ==========================================================
import { db } from './firebase-init.js';
import {
    collection, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';

// ⚠️ CONFIGURACIÓN DE GITHUB 
// (Usa un token de acceso "Fine-grained" solo con permisos para este repositorio)
const GITHUB_TOKEN = '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'; 
const REPO_OWNER = 'dani-villalva';
const REPO_NAME = 'Infieles-EC';

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

// Utilidad para convertir un archivo a Base64 puro
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Quitamos la cabecera 'data:image...'
        reader.onerror = error => reject(error);
    });
}

// NUEVA FUNCIÓN PARA SUBIR ARCHIVOS O JSON A GITHUB VIA API
async function uploadToGitHub(fileOrString, path, isFile = true) {
    const content = isFile 
        ? await getBase64(fileOrString) 
        : btoa(unescape(encodeURIComponent(fileOrString))); // Codifica texto a Base64
        
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Subiendo ${path}`,
            content: content
        })
    });
    
    if (!response.ok) throw new Error('Error subiendo archivo a GitHub: ' + await response.text());
    
    // Retorna la URL "raw" para visualizar la imagen / audio en la web
    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`;
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
            submitBtn.textContent = 'Subiendo archivos a GitHub...';

            // Pre-generar un ID de Firebase para conectar GitHub con Firestore
            const newDocRef = doc(collection(db, 'posts'));
            const postId = newDocRef.id;

            // 1. Subir a GitHub si el usuario seleccionó archivos
            let imageUrl = null;
            let audioUrl = null;

            if (imageFile) {
                const safeName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
                imageUrl = await uploadToGitHub(imageFile, `media/${postId}_${safeName}`);
            }
            if (audioFile) {
                const safeName = audioFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
                audioUrl = await uploadToGitHub(audioFile, `media/${postId}_${safeName}`);
            }

            submitBtn.textContent = 'Publicando secreto...';

            const newPost = {
                categoria: catId,
                ciudad: city,
                titulo: title,
                texto: text,
                imagen: imageUrl,
                audio: audioUrl,
                fecha: serverTimestamp(),
                likes: 0,
                sads: 0,
                comentariosCount: 0,
                clientId: appState.clientId 
            };

            // 2. Guardar el post como archivo .json en GitHub
            const githubPostData = { ...newPost, fecha: new Date().toISOString() };
            const postJsonString = JSON.stringify({ id: postId, ...githubPostData }, null, 2);
            await uploadToGitHub(postJsonString, `posts/${postId}.json`, false);

            // 3. Guardar en Firestore para que la app se actualice en tiempo real sin recargar
            await setDoc(newDocRef, newPost);

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