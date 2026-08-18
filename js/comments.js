// ==========================================================
// DETALLE DE POST + COMENTARIOS EN TIEMPO REAL (Firestore).
// ==========================================================
import { db } from './firebase-init.js';
import {
    collection, addDoc, doc, updateDoc, increment, query, where,
    onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';

function formatFecha(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'Ahora';
    const d = timestamp.toDate();
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

export function openDetail(postId) {
    const post = appState.posts.find(p => p.id === postId);
    if (!post) return;

    appState.activePostId = postId;

    const catData = appState.staticData?.categorias?.find(c => c.id === post.categoria);
    const catName = catData ? catData.nombre : post.categoria;
    const color = catData ? catData.color : '#FDA1CB';

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailPostContent');
    const list = document.getElementById('commentsList');

    let titleHtml = post.titulo ? `<h3 style="margin-bottom:10px; font-size:1.2rem; color:#fff;">${post.titulo}</h3>` : '';

    // Mostrar imagen y audio en el detalle si existen
    let mediaHtml = '';
    if (post.imagen) {
        mediaHtml += `<img src="${post.imagen}" style="width: 100%; border-radius: 12px; margin-top: 15px; object-fit: cover;" alt="Imagen">`;
    }
    if (post.audio) {
        mediaHtml += `<div style="margin-top: 15px;">
            <audio controls src="${post.audio}" style="width: 100%; height: 40px;"></audio>
        </div>`;
    }

    content.innerHTML = `
        <div class="detail-post" style="border-left: 3px solid ${color};">
            <div class="pc-header" style="margin-bottom: 20px;">
                <span class="badge-cat" style="background:${color}; color:#000;">${catName}</span>
                <div class="pc-meta">📍 ${post.ciudad}</div>
            </div>
            ${titleHtml}
            <div class="pc-body" style="font-size:1.15rem; color:#fff;">
                ${post.texto}
                ${mediaHtml}
            </div>
        </div>
    `;

    list.innerHTML = `<p style="text-align:center; color:#D1D5DB; font-size:0.85rem;">Cargando comentarios...</p>`;
    document.getElementById('commentCount').textContent = '0';

    if (appState.commentsUnsub) appState.commentsUnsub();

    // Consulta simplificada para evitar errores de índices en Firebase
    const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId)
    );

    appState.commentsUnsub = onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        document.getElementById('commentCount').textContent = comments.length;
        list.innerHTML = '';

        if (comments.length === 0) {
            list.innerHTML = `<p style="text-align:center; color:#D1D5DB; font-size:0.85rem;">Sé el primero en comentar.</p>`;
            return;
        }

        // Ordenar en JS de más antiguo a más nuevo
        comments.sort((a, b) => {
            const timeA = a.fecha?.toMillis ? a.fecha.toMillis() : 0;
            const timeB = b.fecha?.toMillis ? b.fecha.toMillis() : 0;
            return timeA - timeB;
        });

        comments.forEach(c => {
            const div = document.createElement('div');
            div.className = 'comment-card';
            div.innerHTML = `
                <div class="c-head"><span>Anónimo</span> <span>${formatFecha(c.fecha)}</span></div>
                <p style="color:#fff; font-size:0.95rem; line-height:1.4;">${c.texto}</p>
            `;
            list.appendChild(div);
        });
    }, (error) => {
        console.error("Error al obtener comentarios:", error);
        list.innerHTML = `<p style="text-align:center; color:#ff4d6d; font-size:0.85rem;">Error al cargar comentarios.</p>`;
    });

    modal.classList.remove('hidden');
}

export function closeDetail() {
    document.getElementById('detailModal').classList.add('hidden');
    if (appState.commentsUnsub) {
        appState.commentsUnsub();
        appState.commentsUnsub = null;
    }
    appState.activePostId = null;
}

async function sendComment() {
    const input = document.getElementById('newCommentInput');
    const sendBtn = document.getElementById('sendCommentBtn');
    const text = input.value.trim();
    
    if (text === '' || !appState.activePostId) return;

    input.value = '';
    sendBtn.disabled = true;

    try {
        await addDoc(collection(db, 'comments'), {
            postId: appState.activePostId,
            texto: text,
            fecha: serverTimestamp()
        });

        await updateDoc(doc(db, 'posts', appState.activePostId), {
            comentariosCount: increment(1)
        });
    } catch (error) {
        console.error('Error enviando comentario:', error);
        alert('No se pudo enviar el comentario.');
    } finally {
        sendBtn.disabled = false;
    }
}

export function initComments() {
    document.getElementById('closeDetail').addEventListener('click', closeDetail);
    document.getElementById('sendCommentBtn').addEventListener('click', sendComment);
    document.getElementById('newCommentInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendComment();
    });
}
