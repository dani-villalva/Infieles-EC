// ==========================================================
// NOTIFICACIONES: avisa cuando alguien más publica una confesión nueva.
// - Campanita en el header con contador de no leídas + panel desplegable.
// - Toast emergente en pantalla.
// - Notificación nativa del navegador (si el usuario da permiso), útil
//   incluso si la pestaña no está en primer plano.
// ==========================================================
import { db } from './firebase-init.js';
import {
    collection, query, orderBy, onSnapshot, limit
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { appState } from './state.js';
import { openDetail } from './comments.js';

let unreadCount = 0;
let initialLoadDone = false;
let notifications = []; // { id, titulo, texto, ciudad, catName, color, fecha }

function catInfo(categoriaId) {
    const cat = appState.staticData.categorias.find(c => c.id === categoriaId);
    return { nombre: cat ? cat.nombre : categoriaId, color: cat ? cat.color : '#FDA1CB' };
}

function updateBadge() {
    const badge = document.getElementById('notifBadge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function showToast(post) {
    const { nombre, color } = catInfo(post.categoria);
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = 'notif-toast';
    toast.style.borderLeftColor = color;
    toast.innerHTML = `
        <span class="badge-cat" style="background:${color}; color:#000;">${nombre}</span>
        <p>${post.titulo ? post.titulo : (post.texto.length > 60 ? post.texto.slice(0, 60) + '…' : post.texto)}</p>
    `;
    toast.onclick = () => {
        openDetail(post.id);
        toast.remove();
    };
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('notif-toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showNativeNotification(post) {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    if (document.visibilityState === 'visible') return; // solo si la pestaña no está activa
    const { nombre } = catInfo(post.categoria);
    new Notification('Infieles EC · Nueva confesión', {
        body: `[${nombre}] ${post.titulo || post.texto.slice(0, 80)}`,
        tag: post.id
    });
}

function renderNotifPanel() {
    const list = document.getElementById('notifList');
    list.innerHTML = '';

    if (notifications.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#D1D5DB; font-size:0.85rem; padding:15px;">Sin notificaciones todavía.</p>`;
        return;
    }

    notifications.forEach(n => {
        const item = document.createElement('div');
        item.className = 'notif-item';
        item.innerHTML = `
            <span class="badge-cat" style="background:${n.color}; color:#000;">${n.catName}</span>
            <p>${n.titulo ? `<strong>${n.titulo}</strong> — ` : ''}${n.texto.slice(0, 70)}${n.texto.length > 70 ? '…' : ''}</p>
            <span class="pc-meta">📍 ${n.ciudad}</span>
        `;
        item.onclick = () => {
            openDetail(n.id);
            document.getElementById('notifPanel').classList.add('hidden');
        };
        list.appendChild(item);
    });
}

export function initNotifications() {
    const bellBtn = document.getElementById('notifBell');
    const panel = document.getElementById('notifPanel');

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            unreadCount = 0;
            updateBadge();
        }
    });

    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== bellBtn) {
            panel.classList.add('hidden');
        }
    });

    // Pide permiso de notificaciones nativas al primer clic del usuario en cualquier lado
    document.addEventListener('click', function requestOnce() {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        document.removeEventListener('click', requestOnce);
    });

    const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'), limit(20));
    onSnapshot(q, (snapshot) => {
        if (!initialLoadDone) {
            // La primera carga no debe generar notificaciones, solo establece la línea base.
            initialLoadDone = true;
            return;
        }

        snapshot.docChanges().forEach(change => {
            if (change.type !== 'added') return;
            const post = { id: change.doc.id, ...change.doc.data() };

            // No notificarnos a nosotros mismos por nuestra propia publicación
            if (post.clientId === appState.clientId) return;

            const { nombre, color } = catInfo(post.categoria);
            notifications.unshift({
                id: post.id, titulo: post.titulo, texto: post.texto,
                ciudad: post.ciudad, catName: nombre, color
            });
            notifications = notifications.slice(0, 20);

            unreadCount++;
            updateBadge();
            renderNotifPanel();
            showToast(post);
            showNativeNotification(post);
        });
    });
}
