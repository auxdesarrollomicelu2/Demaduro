import { CheckIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import { ButtonAnchor, ButtonLink } from '../ui/Button'
import { orderConfirmationUrl } from '@/lib/whatsapp'
import type { Sede } from '@/lib/api'

export default function OrderSuccess({ codigo, sede }: { codigo: string; sede: Sede }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-dark/[0.06] bg-white p-6 text-center shadow-lg sm:p-8">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-md" aria-hidden="true">
        <CheckIcon size={32} weight="bold" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold text-dark">¡Recibimos tu pedido!</h1>
      <p className="mt-2 text-sm text-dark/60">Tu número de pedido es</p>
      <p className="mt-1 font-display text-4xl font-bold tracking-wide text-primary">{codigo}</p>
      <p className="mt-4 text-sm leading-relaxed text-dark/70">
        {sede.nombre} validará tu pedido y te confirmará por WhatsApp. Escríbenos para avisarnos que ya lo hiciste.
      </p>

      <div className="mt-6 space-y-3">
        <ButtonAnchor
          href={orderConfirmationUrl(sede, codigo)}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="lg"
          className="w-full"
          icon={<WhatsappLogoIcon size={20} weight="bold" />}
        >
          Confirmar por WhatsApp
        </ButtonAnchor>
        <ButtonLink to="/" variant="light" className="w-full">
          Volver al inicio
        </ButtonLink>
      </div>
    </div>
  )
}
