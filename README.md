# Fabricio Pérez — Portfolio

Portfolio en español construido con React, Vite y Framer Motion. El diseño sigue la skill local [`apple-design`](skills/apple-design/SKILL.md): tipografía clara, respuesta inmediata, movimiento discreto y respeto a las preferencias de accesibilidad.

## Desarrollo

Entorno recomendado: Node.js 24. La suite utiliza el runner nativo en un solo proceso, compatible con el entorno restringido del proyecto.

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

El servidor de desarrollo utiliza el puerto 5173. La compilación genera `dist/`, que se puede servir en un hosting estático. La navegación usa rutas con hash, de modo que los enlaces a páginas de detalle funcionan sin configurar redirecciones en el servidor.

## Clean Architecture

```text
src/
  app/                    Composición e inyección de dependencias
  domain/                 Entidades y reglas puras del catálogo
  application/
    ports/                Contrato PortfolioRepository
    use-cases/            Consultas y coordinación de reglas
  infrastructure/
    content/              Contenido editorial, fotografías y enlaces
    repositories/         Adaptador del contenido estático
  presentation/
    components/           Componentes visuales, navegación y galería
    context/              Proveedor de los casos de uso
    hooks/                Acceso a los casos de uso desde React
    pages/                Pantallas y vistas de detalle
    routing/              Adaptador de rutas hash y resolución de páginas
    styles/               Estilos base, componentes y responsive
  main.jsx                Montaje de React
tests/                    Pruebas de casos de uso, contenido y dependencias
public/                   Logo, capturas, fotografías y documentos PDF
```

Las dependencias apuntan hacia dentro: `application` utiliza `domain`; `infrastructure` implementa el contrato de `application`; `presentation` consume los casos de uso inyectados. Las capas internas no importan React, Framer Motion, DOM ni contenido estático.

`app/compositionRoot.js` conecta `createStaticPortfolioRepository` con `createPortfolioUseCases`. `app/App.jsx` entrega los casos de uso a React mediante `PortfolioProvider`. Las páginas obtienen ese servicio con `usePortfolio()`; no conocen el adaptador concreto.

El dominio define la identidad por `slug`, las categorías, el filtrado, las relaciones y la navegación circular entre elementos. Los casos de uso preparan el inicio, el perfil, los catálogos y los detalles. El estado visual de filtros, galerías, menú, animaciones y rutas pertenece a presentación.

El repositorio ofrece lecturas síncronas de una copia inmutable del contenido local. Otro adaptador debe respetar ese contrato; una futura carga asíncrona requerirá adaptar explícitamente el puerto, los casos de uso y los estados de carga de la interfaz. No se necesita un contenedor de dependencias ni nuevas librerías para la implementación actual.

Para añadir funcionalidad, coloca las reglas independientes en `domain`, la coordinación en `application` y los detalles de almacenamiento en `infrastructure`. Conecta las implementaciones únicamente desde `app`. ESLint restringe los imports entre capas y las pruebas comprueban dependencias y ciclos.

## Contenido y enlaces

El CV se descarga desde `/CV/CV_VICTOR_PEREZ.pdf`. Para actualizarlo, reemplaza ese archivo o cambia `profile.cv`.

El contenido se edita en `src/infrastructure/content/portfolio.js`. Los enlaces de proyectos están en `projects[].url`; framearch utiliza `urlLabel` para identificar su enlace a npm. Una URL se muestra automáticamente en la tarjeta y la página de detalle; un valor `null` omite el enlace. El adaptador conserva las direcciones y los textos tal como están definidos.

Aroma Café, GrowDigital, CASM y TechNova están clasificados como proyectos universitarios. Yares Room no forma parte del catálogo.

Las fotografías de Nich-Ká están separadas por evento: 1–3 corresponden a la Feria Juventud Chiapaneca; 5–9, a ExpoCiencias. CICITEC y Vara Network tienen sus propias historias y galerías.

## Comprobaciones

Ejecuta `npm test`, `npm run lint` y `npm run build`. Las pruebas utilizan el runner nativo de Node y archivos `tests/*.test.js`, sin dependencias adicionales. Cubren repositorios alternativos, filtros y conteos, relaciones, navegación circular, registros inexistentes, catálogos vacíos, inmutabilidad, rutas, recursos locales y límites entre capas. No hay un umbral de cobertura configurado.

Para cambios visuales, comprueba además la navegación directa y los botones atrás/adelante, filtros, enlaces externos, descarga de los PDF y galería (flechas, Escape y retorno de foco). Revisa tamaños de escritorio y móvil, zoom al 200 %, movimiento reducido y contraste aumentado. Confirma las interacciones táctiles en un teléfono real.
