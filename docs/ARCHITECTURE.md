# Arquitectura

`main.tsx` crea la raíz y aplica `ThemeProvider` y `GlobalStyles`. `App.tsx` compone la página, conserva el plan seleccionado y coordina el estado flotante del header. Ninguna sección necesita conocer infraestructura externa.

## Capas

- **Datos y tipos:** `src/data` contiene textos, proyectos y planes; `src/types` define sus contratos. `Project.visual` distingue mockup CSS e imagen real con texto alternativo y dimensiones. URL de proyecto opcional. Datos no importan componentes.
- **Presentación:** `src/sections` muestra cada bloque semántico. `Projects` reúne título, descripción, CTA y rail en un único `section#trabajos`; estilos locales definen encabezado y espaciado. Piezas compartidas viven en `src/components`.
- **Comportamiento:** `src/hooks` contiene IntersectionObserver, arrastre horizontal y bloqueo del scroll. `src/features/project-rail` renderiza los cuatro datos y concentra teclado, snap y arrastre; `src/features/plan-configurator` une UI y comportamiento del diálogo.
- **Tokens:** `src/app/styles/theme.ts` reúne paleta, fuentes, medidas base, radios, sombras, breakpoints, capas y movimiento. `styled.d.ts` tipa el tema.
- **Planes:** `src/data/plans.ts` contiene `plans` (alcances, límites, extras y precios por producto) y `planContent` (textos compartidos, proceso y formulario). Las cuatro tarjetas forman una grilla comparativa; los tres planes estándar ofrecen consulta de base o personalización. Debajo de las tarjetas, el bloque Proceso conserva su encabezado y sus cuatro pasos dentro de `section#planes`; no hay una nota de precios ni un panel de materiales entre ambos. El diálogo se remonta al cambiar de plan, aislando las selecciones de cada apertura. El primer formulario pide datos de contacto y alcance, sin materiales ni enlaces.
- **Envío del configurador:** `server/consultations` valida el JSON contra los datos comerciales compartidos, comprueba Turnstile, aplica límites atómicos en Upstash y solicita a Resend un correo de texto con plan base, opciones, extras y contacto. `functions/api/consultations.ts` es la entrada de Pages y `server/worker.ts` la de Workers con assets; ambas usan el mismo núcleo. `server/dev.ts` proporciona el adaptador HTTP local. Los secretos se reciben del entorno del servidor, sin importarlos en el cliente. `src/features/plan-configurator/submitConsultation.ts` transmite el borrador y conserva datos ante fallos; `Turnstile.tsx` solo recibe la site key pública. La configuración privada incompleta produce `503`, nunca éxito. Ver `docs/CONSULTATIONS.md`.

El flujo de dependencias va de `app` hacia secciones/features, y de éstas hacia componentes, hooks, datos y tipos. La referencia HTML se conserva fuera de `src` como documento de comparación.
