# Activación del correo del configurador

## Estado comprobado

El repositorio era una aplicación Vite estática, sin backend, secretos ni proveedor de correo. El responsable confirmó Cloudflare Pages o Workers; falta identificar cuál de los dos productos y su proyecto concreto. El proveedor de correo y el destinatario todavía no están definidos. No se cambió infraestructura externa ni se publicó código.

El núcleo de servidor está en `server/consultations/`. Se prepararon dos entradas del mismo endpoint `/api/consultations`: `functions/api/consultations.ts` para **Cloudflare Pages Functions** y `server/worker.ts` para **Cloudflare Workers con assets**. Comparten la validación de IP del edge en `server/cloudflare.ts`. El ejemplo `wrangler.example.jsonc` muestra cómo conectar el Worker y `dist`; no es configuración activa ni crea un proyecto. Usar solo la entrada correspondiente al proyecto existente.

El proveedor implementado es **Resend mediante su API HTTP**; no se creó una cuenta ni se confirmó que LinusTec disponga de ella. La protección distribuida usa **Upstash Redis REST** y Turnstile. No se agregaron dependencias.

## Datos y configuración que faltan

No hay valores reales configurados en esta copia. Copiar `.env.example` a `.env.local` sirve para desarrollo; en producción usar variables y secretos del hosting. Nunca usar `VITE_` para una clave privada.

| Variable                   | Ubicación              | Valor que debe aportar el responsable                                                           |
| -------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY`  | Pública, durante build | Site key del widget Turnstile autorizado para el dominio del sitio                              |
| `SITE_ORIGIN`              | Servidor               | Origen exacto, sin barra final; producción `https://linustec.dev` si ese es el dominio elegido  |
| `MAIL_PROVIDER`            | Servidor               | `resend` para el adaptador implementado                                                         |
| `RESEND_API_KEY`           | Secreto de servidor    | API key de envío, idealmente limitada al dominio remitente                                      |
| `MAIL_FROM`                | Servidor               | Una dirección simple del dominio verificado, sin nombre entre `< >`                             |
| `MAIL_TO`                  | Servidor               | Dirección real de LinusTec que recibirá las consultas; confirmar acceso al buzón                |
| `TURNSTILE_SECRET_KEY`     | Secreto de servidor    | Secret key correspondiente al widget público                                                    |
| `UPSTASH_REDIS_REST_URL`   | Servidor               | URL HTTPS de la base Upstash (`https://…upstash.io`)                                            |
| `UPSTASH_REDIS_REST_TOKEN` | Secreto de servidor    | Token con permisos para ejecutar el script `EVAL` y sus comandos `GET`, `INCR`, `EXPIRE`, `TTL` |
| `RATE_LIMIT_SECRET`        | Secreto de servidor    | Valor aleatorio de al menos 32 caracteres, usado para proteger el identificador de IP           |

Además falta confirmar **si el proyecto Cloudflare es Pages o Workers y su nombre**, elegir proveedor de correo, crear o confirmar la cuenta de Resend si se elige ese adaptador, el dominio/subdominio remitente y sus DNS verificados, el destinatario y una base Upstash. No hace falta que el destinatario pertenezca al dominio remitente. Sin dominio verificado, Resend limita los envíos de prueba al destinatario permitido por la cuenta; eso no habilita producción.

## Pasos para activar

1. Abrir el proyecto existente en Cloudflare y comprobar si es Pages o Workers. En **Pages**, mantener build `pnpm build`, salida `dist` y la carpeta raíz `functions`; publicar solo archivos estáticos mediante arrastre no incluye el endpoint. En **Workers**, integrar `main: server/worker.ts` y el binding `ASSETS` de `dist` con `run_worker_first: ["/api/*"]`, como muestra `wrangler.example.jsonc`, conservando el nombre y demás ajustes del Worker existente. No crear otro sitio ni migrar el hosting para esta tarea.
2. Crear o utilizar una cuenta Resend. Agregar el dominio o subdominio remitente; copiar **los registros DNS exactos que indique Resend**, sin inventarlos ni sustituir el SPF existente. Esperar verificación. Elegir `MAIL_FROM`, confirmar el buzón `MAIL_TO` y crear la API key de envío. Si se elige otro proveedor, falta implementar su adaptador; cambiar solo `MAIL_PROVIDER` lo bloqueará.
3. Crear un widget Turnstile y autorizar el hostname elegido. Configurar la site key pública en el build y la secret key en el servidor. La acción usada por el widget y validada por el servidor es `plan-inquiry`; el hostname validado debe coincidir exactamente con `SITE_ORIGIN`. Usar widgets/configuración separados para pruebas y producción.
4. Crear la base Upstash y obtener su URL REST y token. Generar `RATE_LIMIT_SECRET` con un generador criptográfico y guardarlo como secreto. No compartirlo por chat ni ponerlo en el repositorio.
5. Cargar las variables en el proyecto existente, separando preview de producción. Para un entorno preview autorizado, `SITE_ORIGIN` y los hostnames del widget deben corresponder a ese entorno. La site key pública necesita un nuevo build al cambiar; el destinatario y las claves privadas se leen del servidor.
6. Cuando el responsable decida publicar, comprobar una consulta desde el dominio real. Verificar la respuesta `200` con identificador, el registro del envío en Resend y la llegada al buzón (también spam). La aceptación del proveedor confirma que aceptó el envío, no que todos los servidores de destino lo hayan entregado en bandeja de entrada.
7. Probar rechazo de token, límite `429`, errores de formulario y credenciales inválidas en un entorno de prueba. Nunca provocar abuso ni cambiar secretos de producción para hacer estas pruebas.

## Desarrollo local

Se requiere Node.js 24 y PNPM. Configurar `.env.local` con `SITE_ORIGIN=http://127.0.0.1:5173` y las cuentas de prueba correspondientes. Ejecutar en terminales separadas:

```bash
pnpm dev:api
pnpm dev --host 127.0.0.1
```

Vite reenvía `/api` al servidor local en `127.0.0.1:8788`. El servidor toma la IP del socket, no de un header enviado por el cliente. Si faltan variables, responde `503` y no contacta al proveedor. Sin site key pública la interfaz deshabilita el envío y lo explica. Las claves privadas nunca se incluyen en el bundle.

## Comportamiento y límites

- Validación de servidor: estructura y longitudes de campos, correo/WhatsApp, plan existente, IDs de opciones y extras pertenecientes a ese plan y elección única institucional. Nombres, precios y destinatario nunca se aceptan desde el cliente como datos autoritativos. Se rechazan claves ajenas al contrato, incluidos `files` y `materialUrl`.
- Turnstile se valida con Siteverify, hostname y acción. Un token inválido, vencido o ya utilizado no permite enviar. No hay bypass de pruebas en producción.
- El script de Turnstile se carga recién al entrar en Resumen; los 30 segundos máximos de espera comienzan en ese momento, después de completar opciones y datos. `api.js?render=explicit` avisa que está listo mediante su callback `onload`, antes de renderizar el widget. Si falla la carga, retira ese script y permite reintentarlo; después de una carga exitosa reutiliza el script para nuevos widgets sin solicitarlo otra vez. El reintento automático del widget está desactivado: ante un error se limpia el token y la persona usa «Reintentar verificación»; al vencer el token se reinicia el widget. Cada intento de envío consume el token una sola vez, y el cliente lo descarta a los 4 minutos y 45 segundos, antes del límite de 5 minutos de Turnstile. La consola registra solo motivos fijos de fallo de carga o códigos de error del widget; Siteverify se diagnostica en el servidor con códigos saneados. Nunca se registran tokens ni secretos.
- Límite compartido y atómico: 5 intentos por IP en 15 minutos, incluidos los inválidos. El límite global de 60 intentos de envío por hora se consume **solo después de validar Turnstile**, para evitar que peticiones sin CAPTCHA lo agoten. Los contadores viven en Redis con caducidad; no dependen de la memoria de una instancia. Una caída de Redis bloquea el envío. Solo se conserva un HMAC de la IP, sin escribir datos de contacto en ese almacenamiento.
- Las entradas confían únicamente en `CF-Connecting-IP` dentro de Pages/Workers. No reutilizar esa confianza en un servidor genérico; el adaptador local usa la IP del socket.
- Origen exacto obligatorio, solo POST JSON y respuesta sin caché. Máximo 32 KiB de cuerpo JSON; no existe carga de archivos ni procesamiento Base64.
- La consulta inicial no solicita archivos ni enlaces de materiales. El servidor no visita ni descarga recursos externos. El material se pide después de verificar manualmente la acreditación de la seña, mediante un Google Form aparte.
- El correo es texto plano y el remitente/destinatario salen del servidor. Identifica el plan base, las opciones, los extras y los datos de contacto; el correo del cliente se usa como `Reply-To`. No lleva adjuntos.
- La interfaz conserva datos y extras ante errores. Durante el envío bloquea doble clic, volver y cierre del modal; la espera del cliente tiene un máximo de 35 segundos. Ante un fallo renueva Turnstile. No persiste el borrador al recargar o cerrar la página.
- Un timeout puede ocurrir después de que el proveedor aceptó un correo. Al reintentar sin editar, incluso volviendo al formulario, se reutilizan el identificador de consulta y la clave de idempotencia de Resend (24 horas). Cambiar el contenido genera otra clave; cerrar y reabrir el configurador inicia otra consulta.
- `200`: proveedor confirmó aceptación; `400`: datos/token rechazados; `403`: origen no autorizado; `413`: cuerpo excesivo; `415`: formato de petición; `429`: límite con `Retry-After`; `502`: envío sin confirmación; `503`: configuración incompleta o verificación/límite indisponibles. Nunca devolver al navegador secretos ni el cuerpo de error del proveedor.

## Validaciones y límites de esta entrega

Las pruebas automatizadas ejercitan el código real del servidor, con respuestas controladas de Turnstile, Redis y Resend: rechazo de campos de materiales ajenos al contrato, token inválido/vencido/repetido, hostname/acción incorrectos, datos manipulados, exceso de solicitudes, caída de servicios, error del proveedor, envío aceptado e idempotencia. Las pruebas de interfaz verifican confirmación posterior a la respuesta, doble envío y conservación del borrador.

En la fase inicial, lint, TypeScript, 59 tests y build fueron correctos. Pages Functions compiló con Wrangler 4.151.1; Pages y Workers con assets se ejecutaron en su emulador local, sirviendo la home con `200` y rechazando el API sin configuración con `503` JSON sin caché. Chromium comprobó el resumen y envío deshabilitado sin configuración a 1920×1080, 390×844 y 320×720, sin overflow. El bundle público no contiene identificadores privados ni los endpoints del proveedor. GPT-6.1 Sol, razonamiento alto, revisó solo lectura; se corrigió su hallazgo de disponibilidad moviendo el consumo del cupo global después de Turnstile válido y se añadió su prueba de regresión. Las validaciones actuales se anotan en `CODEX_HANDOFF.md`.

Sin cuentas, destinatario y secretos no se pudo comprobar un correo real ni la infraestructura distribuida real. Esas pruebas controladas no equivalen a un envío entregado. Se comprobó por HTTP que el servidor local sin configuración devuelve `503`, sin simular éxito. No hubo deploy ni push.

## Referencias oficiales

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Workers con assets y rutas de servidor](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Turnstile: validación de servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
- [Resend: enviar correo](https://resend.com/docs/api-reference/emails/send-email)
- [Resend: idempotencia](https://resend.com/docs/dashboard/emails/idempotency-keys)
