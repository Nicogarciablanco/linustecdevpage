# LinusTec: estado de entrega

## Extras con precio y envío — 27 de octubre de 2026

Se retiraron de `src/data/plans.ts` las nueve opciones sin importe definido. Solo se ofrecen extras con precio concreto; «A cotizar» permanece únicamente para el plan A medida. Las pruebas de Planes comprueban que esos extras no aparezcan en el configurador. La cuenta y los cupones continúan en el navegador; `/api/consultations` conserva validación, Turnstile, límite de solicitudes y confirmación de Resend antes de mostrar éxito.

El responsable indicó que la configuración externa está en producción. Esta copia local no contiene las variables privadas de Resend, Turnstile ni Upstash, y el endpoint publicado en `https://linustec.dev/api/consultations` respondió `503 unavailable` a una solicitud con origen no autorizado el 27 de octubre, sin intentar enviar correo. En el código actual, una configuración válida habría respondido `403 forbidden` antes de consultar esos servicios. Tras publicar esta copia, revisar las variables del entorno activo y probar un envío real con un destinatario controlado. No se publicó ni se envió correo en esta iteración.

## Presupuesto local y transferencia manual — 27 de octubre de 2026

El configurador suma plan y extras con `calculateBudgetWithCoupon` de `src/data/plans.ts` y muestra la seña del 50 % sin llamar al servidor. «Aplicar» valida los cupones desde `coupons` en el mismo archivo; el cupón de prueba `Montañita Linus Tec` aplica 20 % y es público. Se retiraron `/api/quote`, `COUPONS_JSON` y sus dependencias. El servidor repite la cuenta al recibir la solicitud y no confía en importes enviados por el navegador.

La transferencia muestra únicamente el alias público `nicojngbmp`, editable en `planContent.paymentAlias`. El comprobante se adjunta en el formulario de los planes con precio y conserva la validación PDF/PNG/JPEG de hasta 2 MB en cliente y servidor. Para habilitar un envío real siguen faltando la configuración privada de correo, Turnstile y Upstash; recibir el comprobante no acredita el pago. Los detalles de activación están en `docs/CONSULTATIONS.md`.

## Presupuesto visible y seña — 27 de octubre de 2026

Esta sección documentaba la API de presupuesto que se retiró. El cálculo ahora funciona solo con `pnpm dev`; `pnpm dev:api` sigue siendo necesario para probar el envío del comprobante en desarrollo.

El resumen muestra una sola cifra principal para el precio total y la seña al 50 % como parte de ese total. El subtotal aparece solo cuando hay cupón. No se inventaron credenciales ni se habilitó un envío real.

## Planes, presupuesto y comprobante — 26 de octubre de 2026

La iteración actual conserva los cambios locales previos y deja cuatro planes: Gastronómico AR$220.000, Servicios y reservas AR$300.000, Presentación institucional AR$180.000 y A medida a cotizar. Cada tarjeta muestra la base, una sola acción «Comprar ahora» para los planes con precio y un enlace a su detalle; los extras se ofrecen dentro del configurador. El contenido comercial público se edita en `src/data/plans.ts`. Proceso está dentro de Planes y resume el recorrido en tres etapas: elegir, transferir y verificar, preparar el inicio.

El configurador ofrece base o personalización, cotiza extras definidos y excluye las variantes incompatibles. Los planes con precio requieren un comprobante PDF, PNG o JPEG de hasta 2 MB. `/api/consultations` recalcula el total y la seña, conserva Turnstile y límites compartidos, y pide a Resend un correo de texto con adjunto. El pago no se considera acreditado por recibir el archivo. A medida sigue como consulta sin importe ni comprobante. Los materiales de producción se piden luego por Google Form.

El alias de transferencia indicado por el responsable es `nicojngbmp`; quedó en la fuente compartida `src/data/plans.ts`. Falta la configuración de Cloudflare, Resend, Turnstile y Upstash antes de habilitar un envío real. Los pasos están en `docs/CONSULTATIONS.md`. Las secciones siguientes son historial de iteraciones anteriores y pueden describir un flujo reemplazado por este apartado.

El campo de cupón mantiene el texto como borrador: no hay consultas al escribir ni al pulsar «Aplicar». Los códigos y descuentos se editan en la lista local `coupons` de `src/data/plans.ts`.

La variante de reservas de mesas es una oferta comercial calculable, no una funcionalidad ya desarrollada dentro de esta web. Los extras sin importe definido se retiraron en la actualización posterior descrita arriba.

Las nueve opciones pendientes de esta etapa se retiraron de los planes en la actualización posterior descrita arriba.

Validación local de esta iteración: `pnpm lint`, `pnpm typecheck`, `pnpm test --run` (67 casos), `pnpm build` y `git diff --check` correctos. Chromium revisó la home en 1920×1080, 1440×900, 1024×768 y 390×844; las cuatro páginas de detalle en 390×844; el paso de comprobante en 1920, 1024 y 390 px; y los extras pendientes en 1440 y 390 px. No se observó overflow horizontal ni títulos transparentes. La API y Resend se probaron con servicios simulados, sin transferencia ni correo real. No hubo commit, push ni despliegue.

## Precios base — 26 de octubre de 2026

Gastronómico: AR$ 220.000; Servicios y reservas: AR$ 260.000; Presentación institucional: AR$ 180.000. Se editaron los tres importes base en `src/data/plans.ts` como precios definidos. Los extras conservan precios pendientes y A medida sigue «A cotizar». La interfaz, el resumen y el correo leen la misma fuente.

Las tres tarjetas con precio tienen una sola acción, «Comprar ahora», que abre el recorrido base. Después de completar los datos se pueden sumar extras sin perderlos. A medida conserva «Consultar proyecto» porque su precio se cotiza.

## Turnstile: carga en Resumen — 21 de octubre de 2026

Se retiró la precarga de `Plans.tsx`. La home y los pasos Opciones y Datos ya no cargan `api.js`; el paso Resumen monta el widget y comienza entonces la espera máxima de 30 segundos. Un error de carga elimina el script fallido y permite un nuevo intento; una carga exitosa se reutiliza al volver a Resumen sin insertar otra copia. El widget espera el evento `load` y `turnstile.ready`, aunque el objeto global aparezca antes. El formulario consume cada token al enviar y lo descarta a los 4 minutos y 45 segundos; vencimiento, error del widget y rechazo de Siteverify permiten renovarlo sin recargar. El servidor conserva la validación y registra solo códigos de error saneados. La prueba de integración recorre la página, Opciones, Datos, Resumen, fallo inicial, reintento y regreso a Resumen sin enviar un formulario real. La prueba de ciclo de vida sigue cubriendo tokens viejos y widgets descartados. No se cambiaron claves, DNS ni modo del widget. Sin site key ni secretos reales en esta copia, no se comprobó un envío real por Cloudflare y Resend.

## Iteración de Planes — octubre de 2026

La sección Planes conserva los cuatro productos de `reference/linustec-planes-referencia.html`: Gastronómico, Servicios y reservas, Presentación institucional y A medida. La revisión del 16 de octubre parte de la copia local con cambios pendientes, sin recuperar el commit retirado. Las tarjetas se apilan en todos los tamaños; escritorio distribuye presentación y desplegables en dos columnas internas, y tablet/mobile usan una. Cada tarjeta tiene tres desplegables nativos independientes: Qué incluye, Extras y funciones adicionales y Material que necesitamos de vos. El archivo de referencia estaba sin seguimiento en Git y se conservó intacto. No se tocaron Header, Hero, Proyectos, Proceso, Contacto ni sus datos. No se hizo reset, clean, commit, deploy ni push.

## Dónde editar el contenido comercial

Todo el contenido de las tarjetas y del configurador vive en [`src/data/plans.ts`](src/data/plans.ts). `planContent` reúne los textos compartidos de sección, desplegables, botones, formulario, dominio y condiciones de comienzo. Cada registro de `plans` contiene `headline`, `audience`, `name`, `summary`, `inclusions`, `boundary`, `material`, `choices`, `extras` y `price`. Las cantidades incluidas, como los 48 productos gastronómicos, están en las descripciones de `inclusions` y `boundary`. Los precios base se cambian en `price`; los importes de adicionales, en `extras[].price`. El estado `{ status: 'quote' }` muestra `A cotizar` para A medida; un precio definitivo usa `{ status: 'defined', amount: 123456 }`. El formato está en `formatPrice` y el total en `totalPrice` del mismo archivo.

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
