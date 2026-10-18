export const EMAILJS_PUBLIC_KEY = 'MKHzawgDchmYm0Pad';
export const EMAILJS_SERVICE_ID = 'service_5myec36';
export const EMAILJS_TEMPLATE_ID = 'template_wdhre2l';

export function isEmailJsConfigured() {
    return !Object.values({
        EMAILJS_PUBLIC_KEY,
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID
    }).some((value) => value.startsWith('YOUR_'));
}
