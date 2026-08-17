let appData = {};

async function initApp() {
    const response = await fetch('data/db.json');
    appData = await response.json();
    populateSelects();
    renderFeed(appData.historias);
    initFilters();
    initForm();
}

function populateSelects() {
    const cityFilter = document.getElementById('cityFilter');
    const typeFilter = document.getElementById('typeFilter');

    appData.ciudades.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });

    appData.tipos.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

function initForm() {
    const form = document.getElementById('confessionForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Tu confesión ha sido enviada para revisión anónima. ¡Gracias!');
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', initApp);
