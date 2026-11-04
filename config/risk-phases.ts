import type { RiskPhaseDefinition } from '@/types/content'

export const riskPhases: RiskPhaseDefinition[] = [
  {
    id: 'antes',
    label: 'Antes',
    description: 'Cómo prevenir y prepararte.',
    icon: 'shieldCheck',
  },
  {
    id: 'durante',
    label: 'Durante',
    description: 'Qué hacer en el momento.',
    icon: 'alert',
  },
  {
    id: 'despues',
    label: 'Después',
    description: 'Cómo recuperarnos y mejorar.',
    icon: 'rotate',
  },
]
