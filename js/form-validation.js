import {
    EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    isEmailJsConfigured
} from './emailjs-config.js';

function getFieldMessage(field) {
    if (field.validity.valueMissing) {
        return field.type === 'checkbox'
            ? 'Debes aceptar el uso de tus datos para continuar.'
            : 'Este campo es obligatorio.';
    }
    if (field.validity.typeMismatch) return 'Ingresa un correo electrónico válido.';
    if (field.validity.patternMismatch) return 'Ingresa un teléfono boliviano válido, por ejemplo +591 7000 0000.';
    if (field.validity.tooShort) return `Ingresa al menos ${field.minLength} caracteres.`;
    return '';
}

function updateField(field, showError) {
    const error = document.getElementById(`${field.id}-error`);
    const message = showError && !field.validity.valid ? getFieldMessage(field) : '';

    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
}

export function initializeFormValidation() {
    const form = document.querySelector('#contact-form');
    const status = document.querySelector('#form-status');
    const dialog = document.querySelector('#form-alert');

    if (!form || !status || !(dialog instanceof HTMLDialogElement)) return;

    const title = dialog.querySelector('[data-alert-title]');
    const message = dialog.querySelector('[data-alert-message]');
    const icon = dialog.querySelector('[data-alert-icon]');
    const closeButton = dialog.querySelector('[data-alert-close]');
    const submitButton = form.querySelector('[type="submit"]');
    const resetButton = form.querySelector('[type="reset"]');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'))
        .filter((field) => field.type !== 'reset' && field.type !== 'submit');
    let hasSubmitted = false;
    let invalidField;
    let isSending = false;
    let emailJsLoading;

    const openAlert = ({ type, heading, description }) => {
        dialog.dataset.state = type;
        icon.textContent = type === 'success' ? '✓' : '!';
        title.textContent = heading;
        message.textContent = description;

        if (!dialog.open) dialog.showModal();
        closeButton.focus();
    };

    fields.forEach((field) => {
        field.addEventListener('blur', () => updateField(field, true));
        field.addEventListener('input', () => {
            const showError = hasSubmitted || field.getAttribute('aria-invalid') === 'true';
            updateField(field, showError);
            if (hasSubmitted && form.checkValidity()) {
                status.textContent = 'Todos los campos son válidos. El formulario está listo para enviar.';
                status.dataset.state = 'success';
            } else if (hasSubmitted) {
                status.textContent = 'Aún hay campos por corregir.';
                status.dataset.state = 'error';
            }
        });
        field.addEventListener('change', () => {
            if (field.type === 'checkbox' || field.tagName === 'SELECT') {
                updateField(field, hasSubmitted || field.getAttribute('aria-invalid') === 'true');
            }
        });
    });

    const loadEmailJs = () => {
        if (window.emailjs?.sendForm) return Promise.resolve(window.emailjs);
        if (emailJsLoading) return emailJsLoading;

        emailJsLoading = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.async = true;
            script.onload = () => {
                if (window.emailjs?.sendForm) {
                    resolve(window.emailjs);
                } else {
                    emailJsLoading = undefined;
                    reject(new Error('El SDK de EmailJS no está disponible.'));
                }
            };
            script.onerror = () => {
                emailJsLoading = undefined;
                script.remove();
                reject(new Error('No se pudo cargar el SDK de EmailJS.'));
            };
            document.head.append(script);
        });

        return emailJsLoading;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (isSending) return;

        hasSubmitted = true;
        const validityByField = fields.map((field) => updateField(field, true));
        const firstInvalidIndex = validityByField.indexOf(false);
        invalidField = firstInvalidIndex === -1 ? null : fields[firstInvalidIndex];

        if (invalidField || !form.checkValidity()) {
            status.textContent = 'Revisa los campos obligatorios antes de enviar el formulario.';
            status.dataset.state = 'error';
            openAlert({
                type: 'warning',
                heading: 'Revisa el formulario',
                description: 'Hay campos pendientes o con datos incorrectos. Corrígelos para continuar.'
            });
            return;
        }

        if (!isEmailJsConfigured()) {
            status.textContent = 'Falta configurar EmailJS. Completa las credenciales en js/emailjs-config.js.';
            status.dataset.state = 'error';
            openAlert({
                type: 'warning',
                heading: 'El envío aún no está configurado',
                description: 'Completa la clave pública, el ID del servicio y el ID de la plantilla en js/emailjs-config.js para habilitar el envío.'
            });
            return;
        }

        isSending = true;
        submitButton.disabled = true;
        resetButton.disabled = true;
        status.textContent = 'Enviando tu mensaje...';
        delete status.dataset.state;

        try {
            const emailjs = await loadEmailJs();
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
                publicKey: EMAILJS_PUBLIC_KEY,
                limitRate: {
                    id: 'portfolio-contact-form',
                    throttle: 1000
                }
            });

            form.reset();
            status.textContent = 'Tu mensaje se envió correctamente. Gracias por contactarme.';
            status.dataset.state = 'success';
            openAlert({
                type: 'success',
                heading: 'Mensaje enviado',
                description: 'Tu mensaje se envió correctamente. Gracias por contactarme.'
            });
        } catch (error) {
            console.error('No se pudo enviar el formulario mediante EmailJS:', error);
            status.textContent = 'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.';
            status.dataset.state = 'error';
            openAlert({
                type: 'warning',
                heading: 'No se pudo enviar',
                description: 'Ocurrió un problema al enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.'
            });
        } finally {
            isSending = false;
            submitButton.disabled = false;
            resetButton.disabled = false;
        }
    });

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
        if (invalidField) {
            invalidField.focus();
            invalidField = null;
            return;
        }
        submitButton.focus();
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });

    form.addEventListener('reset', () => {
        hasSubmitted = false;
        fields.forEach((field) => updateField(field, false));
        status.textContent = '';
        delete status.dataset.state;
    });
}
