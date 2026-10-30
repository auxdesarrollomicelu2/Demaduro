import { useCallback, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import PageLayout from '../components/layout/PageLayout'
import CustomerSection from '../components/checkout/CustomerSection'
import DeliverySection from '../components/checkout/DeliverySection'
import PaymentSection from '../components/checkout/PaymentSection'
import OrderSummary from '../components/checkout/OrderSummary'
import OrderSuccess from '../components/checkout/OrderSuccess'
import LoadError from '../components/ui/LoadError'
import { ButtonLink } from '../components/ui/Button'
import { useCart } from '../context/cartContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { createOrder, getSedeById, type Sede } from '../lib/api'
import {
  buildOrderFormData,
  emptyCheckoutForm,
  fieldId,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutForm,
  type UpdateCheckoutField,
} from '../lib/checkout'

const FORM_ID = 'checkout-form'
const FIELD_ORDER: (keyof CheckoutForm)[] = ['nombre', 'telefono', 'email', 'barrio', 'tipoVivienda', 'direccion', 'metodoPago', 'comprobante']

function Notice({ title, description, action }: { title: string; description: string; action: { to: string; label: string } }) {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-dark/[0.06] bg-white p-6 text-center shadow-sm sm:p-8">
      <p className="text-4xl" aria-hidden="true">🍌</p>
      <p className="font-semibold text-dark">{title}</p>
      <p className="text-sm text-dark/60">{description}</p>
      <ButtonLink to={action.to} variant="primary" size="md">
        {action.label}
      </ButtonLink>
    </div>
  )
}

function CheckoutContent({ sedeId, onSuccess }: { sedeId: number; onSuccess: (codigo: string, sede: Sede) => void }) {
  const { items, contactPhone } = useCart()
  const loadSede = useCallback(() => getSedeById(sedeId), [sedeId])
  const { data: sede, status, reload } = useAsyncData(loadSede)
  const [form, setForm] = useState<CheckoutForm>(() => emptyCheckoutForm(contactPhone))
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const updateField: UpdateCheckoutField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const { [field]: _removed, ...rest } = current
      return rest
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!sede) return

    const validation = validateCheckout(form)
    setErrors(validation)
    const firstInvalid = FIELD_ORDER.find((field) => validation[field])
    if (firstInvalid) {
      const element = document.getElementById(fieldId(firstInvalid))
      element?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus({ preventScroll: true })
      return
    }

    setSubmitting(true)
    setSubmitError(false)
    try {
      const { codigo } = await createOrder(buildOrderFormData(form, sedeId, items))
      onSuccess(codigo, sede)
    } catch (error) {
      console.error('Error creando el pedido:', error)
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]" aria-busy="true" aria-label="Cargando">
        <div className="h-96 animate-pulse rounded-3xl bg-white/60" />
        <div className="h-72 animate-pulse rounded-3xl bg-white/60" />
      </div>
    )
  }

  if (status === 'error' || !sede) return <LoadError title="No pudimos cargar los datos de tu sede" onRetry={reload} />

  if (!sede.activo) {
    return (
      <Notice
        title={`${sede.nombre} no está recibiendo pedidos`}
        description="Elige otra sede cercana para hacer tu pedido."
        action={{ to: '/sedes', label: 'Ver sedes' }}
      />
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-dark sm:text-4xl">Finaliza tu pedido</h1>
        <p className="mt-1 text-sm text-dark/60">
          Pedido para <span className="font-semibold text-secondary">{sede.nombre}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <form id={FORM_ID} noValidate onSubmit={handleSubmit} className="space-y-6">
          <CustomerSection form={form} errors={errors} onChange={updateField} />
          <DeliverySection form={form} errors={errors} onChange={updateField} sede={sede} />
          <PaymentSection form={form} errors={errors} onChange={updateField} sede={sede} />
        </form>

        <OrderSummary formId={FORM_ID} tipoEntrega={form.tipoEntrega} submitting={submitting} submitError={submitError} />
      </div>
    </>
  )
}

export default function CheckoutPage() {
  const { sedeId, items, clear } = useCart()
  const [result, setResult] = useState<{ codigo: string; sede: Sede } | null>(null)

  const handleSuccess = (codigo: string, sede: Sede) => {
    setResult({ codigo, sede })
    clear()
  }

  return (
    <PageLayout>
      <div className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {result ? (
            <OrderSuccess codigo={result.codigo} sede={result.sede} />
          ) : sedeId === null || items.length === 0 ? (
            <Notice
              title="Tu carrito está vacío"
              description="Agrega tus maduritos favoritos para hacer tu pedido."
              action={{ to: sedeId === null ? '/sedes' : '/menu', label: sedeId === null ? 'Elegir mi sede' : 'Ver el menú' }}
            />
          ) : (
            <>
              <Link
                to="/menu"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-dark/15 bg-white px-4 py-2 text-sm font-semibold text-dark transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
                Agregar más productos
              </Link>
              <CheckoutContent sedeId={sedeId} onSuccess={handleSuccess} />
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
