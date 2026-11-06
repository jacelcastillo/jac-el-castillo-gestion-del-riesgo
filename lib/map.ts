export interface LatLng {
  lat: number
  lng: number
}

export interface Projected {
  x: number
  y: number
}

const MARGIN = 10
const DEGREES_TO_RADIANS = Math.PI / 180

const round = (value: number) => Math.round(value * 100) / 100

/** Una sola escala para ambos ejes: la forma de las rutas no se estira. */
export function project(coordinates: LatLng[]): Projected[] {
  if (coordinates.length === 0) return []

  const lats = coordinates.map((c) => c.lat)
  const lngs = coordinates.map((c) => c.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const lngFactor = Math.cos(((minLat + maxLat) / 2) * DEGREES_TO_RADIANS)
  const width = (maxLng - minLng) * lngFactor
  const height = maxLat - minLat
  const span = Math.max(width, height)
  const scale = span === 0 ? 0 : (100 - 2 * MARGIN) / span

  const offsetX = 50 - (width * scale) / 2
  const offsetY = 50 - (height * scale) / 2

  return coordinates.map(({ lat, lng }) => ({
    x: round(offsetX + (lng - minLng) * lngFactor * scale),
    y: round(offsetY + (maxLat - lat) * scale),
  }))
}

export const directionsUrl = ({ lat, lng }: LatLng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

export const placeUrl = ({ lat, lng }: LatLng) => `https://www.google.com/maps?q=${lat},${lng}`
