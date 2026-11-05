import type { Risk } from '@/types/content'

export const risks: Risk[] = [
  {
    slug: 'deslizamientos',
    name: 'Deslizamientos',
    icon: 'mountain',
    summary: 'Cuando la tierra, el barro o las piedras se vienen loma abajo, sobre todo después de lluvias fuertes.',
    warningSigns: [
      'Grietas nuevas en paredes, pisos o en el terreno.',
      'Árboles, postes o cercas que se inclinan.',
      'Puertas y ventanas que de repente se atascan.',
      'Agua que brota del suelo o se pone turbia en la quebrada.',
      'Ruidos extraños de la montaña, como crujidos.',
    ],
    phases: {
      antes: [
        'No construyas ni rellenes en laderas sin asesoría técnica.',
        'Mantén limpios los canales y desagües para que el agua no se infiltre.',
        'Siembra plantas de raíz profunda en los taludes.',
        'Reporta a la JAC cualquier grieta o hundimiento que veas.',
        'Ubica tu punto de encuentro y la ruta más segura para llegar.',
      ],
      durante: [
        'Sal de inmediato hacia una zona alta y firme, lejos del deslizamiento.',
        'No cruces por donde está bajando tierra o agua.',
        'Ayuda a niños, personas mayores y con discapacidad.',
        'Llama a la Línea 123 cuando estés a salvo.',
      ],
      despues: [
        'No vuelvas a tu casa hasta que las autoridades digan que es seguro.',
        'Aléjate de la zona: puede haber nuevos deslizamientos.',
        'Revisa si hay personas heridas o atrapadas y avisa a los rescatistas.',
        'Reporta daños en viviendas, tuberías y cables a la JAC.',
      ],
    },
  },
  {
    slug: 'inundaciones',
    name: 'Inundaciones',
    icon: 'droplets',
    summary: 'Cuando la quebrada o el alcantarillado se desbordan y el agua entra a calles y casas.',
    warningSigns: [
      'Lluvias fuertes por varias horas seguidas.',
      'La quebrada sube rápido o el agua cambia de color.',
      'Alcantarillas que se rebosan.',
      'Ruido fuerte del agua o arrastre de troncos y piedras.',
    ],
    phases: {
      antes: [
        'No arrojes basura a la quebrada ni a las alcantarillas.',
        'Guarda documentos importantes en bolsas plásticas y en un lugar alto.',
        'Ten listo tu kit de emergencia.',
        'Conoce la ruta de evacuación hacia la parte alta.',
      ],
      durante: [
        'Desconecta la energía si puedes hacerlo sin tocar agua.',
        'Sube a un lugar alto y no intentes cruzar corrientes de agua.',
        'No camines ni manejes por calles inundadas: 15 cm de agua pueden tumbarte.',
        'Si te lo indican, evacúa de inmediato.',
      ],
      despues: [
        'No toques cables ni aparatos mojados.',
        'Hierve el agua o usa agua embotellada hasta que confirmen que es potable.',
        'Limpia y desinfecta tu casa con cuidado para evitar enfermedades.',
        'Reporta daños a la JAC para gestionar ayudas.',
      ],
    },
  },
  {
    slug: 'incendios-forestales',
    name: 'Incendios forestales',
    icon: 'flame',
    summary: 'Fuego en potreros, bosques o zonas verdes que puede llegar a las casas, sobre todo en temporada seca.',
    warningSigns: [
      'Olor a humo o ceniza en el aire.',
      'Humo saliendo de la montaña o de un lote.',
      'Temporada seca con mucho viento.',
    ],
    phases: {
      antes: [
        'No hagas quemas de basura ni de potreros.',
        'No dejes botellas, vidrios o fogatas en zonas verdes.',
        'Mantén limpio de hojas secas el alrededor de tu casa.',
        'Ten a mano baldes con agua y una manguera.',
      ],
      durante: [
        'Llama de inmediato a Bomberos (119) o a la Línea 123.',
        'Aléjate en dirección contraria al viento y al humo.',
        'Cúbrete nariz y boca con un trapo húmedo.',
        'No intentes apagar un incendio grande por tu cuenta.',
      ],
      despues: [
        'No regreses hasta que Bomberos confirme que está apagado.',
        'Revisa que no queden brasas encendidas cerca de tu casa.',
        'Apoya las jornadas de reforestación de la JAC.',
      ],
    },
  },
  {
    slug: 'sismos',
    name: 'Sismos',
    icon: 'activity',
    summary: 'Movimientos de la tierra que pueden ocurrir en cualquier momento y sin aviso.',
    warningSigns: [
      'Los sismos no avisan. Lo importante es estar preparado siempre.',
      'Después de un sismo pueden venir réplicas.',
    ],
    phases: {
      antes: [
        'Asegura muebles altos, repisas y cilindros de gas a la pared.',
        'Identifica en tu casa los lugares seguros, lejos de ventanas.',
        'Practica con tu familia: agacharse, cubrirse y sujetarse.',
        'Si vas a construir, hazlo con norma sismorresistente.',
      ],
      durante: [
        'Agáchate, cúbrete la cabeza y sujétate de algo firme.',
        'Aléjate de ventanas, vidrios y objetos que puedan caer.',
        'No uses ascensores ni corras por escaleras.',
        'Si estás en la calle, aléjate de postes, cables y paredes.',
      ],
      despues: [
        'Sal con calma hacia tu punto de encuentro.',
        'Cierra el gas y no prendas fósforos ni velas.',
        'Revisa daños en tu casa antes de volver a entrar.',
        'Prepárate para posibles réplicas.',
      ],
    },
  },
  {
    slug: 'vendavales',
    name: 'Vendavales',
    icon: 'wind',
    summary: 'Vientos muy fuertes que pueden levantar techos, tumbar árboles y dañar redes eléctricas.',
    warningSigns: [
      'Cambios bruscos de temperatura y nubes muy oscuras.',
      'Viento que aumenta rápido de fuerza.',
      'Avisos de alerta por tormentas.',
    ],
    phases: {
      antes: [
        'Asegura tejas, láminas de zinc y techos livianos.',
        'Poda las ramas que estén cerca de tu casa o de los cables.',
        'Guarda o amarra objetos sueltos del patio y la terraza.',
      ],
      durante: [
        'Quédate dentro, lejos de ventanas y puertas de vidrio.',
        'Si estás afuera, busca refugio lejos de árboles y postes.',
        'Desconecta aparatos eléctricos.',
      ],
      despues: [
        'No toques cables caídos y avisa a la empresa de energía.',
        'Revisa tu techo antes de que vuelva a llover.',
        'Reporta árboles caídos o viviendas dañadas a la JAC.',
      ],
    },
  },
  {
    slug: 'riesgo-electrico',
    name: 'Riesgo eléctrico',
    icon: 'zap',
    summary: 'Accidentes por cables caídos, conexiones ilegales o instalaciones en mal estado.',
    warningSigns: [
      'Cables caídos, sueltos o que echan chispas.',
      'Olor a quemado en tomas o interruptores.',
      'Luces que parpadean o aparatos que dan corrientazo.',
    ],
    phases: {
      antes: [
        'No hagas conexiones ilegales ni recargues las tomas con muchas extensiones.',
        'Pide revisión de tu instalación a un electricista certificado.',
        'No eleves cometas cerca de los cables.',
      ],
      durante: [
        'No toques a una persona electrocutada sin cortar antes la energía.',
        'Usa un objeto seco de madera o plástico para separarla del cable.',
        'Aléjate al menos 10 metros de un cable caído.',
        'Llama a la Línea 123 y a la empresa de energía.',
      ],
      despues: [
        'No reconectes la energía si hay agua o daños visibles.',
        'Reporta postes y cables en mal estado a la JAC.',
      ],
    },
  },
]
