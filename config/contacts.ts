import type { IconName } from '@/lib/icons'
import type { Contact, ContactGroup } from '@/types/content'

export const wpContactIcons: Record<'jac' | 'sector', IconName> = {
  jac: 'building',
  sector: 'users',
}

export const contactGroups: ContactGroup[] = [
  {
    id: 'nacional',
    title: 'Líneas de emergencia',
    description: 'Gratuitas, funcionan desde cualquier celular, incluso sin saldo.',
  },
  {
    id: 'jac',
    title: 'Junta de Acción Comunal',
    description: 'Comité de gestión del riesgo de la JAC El Castillo.',
  },
  {
    id: 'sector',
    title: 'Líderes de sector',
    description: 'Vecinos de confianza que coordinan cada sector.',
  },
]

export const contacts: Contact[] = [
  {
    id: 'linea-123',
    name: 'Línea 123',
    role: 'Línea única de emergencias',
    phone: '123',
    displayPhone: '123',
    group: 'nacional',
    icon: 'siren',
    priority: 'emergencia',
  },
  {
    id: 'bomberos',
    name: 'Bomberos',
    role: 'Incendios, rescates y fugas de gas',
    phone: '119',
    displayPhone: '119',
    group: 'nacional',
    icon: 'flame',
  },
  {
    id: 'cruz-roja',
    name: 'Cruz Roja',
    role: 'Atención de heridos y ambulancias',
    phone: '132',
    displayPhone: '132',
    group: 'nacional',
    icon: 'heartPulse',
  },
  {
    id: 'defensa-civil',
    name: 'Defensa Civil',
    role: 'Deslizamientos, inundaciones y evacuaciones',
    phone: '144',
    displayPhone: '144',
    group: 'nacional',
    icon: 'shield',
  },
  {
    id: 'policia',
    name: 'Policía',
    role: 'Seguridad y orden público',
    phone: '112',
    displayPhone: '112',
    group: 'nacional',
    icon: 'shieldAlert',
  },
]
