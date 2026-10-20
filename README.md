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

La tipografía Archivo Black e Inter se carga desde Google Fonts como dependencia externa; no se descargaron archivos de fuente.

## Edición de Planes

`src/data/plans.ts` es la fuente de contenido de esta sección y su configurador. Editá `plans` para cambiar inclusiones, límites, materiales, opciones, extras y precios por producto; `planContent` para los textos compartidos, etiquetas del formulario y condiciones comerciales. La validación y longitud máxima del enlace están en `src/data/consultationPolicy.ts`. Un precio pendiente usa `{ status: 'pending' }`; uno definitivo, `{ status: 'defined', amount: 123456 }`. A medida conserva `{ status: 'quote' }`. Cada plan requiere un enlace HTTP(S) a una carpeta con el material disponible y permiso de lectura para LinusTec. El cliente aporta el logo, las fotos, los videos y demás materiales; LinusTec desarrolla la página. El servidor no abre ni descarga el enlace. Después del resumen se envía un correo de texto por Resend; la interfaz confirma éxito únicamente cuando el proveedor lo acepta. Para activarlo faltan proveedor/destinatario, dominio verificado, Turnstile y secretos; los pasos exactos están en `docs/CONSULTATIONS.md` y las variables vacías en `.env.example`.
