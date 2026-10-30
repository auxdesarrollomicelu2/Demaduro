import type { ReactNode } from 'react'

export default function CheckoutCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-dark/[0.06] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 font-display text-xl font-bold text-dark">{title}</h2>
      {children}
    </section>
  )
}
