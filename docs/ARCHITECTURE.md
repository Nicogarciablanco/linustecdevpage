# Arquitectura

`main.tsx` crea la raíz y aplica `ThemeProvider` y `GlobalStyles`. `App.tsx` compone la página, conserva el plan seleccionado y coordina el estado flotante del header. Ninguna sección necesita conocer infraestructura externa.

## Capas

- **Datos y tipos:** `src/data` contiene textos, proyectos y planes; `src/types` define sus contratos. `Project.visual` distingue mockup CSS e imagen real con texto alternativo y dimensiones. URL de proyecto opcional. Datos no importan componentes.
- **Presentación:** `src/sections` muestra cada bloque semántico. `Projects` reúne título, descripción, CTA y rail en un único `section#trabajos`; estilos locales definen encabezado y espaciado. Piezas compartidas viven en `src/components`.
- **Comportamiento:** `src/hooks` contiene IntersectionObserver, arrastre horizontal y bloqueo del scroll. `src/features/project-rail` renderiza los cuatro datos y concentra teclado, snap y arrastre; `src/features/plan-configurator` une UI y comportamiento del diálogo.
- **Tokens:** `src/app/styles/theme.ts` reúne paleta, fuentes, medidas base, radios, sombras, breakpoints, capas y movimiento. `styled.d.ts` tipa el tema.
- **Planes:** `src/data/plans.ts` contiene alcances, límites, extras, precios y textos compartidos. Las cuatro tarjetas muestran el alcance base; cada una enlaza a `/planes/:id`, que reutiliza esos datos. Los tres planes con precio ofrecen solo «Comprar ahora» y permiten sumar extras dentro del configurador; A medida pide descripción y se cotiza. Proceso resume el recorrido en tres etapas dentro de `section#planes`. El diálogo se remonta al cambiar de plan para no trasladar extras incompatibles.
- **Presupuesto y envío:** `src/data/plans.ts` comparte precios, cupones y la cuenta del total y la seña del 50 % entre cliente y servidor. El configurador calcula en el navegador sin llamar a una API; «Aplicar» consulta la lista local de cupones, que incluye el código público de prueba `Montañita Linus Tec` con 20 % de descuento. `/api/consultations` vuelve a validar selección, cupón y comprobante PDF/PNG/JPEG de hasta 2 MB, comprueba Turnstile, aplica límites atómicos en Upstash y solicita a Resend un correo de texto con el comprobante adjunto. Pages, Workers con assets y el adaptador local comparten el núcleo de envío. Los secretos proceden del entorno del servidor; el alias y la site key de Turnstile son públicos. Sin configuración completa no se confirma éxito. Ver `docs/CONSULTATIONS.md`.

El flujo de dependencias va de `app` hacia secciones/features, y de éstas hacia componentes, hooks, datos y tipos. La referencia HTML se conserva fuera de `src` como documento de comparación.
