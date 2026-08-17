function renderFeed(historiasFiltradas) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';

    historiasFiltradas.forEach((historia, index) => {
        const post = document.createElement('div');
        post.className = 'post-card';
        post.onclick = () => openReNote(historia.id);
        
        post.innerHTML = `
            <img src="${historia.imagen}" alt="Historia" class="post-img">
            <div class="post-content">
                <div class="post-title">${historia.texto}</div>
                <div class="post-footer">
                    <div class="post-author">
                        <img src="${historia.avatar}" alt="Avatar">
                        <span>${historia.autor}</span>
                    </div>
                    <div class="post-likes">
                        <i class="fa-solid fa-heart"></i> ${historia.likes}
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(post);

        if ((index + 1) % 4 === 0) {
            const ad = document.createElement('div');
            ad.className = 'ad-banner-feed';
            ad.innerHTML = `<img src="https://via.placeholder.com/300x400/1E1E23/FDA1CB?text=+ANUNCIO+" alt="Ad">`;
            feed.appendChild(ad);
        }
    });
}
