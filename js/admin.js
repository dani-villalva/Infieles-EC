import { db } from './firebase-init.js';
import {
    collection, query, orderBy, onSnapshot, doc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// 🚨 PON AQUÍ LA URL DE TU WORKER
const WORKER_URL = "https://r2-uploader.appcvinc.workers.dev/"; 

// Pedimos la contraseña al administrador (no se guarda en el código visible)
const adminPassword = prompt("Introduce la contraseña de administrador:");

const container = document.getElementById('adminPanel');

// Escuchar los posts
const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
onSnapshot(q, (snapshot) => {
    container.innerHTML = '';
    snapshot.docs.forEach(documento => {
        const post = { id: documento.id, ...documento.data() };
        renderAdminCard(post);
    });
});

function renderAdminCard(post) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    
    let media = '';
    if (post.imagen) media += `<img src="${post.imagen}">`;
    if (post.audio) media += `<audio controls src="${post.audio}"></audio>`;

    card.innerHTML = `
        <span>${post.categoria} | ${post.ciudad}</span>
        <h3>${post.titulo || 'Sin título'}</h3>
        <p>${post.texto}</p>
        ${media}
        <button class="btn-delete">🗑️ Eliminar Post y Archivos</button>
    `;

    // Botón eliminar
    card.querySelector('.btn-delete').addEventListener('click', async () => {
        if (!confirm("¿Seguro que quieres borrar este secreto permanentemente?")) return;
        
        card.style.opacity = '0.5';

        try {
            // 1. Si hay imagen o audio, mandar a borrar a Cloudflare
            if (post.imagen) await deleteFromR2(post.imagen);
            if (post.audio) await deleteFromR2(post.audio);

            // 2. Borrar de Firestore
            await deleteDoc(doc(db, 'posts', post.id));
            
            // Nota: También podrías querer borrar los comentarios asociados a ese post 
            // (Para mantenerlo simple, por ahora borramos el post principal)

        } catch (error) {
            console.error("Error borrando:", error);
            alert("Hubo un error al borrar. Revisa la consola.");
            card.style.opacity = '1';
        }
    });

    container.appendChild(card);
}

// Función que se comunica con el Worker usando el método DELETE
async function deleteFromR2(fileUrl) {
    try {
        // Extraemos solo el nombre del archivo de la URL
        // Ejemplo de fileUrl: "https://pub-xxx.r2.dev/1234-archivo.jpg"
        const urlObj = new URL(fileUrl);
        const fileName = urlObj.pathname.substring(1); // Quita el "/" inicial

        const response = await fetch(`${WORKER_URL}?filename=${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': adminPassword // Pasamos la clave que digitaste en el prompt
            }
        });

        if (!response.ok) {
            console.warn("No se pudo borrar el archivo de R2:", await response.text());
        }
    } catch (e) {
        console.error("Error de red al borrar en R2:", e);
    }
}
