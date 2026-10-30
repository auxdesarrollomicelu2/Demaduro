import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import MenuHero from '../components/menu/MenuHero'
import MenuTabs from '../components/menu/MenuTabs'
import ProductCard from '../components/menu/ProductCard'
import BuildYourOwn from '../components/menu/BuildYourOwn'
import ProductModal, { type ProductSelection } from '../components/cart/ProductModal'
import CartButton from '../components/cart/CartButton'
import CartDrawer from '../components/cart/CartDrawer'
import LoadError from '../components/ui/LoadError'
import { getProducts } from '../lib/api'
import { useAsyncData } from '../hooks/useAsyncData'
import { useCart } from '../context/cartContext'
import { BUILD_GROUPS, BUILD_SECTION, MENU_SECTIONS, groupMenuItems, isBuildItem, type MenuItem } from '../lib/menu'
import { formatCurrency } from '../lib/utils'

const tabs = [...MENU_SECTIONS, BUILD_SECTION]

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 space-y-2 text-center sm:mb-10">
      <p className="text-4xl" aria-hidden="true">{icon}</p>
      <h2 className="font-display text-3xl font-bold text-secondary sm:text-4xl">{title}</h2>
      <p className="text-sm text-dark/60 sm:text-base">{subtitle}</p>
    </div>
  )
}

export default function MenuPage() {
  const { data, status, reload } = useAsyncData(getProducts)
  const products = useMemo(() => data ?? [], [data])
  const [searchParams] = useSearchParams()
  const { sedeId, setSede, setContactPhone } = useCart()
  const [selection, setSelection] = useState<ProductSelection | null>(null)
  const cartActive = sedeId !== null

  useEffect(() => {
    const id = Number(searchParams.get('sede'))
    if (Number.isInteger(id) && id > 0) setSede(id)

    const phone = searchParams.get('tel')
    if (phone) setContactPhone(phone)
  }, [searchParams, setSede, setContactPhone])

  const sections = useMemo(
    () =>
      MENU_SECTIONS.map((section) => ({
        ...section,
        items: groupMenuItems(products.filter((p) => p.categoria === section.categoria && !isBuildItem(p))),
      })),
    [products]
  )

  const buildProducts = useMemo(() => products.filter(isBuildItem), [products])

  const buildSelection = useMemo<ProductSelection | null>(() => {
    const base = buildProducts.find((p) => p.subcategoria === 'Base')
    if (!base) return null
    return {
      title: BUILD_SECTION.title,
      description: `${base.nombre} (${formatCurrency(base.precio)}). Agrégale lo que quieras.`,
      options: [{ label: base.nombre, product: base }],
      complementGroups: BUILD_GROUPS.filter((group) => group.subcategoria !== 'Base')
        .map((group) => ({ title: group.title, items: buildProducts.filter((p) => p.subcategoria === group.subcategoria) }))
        .filter((group) => group.items.length > 0),
    }
  }, [buildProducts])

  const openProduct = (item: MenuItem) => {
    setSelection({
      title: item.product.nombre,
      description: item.product.descripcion,
      imageUrl: item.product.imagen_url,
      options: item.options,
    })
  }

  return (
    <PageLayout>
      <MenuHero />

      {status === 'loading' && (
        <div className="mx-auto grid max-w-5xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8" aria-busy="true" aria-label="Cargando menú">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="px-4 py-12">
          <LoadError title="No pudimos cargar el menú" onRetry={reload} />
        </div>
      )}

      {status === 'success' && (
        <>
          <MenuTabs tabs={tabs} />

          {sections.map((section) =>
            section.items.length > 0 ? (
              <section key={section.id} id={section.id} className="scroll-mt-32 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-5xl">
                  <SectionHeader icon={section.icon} title={section.title} subtitle={section.subtitle} />
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((item) => (
                      <ProductCard key={item.product.nombre} item={item} onAdd={cartActive ? () => openProduct(item) : undefined} />
                    ))}
                  </div>
                </div>
              </section>
            ) : null
          )}

          {buildProducts.length > 0 && (
            <section id={BUILD_SECTION.id} className="scroll-mt-32 px-4 pb-28 pt-12 sm:px-6 sm:pt-16 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <SectionHeader icon={BUILD_SECTION.icon} title={BUILD_SECTION.title} subtitle={BUILD_SECTION.subtitle} />
                <BuildYourOwn
                  products={buildProducts}
                  onBuild={cartActive && buildSelection ? () => setSelection(buildSelection) : undefined}
                />
              </div>
            </section>
          )}
        </>
      )}

      {selection && <ProductModal selection={selection} onClose={() => setSelection(null)} />}
      {cartActive && <CartButton />}
      <CartDrawer />
    </PageLayout>
  )
}
