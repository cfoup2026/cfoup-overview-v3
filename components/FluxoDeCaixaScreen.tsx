/**
 * `FluxoDeCaixaScreen` — apresentação CF13 v0.
 *
 * Componente puro de render: recebe dados já montados pelos helpers
 * `montar*` em `lib/cf13/` e renderiza header + banner veredito +
 * 4 cards + tabela 13 semanas + painel pendências.
 *
 * Sem lógica financeira. Sem dependência de `CF13Output`. Formatação
 * BRL via `Intl.NumberFormat` (locale `pt-BR`).
 *
 * Server Component (sem `'use client'`): ações dos botões de pendência
 * são placeholders no v0 — interação plena entra no Passo 7+.
 */
import type { ReactNode } from "react"

type Severidade = "neutra" | "positiva" | "atencao" | "aviso_forte" | "negativa"

type Props = {
  veredito: {
    categoria: string
    titulo: string
    mensagem: string
    severidade: Severidade
  }
  cards: {
    id: string
    titulo: string
    valor: number | string
    subtitulo?: string
    severidade: string
  }[]
  grade: {
    tipo: string
    label: string
    valores: number[]
    flags?: string[][]
  }[]
  pendencias: {
    id: string
    origem: string
    severidade: "critica" | "media" | "baixa"
    titulo: string
    detalhe: string
    acaoSugerida?: { rotulo: string }
  }[]
  semanasRotulos: string[]
}

/* ─────────── Tokens de cor por severidade ─────────── */

const SEV_BG: Record<Severidade, string> = {
  neutra: "bg-card border-border",
  positiva: "bg-emerald-50 border-emerald-200",
  atencao: "bg-amber-50 border-amber-200",
  aviso_forte: "bg-orange-50 border-orange-200",
  negativa: "bg-red-50 border-red-200",
}

const SEV_TEXT: Record<Severidade, string> = {
  neutra: "text-foreground",
  positiva: "text-emerald-700",
  atencao: "text-amber-700",
  aviso_forte: "text-orange-700",
  negativa: "text-red-700",
}

const SEV_DOT: Record<Severidade, string> = {
  neutra: "bg-slate-400",
  positiva: "bg-emerald-500",
  atencao: "bg-amber-500",
  aviso_forte: "bg-orange-500",
  negativa: "bg-red-500",
}

const SEV_PEND: Record<"critica" | "media" | "baixa", Severidade> = {
  critica: "negativa",
  media: "atencao",
  baixa: "neutra",
}

/* ─────────── Formatação ─────────── */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
})

function formatBRL(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return BRL.format(n)
}

function asSeveridade(s: string): Severidade {
  return (
    ["neutra", "positiva", "atencao", "aviso_forte", "negativa"].includes(s)
      ? (s as Severidade)
      : "neutra"
  )
}

/* ─────────── Componente principal ─────────── */

export function FluxoDeCaixaScreen({
  veredito,
  cards,
  grade,
  pendencias,
  semanasRotulos,
}: Props) {
  return (
    <div className="space-y-8">
      <Header />
      <BannerVeredito veredito={veredito} />
      <CardsRow cards={cards} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <TabelaSemanas grade={grade} semanasRotulos={semanasRotulos} />
        <PainelPendencias pendencias={pendencias} />
      </div>
    </div>
  )
}

/* ─────────── Sub-componentes ─────────── */

function Header() {
  return (
    <header className="flex flex-col gap-2">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--brand-blue)" }}
      >
        Caixa
      </p>
      <h1
        className="text-3xl font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Fluxo de Caixa
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Projeção de 13 semanas — caixa, mínimo operacional e pendências
        que afetam a confiança do número.
      </p>
    </header>
  )
}

function BannerVeredito({ veredito }: { veredito: Props["veredito"] }) {
  const sev = veredito.severidade
  return (
    <section
      className={`rounded-2xl border px-6 py-5 ${SEV_BG[sev]}`}
      aria-labelledby="cf13-veredito-titulo"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full ${SEV_DOT[sev]}`}
        />
        <div className="flex-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Veredito · {veredito.categoria}
          </p>
          <h2
            id="cf13-veredito-titulo"
            className={`mt-1 text-xl font-bold ${SEV_TEXT[sev]}`}
          >
            {veredito.titulo}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {veredito.mensagem}
          </p>
        </div>
      </div>
    </section>
  )
}

function CardsRow({ cards }: { cards: Props["cards"] }) {
  return (
    <section
      aria-label="Indicadores principais"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((c) => {
        const sev = asSeveridade(c.severidade)
        const valorStr =
          typeof c.valor === "number" ? formatBRL(c.valor) : c.valor
        return (
          <div
            key={c.id}
            className={`rounded-2xl border p-5 ${SEV_BG[sev]}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {c.titulo}
            </p>
            <p
              className={`mt-2 text-2xl font-extrabold leading-none tabular-nums ${SEV_TEXT[sev]}`}
            >
              {valorStr}
            </p>
            {c.subtitulo && (
              <p className="mt-2 text-xs text-muted-foreground">
                {c.subtitulo}
              </p>
            )}
          </div>
        )
      })}
    </section>
  )
}

function TabelaSemanas({
  grade,
  semanasRotulos,
}: {
  grade: Props["grade"]
  semanasRotulos: string[]
}) {
  return (
    <section
      aria-label="Projeção 13 semanas"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[180px] bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Linha
              </th>
              {semanasRotulos.map((rot, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-3 py-3 text-right text-[11px] font-semibold text-muted-foreground"
                >
                  {rot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grade.map((linha) => (
              <tr key={linha.label} className="border-t border-border">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {linha.label}
                </th>
                {linha.valores.map((v, i) => (
                  <Cell
                    key={i}
                    valor={v}
                    flags={linha.flags?.[i]}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Cell({ valor, flags }: { valor: number; flags?: string[] }) {
  /* `flags` por célula: pintar só "Caixa final" abaixo do mínimo /
   *  saldo negativo. Outras linhas não trazem flags. */
  const negativo = flags?.includes("saldo_negativo") ?? false
  const abaixoMin = flags?.includes("abaixo_do_minimo") ?? false

  let cls = "text-foreground"
  if (negativo) cls = "text-red-700 font-semibold"
  else if (abaixoMin) cls = "text-amber-700 font-semibold"

  return (
    <td className={`px-3 py-3 text-right tabular-nums ${cls}`}>
      {formatBRL(valor)}
    </td>
  )
}

function PainelPendencias({
  pendencias,
}: {
  pendencias: Props["pendencias"]
}) {
  return (
    <aside
      aria-label="Pendências"
      className="rounded-2xl border border-border bg-card"
    >
      <header className="border-b border-border px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Pendências
        </p>
        <h2
          className="mt-1 text-base font-bold"
          style={{ color: "var(--brand-navy)" }}
        >
          {pendencias.length === 0
            ? "Nenhuma pendência"
            : `${pendencias.length} item${pendencias.length === 1 ? "" : "s"}`}
        </h2>
      </header>
      {pendencias.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">
          Tudo certo. Nenhuma pendência aberta no momento.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {pendencias.map((p) => (
            <li key={p.id} className="px-5 py-4">
              <PendenciaItem pendencia={p} />
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

function PendenciaItem({
  pendencia,
}: {
  pendencia: Props["pendencias"][number]
}) {
  const sev = SEV_PEND[pendencia.severidade]
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${SEV_DOT[sev]}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--brand-navy)" }}
          >
            {pendencia.titulo}
          </p>
          <SeverityBadge severidade={pendencia.severidade} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {pendencia.detalhe}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{pendencia.origem}</span>
        </div>
        {pendencia.acaoSugerida && (
          <button
            type="button"
            className="mt-3 inline-flex items-center rounded-md border border-border bg-white px-2.5 py-1 text-xs font-semibold hover:border-[var(--brand-blue)]/40"
            style={{ color: "var(--brand-navy)" }}
          >
            {pendencia.acaoSugerida.rotulo}
          </button>
        )}
      </div>
    </div>
  )
}

function SeverityBadge({
  severidade,
}: {
  severidade: "critica" | "media" | "baixa"
}): ReactNode {
  const sev = SEV_PEND[severidade]
  const label =
    severidade === "critica" ? "Crítica" : severidade === "media" ? "Média" : "Baixa"
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SEV_BG[sev]} ${SEV_TEXT[sev]}`}
    >
      {label}
    </span>
  )
}
