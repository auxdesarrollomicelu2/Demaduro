import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'soft'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'rounded-2xl'
    
    const variants = {
      default: 'bg-white',
      bordered: 'bg-white border-2 border-gray-100',
      elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-200',
      // Crema sobre fondos claros con patrón (resalta la card sin taparla)
      soft: 'bg-accent/70 border border-dark/[0.08] shadow-sm hover:shadow-md transition-shadow duration-200',
    }
    
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
