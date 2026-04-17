import { AlertTriangle, Clock, FileText, CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function PendenciasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Controle"
        title="Pendências"
        description="Exceções, conciliações e decisões que esperam seu olhar. Tudo priorizado pelo impacto financeiro em Sua empresa."
      />

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <SummaryTile icon={AlertTriangle} label="Críticas" count="2" tone="warning" />
        <SummaryTile icon={Clock} label="Aguardando você" count="7" tone="info" />
        <SummaryTile icon={CheckCircle2} label="Resolvidas no mês" count="14" tone="positive" />
      </section>

      <section className="rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h2 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            Fila priorizada
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ordenado por impacto</span>
          </div>
        </div>
        <ul className="divide-y divide-border">
          <PendingRow
            priority="Crítica"
            title="Concentração de receita acima de 30%"
            body="Um cliente representa 34% da receita dos últimos 90 dias. Avalie diversificação antes da renovação do contrato."
            tag="Receita"
            due="Decisão esta semana"
          />
          <PendingRow
            priority="Crítica"
            title="PMR subiu 6 dias no último ciclo"
            body="Prazo médio de recebimento foi de 28 para 34 dias. Impacto estimado em capital de giro: R$ 48k."
            tag="Caixa"
            due="Rever com time comercial"
          />
          <PendingRow
            priority="Atenção"
            title="7 lançamentos sem classificação"
            body="Movimentações no Banco PJ aguardam categorização. Sem isso, margens da Linha B ficam subestimadas."
            tag="Conciliação"
            due="Hoje"
          />
          <PendingRow
            priority="Atenção"
            title="Conta de fornecedor duplicada"
            body="O CFOup detectou duas entradas idênticas em 12/08. Valide antes do próximo pagamento."
            tag="Contas a pagar"
            due="Amanhã"
          />
          <PendingRow
            priority="Informativa"
            title="Relatório mensal pronto para revisão"
            body="Fechamento consolidado do mês anterior disponível para aprovação."
            tag="Relatórios"
            due="Quando possível"
          />
        </ul>
      </section>
    </>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  count,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  count: string
  tone: "warning" | "info" | "positive"
}) {
  const styles =
    tone === "warning"
      ? { bg: "rgba(234,179,8,0.12)", color: "#92610b" }
      : tone === "info"
        ? { bg: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }
        : { bg: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)" }
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: styles.bg, color: styles.color }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      </div>
      <p className="mt-4 text-4xl font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
        {count}
      </p>
    </div>
  )
}

function PendingRow({
  priority,
  title,
  body,
  tag,
  due,
}: {
  priority: "Crítica" | "Atenção" | "Informativa"
  title: string
  body: string
  tag: string
  due: string
}) {
  const priColor =
    priority === "Crítica"
      ? { bg: "rgba(225,29,72,0.10)", color: "#b91c4b" }
      : priority === "Atenção"
        ? { bg: "rgba(234,179,8,0.12)", color: "#92610b" }
        : { bg: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }

  return (
    <li className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-start md:justify-between">
      <div className="flex gap-4">
        <span
          aria-hidden
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: priColor.bg, color: priColor.color }}
        >
          <FileText className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: priColor.bg, color: priColor.color }}
            >
              {priority}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {tag}
            </span>
          </div>
          <p className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: "var(--brand-navy)" }}>
            {title}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground md:max-w-xl">{body}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2 md:pl-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{due}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40"
        >
          Resolver
        </button>
      </div>
    </li>
  )
}
