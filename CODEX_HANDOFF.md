# LinusTec: estado de entrega

## Turnstile: carga en Resumen — 21 de octubre de 2026

Se retiró la precarga de `Plans.tsx`. La home y los pasos Opciones y Datos no cargan `api.js`; el paso Resumen monta el widget y comienza entonces la espera máxima de 30 segundos. El cargador usa el callback `onload` de `api.js?render=explicit`, sin llamar a `turnstile.ready()`; el objeto global puede aparecer antes de que el script esté listo. Un error de carga elimina el script fallido y permite un nuevo intento; una carga exitosa se reutiliza al volver a Resumen sin insertar otra copia. El widget usa `retry: 'never'` y actualización manual para que su reintento automático no compita con «Reintentar verificación». La consola registra solo motivos fijos de carga/render o códigos numéricos del widget, nunca tokens ni secretos. El formulario consume cada token al enviar y lo descarta a los 4 minutos y 45 segundos; vencimiento, error del widget y rechazo de Siteverify permiten renovarlo sin recargar. El servidor conserva la validación y registra solo códigos de error saneados. Las pruebas dirigidas cubren primer widget, error de carga, error del widget, reintento, token viejo y regreso a Resumen. No se cambiaron claves, DNS ni modo del widget. Sin site key ni secretos reales en esta copia, no se comprobó un envío real por Cloudflare y Resend.

## Iteración de Planes — octubre de 2026

La sección Planes conserva los cuatro productos de `reference/linustec-planes-referencia.html`: Gastronómico, Servicios y reservas, Presentación institucional y A medida. La revisión del 16 de octubre parte de la copia local con cambios pendientes, sin recuperar el commit retirado. Las tarjetas se apilan en todos los tamaños; escritorio distribuye presentación y desplegables en dos columnas internas, y tablet/mobile usan una. Cada tarjeta tiene tres desplegables nativos independientes: Qué incluye, Extras y funciones adicionales y Material que necesitamos de vos. El archivo de referencia estaba sin seguimiento en Git y se conservó intacto. No se tocaron Header, Hero, Proyectos, Proceso, Contacto ni sus datos. No se hizo reset, clean, commit, deploy ni push.

## Dónde editar el contenido comercial

Todo el contenido de las tarjetas y del configurador vive en [`src/data/plans.ts`](src/data/plans.ts). `planContent` reúne los textos compartidos de sección, desplegables, botones, formulario, dominio, precios pendientes y condiciones de comienzo. Cada registro de `plans` contiene `headline`, `audience`, `name`, `summary`, `inclusions`, `boundary`, `material`, `choices`, `extras` y `price`. Las cantidades incluidas, como los 48 productos gastronómicos o las cuatro páginas institucionales, están en las descripciones de `inclusions` y `boundary`. Los precios base se cambian en `price`; los importes de adicionales, en `extras[].price`. El estado `{ status: 'pending' }` muestra `AR$***`; `{ status: 'quote' }` muestra `A cotizar`; un precio definitivo usa `{ status: 'defined', amount: 123456 }`. El formato está en `formatPrice` y el total en `totalPrice` del mismo archivo.

Los tipos comerciales están en [`src/types/plan.ts`](src/types/plan.ts). `PlanRequestDraft` conserva el borrador con estado `draft`; `src/types/consultation.ts` define el contrato JSON y los resultados del envío.

## Flujo actual

- Estándar: tarjeta con base consultable en desplegable → Opciones y extras → Datos y material → Resumen.
- A medida: tarjeta con explicación consultable → Datos de la idea y referencias → Resumen.
- El modal conserva datos al volver entre pasos. Al cerrar y abrir otro plan, inicia con las opciones propias del nuevo plan.
- Hay validación de nombre, negocio, correo, WhatsApp, mensaje y enlace obligatorio a la carpeta de materiales. X, Escape y clic en el fondo cierran; el foco vuelve al botón que abrió el diálogo.
- Después del resumen, “Enviar consulta” requiere Turnstile y una respuesta confirmada del servidor. El éxito solo se muestra cuando Resend acepta el envío; ante fallos, se conservan datos y enlace, se renueva el token y se permite reintentar. Sin la site key pública el botón queda deshabilitado; sin configuración privada el servidor devuelve `503`.

## Archivos principales

- Tarjetas: `src/sections/Plans/Plans.tsx`, `PlanCard.tsx` y `Plans.styles.ts`.
- Modal y pasos: `src/features/plan-configurator/PlanConfigurator.tsx`, `PlanOptions.tsx`, `RequestForm.tsx`, `RequestSummary.tsx` y `PlanConfigurator.styles.ts`.
- Datos y tipos: `src/data/plans.ts` y `src/types/plan.ts`.
- Pruebas: `src/test/App.test.tsx`.

## Pendiente para habilitar envío real

El responsable confirmó Cloudflare Pages o Workers, pero falta identificar el producto/proyecto exacto. Proveedor y destinatario todavía no están definidos. Se dejó Resend como adaptador preparado, sin cuenta ni claves inventadas. Falta configurar dominio remitente verificado, MAIL_FROM/MAIL_TO, claves Resend/Turnstile, widget público y Upstash para límites compartidos. La lista completa y pasos están en `docs/CONSULTATIONS.md` y `.env.example`. No se comprobó un correo real: los casos de proveedor se prueban con servicios externos controlados en tests. El servidor local sin configuración se comprobó por HTTP y responde `503`.

La entrada de Pages es `functions/api/consultations.ts`; la de Workers es `server/worker.ts`, con ejemplo no activo `wrangler.example.jsonc`. No se cambió infraestructura externa ni se publicó código. Los cuatro registros comerciales se conservan.

Validación de la fase de correo: lint, TypeScript, 59 pruebas y build correctos. Servidor y UI prueban servicios externos con respuestas controladas; no se verificó entrega real. Pages y Worker compilan/ejecutan localmente con Wrangler 4.151.1 y devuelven `503` sin secretos; la home sigue respondiendo `200`. Chromium revisó 1920×1080, 390×844 y 320×720. Revisión de seguridad solo lectura por GPT-6.1 Sol High integrada: el límite global se consume únicamente tras CAPTCHA válido. No se añadieron dependencias del proyecto.

## Carpeta de materiales obligatoria — 20 de octubre de 2026

Todos los planes requieren «Enlace al material» para una carpeta con permisos de lectura. El cliente aporta logo, fotos y videos; LinusTec desarrolla la página y no produce esos recursos. El resumen muestra el enlace como texto y el servidor lo añade al correo de texto plano. Acepta URL absoluta HTTP(S), máximo 2048 caracteres, sin credenciales, espacios ni controles. El servidor no visita ni descarga enlaces, ni inicia sesión con servicios de archivos. Se quitaron la carga, los tipos, los límites, la validación y el envío de adjuntos. El cuerpo JSON tiene un máximo de 32 KiB. `src/data/plans.ts` contiene los textos y `src/data/consultationPolicy.ts` la validación compartida.

Validación de esta iteración: `pnpm lint`, `pnpm typecheck`, `pnpm test --run` (**67 pruebas**) y `pnpm build` correctos. Las pruebas cubren enlace ausente, URL inválida, HTTP y HTTPS válidos, rechazo del campo antiguo `files`, correo de texto sin adjuntos, falta de clave Resend, rechazo del proveedor y confirmación solo con respuesta aceptada. No se comprobó entrega real de correo porque los servicios externos siguen sin configurar. Sin reset, clean, commit, push ni deploy.

## Validación del 16 de octubre

- Los cuatro registros comerciales se compararon con una copia de los archivos pendientes tomada antes de editar: inclusiones, límites, opciones, extras, materiales y precios permanecen idénticos.
- Chromium: 1920×1080, 1440×900, 1280×720, 1024×768, 768×1024, 390×844 y 320×720, sin overflow global ni de tarjetas con los tres desplegables abiertos. Títulos con color del tema `#020617` y opacidad 1.
- Recorridos completos de los cuatro planes con mouse y teclado en escritorio, tablet y mobile: validación, datos al volver, resumen sin envío, cierre con botón/Escape/fondo y retorno del foco. Los tests conservan la comprobación de extras propios al cambiar de plan.
- Lint, TypeScript, 26 tests y build correctos. Prettier limitado a archivos modificados. No se agregaron dependencias.
- Capturas temporales: `/tmp/linustec-planes-*-20261016.png`, `/tmp/linustec-planes-expanded-*-20261016.png` y `/tmp/linustec-configurador-*-20261016.png`.
