# Entrega LinusTec

## Estado

Landing React/Vite/TypeScript/Styled Components. Caveman **full** aplicado el 24-09-2026 con tres agentes delimitados: Header/Hero, Proyectos y QA de solo lectura. El agente principal integró, corrigió el rail con scrollbar clásico, revisó visualmente y mantuvo tests y documentación. El directorio no es repositorio Git (`git status` devuelve `fatal: not a git repository`). No hubo commits ni despliegues.

Iteración 25-09-2026: Hero ahora usa `src/assets/brand/linustec-symbol.svg` con halo duplicado decorativo, sombra sutil y flotación vertical lenta que respeta `prefers-reduced-motion`. Header, rail y demás secciones no cambiaron en esta iteración.

## Layout y Header

- Variables compartidas: `--page-gutter: clamp(72px, 7.8vw, 112px)`, tablet `clamp(32px, 5vw, 64px)`, mobile `20px`; `--section-space-top: clamp(96px, 9.6vw, 132px)`; `--section-space-bottom: clamp(88px, 8.2vw, 116px)`; `--content-gap: clamp(28px, 2.6vw, 38px)`.
- Hero, Proyectos, Planes, Proceso, Contacto y Footer comparten gutter. Las secciones comunes ya no tienen `min-height` forzado. Hero conserva altura específica y termina en el primer viewport.
- Header natural y sticky: x/y 7 px, ancho `viewport - 14px`, alto 66 px. Padding desktop 13 × 22 px; radio sticky 18 px; fondo `rgba(8, 17, 35, .86)`; blur 18 px; sombra `0 12px 48px rgba(5, 12, 28, .16)`. El slot mide 80 px. Logo, navegación y CTA conservan su posición relativa entre estados.
- Isotipo del Hero conserva proporción `6045:7199` (`0.8397`) con `object-fit: contain`. Medido en Chromium: 414 × 493 px a 1440 × 900; 302 × 360 px a 1280 × 720; 82 × 98 px máximo en 390 × 844. Glow repite la misma URL de asset, es decorativo y lleva blur bajo; sombra verde sutil y flotación vertical de 6 px cada 12 s. Reduced motion elimina animación. Hero termina en 900, 720 y 844 px respectivamente, sin overflow horizontal ni colisión entre isotipo, título y texto auxiliar.

## Proyectos

- Track sin centrado, alineado a `--page-gutter` y con el mismo padding final. Su expansión usa el ancho del contenedor más ambos gutters, evitando el corrimiento de `100vw` cuando Chromium reserva espacio para la barra vertical.
- Cards desktop `clamp(300px, 24.35vw, 340px)`, gap 20 px, padding 8 px y radio 13 px. Visual 320–340 px; altura total 448–468 px. Mobile conserva `84vw` y 427.59 px de alto a 390 px.
- Se preservan scroll nativo, touch, drag, teclado, Home/End, snap, foco visible, scrollbar y movimiento reducido. No hay flechas ni dependencia de slider.
- Orden y datos productivos siguen Montañita, Estudio Paz, Agrorepuestos y RHEA. Agrorepuestos continúa tercero, provisional y sin URL ficticia. CTA “Elegí tu plan →” enlaza a `#planes`.

## Mediciones Chromium

| Viewport   |    Gutter |               Card | Visibilidad inicial                  |
| ---------- | --------: | -----------------: | ------------------------------------ |
| 1440 × 900 |    112 px |       340 × 468 px | 3 completas + 248 px de la cuarta    |
| 1366 × 768 | 106.55 px | 332.61 × 455.83 px | 3 completas + 201.63 px de la cuarta |
| 1280 × 720 |  99.84 px |    311.67 × 448 px | 3 completas + 185.14 px de la cuarta |
| 390 × 844  |     20 px | 327.59 × 427.59 px | 1 completa + parte de la segunda     |

Con cuatro proyectos, End deja el último completo y conserva el padding final. El fixture exclusivo de QA con cinco proyectos mantiene el mismo inicio, permite volver al primero con Home y deja el quinto completo con padding final. No modifica `src/data/projects.ts`.

## Responsive y configurador

- Header usable a 390 px con ambos CTA; rail táctil desplazado en Chromium y card siguiente visible.
- El diálogo del configurador queda dentro de 390 × 844, bloquea body scroll, cierra con Escape y restaura foco. Se corrigió el ancho mínimo de su cabecera móvil para eliminar overflow horizontal.
- No existe overflow horizontal global en los cuatro viewports.

## Archivos modificados

- Layout: `src/app/styles/theme.ts`, `src/app/styles/GlobalStyles.ts`, `src/components/ui/Layout.ts`.
- Hero: `src/sections/Hero/Hero.tsx`, `src/sections/Hero/Hero.styles.ts`. El asset `src/assets/brand/linustec-symbol.svg` ya existía y no se duplicó.
- Header: sin cambios en esta iteración.
- Proyectos: `src/sections/Projects/Projects.styles.ts`, `src/features/project-rail/ProjectRail.tsx`, `src/features/project-rail/ProjectRail.styles.ts`.
- Ritmo y responsive: `src/sections/Contact/Contact.styles.ts`, `src/features/plan-configurator/PlanConfigurator.styles.ts`.
- Pruebas y documentación: `src/test/App.test.tsx`, `docs/DECISIONS.md`, este archivo.

## Validaciones

- `pnpm lint`: correcto.
- `pnpm typecheck`: correcto.
- `pnpm test --run`: correcto, 13 pruebas. Incluye fixture de cinco proyectos, extremos Home/End y movimiento reducido.
- `pnpm build`: correcto.
- Prettier: aplicado y comprobado solo en archivos modificados.
- Chromium: 1440 × 900, 1366 × 768, 1280 × 720 y 390 × 844 revisados. Teclado, drag, touch, snap, foco, scrollbar, movimiento reducido y modal verificados.
- Chromium Hero: 1440 × 900 y 1280 × 720 muestran isotipo nítido en columna derecha, sin superponerse al título ni texto auxiliar; CTA y Hero completos dentro del primer viewport. Mobile 390 × 844 conserva flujo aprobado, isotipo pequeño entre título y descripción y sin overflow. `prefers-reduced-motion: reduce` produce `animation-name: none`; source del glow coincide con source principal y capa está fuera del árbol accesible.

## Dependencias y contenido

No se agregaron dependencias. Logo del Header, tipografías, paleta, textos, precios, datos de proyectos y arquitectura funcional permanecen sin cambios. El Hero pasó de la esfera ornamental al SVG original de LinusTec.
