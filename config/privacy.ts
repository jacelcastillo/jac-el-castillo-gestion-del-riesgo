export interface PrivacySection {
  id: string
  title: string
  paragraphs?: string[]
  items?: string[]
}

export interface PrivacyNotice {
  draftNotice: string
  law: string
  contactUrl: string
  contactLabel: string
  sections: PrivacySection[]
}

export const privacyNotice: PrivacyNotice = {
  draftNotice: 'Borrador pendiente de revisión y aprobación de la Junta.',
  law: 'Ley 1581 de 2012 de protección de datos personales',
  contactUrl: 'https://web.jacelcastillo.com.co/contacto/',
  contactLabel: 'Ir a la página de contacto de la JAC',
  sections: [
    {
      id: 'responsable',
      title: '¿Quién es el responsable?',
      paragraphs: [
        'La Junta de Acción Comunal El Castillo es la responsable de los datos que nos compartes en un reporte de incidente.',
      ],
    },
    {
      id: 'finalidad',
      title: '¿Para qué usamos tus datos?',
      paragraphs: [
        'Solo para atender los reportes de riesgo del barrio: revisar la situación, avisar a quien corresponda y, si dejaste tu contacto, comunicarnos contigo sobre tu reporte.',
      ],
    },
    {
      id: 'datos',
      title: '¿Qué datos recogemos?',
      items: [
        'La ubicación del incidente, por GPS o por la dirección que escribas.',
        'La descripción de lo que está pasando.',
        'Tu nombre y tu celular, solo si decides compartirlos.',
      ],
    },
    {
      id: 'anonimo',
      title: 'Puedes enviar de forma anónima',
      paragraphs: [
        'Si marcas "Enviar de forma anónima", no enviamos tu nombre ni tu celular. Así no podremos contactarte para pedirte más información.',
      ],
    },
    {
      id: 'derechos',
      title: 'Tus derechos',
      paragraphs: ['Según la Ley 1581 de 2012, puedes:'],
      items: [
        'Conocer los datos que tenemos sobre ti.',
        'Actualizarlos.',
        'Rectificarlos si están mal.',
        'Pedir que los eliminemos.',
      ],
    },
    {
      id: 'contacto',
      title: '¿Cómo ejercer tus derechos?',
      paragraphs: ['Escríbenos desde la página de contacto del sitio de la JAC y cuéntanos qué necesitas.'],
    },
    {
      id: 'conservacion',
      title: '¿Por cuánto tiempo guardamos los datos?',
      paragraphs: [
        'Proponemos guardar los reportes por 12 meses y luego eliminarlos. Este plazo está pendiente de aprobación de la Junta.',
      ],
    },
  ],
}
