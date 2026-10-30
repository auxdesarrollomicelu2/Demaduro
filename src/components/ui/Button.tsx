import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'whatsapp' | 'light'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-md hover:shadow-lg',
  dark: 'bg-dark hover:bg-dark-light text-white shadow-md hover:shadow-lg',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  whatsapp: 'bg-[#25D366] hover:bg-[#1EBE5A] text-white shadow-md hover:shadow-lg',
  light: 'bg-white hover:bg-accent-light text-dark border border-dark/10 shadow-sm hover:shadow-md',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(baseStyles, variants[variant], sizes[size], className)
}

/**
 * Botón para acciones (formularios, carrito, etc.)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', icon, className, ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
)

Button.displayName = 'Button'

/**
 * Enlace con apariencia de botón para navegar entre páginas
 */
interface ButtonLinkProps extends LinkProps, ButtonStyleProps {}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, variant = 'primary', size = 'md', icon, className, ...props }, ref) => (
    <Link ref={ref} className={buttonClasses(variant, size, className)} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </Link>
  )
)

ButtonLink.displayName = 'ButtonLink'

/**
 * Enlace externo con apariencia de botón (WhatsApp, Maps, llamadas)
 */
interface ButtonAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement>, ButtonStyleProps {}

export const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonAnchorProps>(
  ({ children, variant = 'primary', size = 'md', icon, className, ...props }, ref) => (
    <a ref={ref} className={buttonClasses(variant, size, className)} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </a>
  )
)

ButtonAnchor.displayName = 'ButtonAnchor'

export default Button
