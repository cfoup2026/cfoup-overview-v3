import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: ReactNode
  /**
   * Alias para `actions`. Aceito para compatibilidade com pages que passam o
   * conteúdo de actions entre as tags `<PageHeader>...</PageHeader>`.
   * Se ambos forem fornecidos, `actions` vence.
   */
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions, children }: PageHeaderProps) {
  const actionsSlot = actions ?? children
  return (
    <header className="mb-10 flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
            {eyebrow}
          </p>
        )}
        <h1
          className="text-balance text-3xl font-extrabold leading-tight tracking-tight md:text-[2.25rem]"
          style={{ color: "var(--brand-navy)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actionsSlot && <div className="flex shrink-0 flex-wrap items-center gap-2">{actionsSlot}</div>}
    </header>
  )
}
