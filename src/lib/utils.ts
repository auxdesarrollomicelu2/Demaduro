import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge and deduplicate Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to Colombian Peso (ej: $39.600)
 */
export function formatCurrency(amount: number): string {
  return `$${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(amount)}`
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Calculate delivery cost based on location
 * TODO: Implement real delivery cost calculation logic
 */
export function calculateDeliveryCost(_address: string, _sedeId: string): number {
  // Placeholder logic - replace with actual calculation
  const baseCost = 5000
  const additionalCost = Math.floor(Math.random() * 3000) // 0-3000 additional
  return baseCost + additionalCost
}

/**
 * Get sede by ID
 */
export function getSedeById(sedeId: string) {
  const sedes = {
    envigado: {
      id: 'envigado',
      name: 'Envigado',
      address: 'Calle 40 Sur # 41-44, Edificio Murano Plaza',
      phone: '+573122519184',
      email: 'envigado@demaduro.com',
      coordinates: { lat: 6.1701, lng: -75.5830 }
    },
    sabaneta: {
      id: 'sabaneta',
      name: 'Sabaneta',
      address: 'Calle 70 Sur # 43B-69, Local 105',
      phone: '+573122519184',
      email: 'sabaneta@demaduro.com',
      coordinates: { lat: 6.1512, lng: -75.6161 }
    },
    laureles: {
      id: 'laureles',
      name: 'Laureles',
      address: 'Circular 74 # 39-36, Mercado de Laureles',
      phone: '+573122519184',
      email: 'laureles@demaduro.com',
      coordinates: { lat: 6.2443, lng: -75.5912 }
    },
    aranjuez: {
      id: 'aranjuez',
      name: 'Aranjuez',
      address: 'Carrera 49 # 92-86',
      phone: '+573122519184',
      email: 'aranjuez@demaduro.com',
      coordinates: { lat: 6.2778, lng: -75.5617 }
    }
  }
  
  return sedes[sedeId as keyof typeof sedes] || null
}
