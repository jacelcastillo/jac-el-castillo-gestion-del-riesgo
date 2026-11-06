import type { ResourceFormat, ResourceFormatDefinition } from '@/types/content'

export const resourceFormats: Record<ResourceFormat, ResourceFormatDefinition> = {
  pdf: { label: 'PDF', icon: 'fileText', action: 'Abrir PDF', extensions: ['pdf'] },
  word: { label: 'Word', icon: 'fileText', action: 'Descargar', extensions: ['doc', 'docx'] },
  excel: { label: 'Excel', icon: 'fileSpreadsheet', action: 'Descargar', extensions: ['xls', 'xlsx'] },
  powerpoint: { label: 'PowerPoint', icon: 'presentation', action: 'Descargar', extensions: ['ppt', 'pptx'] },
  imagen: { label: 'Imagen', icon: 'image', action: 'Ver imagen', extensions: ['jpg', 'jpeg', 'png', 'webp'] },
}
