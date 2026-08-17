function initFilters() {
    const renderTags = (containerId, items) => {
        const container = document.getElementById(containerId);
        items.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = index === 0 ? 'tag active' : 'tag';
            btn.textContent = item;
            container.appendChild(btn);
        });
    };

    renderTags('typeFilters', appData.tipos);
    renderTags('cityFilters', appData.ciudades);
}
