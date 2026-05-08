import type { ReactNode } from "react"

export function TabHeaderCard({
  titulo,
  intro,
}: {
  titulo: string
  intro: ReactNode
}) {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-base font-bold leading-snug text-[color:var(--brand-navy)]">
        {titulo}
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--slate-700)]">
        {intro}
      </p>
    </div>
  )
}
