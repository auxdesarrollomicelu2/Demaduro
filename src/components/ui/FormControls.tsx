import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const controlClass = (invalid?: boolean) =>
  cn(
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-dark placeholder:text-dark/40 transition-colors',
    'focus:outline-none focus:ring-2',
    invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-dark/15 focus:border-primary focus:ring-primary/20'
  )

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-dark">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-dark/50">{hint}</p>
      )}
    </div>
  )
}

interface ControlProps {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & ControlProps>(
  ({ invalid, className, id, ...props }, ref) => (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(controlClass(invalid), className)}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & ControlProps>(
  ({ invalid, className, id, ...props }, ref) => (
    <select
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(controlClass(invalid), className)}
      {...props}
    />
  )
)
Select.displayName = 'Select'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & ControlProps>(
  ({ invalid, className, id, ...props }, ref) => (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(controlClass(invalid), 'resize-none', className)}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
