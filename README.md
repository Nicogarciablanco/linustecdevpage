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

Vite muestra la URL local. El configurador usa un endpoint de servidor para correo, Turnstile y límite compartido. Sin configurar los servicios el envío permanece deshabilitado; no hay un éxito simulado. Ver [activación y variables de entorno](docs/CONSULTATIONS.md).

## Scripts

| Comando           | Uso                                  |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Servidor local                       |
| `pnpm dev:api`    | API local del configurador en 8788   |
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

Las tipografías Barlow Condensed y Google Sans se cargan desde Google Fonts como dependencia externa; no se descargaron archivos de fuente.

## Edición de Planes

`src/data/plans.ts` es la fuente de contenido de esta sección y su configurador. Editá `plans` para cambiar inclusiones, límites, materiales que se pedirán después, opciones, extras y precios por producto; `planContent` para los textos compartidos, el proceso, las etiquetas del formulario y las condiciones comerciales. Un precio pendiente usa `{ status: 'pending' }`; uno definitivo, `{ status: 'defined', amount: 123456 }`. A medida conserva `{ status: 'quote' }`. Las tarjetas muestran la base completa y ofrecen «Comprar base» o «Personalizar plan»; A medida abre una consulta de proyecto. La primera consulta pide datos de contacto y alcance, sin archivos ni enlaces de materiales. Después de la acreditación manual de la seña se solicitarán materiales mediante Google Form. Resend envía un correo de texto y la interfaz confirma éxito únicamente cuando el proveedor lo acepta. La configuración del envío se explica en `docs/CONSULTATIONS.md` y `.env.example`.
