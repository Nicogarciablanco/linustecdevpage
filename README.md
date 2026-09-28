# LinusTec

Landing de una página construida con React, Vite, TypeScript estricto y Styled Components. `reference/linustec-concept-v1.html` permanece intacto y define contenido y aspecto de esta primera versión.

## Requisitos

- Node.js 24.15 o superior (también compatible con versiones admitidas por Vite 8 y jsdom 30).
- PNPM 11.25 o superior.

## Instalación y uso

```bash
pnpm install
pnpm dev
```

Vite muestra la URL local. No hay backend ni variables de entorno.

## Scripts

| Comando           | Uso                                  |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Servidor local                       |
| `pnpm lint`       | ESLint                               |
| `pnpm typecheck`  | TypeScript estricto                  |
| `pnpm test --run` | Tests Vitest + React Testing Library |
| `pnpm build`      | TypeScript y build de producción     |
| `pnpm preview`    | Vista local del build                |

## Estructura

- `src/app`: composición, theme, estilos globales.
- `src/components`: layout y piezas visuales compartidas.
- `src/sections`: bloques de la landing.
- `src/features`: rail y configurador.
- `src/hooks`: comportamiento reutilizable.
- `src/data` y `src/types`: contenido y contratos de datos.
- `src/test`: pruebas y configuración.
- `docs`: arquitectura y decisiones.

La tipografía Archivo Black e Inter se carga desde Google Fonts como dependencia externa; no se descargaron archivos de fuente.
