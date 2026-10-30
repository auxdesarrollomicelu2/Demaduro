import { useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { CheckIcon, ReceiptIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import PageLayout from '../components/layout/PageLayout'
import Button, { ButtonAnchor } from '../components/ui/Button'
import LoadError from '../components/ui/LoadError'
import { useAsyncData } from '../hooks/useAsyncData'
import { confirmOrder, getOrderConfirmation, type OrderConfirmation } from '../lib/api'
import { customerOrderConfirmedUrl } from '../lib/whatsapp'
import { formatCurrency } from '../lib/utils'

const formatDate = (value: string) => new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-dark/60">{label}</dt>
      <dd className="text-right font-semibold text-dark">{value}</dd>
    </div>
  )
}

export default function ConfirmOrderPage() {
  const { codigo = '' } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const loadOrder = useCallback(() => getOrderConfirmation(codigo, token), [codigo, token])
  const { data, status, reload } = useAsyncData(loadOrder)
  const [confirmed, setConfirmed] = useState<OrderConfirmation | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const order = confirmed ?? data

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(false)
    try {
      const result = await confirmOrder(codigo, token)
      if (result) setConfirmed(result)
      else setSubmitError(true)
    } catch (error) {
      console.error('Error confirmando el pedido:', error)
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-md">
          {status === 'loading' && <div className="h-96 animate-pulse rounded-3xl bg-white/60" aria-busy="true" aria-label="Cargando pedido" />}

          {status === 'error' && <LoadError title="No pudimos cargar el pedido" onRetry={reload} />}

          {status === 'success' && !order && (
            <div className="space-y-3 rounded-3xl border border-dark/[0.06] bg-white p-6 text-center shadow-sm sm:p-8">
              <p className="text-4xl" aria-hidden="true">🔒</p>
              <p className="font-semibold text-dark">Este enlace no es válido</p>
              <p className="text-sm text-dark/60">Abre el botón “Confirmar pedido” directamente desde el correo del pedido.</p>
            </div>
          )}

          {order && (
            <div className="rounded-3xl border border-dark/[0.06] bg-white p-6 shadow-lg sm:p-8">
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
                  <ReceiptIcon size={28} weight="bold" />
                </span>
                <h1 className="mt-4 font-display text-3xl font-bold text-dark">Pedido {order.codigo}</h1>
                <p className="mt-1 text-sm font-semibold text-secondary">{order.sede_nombre}</p>
              </div>

              <dl className="mt-6 divide-y divide-dark/[0.06] border-y border-dark/[0.06]">
                <Detail label="Cliente" value={order.cliente_nombre} />
                <Detail label="Teléfono" value={order.cliente_telefono} />
                <Detail label="Entrega" value={order.tipo_entrega === 'domicilio' ? 'Domicilio' : 'Recoge en tienda'} />
                <Detail label="Pago" value={order.metodo_pago === 'transferencia' ? 'Transferencia Bre-B' : 'Efectivo'} />
                <Detail label="Total" value={formatCurrency(order.total)} />
                <Detail label="Recibido" value={formatDate(order.created_at)} />
              </dl>

              {order.estado === 'pendiente' ? (
                <div className="mt-6 space-y-3">
                  <p className="text-center text-sm text-dark/70">
                    Confirma que recibiste este pedido{order.metodo_pago === 'transferencia' ? ' y validaste el pago' : ''}.
                  </p>
                  {submitError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">
                      No pudimos confirmar el pedido. Inténtalo de nuevo.
                    </p>
                  )}
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                    onClick={handleConfirm}
                    icon={<CheckIcon size={20} weight="bold" />}
                  >
                    {submitting ? 'Confirmando…' : 'Confirmar pedido'}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary">
                    <CheckIcon size={18} weight="bold" aria-hidden="true" />
                    {order.confirmado_at ? `Confirmado el ${formatDate(order.confirmado_at)}` : `Estado: ${order.estado}`}
                  </div>
                  <ButtonAnchor
                    href={customerOrderConfirmedUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    icon={<WhatsappLogoIcon size={20} weight="bold" />}
                  >
                    Avisar al cliente por WhatsApp
                  </ButtonAnchor>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
