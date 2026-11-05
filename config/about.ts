import type { AboutContent } from '@/types/content'

export const aboutContent: AboutContent = {
  mission:
    'Promover la participación de los vecinos de El Castillo para conocer nuestros riesgos, prevenir emergencias y responder de manera organizada y solidaria.',
  vision:
    'Ser un barrio preparado, donde cada familia sabe qué hacer y todos nos cuidamos entre todos.',
  committee: {
    title: 'Comité de Gestión del Riesgo',
    description:
      'Vecinos voluntarios que coordinan la prevención, los simulacros y la respuesta ante emergencias junto con las autoridades.',
  },
  participate: {
    title: 'Cómo participar',
    description: 'Todos podemos aportar, sin importar la edad. Así puedes sumarte:',
    ways: [
      {
        id: 'voluntario',
        title: 'Hazte voluntario',
        description: 'Únete a una de las comisiones del comité. Te capacitamos.',
        icon: 'handHeart',
      },
      {
        id: 'asamblea',
        title: 'Asiste a las reuniones',
        description: 'Participa en las asambleas de la JAC y propone mejoras para el barrio.',
        icon: 'users',
      },
      {
        id: 'simulacros',
        title: 'Participa en simulacros',
        description: 'Practicar salva vidas. Ven con tu familia.',
        icon: 'siren',
      },
      {
        id: 'reporta',
        title: 'Reporta lo que veas',
        description: 'Grietas, cables caídos o basura en la quebrada. Tu reporte ayuda a prevenir.',
        icon: 'megaphone',
      },
    ],
  },
}
