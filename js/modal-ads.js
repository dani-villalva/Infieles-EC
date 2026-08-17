function openReNote(historiaId) {
    const modal = document.getElementById('renoteModal');
    const videoContainer = document.getElementById('videoAdContainer');
    const renoteContent = document.getElementById('renoteContent');
    const adVideo = document.getElementById('adVideo');

    modal.classList.remove('hidden');
    videoContainer.classList.remove('hidden');
    renoteContent.classList.add('hidden');

    adVideo.play().catch(e => console.log("Auto-play prevenido por el navegador"));

    document.getElementById('btn-opt1').onclick = () => window.open('https://google.com', '_blank');
    
    document.getElementById('btn-opt2').onclick = () => {
        videoContainer.classList.add('hidden');
        adVideo.pause();
        renoteContent.classList.remove('hidden');
    };

    document.getElementById('btn-opt3').onclick = () => alert("Abriendo perfil del anunciante...");

    document.getElementById('closeModal').onclick = () => {
        modal.classList.add('hidden');
        adVideo.pause();
    };
}