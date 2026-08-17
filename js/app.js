let appData = {};

async function initApp() {
    const response = await fetch('data/db.json');
    appData = await response.json();
    renderFeed(appData.historias);
    initFilters();
    
    document.getElementById('fab-confess').addEventListener('click', () => {
        document.getElementById('submitModal').classList.remove('hidden');
    });
    
    document.getElementById('btn-open-submit').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('submitModal').classList.remove('hidden');
    });

    document.getElementById('closeSubmit').addEventListener('click', () => {
        document.getElementById('submitModal').classList.add('hidden');
    });

    document.getElementById('confessionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Secreto enviado de forma anónima.');
        document.getElementById('submitModal').classList.add('hidden');
        e.target.reset();
    });
}

document.addEventListener('DOMContentLoaded', initApp);
