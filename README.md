# Fabricio Pérez — Portfolio

Portfolio en español construido con React, Vite y Framer Motion. El diseño sigue la skill local [`apple-design`](skills/apple-design/SKILL.md): tipografía clara, respuesta inmediata, movimiento discreto y respeto a las preferencias de accesibilidad.

## Desarrollo

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

El servidor de desarrollo utiliza el puerto 5173. La compilación genera `dist/`, que se puede servir en un hosting estático. La navegación usa rutas con hash, de modo que los enlaces a páginas de detalle funcionan sin configurar redirecciones en el servidor.

## Organización

- `src/data/portfolio.js`: perfil, enlaces, proyectos, experiencias, formación y trayectoria.
- `src/pages/`: inicio, catálogo y detalle de proyectos, experiencias, perfil y contacto.
- `src/components/`: navegación, tarjetas, transiciones, galería y componentes compartidos.
- `src/index.css`: estilos base y preferencias de movimiento.
- `src/App.css`: diseño, componentes y adaptación responsive.
- `public/`: logo, capturas, fotografías, CV y reconocimiento del hackatón.

## Contenido y enlaces

El CV se descarga desde `/CV/CV_VICTOR_PEREZ.pdf`. Para actualizarlo, reemplaza ese archivo o cambia `profile.cv`.

Los enlaces de proyectos se editan en `projects[].url`. Nich-Ká y AprendIA tienen landing; framearch enlaza a npm. SUMS, Legado Activo, Aroma Café, GrowDigital, CASM y TechNova tienen `url: null` hasta disponer de sus direcciones confirmadas. Al completar una URL, aparece automáticamente el enlace en la tarjeta y la página de detalle. No se muestran botones vacíos.

Aroma Café, GrowDigital, CASM y TechNova están clasificados como proyectos universitarios. Yares Room no forma parte del catálogo.

Las fotografías de Nich-Ká están separadas por evento: 1–3 corresponden a la Feria Juventud Chiapaneca; 5–9, a ExpoCiencias. CICITEC y Vara Network tienen sus propias historias y galerías.

## Comprobaciones

Antes de publicar, ejecuta lint y build. Comprueba la navegación directa y los botones atrás/adelante, filtros, enlaces externos, descarga de los PDF y galería (flechas, Escape y retorno de foco). Revisa tamaños de escritorio y móvil, zoom al 200 %, movimiento reducido y contraste aumentado. Confirma las interacciones táctiles en un teléfono real.
