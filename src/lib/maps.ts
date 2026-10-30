import type { Sede } from './api'

function coordinates(sede: Sede) {
  const values = sede.coordenadas?.split(',').map((value) => Number(value.trim()))
  return values?.length === 2 && values.every(Number.isFinite) ? values.join(',') : null
}

export function mapEmbedUrl(sede: Sede) {
  const coords = coordinates(sede)
  return coords ? `https://maps.google.com/maps?q=${coords}&z=16&output=embed` : null
}

export function openInMapsUrl(sede: Sede) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates(sede) ?? sede.direccion)}`
}

export function directionsUrl(sede: Sede) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates(sede) ?? sede.direccion)}`
}
