export function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = menuToggle
        ? document.getElementById(menuToggle.getAttribute('aria-controls'))
        : null;

    if (!menuToggle || !navigation) return;

    const setMenuOpen = (isOpen) => {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
        navigation.classList.toggle('is-open', isOpen);
    };

    menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
        if (event.matches) setMenuOpen(false);
    });
}
