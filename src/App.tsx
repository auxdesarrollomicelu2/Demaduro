import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const SedesPage = lazy(() => import('./pages/SedesPage'))
const SedePage = lazy(() => import('./pages/SedePage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ConfirmOrderPage = lazy(() => import('./pages/ConfirmOrderPage'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-accent" role="status" aria-label="Cargando">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
  </div>
)

function App() {
  const { pathname } = useLocation()

  // Cada página nueva empieza desde arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/sedes" element={<SedesPage />} />
        <Route path="/sede/:sedeId" element={<SedePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmar-pedido/:codigo" element={<ConfirmOrderPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
