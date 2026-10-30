import { MapPinIcon, MotorcycleIcon, StorefrontIcon } from '@phosphor-icons/react'
import CheckoutCard from './CheckoutCard'
import { FormField, Input, Select, Textarea } from '../ui/FormControls'
import { cn } from '@/lib/utils'
import { TIPOS_VIVIENDA, fieldId, type CheckoutSectionProps, type TipoEntrega } from '@/lib/checkout'
import type { Sede } from '@/lib/api'

const deliveryOptions: { value: TipoEntrega; label: string; icon: typeof MotorcycleIcon }[] = [
  { value: 'domicilio', label: 'Domicilio', icon: MotorcycleIcon },
  { value: 'recoger', label: 'Recoger en tienda', icon: StorefrontIcon },
]

export default function DeliverySection({ form, errors, onChange, sede }: CheckoutSectionProps & { sede: Sede }) {
  return (
    <CheckoutCard title="¿Cómo quieres recibir tu pedido?">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-accent/60 p-1.5" role="radiogroup" aria-label="Tipo de entrega">
        {deliveryOptions.map(({ value, label, icon: Icon }) => {
          const active = form.tipoEntrega === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange('tipoEntrega', value)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                active ? 'bg-dark text-white shadow-md' : 'text-dark/70 hover:bg-white'
              )}
            >
              <Icon size={18} weight="bold" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {form.tipoEntrega === 'domicilio' ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField id={fieldId('barrio')} label="Barrio" required error={errors.barrio}>
            <Input
              id={fieldId('barrio')}
              placeholder="Ej. El Poblado"
              value={form.barrio}
              invalid={!!errors.barrio}
              onChange={(event) => onChange('barrio', event.target.value)}
            />
          </FormField>

          <FormField id={fieldId('tipoVivienda')} label="Tipo de vivienda" required error={errors.tipoVivienda}>
            <Select
              id={fieldId('tipoVivienda')}
              value={form.tipoVivienda}
              invalid={!!errors.tipoVivienda}
              onChange={(event) => onChange('tipoVivienda', event.target.value)}
            >
              <option value="">Selecciona…</option>
              {TIPOS_VIVIENDA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              id={fieldId('direccion')}
              label="Dirección"
              required
              error={errors.direccion}
              hint="Incluye torre, apartamento o casa si aplica."
            >
              <Input
                id={fieldId('direccion')}
                autoComplete="street-address"
                placeholder="Ej. Carrera 27D #34DD Sur-85, Envigado"
                value={form.direccion}
                invalid={!!errors.direccion}
                onChange={(event) => onChange('direccion', event.target.value)}
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField id={fieldId('indicaciones')} label="Otras indicaciones" hint="Opcional">
              <Textarea
                id={fieldId('indicaciones')}
                rows={2}
                maxLength={300}
                placeholder="Ej. Tocar el timbre 2, portería principal…"
                value={form.indicaciones}
                onChange={(event) => onChange('indicaciones', event.target.value)}
              />
            </FormField>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4">
          <MapPinIcon size={22} weight="fill" className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-dark">Recoge tu pedido en {sede.nombre}</p>
            <p className="mt-0.5 text-dark/60">{sede.direccion}</p>
          </div>
        </div>
      )}
    </CheckoutCard>
  )
}
