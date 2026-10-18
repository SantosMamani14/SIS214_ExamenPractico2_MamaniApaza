const STORAGE_KEY = 'cv-theme';

function readThemePreference() {
    try {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        if (storedValue === null) return 'light';

        try {
            const preference = JSON.parse(storedValue);
            if (preference && ['light', 'dark'].includes(preference.theme)) {
                return preference.theme;
            }
        } catch (error) {
            if (['light', 'dark'].includes(storedValue)) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: storedValue }));
                return storedValue;
            }
            throw error;
        }

        console.error('La preferencia de tema guardada tiene un formato no válido.');
    } catch (error) {
        console.error('No se pudo leer la preferencia del tema desde localStorage.', error);
    }

    return 'light';
}

export function initializeTheme() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;

    themeToggle.checked = readThemePreference() === 'dark';
    themeToggle.addEventListener('change', () => {
        const preference = { theme: themeToggle.checked ? 'dark' : 'light' };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
        } catch (error) {
            console.error('No se pudo guardar la preferencia del tema en localStorage.', error);
        }
    });
}
