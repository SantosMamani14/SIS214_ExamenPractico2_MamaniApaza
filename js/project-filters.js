function normalizeText(value) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es');
}

export function initializeProjectFilters() {
    const projectList = document.querySelector('#project-list');
    const projectSearch = document.querySelector('#project-search');
    const projectCount = document.querySelector('#project-count');
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

    if (!projectList || !projectSearch || !projectCount || filterButtons.length === 0) return;

    const projectCards = Array.from(projectList.querySelectorAll('[data-category]'));
    let activeFilter = 'all';

    const renderProjects = () => {
        const query = normalizeText(projectSearch.value.trim());
        const visibleProjects = projectCards.filter((card) => {
            const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
            const searchableText = normalizeText(`${card.textContent} ${card.dataset.search || ''}`);
            return categoryMatches && searchableText.includes(query);
        });

        projectCards.forEach((card) => {
            card.hidden = !visibleProjects.includes(card);
        });

        const projectNames = visibleProjects.map((card) => card.querySelector('h2').textContent.trim());
        projectCount.textContent = projectNames.length === 0
            ? 'No se encontraron proyectos con esos filtros.'
            : projectNames.length === 1
                ? 'Se muestra 1 proyecto.'
                : `Se muestran ${projectNames.length} proyectos.`;
        projectList.setAttribute(
            'aria-label',
            projectNames.length ? `Proyectos encontrados: ${projectNames.join(', ')}` : 'No se encontraron proyectos'
        );
    };

    projectSearch.addEventListener('input', renderProjects);
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });
            renderProjects();
        });
    });

    renderProjects();
}
