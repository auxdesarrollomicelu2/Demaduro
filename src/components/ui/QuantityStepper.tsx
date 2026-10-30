import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md' }: QuantityStepperProps) {
  const buttonClass = cn(
    'flex items-center justify-center rounded-full text-dark transition-colors hover:bg-accent',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40',
    size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  )

  return (
    <div className="inline-flex items-center rounded-full border border-dark/10 bg-white p-1 shadow-sm">
      <button type="button" aria-label="Disminuir cantidad" disabled={value <= min} onClick={() => onChange(value - 1)} className={buttonClass}>
        <MinusIcon size={16} weight="bold" aria-hidden="true" />
      </button>
      <span className={cn('text-center font-bold', size === 'sm' ? 'w-7 text-sm' : 'w-9')} aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label="Aumentar cantidad" disabled={value >= max} onClick={() => onChange(value + 1)} className={buttonClass}>
        <PlusIcon size={16} weight="bold" aria-hidden="true" />
      </button>
    </div>
  )
}
