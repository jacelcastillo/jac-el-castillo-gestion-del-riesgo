import type { KitCategory, PlanStep } from '@/types/content'

export const familyPlanSteps: PlanStep[] = [
  {
    id: 'reunion',
    title: 'Reúne a tu familia',
    description: 'Hablen de los riesgos del barrio y de cómo podría afectarles cada uno.',
    icon: 'users',
  },
  {
    id: 'riesgos-casa',
    title: 'Revisa tu casa',
    description: 'Identifiquen grietas, cables, cilindros de gas y objetos que puedan caer.',
    icon: 'home',
  },
  {
    id: 'punto-encuentro',
    title: 'Elijan un punto de encuentro',
    description: 'Uno cerca de la casa y otro fuera del barrio, por si no pueden volver.',
    icon: 'flag',
  },
  {
    id: 'rutas',
    title: 'Definan las rutas de salida',
    description: 'Ubiquen dos salidas de la casa y el camino al punto de encuentro.',
    icon: 'route',
  },
  {
    id: 'contactos',
    title: 'Anoten los contactos clave',
    description: 'Un familiar fuera del barrio, la JAC y las líneas de emergencia. Escríbanlos en papel.',
    icon: 'phone',
  },
  {
    id: 'roles',
    title: 'Repartan tareas',
    description: 'Quién lleva el kit, quién ayuda a niños, mayores y mascotas, quién cierra el gas.',
    icon: 'handHeart',
  },
  {
    id: 'practica',
    title: 'Practiquen el plan',
    description: 'Hagan un simulacro en casa al menos dos veces al año.',
    icon: 'siren',
  },
]

export const emergencyKit: KitCategory[] = [
  {
    id: 'agua-comida',
    title: 'Agua y comida',
    items: [
      { id: 'agua', label: 'Agua potable', hint: '4 litros por persona al día, para 3 días' },
      { id: 'enlatados', label: 'Alimentos no perecederos', hint: 'Enlatados, galletas, panela' },
      { id: 'abrelatas', label: 'Abrelatas manual' },
    ],
  },
  {
    id: 'salud',
    title: 'Salud e higiene',
    items: [
      { id: 'botiquin', label: 'Botiquín de primeros auxilios' },
      { id: 'medicamentos', label: 'Medicamentos de uso diario', hint: 'Con copia de la fórmula' },
      { id: 'tapabocas', label: 'Tapabocas y gel antibacterial' },
      { id: 'higiene', label: 'Papel higiénico y toallas higiénicas' },
    ],
  },
  {
    id: 'herramientas',
    title: 'Herramientas y comunicación',
    items: [
      { id: 'linterna', label: 'Linterna con pilas de repuesto' },
      { id: 'radio', label: 'Radio de pilas' },
      { id: 'silbato', label: 'Pito o silbato', hint: 'Para pedir ayuda si quedas atrapado' },
      { id: 'cargador', label: 'Cargador portátil para el celular' },
      { id: 'navaja', label: 'Navaja multiusos' },
    ],
  },
  {
    id: 'documentos',
    title: 'Documentos y dinero',
    items: [
      { id: 'copias', label: 'Copias de documentos en bolsa plástica', hint: 'Cédulas, registros, escrituras' },
      { id: 'efectivo', label: 'Algo de dinero en efectivo' },
      { id: 'lista-contactos', label: 'Lista de contactos escrita en papel' },
    ],
  },
  {
    id: 'abrigo',
    title: 'Abrigo',
    items: [
      { id: 'ropa', label: 'Muda de ropa y zapatos cerrados' },
      { id: 'cobija', label: 'Cobija o manta térmica' },
      { id: 'impermeable', label: 'Impermeable o plástico grande' },
    ],
  },
]

export const KIT_STORAGE_KEY = 'jac-kit-emergencia'
export const PLAN_STORAGE_KEY = 'jac-plan-familiar'

export const kitItemIds = emergencyKit.flatMap((category) => category.items.map((item) => item.id))
export const planStepIds = familyPlanSteps.map((step) => step.id)
