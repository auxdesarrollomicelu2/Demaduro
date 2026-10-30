import Button from './Button'

interface LoadErrorProps {
  title: string
  onRetry: () => void
}

export default function LoadError({ title, onRetry }: LoadErrorProps) {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-dark/[0.07] bg-white/70 p-6 text-center sm:p-8" role="alert">
      <p className="font-semibold text-dark">{title}</p>
      <p className="text-sm text-dark-light">Revisa tu conexión e inténtalo de nuevo.</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  )
}
