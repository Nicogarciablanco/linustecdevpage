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

El presupuesto, la seña del 50 % y los cupones se calculan en el navegador con los datos de `src/data/plans.ts`; no necesitan la API local. Para probar el envío real del formulario en desarrollo, ejecutá también `pnpm dev:api` y configurá los servicios indicados en la guía.

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

`src/data/plans.ts` es la fuente de contenido comercial: `plans` reúne alcances, límites, opciones, extras y precios; `coupons` contiene los códigos que LinusTec decida publicar; `planContent` reúne textos compartidos, alias, proceso y formulario. Los tres planes con precio ofrecen solo «Comprar ahora», con una oportunidad de sumar extras dentro del configurador; cada uno tiene su detalle en `/planes/:id`. A medida sigue «A cotizar». El configurador calcula total y seña del 50 % localmente; el servidor repite la cuenta antes de enviar. Para los planes con precio se solicita un comprobante PDF, PNG o JPG de hasta 2 MB. Resend recibe un correo de texto con ese adjunto; la aceptación del proveedor no acredita el pago, que LinusTec verificará manualmente. Los materiales se solicitan luego mediante Google Form. La configuración del envío se explica en `docs/CONSULTATIONS.md` y `.env.example`.
