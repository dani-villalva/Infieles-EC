function renderFeed(historiasFiltradas) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    historiasFiltradas.forEach((historia, index) => {
        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
            <div class="post-header">📍 ${historia.ciudad} &nbsp;|&nbsp; 🚩 ${historia.tipo}</div>
            <div class="post-body">"${historia.texto}"</div>
            <button class="btn-renote" onclick="openReNote(${historia.id})">
                <i class="fa-regular fa-comment-dots"></i> Abrir ReNOTE
            </button>
        `;
        feed.appendChild(post);

        if ((index + 1) % 4 === 0) {
            const ad = document.createElement('div');
            ad.className = 'post ad-banner';
            ad.innerHTML = `<img src="https://via.placeholder.com/800x250/1E1E23/FDA1CB?text=++ANUNCIO+PATROCINADO++" alt="Ad">`;
            feed.appendChild(ad);
        }
    });
}