import type { AlertLevelDefinition, AlertLevelId } from '@/types/content'

export const alertLevels: Record<AlertLevelId, AlertLevelDefinition> = {
  verde: {
    id: 'verde',
    label: 'Sin alerta',
    meaning: 'Situación normal. Es buen momento para prepararnos.',
    whatToDo: 'Revisa tu plan familiar y tu kit de emergencia.',
    icon: 'shieldCheck',
  },
  amarilla: {
    id: 'amarilla',
    label: 'Alerta amarilla',
    meaning: 'Hay condiciones que podrían causar una emergencia. Estemos atentos.',
    whatToDo: 'Sigue los avisos de la JAC y ten tu kit a la mano.',
    icon: 'alert',
  },
  naranja: {
    id: 'naranja',
    label: 'Alerta naranja',
    meaning: 'Es probable que ocurra una emergencia pronto. Prepárate para actuar.',
    whatToDo: 'Alista tu kit, ubica tu punto de encuentro y no te acerques a zonas de riesgo.',
    icon: 'shieldAlert',
  },
  roja: {
    id: 'roja',
    label: 'Alerta roja',
    meaning: 'La emergencia está ocurriendo o es inminente.',
    whatToDo: 'Sigue las instrucciones de las autoridades y evacúa si te lo indican.',
    icon: 'siren',
  },
}
