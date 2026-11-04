import { photoCompression } from '@/config/incident'
import type { IncidentPhoto } from '@/types/incident'

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    image.src = url
  })
}

const dataUrlSizeKb = (dataUrl: string) => Math.round((dataUrl.length * 3) / 4 / 1024)

/**
 * Reduce la foto en el navegador (dimensión y calidad JPEG) para que pese
 * poco y se envíe rápido en conexiones lentas.
 */
export async function compressImage(file: File): Promise<IncidentPhoto> {
  const image = await loadImage(file)
  const { maxDimension, maxSizeKb } = photoCompression
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('El navegador no permite procesar imágenes')
  context.drawImage(image, 0, 0, width, height)

  let quality: number = photoCompression.quality
  let dataUrl = canvas.toDataURL('image/jpeg', quality)
  while (dataUrlSizeKb(dataUrl) > maxSizeKb && quality > 0.3) {
    quality -= 0.1
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }

  return { dataUrl, width, height, sizeKb: dataUrlSizeKb(dataUrl) }
}
