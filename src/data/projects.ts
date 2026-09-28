import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: 'montanita',
    name: 'Montañita',
    category: 'Gastronomía · pedidos',
    visual: {
      kind: 'css-mockup',
      title: ['MONTAÑITA', 'COCINA REAL.'],
      background:
        'linear-gradient(135deg, #f9e4c4 0%, #e5a576 52%, #bc6948 100%)',
      alt: 'Mockup provisional de Montañita con el título Cocina Real',
    },
  },
  {
    id: 'estudio-paz',
    name: 'Estudio Paz',
    category: 'Institucional · servicios',
    visual: {
      kind: 'css-mockup',
      title: ['PAZ', '& ASOC.'],
      background:
        'linear-gradient(135deg, #e5e8de 0%, #a8b1a8 54%, #63736d 100%)',
      alt: 'Mockup provisional de Estudio Paz con el título Paz y Asociados',
    },
  },
  {
    id: 'agrorepuestos',
    name: 'Agrorepuestos',
    category: 'Catálogo · repuestos',
    visual: {
      kind: 'css-mockup',
      title: ['AGRO', 'REPUESTOS'],
      background:
        'linear-gradient(135deg, #e0e6bb 0%, #91a66e 52%, #435a44 100%)',
      alt: 'Mockup provisional de Agrorepuestos con su nombre',
    },
  },
  {
    id: 'rhea',
    name: 'RHEA',
    category: 'Experiencia · reservas',
    visual: {
      kind: 'css-mockup',
      title: ['RHEA'],
      background:
        'linear-gradient(135deg, #dcebf3 0%, #94adc3 52%, #536987 100%)',
      alt: 'Mockup provisional de RHEA con su nombre',
    },
  },
]
