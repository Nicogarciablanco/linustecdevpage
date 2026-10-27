import type { DomainStatus, Plan, PlanExtra, Price } from '../types/plan'

// Textos compartidos de Planes y del configurador. Los alcances por producto están debajo.
export const planContent = {
  heading: 'Elegí un plan',
  headingSecondLine: 'Adaptalo a',
  headingAccent: 'tu negocio.',
  introduction:
    'Compará qué incluye cada plan y sumá solo los extras que necesita tu proyecto.',
  baseAction: 'Comprar ahora',
  customAction: 'Consultar proyecto',
  detailAction: '¿Querés saber más?',
  detailBack: 'Volver a Planes',
  detailScope: 'Alcance y límites',
  extrasPrompt: '¿Te faltó sumar algún extra?',
  extrasPromptCopy:
    'Podés revisar los adicionales disponibles antes de completar la solicitud.',
  addExtras: 'Agregar extras',
  skipExtras: 'Seguir sin extras',
  processHeading: 'Claro desde el primer',
  processHeadingAccent: 'paso.',
  processIntroduction:
    'Tres etapas claras, desde la elección del plan hasta el comienzo del trabajo.',
  processSteps: [
    {
      number: '01',
      title: 'Elegís y revisás',
      copy: 'Seleccionás un plan y sus extras. Antes de avanzar, ves el alcance, el total y la seña del 50 %.',
    },
    {
      number: '02',
      title: 'Transferís y verificamos',
      copy: 'Transferís la seña y enviás el comprobante. LinusTec verifica el pago manualmente y te contacta.',
    },
    {
      number: '03',
      title: 'Preparamos el inicio',
      copy: 'Con el pago verificado, te pedimos los materiales y empezamos el desarrollo según el alcance acordado.',
    },
  ],
  included: 'Incluido',
  extrasLabel: 'Extras',
  noExtras: 'Sin extras',
  includedOptions: 'Opciones de la solución base',
  includedOptionsNote: 'Estas opciones están incluidas en el precio base.',
  extrasHeading: '¿Querés sumar algo?',
  quotePrice: 'A cotizar',
  startCondition:
    'El trabajo comienza después de confirmar el alcance, verificar manualmente la seña y recibir los materiales acordados.',
  standardNote:
    'Planes estándar por formulario y mensajes. Reuniones solo para proyectos a medida.',
  customNote: 'La reunión sirve para definir una propuesta propia.',
  reviewNote:
    'Revisá el plan, los extras y tus datos antes de enviar la consulta.',
  submission: {
    send: 'Enviar solicitud y comprobante',
    customSend: 'Enviar consulta',
    sending: 'Enviando solicitud…',
    sent: 'Solicitud recibida',
    customSent: 'Consulta enviada',
    success:
      'Recibimos tu solicitud y comprobante. El pago está pendiente de verificación manual. Te contactaremos por correo o WhatsApp después de comprobar la transferencia.',
    customSuccess:
      'Recibimos tu consulta para cotizar. Te contactaremos por correo o WhatsApp; todavía no hay precio ni seña definidos.',
    unavailable:
      'El envío todavía no está habilitado. Tus datos se conservan mientras mantengas abierto el configurador.',
    verificationError:
      'No pudimos completar la verificación de seguridad. Reintentá para poder enviar.',
    retryVerification: 'Reintentar verificación',
    errors: {
      unavailable:
        'El servicio de envío no está disponible. Conservamos tus datos; reintentá más tarde.',
      invalid_data:
        'Revisá tus datos, el comprobante y las opciones del plan antes de enviar.',
      invalid_coupon:
        'El cupón no es válido para esta selección. Revisalo o quitá el código.',
      invalid_receipt:
        'El comprobante debe ser PDF, PNG o JPG y pesar como máximo 2 MB.',
      invalid_token:
        'La verificación venció o no es válida. Completala de nuevo y reintentá.',
      too_large:
        'La solicitud supera el tamaño permitido. Acortá el mensaje y reintentá.',
      rate_limited:
        'Se alcanzó el límite de consultas. Esperá antes de volver a intentar; tus datos se conservan.',
      mail_unconfirmed:
        'No pudimos confirmar el envío. Tus datos se conservan; reintentá con la misma consulta para evitar duplicados.',
      forbidden:
        'No se pudo validar el origen de la consulta. Abrí el sitio oficial y volvé a intentar.',
    },
  },
  selectionHeading: 'Tu selección',
  subtotalLabel: 'Subtotal',
  discountLabel: 'Descuento',
  totalLabel: 'Precio total del proyecto',
  depositLabel: 'Seña del 50 % :',
  depositNote: 'La seña forma parte del total; no se suma aparte.',
  paymentHeading: 'Transferencia para la seña',
  paymentAlias: 'nicojngbmp',
  paymentNote:
    'El envío del comprobante no acredita el pago. LinusTec lo verificará manualmente.',
  paymentReviewStatus: 'Pago: pendiente de verificación manual',
  materialsAfterPayment:
    'Después de verificar la seña, LinusTec enviará un Google Form para textos, logo, fotos, videos y enlaces.',
  couponLabel: 'Cupón de descuento',
  couponApply: 'Aplicar',
  couponInvalid: 'El cupón no es válido o no está disponible para este plan.',
  reviewHeading: 'Resumen de tu solicitud',
  steps: {
    options: 'Opciones y extras',
    quote: 'Precio y seña',
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
    receipt: {
      label: 'Comprobante de la transferencia',
      help: 'Adjuntá un PDF, PNG o JPG de hasta 2 MB. No envíes otros materiales todavía.',
      error: 'Adjuntá un comprobante PDF, PNG o JPG de hasta 2 MB.',
    },
  },
  domainOptions: [
    { value: 'register', label: 'Necesito registrar un dominio' },
    { value: 'owned', label: 'Ya tengo un dominio' },
    { value: 'later', label: 'Lo voy a definir después' },
  ] satisfies { value: DomainStatus; label: string }[],
}

// Extras comunes: importes de desarrollo por única vez. Editar precios aquí.
const commonExtras: PlanExtra[] = [
  {
    id: 'section',
    name: 'Sección adicional',
    description:
      'Una sección nueva de contenido dentro de una página existente.',
    price: { status: 'defined', amount: 60000 },
  },
  {
    id: 'page',
    name: 'Página adicional',
    description:
      'Una página de contenido con hasta tres secciones. Las secciones extra se cobran por separado.',
    price: { status: 'defined', amount: 120000 },
  },
  {
    id: 'webpayment',
    name: 'Cobro electrónico en la web de tu negocio',
    description:
      'Un proveedor, cobros únicos y confirmación en servidor. Comisiones del proveedor aparte. No es el pago de la seña a LinusTec.',
    price: { status: 'defined', amount: 100000 },
  },
]
const panelPrices = { simple: 100000, photos: 150000 }
const panelExtras = (id = 'panel'): PlanExtra[] => [
  {
    id,
    name: 'Panel autoadministrable sin carga de fotos',
    description:
      'Actualizás textos y datos del contenido acordado. No incluye subir imágenes.',
    price: { status: 'defined', amount: panelPrices.simple },
    group: 'panel',
  },
  {
    id: 'panelphotos',
    name: 'Panel autoadministrable con carga de fotos',
    description: `Incluye el panel anterior y la carga de fotos. Precio total de esta variante; diferencia de ${formatPrice({ status: 'defined', amount: panelPrices.photos - panelPrices.simple })}.`,
    price: { status: 'defined', amount: panelPrices.photos },
    group: 'panel',
  },
]

// Contenido comercial, límites y precios: editar aquí.
export const plans: Plan[] = [
  {
    id: 'gastronomico',
    number: '01',
    label: 'Gastronómico',
    headline: 'Carta que también toma pedidos.',
    audience:
      'Para restaurantes, cafeterías y locales de comida que quieren mostrar su carta y recibir pedidos.',
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
        title: 'Diseño adaptado a tu marca',
        description:
          'Adaptamos la base de la solución con tu logo, colores, imágenes y datos.',
      },
      {
        title: 'Menú: 2 categorías, hasta 8 subcategorías y 48 productos',
        description:
          'Dos categorías principales, por ejemplo comida y bebida; hasta ocho subcategorías a distribuir y 48 productos en total.',
      },
      {
        title: 'Nombre, descripción, precio e imagen por producto',
        description:
          'Cada producto puede tener nombre, descripción, precio y una imagen que nos proporciones.',
      },
      {
        title: 'Carta digital y QR para compartir',
        description:
          'El menú se consulta desde un enlace o un QR listo para compartir o imprimir.',
      },
      {
        title: 'Carrito y pedido ordenado por WhatsApp',
        description:
          'El cliente elige cantidades, agrega una observación general y envía el pedido ordenado al local.',
      },
      {
        title: 'Retiro y delivery simple',
        description:
          'Configuramos las modalidades que uses, los datos del cliente y las condiciones de envío acordadas.',
      },
      {
        title: 'Contacto y datos de transferencia',
        description:
          'Horarios, ubicación, redes y datos informativos para pagar por transferencia. El pago no se procesa en la web.',
      },
      {
        title: 'Adaptación mobile, una revisión y publicación',
        description:
          'Funciona en celular y computadora. Incluye una ronda de ajustes dentro del alcance y la conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Carga adicional y cambios posteriores se acuerdan aparte. Stock, caja y comandas requieren un alcance propio.',
    material: [
      'Logo, colores y datos del local.',
      'Menú legible con nombres, descripciones y precios.',
      'Fotos, horarios, WhatsApp y condiciones de retiro o envío.',
    ],
    price: {
      status: 'defined',
      amount: 220000,
    },
    extras: [
      ...commonExtras,
      ...panelExtras(),
      {
        id: 'deliverycalc',
        name: 'Cálculo automático de delivery',
        description:
          'Reglas de cálculo acordadas para zonas o recorridos. Un servicio externo de rutas, si hace falta, se paga aparte y no se promete gratuito.',
        price: { status: 'defined', amount: 50000 },
      },
      {
        id: 'tables',
        name: 'Reservas de mesas',
        description:
          'Desarrollamos la reserva por fecha, horario y cantidad de personas, con control de capacidad, disponibilidad y duplicados en servidor. Un salón y horarios configurados. Plano informativo sin elegir mesa.',
        price: { status: 'defined', amount: 160000 },
        group: 'tables',
      },
      {
        id: 'tableselection',
        name: 'Reservas con elección de mesa',
        description:
          'Desarrollamos la reserva anterior y la selección de una mesa disponible en plano. Un salón, mesas identificadas con capacidad y horarios configurados. Combinaciones y múltiples salones van a medida.',
        price: { status: 'defined', amount: 260000 },
        group: 'tables',
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
      'Presentá tus servicios y, por separado, ofrecé turnos con una agenda básica para un profesional o recurso.',
    inclusionLabel: 'Qué incluye de base',
    inclusions: [
      {
        title: 'Presentación con tu marca y datos de contacto',
        description:
          'Tu logo, fotos, información del negocio, ubicación y formas de contacto.',
      },
      {
        title: 'Catálogo de servicios; cantidad inicial a definir',
        description:
          'Mostramos los servicios, su descripción, duración y precio. El límite de la carga inicial está pendiente de definir en esta propuesta.',
      },
      {
        title: 'Catálogo informativo de productos, si corresponde',
        description:
          'Si vendés productos, pueden aparecer en un catálogo informativo con imagen, descripción, precio y consulta por WhatsApp. La cantidad inicial también queda por definir.',
      },
      {
        title: 'Agenda para un profesional o recurso',
        description:
          'Un profesional o recurso, con días de atención, horarios y duración de los turnos acordados.',
      },
      {
        title: 'Disponibilidad y reserva de turnos',
        description:
          'El cliente elige servicio, fecha y horario dentro de una ventana limitada de reserva. El servidor comprueba disponibilidad y evita turnos duplicados.',
      },
      {
        title: 'Panel básico para gestionar reservas',
        description:
          'Consultar y cancelar turnos, bloquear horarios y gestionar la configuración prevista en la agenda. Está incluido.',
      },
      {
        title: 'Adaptación mobile, una revisión y publicación',
        description:
          'Celular y computadora, una ronda de ajustes dentro del alcance, publicación y conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Panel avanzado, carga adicional, más profesionales, pagos de turnos y recordatorios se acuerdan aparte. El catálogo informativo no incluye tienda ni stock.',
    material: [
      'Logo, imágenes y datos del negocio.',
      'Listado de servicios, duración y precios; productos si corresponde.',
      'Horarios, días de atención y reglas de reserva.',
    ],
    price: {
      status: 'defined',
      amount: 300000,
    },
    extras: [...commonExtras, ...panelExtras('catalogpanel')],
  },
  {
    id: 'institucional',
    number: '03',
    label: 'Presentación institucional',
    headline: 'Una presencia que da confianza.',
    audience:
      'Para profesionales, estudios y negocios que quieren mostrar lo que hacen.',
    choices: [
      {
        id: 'onepage',
        name: 'Una página con secciones',
      },
    ],
    choiceMode: 'single',
    defaultChoices: ['onepage'],
    name: 'Presentación institucional',
    summary:
      'Una página institucional con hasta cinco secciones para presentar el trabajo, el equipo y las formas de contacto.',
    inclusionLabel: 'Qué incluye de base',
    inclusions: [
      {
        title: 'Diseño adaptado a tu marca',
        description:
          'Adaptación de la base visual con tu logo, colores y material.',
      },
      {
        title: 'Una página con hasta 5 secciones',
        description:
          'Organizamos hasta cinco secciones en una sola página. Cada página o sección adicional se suma como extra.',
      },
      {
        title: 'Textos e imágenes organizados',
        description:
          'Distribuimos los textos e imágenes que nos envíes en las páginas acordadas.',
      },
      {
        title: 'Navegación y enlaces de contacto',
        description: 'Menú entre páginas y enlaces a WhatsApp, correo y redes.',
      },
      {
        title: 'Diseño mobile y datos básicos para buscadores',
        description:
          'Versiones para celular y computadora, más título y descripción para las páginas principales.',
      },
      {
        title: 'Una revisión y publicación',
        description:
          'Una ronda de ajustes dentro del alcance, publicación y conexión del dominio que registres.',
      },
    ],
    boundaryLabel: 'Se solicita aparte',
    boundary:
      'Las páginas y secciones adicionales se cobran por separado. Redacción, galerías y formularios se cotizan aparte. Pedidos y reservas requieren otro alcance.',
    material: [
      'Logo e imágenes existentes.',
      'Textos de cada página y servicios.',
      'Equipo, imágenes y datos de contacto si corresponde.',
    ],
    price: {
      status: 'defined',
      amount: 180000,
    },
    extras: [...commonExtras, ...panelExtras()],
  },
  {
    id: 'medida',
    number: '04',
    label: 'A medida',
    headline: 'Cuando tu idea necesita otra lógica.',
    audience:
      'Para funciones, flujos e integraciones que necesitan una propuesta propia.',
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
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export function totalPrice(prices: Price[]): Price {
  if (prices.some((price) => price.status === 'quote'))
    return { status: 'quote' }
  return {
    status: 'defined',
    amount: prices.reduce(
      (sum, price) => sum + (price.status === 'defined' ? price.amount : 0),
      0,
    ),
  }
}

export function calculateBudget(
  plan: Plan,
  selectedExtraIds: string[],
  discount = 0,
) {
  const extras = plan.extras.filter((extra) =>
    selectedExtraIds.includes(extra.id),
  )
  const subtotal = totalPrice([
    plan.price,
    ...extras.map((extra) => extra.price),
  ])
  if (subtotal.status !== 'defined') return null
  const appliedDiscount = Math.min(
    Math.max(0, Math.round(discount)),
    subtotal.amount,
  )
  const total = subtotal.amount - appliedDiscount
  return {
    subtotal: subtotal.amount,
    discount: appliedDiscount,
    total,
    deposit: Math.ceil(total / 2),
  }
}

// Los cupones son públicos y se aplican localmente; editar aquí.
export const coupons: {
  code: string
  type: 'percent' | 'fixed'
  value: number
}[] = [{ code: 'Montañita Linus Tec', type: 'percent', value: 20 }]

function normalizeCouponCode(code: string) {
  return code
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleUpperCase('es-AR')
}

export function calculateBudgetWithCoupon(
  plan: Plan,
  selectedExtraIds: string[],
  couponCode?: string,
) {
  const base = calculateBudget(plan, selectedExtraIds)
  if (!base || !couponCode) return base
  const normalizedCode = normalizeCouponCode(couponCode)
  const coupon = coupons.find(
    (item) => normalizeCouponCode(item.code) === normalizedCode,
  )
  if (!coupon || !Number.isInteger(coupon.value) || coupon.value <= 0)
    return null
  const discount =
    coupon.type === 'percent'
      ? Math.round((base.subtotal * Math.min(coupon.value, 100)) / 100)
      : coupon.value
  return calculateBudget(plan, selectedExtraIds, discount)
}
