import type { MapPointKindDefinition } from '@/types/content'

export const mapPointKinds: MapPointKindDefinition[] = [
  {
    id: 'encuentro',
    label: 'Puntos de encuentro',
    description: 'Lugares seguros y abiertos donde nos reunimos en una emergencia.',
    icon: 'flag',
  },
  {
    id: 'ruta',
    label: 'Rutas de evacuación',
    description: 'Caminos recomendados para llegar a los puntos de encuentro.',
    icon: 'route',
  },
  {
    id: 'riesgo',
    label: 'Zonas de riesgo',
    description: 'Lugares donde hay que tener más cuidado o evitar en una emergencia.',
    icon: 'alert',
  },
]
