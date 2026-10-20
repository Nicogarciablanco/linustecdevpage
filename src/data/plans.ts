import type { DomainStatus, Plan, Price } from '../types/plan'
import { consultationPolicy } from './consultationPolicy.ts'

// Textos compartidos de Planes y del configurador. Los alcances por producto están debajo.
export const planContent = {
  heading: 'Elegí un plan. Adaptalo a',
  headingAccent: 'tu negocio.',
  introduction:
    'Todo lo que incluye cada base, a la vista. Elegí tu plan, sumá los extras que necesitás y prepará la información de tu proyecto.',
  priceNote:
    'Vista de trabajo para definir los alcances. Los asteriscos representan precios todavía pendientes de definir.',
  disclosures: {
    included: 'Qué incluye',
    extras: 'Extras y funciones adicionales',
    material: 'Material que necesitamos de vos',
  },
  configure: 'Configurar plan',
  customConfigure: 'Contame tu idea',
  included: 'Incluido',
  includedOptions: 'Opciones de la solución base',
  includedOptionsNote: 'Estas opciones están incluidas en el precio base.',
  extrasHeading: '¿Querés sumar algo?',
  pendingPrice: 'AR$***',
  quotePrice: 'A cotizar',
  pendingPriceNote: 'Los importes están pendientes de definir.',
  startCondition:
    'El trabajo comienza con el material completo y la seña del 50% acreditada.',
  materialNote:
    'Vos aportás el logo, las fotos, los videos y demás materiales. LinusTec desarrolla la página; no diseña logos ni produce fotos o videos. Si falta algo, te lo pedimos por mensaje antes de iniciar.',
  standardNote:
    'Planes estándar por formulario y mensajes. Reuniones solo para proyectos a medida.',
  customNote: 'La reunión sirve para definir una propuesta propia.',
  reviewNote: 'Revisá los datos y el material antes de enviar tu consulta.',
  submission: {
    send: 'Enviar consulta',
    sending: 'Enviando consulta…',
    sent: 'Consulta enviada',
    success:
      'El servicio de correo aceptó el envío de tu consulta. Te responderemos por los datos de contacto que dejaste.',
    unavailable:
      'El envío todavía no está habilitado. Tus datos se conservan mientras mantengas abierto el configurador.',
    verificationError:
      'No pudimos completar la verificación de seguridad. Reintentá para poder enviar.',
    retryVerification: 'Reintentar verificación',
    errors: {
      unavailable:
        'El servicio de envío no está disponible. Conservamos tus datos; reintentá más tarde.',
      invalid_data:
        'Revisá los datos y el enlace a la carpeta de materiales antes de enviar.',
      invalid_token:
        'La verificación venció o no es válida. Completala de nuevo y reintentá.',
      too_large:
        'La solicitud supera el tamaño permitido. Acortá el mensaje o el enlace y reintentá.',
      rate_limited:
        'Se alcanzó el límite de consultas. Esperá antes de volver a intentar; tus datos se conservan.',
      mail_unconfirmed:
        'No pudimos confirmar el envío. Tus datos se conservan; reintentá con la misma consulta para evitar duplicados.',
      forbidden:
        'No se pudo validar el origen de la consulta. Abrí el sitio oficial y volvé a intentar.',
    },
  },
  selectionHeading: 'Tu selección',
  totalLabel: 'Total seleccionado',
  reviewHeading: 'Resumen de tu solicitud',
  materialUrlEmailNote: 'Enlace aportado por la persona; acceso no verificado.',
  steps: {
    options: 'Opciones y extras',
    details: 'Tu proyecto',
    customDetails: 'Tu idea y referencias',
    review: 'Resumen',
  },
  dialog: {
    options: 'Personalizá el alcance',
    details: 'Contanos tu proyecto',
    review: 'Revisá tu solicitud',
    close: 'Cerrar configurador',
    stepsLabel: 'Pasos de la solicitud',
    back: 'Volver',
    next: 'Completar solicitud',
    reviewNext: 'Ver resumen',
  },
  form: {
    name: {
      label: 'Tu nombre',
      placeholder: 'Nombre y apellido',
      error: 'Ingresá tu nombre.',
    },
    business: {
      label: 'Negocio o actividad',
      placeholder: 'Nombre de tu negocio',
      error: 'Ingresá tu negocio o actividad.',
    },
    email: {
      label: 'Correo electrónico',
      placeholder: 'hola@ejemplo.com',
      error: 'Ingresá un correo electrónico válido.',
    },
    phone: {
      label: 'WhatsApp',
      placeholder: 'Código de área y número',
      error: 'Ingresá un WhatsApp con código de área.',
    },
    message: {
      label: '¿Qué necesitás?',
      placeholder: 'Contanos qué querés mostrar o cómo funciona tu negocio.',
      error: 'Contanos brevemente qué necesitás.',
    },
    domainLabel: 'Dominio',
    materialUrl: {
      label: 'Enlace al material',
      help: 'Compartí una carpeta con el material disponible y asegurate de darnos acceso para ver los archivos.',
      error: `Ingresá el enlace a la carpeta: debe empezar con http:// o https:// y tener hasta ${consultationPolicy.maxMaterialUrlLength} caracteres.`,
    },
  },
  domainOptions: [
    { value: 'register', label: 'Necesito registrar un dominio' },
    { value: 'owned', label: 'Ya tengo un dominio' },
    { value: 'later', label: 'Lo voy a definir después' },
  ] satisfies { value: DomainStatus; label: string }[],
}

// Contenido comercial, límites y precios: editar aquí. 'pending' muestra AR$***.
export const plans: Plan[] = [
  {
    id: 'gastronomico',
    number: '01',
    label: 'Gastronómico',
    headline: 'Carta que también toma pedidos.',
    audience:
      'Para restaurantes, cafeterías y locales de comida que quieren mostrar su carta y recibir pedidos.',
    priceLabel: 'Plan gastronómico',
    choices: [
      {
        id: 'retiro',
        name: 'Retiro en el local',
      },
      {
        id: 'delivery',
        name: 'Delivery',
      },
    ],
    choiceMode: 'multiple',
    defaultChoices: ['retiro'],
    name: 'Plan gastronómico',
    summary:
      'Una carta propia para que tus clientes vean el menú, armen un pedido y lo envíen a tu WhatsApp.',
    inclusionLabel: 'Qué incluye de base',
    inclusions: [
      {
        title: 'Identidad de tu negocio',
        description:
          'Adaptamos la base de la solución con tu logo, colores, imágenes y datos.',
      },
      {
        title: 'Carga inicial del menú',
        description:
          'Dos categorías principales, por ejemplo comida y bebida; hasta ocho subcategorías a distribuir y 48 productos en total.',
      },
      {
        title: 'Información de los productos',
        description:
          'Cada producto puede tener nombre, descripción, precio y una imagen que nos proporciones.',
      },
      {
        title: 'Carta digital y acceso por QR',
        description:
          'El menú se consulta desde un enlace o un QR listo para compartir o imprimir.',
      },
      {
        title: 'Carrito y pedido por WhatsApp',
        description:
          'El cliente elige cantidades, agrega una observación general y envía el pedido ordenado al local.',
      },
      {
        title: 'Retiro y delivery simple',
        description:
          'Configuramos las modalidades que uses, los datos del cliente y las condiciones de envío acordadas.',
      },
      {
        title: 'Información y contacto',
        description:
          'Horarios, ubicación, redes y datos informativos para pagar por transferencia. El pago no se procesa en la web.',
      },
      {
        title: 'Revisión y publicación',
        description:
          'Funciona en celular y computadora. Incluye una ronda de ajustes dentro del alcance y la conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Panel para editar la carta, reservas de mesas, carga adicional y cambios posteriores. Pagos online, stock, caja y comandas requieren un alcance propio.',
    material: [
      'Logo, colores y datos del local.',
      'Menú legible con nombres, descripciones y precios.',
      'Fotos, horarios, WhatsApp y condiciones de retiro o envío.',
    ],
    price: {
      status: 'pending',
    },
    extras: [
      {
        id: 'products',
        name: 'Carga inicial adicional',
        description:
          'Productos o subcategorías por encima del límite incluido.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'panel',
        name: 'Panel para editar la carta',
        description:
          'Cambiar productos, precios, textos e imágenes por tu cuenta.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'tables',
        name: 'Reservas de mesas',
        description:
          'Disponibilidad por horario y cupos de personas, con panel para gestionar reservas. El local asigna las mesas.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'gallery',
        name: 'Galería de fotos',
        description:
          'Una sección adicional con imágenes de tu local o tus platos.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'updates',
        name: 'Cambios menores por LinusTec',
        description:
          'Un servicio posterior para actualizaciones pequeñas; la cantidad de cambios se define antes de contratar.',
        price: {
          status: 'pending',
        },
      },
    ],
  },
  {
    id: 'servicios',
    number: '02',
    label: 'Servicios y reservas',
    headline: 'Tus servicios. Su próximo turno.',
    audience:
      'Para masajes, estética y otros servicios que necesitan mostrar su oferta y organizar una agenda.',
    priceLabel: 'Plan de servicios y reservas',
    choices: [
      {
        id: 'catalogo',
        name: 'Mostrar productos relacionados',
      },
      {
        id: 'whatsapp',
        name: 'Consultas por WhatsApp',
      },
    ],
    choiceMode: 'multiple',
    defaultChoices: ['catalogo', 'whatsapp'],
    name: 'Servicios y reservas',
    summary:
      'Una página para mostrar tus servicios y productos relacionados, y permitir que tus clientes reserven un turno. El modelo se organiza alrededor de una agenda.',
    inclusionLabel: 'Qué incluye de base',
    inclusions: [
      {
        title: 'Identidad y presentación',
        description:
          'Tu logo, fotos, información del negocio, ubicación y formas de contacto.',
      },
      {
        title: 'Catálogo de servicios',
        description:
          'Mostramos los servicios, su descripción, duración y precio. El límite de la carga inicial está pendiente de definir en esta propuesta.',
      },
      {
        title: 'Productos relacionados',
        description:
          'Si vendés productos, pueden aparecer en un catálogo informativo con imagen, descripción, precio y consulta por WhatsApp. La cantidad inicial también queda por definir.',
      },
      {
        title: 'Una agenda de turnos',
        description:
          'Un profesional o recurso, con días de atención, horarios y duración de los turnos acordados.',
      },
      {
        title: 'Disponibilidad y reserva',
        description:
          'El cliente elige servicio, fecha y horario. Ve si hay disponibilidad y completa los datos para confirmar un turno.',
      },
      {
        title: 'Panel básico de reservas',
        description:
          'Consultar y cancelar turnos, bloquear horarios y gestionar la configuración prevista en la agenda. Está incluido.',
      },
      {
        title: 'Adaptación y entrega',
        description:
          'Celular y computadora, una ronda de ajustes dentro del alcance, publicación y conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Panel para editar el catálogo, carga adicional, más profesionales o recursos, cobros y recordatorios. El catálogo de productos no incluye tienda, stock ni pagos online. Reservas de hotel necesitan otro modelo.',
    material: [
      'Logo, imágenes y datos del negocio.',
      'Listado de servicios, duración y precios; productos si corresponde.',
      'Horarios, días de atención y reglas de reserva.',
    ],
    price: {
      status: 'pending',
    },
    extras: [
      {
        id: 'catalogpanel',
        name: 'Panel para editar servicios y productos',
        description:
          'Actualizar el contenido del catálogo por tu cuenta; distinto del panel básico de reservas incluido.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'products',
        name: 'Carga inicial adicional',
        description:
          'Más servicios o productos que los que se acuerden para la base.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'gallery',
        name: 'Galería de fotos',
        description: 'Mostrá el espacio y los servicios.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'updates',
        name: 'Cambios menores por LinusTec',
        description:
          'Actualizaciones posteriores del contenido; cantidad y frecuencia acordadas.',
        price: {
          status: 'pending',
        },
      },
    ],
  },
  {
    id: 'institucional',
    number: '03',
    label: 'Presentación institucional',
    headline: 'Una presencia que da confianza.',
    audience:
      'Para profesionales, estudios y negocios que quieren mostrar lo que hacen.',
    priceLabel: 'Un plan, un precio',
    choices: [
      {
        id: 'onepage',
        name: 'Una página con secciones',
      },
      {
        id: 'multipage',
        name: 'Páginas separadas, hasta cuatro',
      },
    ],
    choiceMode: 'single',
    defaultChoices: ['onepage'],
    name: 'Presentación institucional',
    summary:
      'Un único plan para profesionales, estudios, portfolios, negocios e instituciones. La información puede organizarse en una página con secciones o en hasta cuatro páginas, con el mismo precio base.',
    inclusionLabel: 'Qué incluye de base',
    inclusions: [
      {
        title: 'Identidad del negocio',
        description:
          'Adaptación de la base visual con tu logo, colores y material.',
      },
      {
        title: 'Estructura de presentación',
        description:
          'Una página con hasta cinco secciones o hasta cuatro páginas separadas. La estructura se acuerda según el contenido, dentro de un mismo plan y precio base.',
      },
      {
        title: 'Contenido organizado',
        description:
          'Distribuimos los textos e imágenes que nos envíes en las páginas acordadas.',
      },
      {
        title: 'Navegación y contacto',
        description: 'Menú entre páginas y enlaces a WhatsApp, correo y redes.',
      },
      {
        title: 'Adaptación y buscadores',
        description:
          'Versiones para celular y computadora, más título y descripción para las páginas principales.',
      },
      {
        title: 'Revisión y publicación',
        description:
          'Una ronda de ajustes dentro del alcance, publicación y conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Contenido por encima del alcance, páginas adicionales, redacción, galerías, formularios y panel para editar información. Pedidos, reservas y pagos se definen en las soluciones correspondientes.',
    material: [
      'Logo e identidad visual.',
      'Textos de cada página y servicios.',
      'Equipo, imágenes y datos de contacto si corresponde.',
    ],
    price: {
      status: 'pending',
    },
    extras: [
      {
        id: 'page',
        name: 'Página adicional',
        description:
          'Contenido adicional fuera de las cuatro páginas de la base.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'gallery',
        name: 'Galería de trabajos o fotos',
        description: 'Hasta 12 imágenes provistas por el cliente.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'copy',
        name: 'Ayuda con la redacción',
        description: 'A partir de la información real de tu negocio.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'contactform',
        name: 'Formulario de consultas',
        description: 'Con los campos y el correo de recepción acordados.',
        price: {
          status: 'pending',
        },
      },
      {
        id: 'panel',
        name: 'Panel para actualizar contenido',
        description:
          'Editar textos e imágenes en las páginas y espacios definidos.',
        price: {
          status: 'pending',
        },
      },
    ],
  },
  {
    id: 'medida',
    number: '04',
    label: 'A medida',
    headline: 'Cuando tu idea necesita otra lógica.',
    audience:
      'Para funciones, flujos e integraciones que necesitan una propuesta propia.',
    priceLabel: 'Según el alcance',
    choices: [],
    choiceMode: 'multiple',
    defaultChoices: [],
    name: 'Proyecto a medida',
    summary:
      'Este camino sirve cuando hay funciones particulares o todavía necesitamos definir qué solución encaja con tu idea.',
    inclusionLabel: 'Cómo lo trabajamos',
    inclusions: [
      {
        title: 'Nos contás la idea',
        description:
          'Completás la consulta con tu objetivo y las referencias que tengas.',
      },
      {
        title: 'Reunión de definición',
        description:
          'Conversamos sobre cómo trabaja el negocio y qué necesita resolver.',
      },
      {
        title: 'Propuesta escrita',
        description:
          'Recibís el alcance, las funciones, los tiempos, las revisiones y el presupuesto antes de iniciar.',
      },
      {
        title: 'Material y comienzo',
        description:
          'Acordamos los contenidos y accesos necesarios. El desarrollo comienza con material completo y seña acreditada.',
      },
      {
        title: 'Desarrollo y revisión',
        description:
          'Implementamos la propuesta y revisamos los avances según las etapas acordadas.',
      },
      {
        title: 'Publicación y entrega',
        description:
          'Entregamos lo definido en la propuesta, después de la aprobación y del saldo.',
      },
    ],
    boundaryLabel: 'Alcance por definir en la propuesta',
    boundary:
      'La reunión define qué se incluye. No tiene un paquete de funciones cerrado ni extras automáticos; todo queda escrito en la propuesta.',
    material: [
      'Objetivo del proyecto y cómo funciona tu negocio.',
      'Referencias, diseños o archivos disponibles.',
      'Funciones importantes y restricciones que conozcas.',
    ],
    price: {
      status: 'quote',
    },
    extras: [],
  },
]

export function formatPrice(price: Price): string {
  if (price.status === 'quote') return planContent.quotePrice
  if (price.status === 'pending') return planContent.pendingPrice
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export function totalPrice(prices: Price[]): Price {
  if (prices.some((price) => price.status === 'quote'))
    return { status: 'quote' }
  if (prices.some((price) => price.status === 'pending'))
    return { status: 'pending' }
  return {
    status: 'defined',
    amount: prices.reduce(
      (sum, price) => sum + (price.status === 'defined' ? price.amount : 0),
      0,
    ),
  }
}
