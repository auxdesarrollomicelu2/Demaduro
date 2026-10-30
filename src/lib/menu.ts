import type { Product } from './api'

/**
 * Grupos de "Arma tu Madurito" (subcategorías de la base y sus complementos), en orden de visualización
 */
export const BUILD_GROUPS = [
  { subcategoria: 'Base', title: 'Base' },
  { subcategoria: 'Queso', title: 'Quesos' },
  { subcategoria: 'Salsa', title: 'Salsas' },
  { subcategoria: 'Topping', title: 'Toppings' },
  { subcategoria: 'Adicion', title: 'Adiciones' },
] as const

/**
 * Secciones del menú por categoría de la base de datos
 */
export const MENU_SECTIONS = [
  { categoria: 'Salados', id: 'maduritos', title: 'Maduritos', icon: '🧀', subtitle: 'Plátano maduro asado, gratinado y cargado de sabor.' },
  { categoria: 'Dulcecitos', id: 'dulcecitos', title: 'Dulcecitos', icon: '🧁', subtitle: 'Para cerrar con el sabor de casa.' },
] as const

export const BUILD_SECTION = { id: 'arma-tu-madurito', title: 'Arma tu Madurito', icon: '🛠️', subtitle: 'Hazlo tuyo: empieza con la base y agrégale lo que quieras.' } as const

const buildSubcategorias: readonly string[] = BUILD_GROUPS.map((group) => group.subcategoria)

export function isBuildItem(product: Product) {
  return product.subcategoria !== null && buildSubcategorias.includes(product.subcategoria)
}

export interface MenuOption {
  label: string
  product: Product
}

export interface MenuItem {
  /** Variante principal (la de menor precio) */
  product: Product
  /** Todas las variantes con el mismo nombre, la principal primero */
  options: MenuOption[]
  destacado: boolean
}

/**
 * Agrupa las variantes (mismo nombre) en un solo item del menú.
 * El destacado va primero; el resto conserva el orden del API.
 */
export function groupMenuItems(products: Product[]): MenuItem[] {
  const groups = new Map<string, Product[]>()

  for (const product of products) {
    const group = groups.get(product.nombre) ?? []
    group.push(product)
    groups.set(product.nombre, group)
  }

  const items = Array.from(groups.values()).map((group) => {
    const [main, ...others] = [...group].sort((a, b) => a.precio - b.precio)
    return {
      product: main,
      options: [
        { label: main.subcategoria ?? '', product: main },
        ...others.map((variant) => ({ label: variantLabel(variant.subcategoria, main.subcategoria), product: variant })),
      ],
      destacado: group.some((p) => p.destacado),
    }
  })

  return items.sort((a, b) => Number(b.destacado) - Number(a.destacado))
}

/**
 * "Tex-Mex con Pollo" con base "Tex-Mex" -> "con pollo"; "Con tocineta" -> "con tocineta"
 */
function variantLabel(subcategoria: string | null, mainSubcategoria: string | null) {
  let label = subcategoria ?? ''
  if (mainSubcategoria && label.startsWith(mainSubcategoria)) {
    label = label.slice(mainSubcategoria.length)
  }
  return label.trim().toLowerCase()
}
