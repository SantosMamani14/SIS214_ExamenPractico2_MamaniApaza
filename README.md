# Hoja de Vida — Santos Luis Mamani Apaza

CV y portafolio web interactivo implementado con HTML5 semántico, CSS3 modular y JavaScript ES6+ sin dependencias de ejecución.

## Estructura

```text
CV_SantosMamani/
├── index.html
├── trayectoria.html
├── habilidades.html
├── proyectos.html
├── multimedia.html
├── contacto.html
├── css/
│   ├── styles.css       # Punto de entrada con @import
│   ├── variables.css    # Paleta y variables
│   ├── base.css         # Reset, tipografía y accesibilidad
│   ├── layout.css       # Flexbox, Grid y responsive
│   ├── components.css   # Tarjetas, tablas y formularios
│   └── animations.css   # Microinteracciones
├── js/
│   ├── main.js              # Inicialización de los módulos
│   ├── theme.js             # Tema persistente
│   ├── navigation.js        # Menú móvil accesible
│   ├── project-filters.js   # Búsqueda y filtros de proyectos
│   ├── github-profile.js    # Perfil público GitHub con estados y reintentos
│   ├── location-map.js      # Mapa Leaflet/OpenStreetMap de La Paz
│   ├── form-validation.js   # Validación y envío por EmailJS
│   └── emailjs-config.js    # IDs públicos de configuración de EmailJS
├── assets/
│   ├── images/
│   │   ├── foto-perfil.jpeg
│   │   └── sistema-finanzas.png
│   ├── audio/
│   │   └── presentacion.mp3
│   └── video/
│       ├── proyecto.mp4    # Formato compatible con navegadores
│       └── proyecto.mkv    # Archivo original
└── README.md
```

## Características

- Perfil personal centrado y ubicado arriba.
- Paleta verde de la referencia: `#fffff6`, `#cdf69c` y `#7bb45a`, con fondos y tonos de texto adaptados para mantener el contraste en modo claro y oscuro.
- Tipografía de sistema rápida y legible en diferentes dispositivos.
- Modo claro/oscuro persistente entre páginas mediante `localStorage` y preferencias JSON serializadas.
- Navegación móvil tipo hamburguesa con estado accesible `aria-expanded`.
- Búsqueda y filtros por categoría en los proyectos; los datos originales del portafolio no se modifican.
- Ficha breve del perfil público de GitHub en Contacto, consultada mediante API REST con timeout, reintentos limitados y manejo de errores; no se muestra una lista de repositorios.
- Mapa interactivo de OpenStreetMap con Leaflet en la portada, centrado de forma aproximada en La Paz, departamento de La Paz, Bolivia; no consulta ni comparte el GPS del visitante.
- Flexbox en navegación, datos de contacto y etiquetas.
- CSS Grid en formación, habilidades, proyectos, multimedia y formulario.
- CSS mobile-first con rangos explícitos: móvil hasta 767 px, tablet de 768 a 1024 px y escritorio desde 1025 px.
- Etiquetas HTML5 semánticas y elementos de accesibilidad.
- Formulario con validación interactiva, mensajes asociados a cada campo, envío mediante EmailJS y ventana modal de éxito o advertencia.
- Enlaces profesionales a GitHub y LinkedIn.

## Ejecución local

Sirve la carpeta con un servidor HTTP local o publícala en GitHub Pages para que el navegador pueda cargar correctamente los módulos JavaScript. La ficha de GitHub y el envío mediante EmailJS necesitan conexión a Internet. Para activar el formulario, completa la clave pública, el ID del servicio y el ID de la plantilla en `js/emailjs-config.js`, y configura las variables de plantilla indicadas en `js/README.md`. El resto del portafolio sigue funcionando aunque estas integraciones no estén disponibles.

La **Public Key** de EmailJS es la única clave que va en el navegador; nunca pongas una clave privada aquí. Consulta la [guía de configuración de EmailJS](js/README.md#emailjs-configjs) para preparar el servicio y la plantilla.
