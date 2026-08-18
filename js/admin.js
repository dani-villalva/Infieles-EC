import { db } from './firebase-init.js';
import {
    collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDocs, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const WORKER_URL = "https://r2-uploader.appcvinc.workers.dev"; 

const adminPassword = prompt("Introduce la contraseña de administrador:");
const container = document.getElementById('adminPanel');

const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
onSnapshot(q, (snapshot) => {
    container.innerHTML = '';
    if (snapshot.empty) {
        container.innerHTML = '<p style="text-align:center;">No hay confesiones publicadas.</p>';
        return;
    }
    snapshot.docs.forEach(documento => {
        const post = { id: documento.id, ...documento.data() };
        renderAdminCard(post);
    });
});

async function renderAdminCard(post) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    
    let media = '';
    if (post.imagen) media += `<img src="${post.imagen}" style="max-width: 180px; border-radius: 8px;">`;
    if (post.audio) media += `<audio controls src="${post.audio}" style="margin-top: 10px;"></audio>`;

    card.innerHTML = `
        <span style="color: #FDA1CB; font-weight: bold;">[${post.categoria.toUpperCase()}]</span> 
        <span>📍 ${post.ciudad}</span>
        <h3 style="margin: 8px 0;">${post.titulo || 'Sin título'}</h3>
        <p style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">${post.texto}</p>
        ${media}
        <br>
        <button class="btn-delete" style="background:#ff4d6d; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">
            🗑️ Eliminar Post, Fotos y Comentarios
        </button>

        <div class="admin-comments" style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">
            <h4 style="font-size:0.9rem; color:#aaa;">💬 Comentarios:</h4>
            <div id="comments-${post.id}" style="font-size: 0.85rem; color: #ddd;">Cargando comentarios...</div>
        </div>
    `;

    // Cargar comentarios del post
    loadCommentsForAdmin(post.id);

    // Botón eliminar post completo
    card.querySelector('.btn-delete').addEventListener('click', async () => {
        if (!confirm("¿Seguro que quieres borrar este post, sus archivos de R2 y todos sus comentarios?")) return;
        card.style.opacity = '0.4';

        try {
            // 1. Borrar imagen y audio de R2
            if (post.imagen) await deleteFromR2(post.imagen);
            if (post.audio) await deleteFromR2(post.audio);

            // 2. Borrar todos los comentarios de ese post en Firebase
            const qComments = query(collection(db, 'comments'), where('postId', '==', post.id));
            const commentsSnap = await getDocs(qComments);
            const deletePromises = commentsSnap.docs.map(cDoc => deleteDoc(cDoc.ref));
            await Promise.all(deletePromises);

            // 3. Borrar el documento del post
            await deleteDoc(doc(db, 'posts', post.id));

        } catch (error) {
            console.error("Error borrando post:", error);
            alert("Error al borrar. Revisa la consola.");
            card.style.opacity = '1';
        }
    });

    container.appendChild(card);
}

// Cargar y permitir borrar comentarios individuales
function loadCommentsForAdmin(postId) {
    const box = document.getElementById(`comments-${postId}`);
    const qComments = query(collection(db, 'comments'), where('postId', '==', postId));
    
    onSnapshot(qComments, (snap) => {
        if (snap.empty) {
            box.innerHTML = '<span style="color:#777;">Sin comentarios.</span>';
            return;
        }
        box.innerHTML = '';
        snap.docs.forEach(cDoc => {
            const comment = cDoc.data();
            const row = document.createElement('div');
            row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:6px 10px; margin:4px 0; border-radius:6px;";
            row.innerHTML = `
                <span>${comment.texto}</span>
                <button style="background:transparent; border:none; color:#ff4d6d; cursor:pointer; font-size:0.9rem;" title="Borrar comentario">❌</button>
            `;
            // Botón para borrar un comentario individual
            row.querySelector('button').addEventListener('click', async () => {
                if (!confirm("¿Borrar solo este comentario?")) return;
                await deleteDoc(cDoc.ref);
                await updateDoc(doc(db, 'posts', postId), { comentariosCount: increment(-1) });
            });
            box.appendChild(row);
        });
    });
}

async function deleteFromR2(fileUrl) {
    try {
        const urlObj = new URL(fileUrl);
        const fileName = urlObj.pathname.substring(1);

        const response = await fetch(`${WORKER_URL}?filename=${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
            headers: { 'Authorization': adminPassword }
        });

        if (!response.ok) console.warn("No se pudo borrar de R2:", await response.text());
    } catch (e) {
        console.error("Error en R2:", e);
    }
}
