function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const cityFilter = document.getElementById('cityFilter');
    const typeFilter = document.getElementById('typeFilter');

    const applyFilters = () => {
        const text = searchInput.value.toLowerCase();
        const city = cityFilter.value;
        const type = typeFilter.value;

        const filtered = appData.historias.filter(h => {
            const matchText = h.texto.toLowerCase().includes(text) || h.autor.toLowerCase().includes(text);
            const matchCity = city === 'all' || h.ciudad === city;
            const matchType = type === 'all' || h.tipo === type;
            return matchText && matchCity && matchType;
        });

        renderFeed(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    
    document.getElementById('btn-buscador').addEventListener('click', (e) => {
        searchInput.focus();
    });
}