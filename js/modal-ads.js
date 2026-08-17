function openDetail(historia) {
    const modal = document.getElementById('renoteModal');
    const adScreen = document.getElementById('videoAdContainer');
    const detailScreen = document.getElementById('renoteContent');
    const video = document.getElementById('adVideo');
    const postContent = document.getElementById('detailPostContent');

    modal.classList.remove('hidden');
    adScreen.classList.remove('hidden');
    detailScreen.classList.add('hidden');
    video.play().catch(()=>{});

    let imgHtml = historia.imagen ? `<img src="${historia.imagen}" class="sc-img" style="margin-top:15px;">` : '';

    postContent.innerHTML = `
        <div class="sc-header">
            <span class="sc-badge" style="background:#FFCD00; color:#000;">${historia.tipo}</span>
            <div class="sc-meta">${historia.fecha}</div>
        </div>
        <div class="sc-body" style="font-size:1.15rem;">${historia.texto}</div>
        ${imgHtml}
        <div class="big-reactions">
            <span>🔥 ${historia.likes}</span>
            <span>😢 ${historia.sads}</span>
            <span>😂 0</span>
        </div>
    `;

    document.getElementById('commentCount').textContent = historia.comentarios;

    document.getElementById('btn-opt2').onclick = () => {
        video.pause();
        adScreen.classList.add('hidden');
        detailScreen.classList.remove('hidden');
    };

    document.getElementById('closeDetail').onclick = () => {
        modal.classList.add('hidden');
    };
}
