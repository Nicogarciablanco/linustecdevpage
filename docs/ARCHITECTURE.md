# Arquitectura

`main.tsx` crea la raíz y aplica `ThemeProvider` y `GlobalStyles`. `App.tsx` compone la página, conserva el plan seleccionado y coordina el estado flotante del header. Ninguna sección necesita conocer infraestructura externa.

## Capas

- **Datos y tipos:** `src/data` contiene textos, proyectos, planes y pasos; `src/types` define sus contratos. `Project.visual` distingue mockup CSS e imagen real con texto alternativo y dimensiones. URL de proyecto opcional. Datos no importan componentes.
- **Presentación:** `src/sections` muestra cada bloque semántico. `Projects` reúne título, descripción, CTA y rail en un único `section#trabajos`; estilos locales definen encabezado y espaciado. Piezas compartidas viven en `src/components`.
- **Comportamiento:** `src/hooks` contiene IntersectionObserver, arrastre horizontal y bloqueo del scroll. `src/features/project-rail` renderiza los cuatro datos y concentra teclado, snap y arrastre; `src/features/plan-configurator` une UI y comportamiento del diálogo.
- **Tokens:** `src/app/styles/theme.ts` reúne paleta, fuentes, medidas base, radios, sombras, breakpoints, capas y movimiento. `styled.d.ts` tipa el tema.
- **Planes:** `src/data/plans.ts` contiene `plans` (alcances por producto) y `planContent` (textos compartidos y opciones del formulario); `src/data/consultationPolicy.ts` comparte el límite de longitud y la validación del enlace con el servidor. Tarjetas, opciones y resumen reutilizan esos datos. El enlace HTTP(S) a la carpeta es obligatorio en todos los planes, se trata como texto no confiable y nunca se descarga. Los desplegables nativos conservan estado independiente y el diálogo se remonta por identificador al cambiar de plan, aislando las selecciones de cada apertura.
- **Envío del configurador:** `server/consultations` valida el JSON contra los datos comerciales compartidos, comprueba Turnstile, aplica límites atómicos en Upstash y solicita a Resend un correo de texto con el enlace. `functions/api/consultations.ts` es la entrada de Pages y `server/worker.ts` la de Workers con assets; ambas usan el mismo núcleo. `server/dev.ts` proporciona el adaptador HTTP local. Los secretos se reciben del entorno del servidor, sin importarlos en el cliente. `src/features/plan-configurator/submitConsultation.ts` transmite el borrador y conserva datos ante fallos; `Turnstile.tsx` solo recibe la site key pública. Proveedor y destinatario no están definidos todavía: configuración incompleta produce `503`, nunca éxito. Ver `docs/CONSULTATIONS.md`.

El flujo de dependencias va de `app` hacia secciones/features, y de éstas hacia componentes, hooks, datos y tipos. La referencia HTML se conserva fuera de `src` como documento de comparación.
