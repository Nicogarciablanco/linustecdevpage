# Arquitectura

`main.tsx` crea la raíz y aplica `ThemeProvider` y `GlobalStyles`. `App.tsx` compone la página, conserva el plan seleccionado y coordina el estado flotante del header. Ninguna sección necesita conocer infraestructura externa.

## Capas

- **Datos y tipos:** `src/data` contiene textos, proyectos, planes y pasos; `src/types` define sus contratos. `Project.visual` distingue mockup CSS e imagen real con texto alternativo y dimensiones. URL de proyecto opcional. Datos no importan componentes.
- **Presentación:** `src/sections` muestra cada bloque semántico. `Projects` reúne título, descripción, CTA y rail en un único `section#trabajos`; estilos locales definen encabezado y espaciado. Piezas compartidas viven en `src/components`.
- **Comportamiento:** `src/hooks` contiene IntersectionObserver, arrastre horizontal y bloqueo del scroll. `src/features/project-rail` renderiza los cuatro datos y concentra teclado, snap y arrastre; `src/features/plan-configurator` une UI y comportamiento del diálogo.
- **Tokens:** `src/app/styles/theme.ts` reúne paleta, fuentes, medidas base, radios, sombras, breakpoints, capas y movimiento. `styled.d.ts` tipa el tema.
- **Integraciones futuras:** no hay llamadas de red, formularios reales ni estado persistente. Un flujo de guardado o presupuesto puede añadirse al configurador sin cambiar tarjetas ni datos visuales.

El flujo de dependencias va de `app` hacia secciones/features, y de éstas hacia componentes, hooks, datos y tipos. La referencia HTML se conserva fuera de `src` como documento de comparación.
