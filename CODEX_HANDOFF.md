# LinusTec: estado de la copia local

## Planes — 24 de octubre de 2026

Esta iteración se hizo sobre cambios locales existentes, que se conservaron. La sección Planes muestra Gastronómico, Servicios y reservas, Presentación institucional y A medida en una grilla comparativa de cuatro columnas en escritorio, dos en tablet y una en mobile. Las tres bases muestran directamente sus inclusiones completas en frases breves, precio `AR$***`, «Comprar base» y «Personalizar plan». A medida conserva «A cotizar» y una consulta de proyecto, sin fingir precio cerrado. Los importes se muestran sin la etiqueta corta que antes aparecía encima. Los títulos usan el color visible del tema. Debajo de las tarjetas, el bloque Proceso conserva su encabezado y diseño de cuatro pasos dentro de la misma `section#planes`; solo se retiró su enlace de la navegación superior. Se retiraron la nota separada de precios pendientes y el panel separado de materiales. El texto de los pasos se ajustó al nuevo momento de solicitud de materiales y vive en `planContent`, sin una segunda fuente de datos.

Todo el contenido comercial editable está en `src/data/plans.ts`: `planContent` contiene textos compartidos, proceso y etiquetas; `plans` contiene nombres, inclusiones y límites, materiales para una fase posterior, opciones, extras y precios por producto. `{ status: 'pending' }` muestra `AR$***`; `{ status: 'quote' }` muestra «A cotizar»; `{ status: 'defined', amount: 123456 }` define un importe real. No se añadió un plan de hoteles.

«Comprar base» abre el formulario de contacto con las opciones base y sin extras. Tras validarlo, pregunta «¿Te faltó sumar algún extra?»; se puede seguir al resumen o abrir las opciones sin perder datos. «Personalizar plan» comienza por opciones y extras, luego contacto y resumen. A medida pide la descripción de la idea para cotizar. Al cambiar de plan se crea un diálogo nuevo con sus propias opciones. El resumen y el correo identifican plan base, opciones, extras y contacto. La primera consulta ya no pide archivos, URL de materiales ni acreditación de pago; el servidor rechaza esas claves ajenas al contrato.

La propuesta comercial explica que se confirma el precio y los datos de cobro antes de indicar la seña del 50 %, el comprobante llega por correo, LinusTec verifica manualmente la acreditación y recién después envía un Google Form para materiales. No hay pasarela ni confirmación automática de pago. No se calcula una seña a partir de `AR$***`.

## Envío y seguridad

El endpoint `/api/consultations` conserva validación de servidor, Turnstile, límite distribuido con Upstash, idempotencia y correo de texto mediante Resend. El script de Turnstile se carga recién en Resumen mediante el callback `onload`; el token se consume una vez y se renueva tras vencimiento o rechazo. La interfaz solo anuncia éxito cuando el servidor confirma que Resend aceptó el correo. Sin configuración privada responde `503`; sin site key pública el botón queda deshabilitado. No se publicaron claves.

Para activar el envío faltan confirmar proyecto Pages/Workers, remitente y dominio verificado en Resend, destinatario, claves de Resend y Turnstile, widget autorizado para el dominio, Upstash y secretos del límite. `docs/CONSULTATIONS.md` contiene variables y pasos concretos. No se probó entrega real de correo ni pago.

## Archivos y verificación

Las piezas principales son `src/sections/Plans/`, `src/features/plan-configurator/`, `src/data/plans.ts`, `src/types/`, `server/consultations/`, `src/app/App.tsx` y `src/components/layout/Header/Header.tsx`. La documentación vigente es `README.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` y `docs/CONSULTATIONS.md`.

ESLint, TypeScript, 62 pruebas y build pasaron en esta iteración. Chromium revisó 1920×1080, 1440×900, 1280×720, 1100×800, 1024×768 y 390×844: cuatro columnas desde 1280 px, dos hasta 701 px y una en mobile, sin overflow horizontal global. Se probó la validación del formulario, el paso de extras, el resumen, Escape, cierre por botón y retorno del foco. Las capturas locales están en `/tmp/linustec-planes-final-*-20261024.png` y `/tmp/linustec-plan-dialog-20261024.png`; el diff acotado de la iteración está en `/tmp/linustec-planes-20261024.diff`.

No se hizo reset, clean, commit, push ni deploy.
