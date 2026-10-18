const PROFILE_URL = 'https://api.github.com/users/SantosMamani14';
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT = 7000;
const RETRY_DELAY = 500;

class GitHubResponseError extends Error {
    constructor(status) {
        super(`GitHub respondió con el estado HTTP ${status}.`);
        this.name = 'GitHubResponseError';
        this.status = status;
    }
}

class GitHubNetworkError extends Error {
    constructor(cause) {
        super('No se pudo completar la solicitud a GitHub.', { cause });
        this.name = 'GitHubNetworkError';
    }
}

function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function requestProfile() {
    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        let response;
        let profile;

        try {
            response = await fetch(PROFILE_URL, {
                headers: { Accept: 'application/vnd.github+json' },
                signal: controller.signal
            });
            if (response.ok) {
                profile = await response.json();
            }
        } catch (error) {
            if (error instanceof SyntaxError) throw error;
            lastError = error;
        } finally {
            window.clearTimeout(timeoutId);
        }

        if (response) {
            if (!response.ok) {
                lastError = new GitHubResponseError(response.status);
                if (response.status !== 408 && response.status !== 429 && response.status < 500) {
                    throw lastError;
                }
            } else {
                if (!profile || typeof profile.login !== 'string') {
                    throw new TypeError('El perfil recibido no tiene un formato válido.');
                }
                return profile;
            }
        }

        if (attempt < MAX_ATTEMPTS) {
            await wait(RETRY_DELAY * (2 ** (attempt - 1)));
        }
    }

    if (lastError instanceof GitHubResponseError || lastError?.name === 'AbortError') {
        throw lastError;
    }
    throw new GitHubNetworkError(lastError);
}

function isGitHubUrl(value, hostname) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === hostname;
    } catch {
        return false;
    }
}

function renderProfile(panel, profile) {
    const avatar = panel.querySelector('[data-profile-avatar]');
    const bio = panel.querySelector('[data-profile-bio]');
    const followers = panel.querySelector('[data-profile-followers]');
    const link = panel.querySelector('[data-profile-link]');
    const status = panel.querySelector('[data-profile-status]');

    if (typeof profile.name === 'string' && profile.name.trim()) {
        panel.querySelector('h2').textContent = profile.name.trim();
    }

    bio.textContent = typeof profile.bio === 'string' && profile.bio.trim()
        ? profile.bio.trim()
        : `Perfil público de GitHub: @${profile.login}.`;
    followers.textContent = Number.isInteger(profile.followers)
        ? new Intl.NumberFormat('es-BO').format(profile.followers)
        : '—';

    if (isGitHubUrl(profile.html_url, 'github.com')) {
        link.href = profile.html_url;
    }

    if (isGitHubUrl(profile.avatar_url, 'avatars.githubusercontent.com')) {
        avatar.addEventListener('error', () => {
            avatar.hidden = true;
        }, { once: true });
        avatar.src = profile.avatar_url;
        avatar.alt = `Foto de perfil de ${profile.login}`;
        avatar.hidden = false;
    }

    status.textContent = 'Datos actualizados desde la API pública de GitHub.';
    status.dataset.state = 'success';
}

function showError(panel, error) {
    const status = panel.querySelector('[data-profile-status]');
    const retry = panel.querySelector('[data-profile-retry]');

    console.error('No se pudo cargar el perfil público de GitHub.', error);
    if (error instanceof GitHubResponseError) {
        status.textContent = `GitHub respondió con HTTP ${error.status}. Inténtalo de nuevo más tarde.`;
    } else if (error instanceof TypeError) {
        status.textContent = 'GitHub devolvió datos que no se pudieron interpretar.';
    } else if (error instanceof SyntaxError) {
        status.textContent = 'GitHub devolvió una respuesta con formato no válido.';
    } else if (error.name === 'AbortError') {
        status.textContent = 'La conexión con GitHub tardó demasiado. Puedes volver a intentarlo.';
    } else if (error instanceof GitHubNetworkError) {
        status.textContent = 'No se pudo conectar con GitHub. Revisa tu conexión e inténtalo de nuevo.';
    } else {
        status.textContent = 'No se pudo mostrar el perfil de GitHub.';
    }
    status.dataset.state = 'error';
    retry.hidden = false;
}

async function loadProfile(panel) {
    const status = panel.querySelector('[data-profile-status]');
    const retry = panel.querySelector('[data-profile-retry]');

    retry.hidden = true;
    retry.disabled = true;
    status.textContent = 'Cargando perfil público...';
    status.dataset.state = 'loading';

    try {
        const profile = await requestProfile();
        renderProfile(panel, profile);
    } catch (error) {
        showError(panel, error);
    } finally {
        retry.disabled = false;
    }
}

export function initializeGitHubProfile() {
    const panel = document.querySelector('[data-github-profile]');
    if (!panel) return;

    panel.querySelector('[data-profile-retry]').addEventListener('click', () => {
        loadProfile(panel);
    });

    loadProfile(panel);
}
