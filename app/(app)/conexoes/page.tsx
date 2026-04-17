import { Plus, CheckCircle2, AlertCircle, RefreshCcw, Landmark, Receipt, ShoppingCart, Calculator } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function ConexoesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fontes de dados"
        title="Conexões"
        description="Quanto mais fontes conectadas, mais afiada fica a leitura do CFOup sobre a Gregorutt. Gerencie bancos, ERPs, gateways e serviços contábeis aqui."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-navy)] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Nova conexão
          </button>
        }
      />

      <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-hero-gradient p-7 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
              Cobertura atual
            </p>
            <h2 className="mt-1 text-2xl font-extrabold" style={{ color: "var(--brand-navy)" }}>
              4 de 6 fontes essenciais ativas
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Conecte o gateway e o serviço contábil para o CFOup consolidar margens por linha de receita com confiança total.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
                  style={{ backgroundColor: ["#1567C8", "#38B8E8", "#36BA58", "#0D2D5C"][i] }}
                >
                  {["B", "C", "E", "F"][i]}
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">+ 2 pendentes</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="conexoes-list" className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 id="conexoes-list" className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            Integrações
          </h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[var(--brand-navy)]">
            <RefreshCcw className="h-3.5 w-3.5" />
            Sincronizar todas
          </button>
        </div>
        <ul className="divide-y divide-border">
          <ConnectionRow
            icon={Landmark}
            name="Banco PJ"
            category="Conta corrente"
            status="connected"
            meta="Última sincronização há 4 minutos"
          />
          <ConnectionRow
            icon={Landmark}
            name="Banco de Investimentos"
            category="Aplicações"
            status="connected"
            meta="Última sincronização há 1 hora"
          />
          <ConnectionRow
            icon={ShoppingCart}
            name="Gateway de pagamentos"
            category="Adquirente"
            status="attention"
            meta="Token de acesso expira em 3 dias"
          />
          <ConnectionRow
            icon={Receipt}
            name="ERP fiscal"
            category="Notas e emissão"
            status="connected"
            meta="Última sincronização hoje"
          />
          <ConnectionRow
            icon={Calculator}
            name="Contabilidade"
            category="Escritório contábil"
            status="disconnected"
            meta="Integração não configurada"
          />
          <ConnectionRow
            icon={Landmark}
            name="Cartão corporativo"
            category="Despesas"
            status="disconnected"
            meta="Integração não configurada"
          />
        </ul>
      </section>
    </>
  )
}

function ConnectionRow({
  icon: Icon,
  name,
  category,
  status,
  meta,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  name: string
  category: string
  status: "connected" | "attention" | "disconnected"
  meta: string
}) {
  const badge =
    status === "connected"
      ? { label: "Conectado", bg: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)", Icon: CheckCircle2 }
      : status === "attention"
        ? { label: "Atenção", bg: "rgba(234,179,8,0.14)", color: "#92610b", Icon: AlertCircle }
        : { label: "Não conectado", bg: "var(--slate-100)", color: "var(--slate-600)", Icon: AlertCircle }

  return (
    <li className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white"
          style={{ color: "var(--brand-blue)" }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {category} · {meta}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: badge.bg, color: badge.color }}
        >
          <badge.Icon className="h-3 w-3" strokeWidth={2.2} />
          {badge.label}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40"
        >
          {status === "disconnected" ? "Conectar" : "Gerenciar"}
        </button>
      </div>
    </li>
  )
}
