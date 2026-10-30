import { useState } from 'react'
import { BankIcon, CheckIcon, CopyIcon, MoneyIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import CheckoutCard from './CheckoutCard'
import { cn } from '@/lib/utils'
import { fieldId, type CheckoutSectionProps, type MetodoPago } from '@/lib/checkout'
import type { Sede } from '@/lib/api'

export default function PaymentSection({ form, errors, onChange, sede }: CheckoutSectionProps & { sede: Sede }) {
  const [copied, setCopied] = useState(false)
  const transferAvailable = Boolean(sede.llave_breb || sede.qr_pago_url)

  const options: { value: MetodoPago; title: string; description: string; icon: typeof MoneyIcon; disabled?: boolean }[] = [
    {
      value: 'efectivo',
      title: 'Efectivo',
      description: form.tipoEntrega === 'domicilio' ? 'Pagas al recibir tu pedido' : 'Pagas al recoger tu pedido',
      icon: MoneyIcon,
    },
    {
      value: 'transferencia',
      title: 'Transferencia Bre-B',
      description: transferAvailable ? 'Pagas ahora y adjuntas el comprobante' : 'No disponible en esta sede por ahora',
      icon: BankIcon,
      disabled: !transferAvailable,
    },
  ]

  const copyKey = async () => {
    if (!sede.llave_breb) return
    try {
      await navigator.clipboard.writeText(sede.llave_breb)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.warn('No se pudo copiar la llave:', error)
    }
  }

  return (
    <CheckoutCard title="Método de pago">
      <div id={fieldId('metodoPago')} tabIndex={-1} className="grid gap-3 outline-none sm:grid-cols-2" role="radiogroup" aria-label="Método de pago">
        {options.map(({ value, title, description, icon: Icon, disabled }) => {
          const active = form.metodoPago === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange('metodoPago', value)}
              className={cn(
                'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                active ? 'border-primary bg-primary/5' : 'border-dark/15 hover:border-primary/40',
                errors.metodoPago && !active && 'border-red-300'
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', active ? 'bg-primary text-white' : 'bg-accent text-dark')}>
                <Icon size={20} weight="bold" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-dark">{title}</span>
                <span className="mt-0.5 block text-xs text-dark/60">{description}</span>
              </span>
            </button>
          )
        })}
      </div>
      {errors.metodoPago && <p className="mt-2 text-xs font-medium text-red-600">{errors.metodoPago}</p>}

      {form.metodoPago === 'transferencia' && (
        <div className="mt-5 space-y-4 rounded-2xl bg-accent/60 p-4 sm:p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {sede.qr_pago_url && (
              <img
                src={sede.qr_pago_url}
                alt={`QR de pago de ${sede.nombre}`}
                className="h-40 w-40 shrink-0 rounded-xl border border-dark/10 bg-white object-contain p-2"
              />
            )}
            <div className="w-full space-y-3 text-center sm:text-left">
              <p className="text-sm text-dark/70">Escanea el QR o usa la llave Bre-B desde la app de tu banco.</p>
              {sede.llave_breb && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-dark/10 bg-white px-4 py-3">
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-dark/50">Llave Bre-B</p>
                    <p className="truncate font-bold text-dark">{sede.llave_breb}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyKey}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-secondary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    {copied ? <CheckIcon size={14} weight="bold" aria-hidden="true" /> : <CopyIcon size={14} weight="bold" aria-hidden="true" />}
                    {copied ? 'Copiada' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor={fieldId('comprobante')}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed bg-white px-4 py-5 text-center transition-colors',
                errors.comprobante ? 'border-red-300' : 'border-dark/15 hover:border-primary/50'
              )}
            >
              <UploadSimpleIcon size={26} weight="bold" className="text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-dark">
                {form.comprobante ? form.comprobante.name : 'Adjunta tu comprobante de pago'}
              </span>
              <span className="text-xs text-dark/50">{form.comprobante ? 'Toca para cambiarlo' : 'Imagen o PDF, máximo 5 MB'}</span>
            </label>
            <input
              id={fieldId('comprobante')}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              aria-invalid={!!errors.comprobante || undefined}
              onChange={(event) => onChange('comprobante', event.target.files?.[0] ?? null)}
            />
            {errors.comprobante && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.comprobante}</p>}
          </div>
        </div>
      )}
    </CheckoutCard>
  )
}
