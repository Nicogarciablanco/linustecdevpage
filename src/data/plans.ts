import type { Plan } from '../types/plan'

export const plans: Plan[] = [
  {
    id: 'gastronomica',
    number: '01',
    label: 'PLAN GASTRONÓMICO',
    headline: 'Carta que también toma pedidos.',
    audience:
      'Para restaurantes, cafeterías, rotiserías y marcas gastronómicas.',
    features: [
      'Carta digital por categorías',
      'Carrito y pedido por WhatsApp',
      'Retiro, delivery o ambos',
    ],
    title: 'Plan gastronómico',
    copy: 'Partí de una carta digital clara y elegí los agregados que mejor se adapten a tu local.',
    featured: true,
    options: [
      {
        name: 'Carta QR',
        description: 'Compartí el menú desde mesas, redes y Google.',
      },
      {
        name: 'Pedidos por WhatsApp',
        description: 'El cliente arma su pedido y lo envía ordenado.',
      },
      {
        name: 'Retiro o delivery',
        description: 'Definí cómo recibe el pedido cada cliente.',
      },
      {
        name: 'Carga adicional de productos',
        description: 'Sumá más categorías o productos al alcance inicial.',
      },
      {
        name: 'Conexión de dominio',
        description: 'Usá una dirección propia para tu negocio.',
      },
      {
        name: 'Hosting',
        description: 'Dejá resuelto el alojamiento del sitio.',
      },
    ],
  },
  {
    id: 'institucional',
    number: '02',
    label: 'PLAN INSTITUCIONAL',
    headline: 'Una presencia que da confianza.',
    audience:
      'Para profesionales, estudios, comercios y negocios de servicios.',
    features: [
      'Servicios y presentación',
      'Contacto, WhatsApp y redes',
      'Secciones y extras elegibles',
    ],
    title: 'Plan institucional',
    copy: 'Empezá con una presencia profesional y seleccioná las secciones que ayuden a convertir visitas en consultas.',
    options: [
      {
        name: 'Página adicional',
        description: 'Sumá una sección de servicios, equipo o nosotros.',
      },
      {
        name: 'Galería de trabajos',
        description: 'Mostrá proyectos, casos o imágenes destacadas.',
      },
      {
        name: 'Formulario de consulta',
        description: 'Ordená los mensajes que llegan desde el sitio.',
      },
      {
        name: 'Turnos o reservas',
        description: 'Permití que las personas consulten disponibilidad.',
      },
      {
        name: 'Conexión de dominio',
        description: 'Usá una dirección propia para tu negocio.',
      },
      {
        name: 'Hosting',
        description: 'Dejá resuelto el alojamiento del sitio.',
      },
    ],
  },
  {
    id: 'personalizado',
    number: '03',
    label: 'PLAN A MEDIDA',
    headline: 'Cuando tu idea necesita otra lógica.',
    audience:
      'Para flujos, funciones o integraciones que no entran en una solución cerrada.',
    features: [
      'Reunión de definición',
      'Alcance y propuesta propios',
      'Presupuesto personalizado',
    ],
    title: 'Plan a medida',
    copy: 'Elegí las funciones que imaginás para tu proyecto. Esta base sirve para preparar una propuesta personalizada.',
    options: [
      {
        name: 'Reservas o turnos',
        description: 'Coordiná disponibilidad desde el sitio.',
      },
      {
        name: 'Panel para editar contenido',
        description: 'Actualizá información sin depender de cambios manuales.',
      },
      {
        name: 'Pagos o integraciones',
        description: 'Conectá servicios externos según el caso.',
      },
      {
        name: 'Segundo idioma',
        description: 'Prepará el sitio para otra audiencia.',
      },
      {
        name: 'Conexión de dominio',
        description: 'Usá una dirección propia para tu negocio.',
      },
      {
        name: 'Hosting',
        description: 'Dejá resuelto el alojamiento del sitio.',
      },
    ],
  },
]
