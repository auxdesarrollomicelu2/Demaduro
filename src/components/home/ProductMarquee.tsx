const products = [
  'PLATANO MACHARRÓN',
  'PIZZA PEPPERONI DEMADURO',
  'DEMADURO TEX-MEX',
  'DEMADURO DE CARNE',
  'GRATINADO DE POLLO',
  'SÚPER GRATINADO DE LA ABUELA',
  'DEMADURO DE CHICHARRÓN',
]

function ProductList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {products.map((product) => (
        <li key={product} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-xs font-bold tracking-wide text-yellow-badge sm:px-9 sm:text-sm">
            {product}
          </span>
          <span className="text-sm sm:text-base" aria-hidden="true">🍌</span>
        </li>
      ))}
    </ul>
  )
}

export default function ProductMarquee() {
  return (
    <div className="overflow-hidden border-y-2 border-secondary-dark bg-secondary py-3 sm:py-3.5">
      {/* w-max: el ancho es el del contenido, así -50% mueve exactamente una lista y el bucle es continuo */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <ProductList />
        <ProductList hidden />
      </div>
    </div>
  )
}
