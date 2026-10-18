# JavaScript

El comportamiento del CV está dividido en módulos independientes de JavaScript nativo.

## Archivos

### `main.js`

Es el punto de entrada de los módulos compartidos y coordina:

- `theme.js`: persistencia de la preferencia de tema mediante `localStorage`.
- `navigation.js`: menú móvil, atributos accesibles y cierre con `Escape`.
- `project-filters.js`: búsqueda y filtros de proyectos sin modificar los datos originales.
- `github-profile.js`: consulta el perfil público con `fetch`, valida `response.ok`, aplica timeout y reintentos acotados ante fallos transitorios, y muestra estados accesibles de carga, éxito y error. No carga ni muestra repositorios.
- `location-map.js`: crea el mapa Leaflet con teselas de OpenStreetMap y una referencia aproximada de La Paz. No solicita geolocalización al navegador ni muestra una dirección domiciliaria.

### `form-validation.js`

Se inicializa desde `main.js` únicamente en `contacto.html` y valida el formulario:

- Comprueba campos obligatorios, formatos y longitudes en tiempo real.
- Utiliza la validación nativa del navegador.
- Asocia mensajes de error accesibles a los campos correspondientes.
- Abre un diálogo modal accesible con un aviso de éxito o advertencia.
- Envía los datos válidos mediante EmailJS y muestra estados accesibles de envío, éxito y error.
- Evita envíos repetidos mientras una solicitud está en curso y limita solicitudes consecutivas.
- Devuelve el foco al campo inválido o al botón de envío al cerrar el diálogo.
- Limpia el estado al usar el botón de reinicio.

### `emailjs-config.js`

Configura la integración de EmailJS reemplazando los tres valores de ejemplo:

- `EMAILJS_PUBLIC_KEY`: clave pública del panel **Account**.
- `EMAILJS_SERVICE_ID`: ID del servicio de correo creado en EmailJS.
- `EMAILJS_TEMPLATE_ID`: ID de la plantilla que recibirá el formulario.

Para activarlo:

1. En EmailJS, crea o conecta un servicio de correo y copia su **Service ID** desde **Email Services**.
2. Crea una plantilla en **Email Templates**. En el cuerpo puedes usar `{{nombre}}`, `{{email}}`, `{{telefono}}`, `{{motivo}}` y `{{mensaje}}`, que corresponden a los atributos `name` del formulario. Pon tu dirección en **To Email** y, para responder al remitente, configura **Reply To** como `{{email}}`.
3. Copia el **Template ID** de esa plantilla y la **Public Key** de **Account** en las constantes correspondientes de `emailjs-config.js`.
4. En **Account > Security**, limita los dominios autorizados a tu sitio publicado y al dominio local de pruebas.

La clave pública está diseñada para uso en el navegador. No coloques una clave privada en este sitio.

La librería oficial del navegador se carga desde jsDelivr solo cuando se envía el formulario. El formulario requiere conexión a Internet y credenciales válidas de EmailJS.

## Carga de módulos

El punto de entrada compartido se carga como módulo ES6. El navegador resuelve sus importaciones después de analizar el HTML:

```html
<script type="module" src="js/main.js"></script>
```

`main.js` inicializa la validación solo cuando encuentra `#contact-form`.
Debido al uso de módulos, ejecuta el sitio mediante un servidor HTTP local o publícalo en GitHub Pages; abrir los archivos directamente con `file://` puede impedir que el navegador cargue los módulos.
