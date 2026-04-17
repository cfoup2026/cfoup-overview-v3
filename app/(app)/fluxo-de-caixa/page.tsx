import { PageHeader } from "@/components/page-header"
import { ArrowDownRight, ArrowUpRight, Calendar, Download } from "lucide-react"

export default function FluxoDeCaixaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Caixa"
        title="Fluxo de Caixa"
        description="O que entrou, o que saiu e o que ainda tá no horizonte de 90 dias na Gregorutt. Sem reprocessamento, sem planilha paralela."
        actions={
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40">
              <Calendar className="h-4 w-4" />
              Últimos 90 dias
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        }
      />

      {/* Destaque gráfico */}
      <section className="mb-8 rounded-2xl border border-border bg-card p-7 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Saldo projetado · 90 dias
            </p>
            <p
              className="mt-2 text-[2.5rem] font-extrabold leading-none tabular-nums"
              style={{ color: "var(--brand-navy)" }}
            >
              R$ 1,41M
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-[var(--brand-green-dark)]">+ R$ 126k</span> em relação ao saldo atual
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Legend color="#1567C8" label="Entradas" />
            <Legend color="#0D2D5C" label="Saídas" />
            <Legend color="#36BA58" label="Saldo" />
          </div>
        </div>

        <div className="mt-8">
          <CashBarChart />
        </div>
      </section>

      {/* Duas colunas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
              Entradas previstas
            </h2>
            <span className="text-sm font-bold text-[var(--brand-green-dark)] tabular-nums">+ R$ 684,2k</span>
          </div>
          <ul className="mt-6 divide-y divide-border">
            <FlowItem label="Recebíveis contratados" when="Próximos 30 dias" amount="+ R$ 312,0k" positive />
            <FlowItem label="Repasses de gateway" when="D+1 a D+30" amount="+ R$ 148,4k" positive />
            <FlowItem label="Cobranças em aberto" when="A recuperar" amount="+ R$ 94,8k" positive />
            <FlowItem label="Aplicações com resgate" when="Em 45 dias" amount="+ R$ 129,0k" positive />
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
              Saídas previstas
            </h2>
            <span className="text-sm font-bold tabular-nums" style={{ color: "var(--brand-red)" }}>
              − R$ 558,1k
            </span>
          </div>
          <ul className="mt-6 divide-y divide-border">
            <FlowItem label="Folha de pagamento" when="Dia 05 de cada mês" amount="− R$ 186,4k" />
            <FlowItem label="Fornecedores recorrentes" when="30 dias" amount="− R$ 142,0k" />
            <FlowItem label="Impostos e tributos" when="Conforme calendário" amount="− R$ 98,7k" />
            <FlowItem label="Contratos SaaS e serviços" when="Mensal" amount="− R$ 24,8k" />
            <FlowItem label="Investimentos programados" when="Próximos 90 dias" amount="− R$ 106,2k" />
          </ul>
        </section>
      </div>
    </>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="font-semibold">{label}</span>
    </span>
  )
}

function FlowItem({
  label,
  when,
  amount,
  positive = false,
}: {
  label: string
  when: string
  amount: string
  positive?: boolean
}) {
  return (
    <li className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: positive ? "rgba(54,186,88,0.12)" : "rgba(200,30,30,0.10)",
            color: positive ? "var(--brand-green-dark)" : "var(--brand-red)",
          }}
        >
          {positive ? (
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          ) : (
            <ArrowDownRight className="h-4 w-4" strokeWidth={2.2} />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
            {label}
          </p>
          <p className="text-xs text-muted-foreground">{when}</p>
        </div>
      </div>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: positive ? "var(--brand-green-dark)" : "var(--brand-red)" }}
      >
        {amount}
      </span>
    </li>
  )
}

/** Gráfico de barras: entradas acima e saídas invertidas, com linha de saldo. SVG puro, sem libs. */
function CashBarChart() {
  const months = ["Mai", "Jun", "Jul", "Ago", "Set*", "Out*", "Nov*"]
  const inflow = [310, 352, 388, 421, 452, 468, 480]
  const outflow = [280, 298, 312, 338, 360, 372, 378]
  const w = 720
  const h = 240
  const pad = { l: 28, r: 16, t: 12, b: 28 }
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const max = Math.max(...inflow, ...outflow) * 1.1
  const barW = iw / months.length / 2.3
  const groupW = iw / months.length

  const balance = inflow.map((v, i) => v - outflow[i])
  const balMax = Math.max(...balance)
  const balMin = Math.min(...balance)
  const balRange = balMax - balMin || 1
  const balPoints = balance.map((v, i) => {
    const x = pad.l + i * groupW + groupW / 2
    const y = pad.t + ih - ((v - balMin) / balRange) * (ih - 24) - 12
    return [x, y] as const
  })
  const balPath = balPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Gráfico de entradas, saídas e saldo">
      {/* grid */}
      {[0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={pad.l}
          x2={w - pad.r}
          y1={pad.t + ih * t}
          y2={pad.t + ih * t}
          stroke="#E2E8F0"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      {months.map((m, i) => {
        const gx = pad.l + i * groupW + groupW / 2
        const inH = (inflow[i] / max) * ih
        const outH = (outflow[i] / max) * ih
        return (
          <g key={m}>
            <rect
              x={gx - barW - 2}
              y={pad.t + ih - inH}
              width={barW}
              height={inH}
              rx="3"
              fill="#1567C8"
              opacity={i >= 4 ? 0.55 : 1}
            />
            <rect
              x={gx + 2}
              y={pad.t + ih - outH}
              width={barW}
              height={outH}
              rx="3"
              fill="#0D2D5C"
              opacity={i >= 4 ? 0.45 : 0.9}
            />
            <text
              x={gx}
              y={h - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#64748B"
              fontFamily="inherit"
            >
              {m}
            </text>
          </g>
        )
      })}
      {/* Balance line */}
      <path d={balPath} fill="none" stroke="#36BA58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {balPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#36BA58" strokeWidth="2" />
      ))}
    </svg>
  )
}
