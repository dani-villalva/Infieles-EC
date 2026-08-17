let appData = {};

async function initApp() {
    const response = await fetch('data/db.json');
    appData = await response.json();
    
    populateSelects();
    renderFeed(appData.historias);
    initFilters();
    initTVNavigation();
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

function initTVNavigation() {
    const focusableElements = document.querySelectorAll('.card, .banner-container, input, select');
    let currentIndex = 0;

    if(window.innerWidth > 900 && focusableElements.length > 0) {
        focusableElements[0].focus();
    }

    document.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
            currentIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[currentIndex].focus();
            e.preventDefault();
        } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
            currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[currentIndex].focus();
            e.preventDefault();
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);