import { PageHeader } from "@/components/page-header"
import { Bell, Building2, Shield, Gauge, Mail } from "lucide-react"

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preferências"
        title="Configurações"
        description="Ajuste como o CFOup trabalha pra Gregorutt: ciclos de fechamento, metas, tolerâncias e quem recebe os alertas."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Seções" className="rounded-2xl border border-border bg-card p-3 h-fit">
          <SectionLink icon={Building2} label="Empresa" active />
          <SectionLink icon={Gauge} label="Metas e tolerâncias" />
          <SectionLink icon={Bell} label="Alertas" />
          <SectionLink icon={Mail} label="Relatórios" />
          <SectionLink icon={Shield} label="Segurança" />
        </nav>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
            <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
              Perfil da empresa
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Essas informações servem de contexto para o CFOup.</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Razão social" value="Gregorutt Indústria e Comércio LTDA" />
              <Field label="Apelido no CFOup" value="Gregorutt" />
              <Field label="Setor de atuação" value="Indústria · Comércio B2B" />
              <Field label="Moeda padrão" value="BRL · Real brasileiro" />
              <Field label="Regime tributário" value="Lucro Presumido" />
              <Field label="Início do exercício fiscal" value="Janeiro" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
            <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
              Metas e tolerâncias
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Os limites que definem quando o CFOup levanta um alerta na Visão Geral.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Margem líquida alvo" value="15,0%" hint="Alerta abaixo de 12%" />
              <Field label="Runway mínimo" value="6 meses" hint="Alerta crítico abaixo de 3 meses" />
              <Field label="Concentração máxima por cliente" value="30%" hint="Alerta acima desse valor" />
              <Field label="PMR tolerado" value="30 dias" hint="Alerta quando ultrapassa" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
            <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
              Alertas e comunicação
            </h2>
            <div className="mt-6 space-y-3">
              <Toggle label="Resumo diário por e-mail" description="Entregue às 08:00, apenas nos dias úteis." on />
              <Toggle label="Alertas críticos em tempo real" description="Notificações quando um limite for ultrapassado." on />
              <Toggle label="Relatório mensal consolidado" description="Fechamento em PDF, enviado ao seu contador." />
              <Toggle label="Resumo semanal estratégico" description="Principais decisões sugeridas pelo CFOup." />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

function SectionLink({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-muted font-bold text-[var(--brand-navy)]"
          : "font-medium text-[var(--slate-700)] hover:bg-muted/60"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      {label}
    </button>
  )
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
        {value}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function Toggle({ label, description, on = false }: { label: string; description: string; on?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
          {label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <span
        aria-hidden
        role="switch"
        aria-checked={on}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
        style={{ backgroundColor: on ? "var(--brand-green)" : "var(--slate-300)" }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
          style={{ transform: on ? "translateX(22px)" : "translateX(4px)" }}
        />
      </span>
    </div>
  )
}
