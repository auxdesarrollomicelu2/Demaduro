import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'yellow' | 'green' | 'orange' | 'white'
  icon?: React.ReactNode
}

export default function Badge({ children, variant = 'yellow', icon, className = '', ...props }: BadgeProps) {
  const variants = {
    yellow: 'bg-yellow-badge text-dark',
    green: 'bg-secondary text-white',
    orange: 'bg-primary text-white',
    white: 'bg-white text-dark shadow-sm',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  )
}
