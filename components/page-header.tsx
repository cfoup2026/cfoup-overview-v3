import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
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
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
