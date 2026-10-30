import CheckoutCard from './CheckoutCard'
import { FormField, Input } from '../ui/FormControls'
import { fieldId, type CheckoutSectionProps } from '@/lib/checkout'

export default function CustomerSection({ form, errors, onChange }: CheckoutSectionProps) {
  return (
    <CheckoutCard title="Tus datos">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={fieldId('nombre')} label="Nombre completo" required error={errors.nombre}>
          <Input
            id={fieldId('nombre')}
            autoComplete="name"
            placeholder="Ej. Juan Pérez"
            value={form.nombre}
            invalid={!!errors.nombre}
            onChange={(event) => onChange('nombre', event.target.value)}
          />
        </FormField>

        <FormField
          id={fieldId('telefono')}
          label="Celular WhatsApp"
          required
          error={errors.telefono}
          hint="10 dígitos, sin +57. Ej: 3001234567"
        >
          <Input
            id={fieldId('telefono')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="3001234567"
            value={form.telefono}
            invalid={!!errors.telefono}
            onChange={(event) => onChange('telefono', event.target.value.replace(/\D/g, ''))}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField id={fieldId('email')} label="Correo electrónico" error={errors.email} hint="Opcional">
            <Input
              id={fieldId('email')}
              type="email"
              autoComplete="email"
              placeholder="Ej. juan@correo.com"
              value={form.email}
              invalid={!!errors.email}
              onChange={(event) => onChange('email', event.target.value)}
            />
          </FormField>
        </div>
      </div>
    </CheckoutCard>
  )
}
