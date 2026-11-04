import type { IncidentLocation } from '@/types/incident'

export function describeLocation(location: IncidentLocation): string {
  const parts: string[] = []
  if (location.address) parts.push(location.address)
  if (location.reference) parts.push(location.reference)
  if (location.latitude !== undefined && location.longitude !== undefined) {
    parts.push(`GPS ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`)
  }
  return parts.join(' · ')
}
