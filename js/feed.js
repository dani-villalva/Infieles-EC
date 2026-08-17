function renderFeed(historias) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    historias.forEach(h => {
        const post = document.createElement('div');
        post.className = 'secret-card';
        post.onclick = () => openDetail(h);
        
        let imgHtml = h.imagen ? `<img src="${h.imagen}" class="sc-img">` : '';

        post.innerHTML = `
            <div class="sc-header">
                <span class="sc-badge">${h.tipo}</span>
                <div class="sc-meta">${h.fecha} <i class="fa-solid fa-ellipsis-vertical"></i></div>
            </div>
            ${imgHtml}
            <div class="sc-body">${h.texto}</div>
            <div class="sc-footer">
                <div class="sc-reactions">
                    <span>🔥 ${h.likes}</span>
                    <span>😢 ${h.sads}</span>
                </div>
                <span><i class="fa-solid fa-comment"></i> ${h.comentarios}</span>
            </div>
        `;
        feed.appendChild(post);
    });
}
