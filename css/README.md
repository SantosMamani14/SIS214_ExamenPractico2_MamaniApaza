# Arquitectura CSS

Los estilos del CV están separados en varios archivos para mantener una estructura clara y fácil de mantener.

## Archivos

- `styles.css`: punto de entrada principal. Importa todos los módulos CSS.
- `variables.css`: tokens de color requeridos, tipografía, sombras, bordes, medidas y transiciones.
- `base.css`: reinicio de estilos, reglas generales, formularios, tablas y accesibilidad.
- `layout.css`: estructura de las páginas, Flexbox, CSS Grid, navegación y diseño responsive.
- `components.css`: tarjetas, habilidades, proyectos, multimedia, botones y formulario de contacto.
- `animations.css`: animaciones de entrada, transiciones y respeto por `prefers-reduced-motion`.

## Punto de entrada

Las páginas HTML solo necesitan cargar:

```html
<link rel="stylesheet" href="css/styles.css">
```

El archivo `styles.css` organiza los módulos mediante `@import`.

## Responsive

El diseño es mobile-first: los estilos base corresponden a móvil (hasta 767 px), la adaptación a tablet usa `768px–1024px` y escritorio comienza en `1025px`. Flexbox y CSS Grid reorganizan la navegación, formularios y contenido multimedia en esos rangos. En la página Multimedia, la imagen, el reproductor de audio y el video ocupan cada uno una fila completa y se ajustan al ancho disponible.

## Temas

Todas las páginas utilizan el checkbox `#theme-toggle` y las variables CSS para cambiar entre modo claro y oscuro. `main.js` restaura y guarda la preferencia en `localStorage`.
