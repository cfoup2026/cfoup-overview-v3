import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
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
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
