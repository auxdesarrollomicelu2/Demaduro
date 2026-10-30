import { ForkKnifeIcon, NavigationArrowIcon, PhoneIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import { ButtonAnchor, ButtonLink } from '../ui/Button'
import { directionsUrl } from '@/lib/maps'
import { formatPhone, normalizePhone, sedeWhatsAppUrl } from '@/lib/whatsapp'
import type { Sede } from '@/lib/api'

export default function SedeContact({ sede }: { sede: Sede }) {
  const whatsappUrl = sedeWhatsAppUrl(sede)

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-[#2BD46B] to-[#1EAE55] p-6 text-center text-white shadow-xl sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
          <WhatsappLogoIcon size={30} />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold">Pide tu domicilio</h2>
        <p className="mt-1 text-sm text-white/90">
          Rapidito y calientico, directo a tu casa <span aria-hidden="true">🍌</span>
        </p>
        <p className="mt-5 font-display text-2xl font-bold tracking-wide">{formatPhone(sede.whatsapp)}</p>

        <ButtonAnchor
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
          size="lg"
          className="mt-5 w-full border-transparent text-[#1EAE55] hover:bg-white/90"
          icon={<WhatsappLogoIcon size={20} weight="bold" />}
        >
          Escribir por WhatsApp
        </ButtonAnchor>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ButtonAnchor
          href={directionsUrl(sede)}
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
          icon={<NavigationArrowIcon size={18} weight="fill" />}
        >
          Cómo llegar
        </ButtonAnchor>
        <ButtonLink to="/menu" variant="primary" icon={<ForkKnifeIcon size={18} weight="bold" />}>
          Ver el menú
        </ButtonLink>
        <ButtonAnchor href={`tel:+${normalizePhone(sede.telefono)}`} variant="dark" icon={<PhoneIcon size={18} weight="fill" />}>
          Llamar
        </ButtonAnchor>
      </div>

      <ButtonAnchor
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="whatsapp"
        className="fixed bottom-4 right-4 z-40 shadow-xl sm:bottom-6 sm:right-6"
        icon={<WhatsappLogoIcon size={20} weight="bold" />}
      >
        Pedir ahora
      </ButtonAnchor>
    </div>
  )
}
