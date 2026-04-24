"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Building2, Shield, Gauge, Mail, Plug } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import {
  useConfiguracoesData,
  type ConfiguracoesSectionId,
  type ConfiguracoesField,
  type ConfiguracoesToggle,
} from "@/lib/hooks/use-configuracoes-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"

const SECTION_ICON: Record<
  ConfiguracoesSectionId,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  empresa: Building2,
  metas: Gauge,
  alertas: Bell,
  relatorios: Mail,
  seguranca: Shield,
}

export default function ConfiguracoesPage() {
  const user = useCurrentUser()
  const data = useConfiguracoesData({ name: user.name, email: user.email })
  const [activeSection, setActiveSection] = useState<ConfiguracoesSectionId>("empresa")

  const disabled = !data.hasConnections

  return (
    <>
      <PageHeader
        eyebrow={data.header.eyebrow}
        title={data.header.title}
        description={data.header.description}
      />

      {!data.hasConnections && (
        <div
          role="status"
          className="mb-6 flex flex-col gap-3 rounded-2xl border px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-5"
          style={{
            background: "rgba(21,103,200,0.06)",
            borderColor: "rgba(21,103,200,0.25)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(21,103,200,0.12)", color: "var(--brand-blue)" }}
            >
              <Plug className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
                {data.banner.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--slate-700)]">
                {data.banner.description}
              </p>
            </div>
          </div>
          <Link
            href={data.banner.ctaHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-blue)]"
          >
            <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
            {data.banner.ctaLabel}
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Seções" className="rounded-2xl border border-border bg-card p-3 h-fit">
          {data.sections.map((section) => (
            <SectionLink
              key={section.id}
              icon={SECTION_ICON[section.id]}
              label={section.label}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            />
          ))}
        </nav>

        <div className="space-y-6">
          {activeSection === "empresa" && (
            <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                {data.empresa.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.empresa.description}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field field={data.empresa.fields.razaoSocial} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.empresa.fields.apelido} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.empresa.fields.setor} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.empresa.fields.moeda} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.empresa.fields.regime} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.empresa.fields.inicioFiscal} emptyLabel={data.emptyFieldLabel} />
                <Field
                  field={data.empresa.fields.contatoResponsavel}
                  emptyLabel={data.emptyFieldLabel}
                />
                <Field
                  field={data.empresa.fields.emailResponsavel}
                  emptyLabel={data.emptyFieldLabel}
                />
              </div>
            </section>
          )}

          {activeSection === "metas" && (
            <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                {data.metas.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.metas.description}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field field={data.metas.fields.margemLiquida} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.metas.fields.runway} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.metas.fields.concentracao} emptyLabel={data.emptyFieldLabel} />
                <Field field={data.metas.fields.pmr} emptyLabel={data.emptyFieldLabel} />
              </div>
            </section>
          )}

          {activeSection === "alertas" && (
            <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                {data.alertas.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.alertas.description}</p>

              <div className="mt-6 space-y-3">
                {data.alertas.toggles.map((toggle) => (
                  <Toggle key={toggle.id} toggle={toggle} disabled={disabled} />
                ))}
              </div>
            </section>
          )}

          {activeSection === "relatorios" && (
            <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                {data.relatorios.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.relatorios.description}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  field={data.relatorios.fields.destinatarios}
                  emptyLabel={data.emptyFieldLabel}
                />
                <Field
                  field={data.relatorios.fields.frequencia}
                  emptyLabel={data.emptyFieldLabel}
                />
                <Field field={data.relatorios.fields.formato} emptyLabel={data.emptyFieldLabel} />
              </div>

              <div className="mt-6 space-y-3">
                {data.relatorios.toggles.map((toggle) => (
                  <Toggle key={toggle.id} toggle={toggle} disabled={disabled} />
                ))}
              </div>
            </section>
          )}

          {activeSection === "seguranca" && (
            <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                {data.seguranca.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.seguranca.description}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  field={data.seguranca.fields.autenticacao}
                  emptyLabel={data.emptyFieldLabel}
                />
                <Field field={data.seguranca.fields.sessao} emptyLabel={data.emptyFieldLabel} />
                <Field
                  field={data.seguranca.fields.ultimoAcesso}
                  emptyLabel={data.emptyFieldLabel}
                />
              </div>

              <div className="mt-6 space-y-3">
                {data.seguranca.toggles.map((toggle) => (
                  <Toggle key={toggle.id} toggle={toggle} disabled={disabled} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

function SectionLink({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
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

function Field({ field, emptyLabel }: { field: ConfiguracoesField; emptyLabel: string }) {
  const isEmpty = !field.value
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {field.label}
      </label>
      <div
        className={`mt-1.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm ${
          isEmpty ? "font-medium text-muted-foreground" : "font-semibold"
        }`}
        style={isEmpty ? undefined : { color: "var(--brand-navy)" }}
      >
        {isEmpty ? emptyLabel : field.value}
      </div>
      {field.hint && <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>}
    </div>
  )
}

function Toggle({
  toggle,
  disabled = false,
}: {
  toggle: ConfiguracoesToggle
  disabled?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3.5 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
          {toggle.label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{toggle.description}</p>
      </div>
      <span
        aria-hidden
        role="switch"
        aria-checked={toggle.on}
        aria-disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          disabled ? "cursor-not-allowed" : ""
        }`}
        style={{ backgroundColor: toggle.on ? "var(--brand-green)" : "var(--slate-300)" }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
          style={{ transform: toggle.on ? "translateX(22px)" : "translateX(4px)" }}
        />
      </span>
    </div>
  )
}
