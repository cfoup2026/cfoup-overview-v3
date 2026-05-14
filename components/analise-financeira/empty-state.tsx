import Link from "next/link"

type Props = {
  titulo: string
  descricao: string
  fontesFaltando?: string[]
}

export function EmptyState({ titulo, descricao, fontesFaltando }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p
        className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--brand-blue)" }}
      >
        Dados pendentes
      </p>

      <h3
        className="mb-3 text-lg font-semibold"
        style={{ color: "var(--brand-navy)" }}
      >
        {titulo}
      </h3>

      <p
        className="mb-6 max-w-md text-[13px] leading-relaxed"
        style={{ color: "var(--brand-ink-muted)" }}
      >
        {descricao}
      </p>

      {fontesFaltando && fontesFaltando.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {fontesFaltando.map((fonte) => (
            <span
              key={fonte}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-medium"
              style={{ color: "var(--brand-ink-muted)" }}
            >
              {fonte}
            </span>
          ))}
        </div>
      )}

      <Link
        href="/conexoes"
        className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: "var(--brand-blue)" }}
      >
        Importar arquivos
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
