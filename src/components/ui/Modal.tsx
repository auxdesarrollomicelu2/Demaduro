import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  onClose: () => void
  labelledBy: string
  position?: 'center' | 'right'
  children: ReactNode
}

const positions = {
  center: 'm-auto w-[calc(100%-2rem)] rounded-3xl sm:max-w-lg',
  right: 'm-0 ml-auto h-dvh w-full sm:max-w-md',
}

export default function Modal({ onClose, labelledBy, position = 'center', children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
      dialog.focus()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={cn(
        'max-h-none max-w-none overflow-hidden bg-white p-0 text-dark shadow-2xl outline-none backdrop:bg-dark/60 backdrop:backdrop-blur-sm',
        positions[position]
      )}
    >
      {children}
    </dialog>
  )
}
