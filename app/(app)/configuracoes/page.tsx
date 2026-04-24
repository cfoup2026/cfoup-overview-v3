"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Bell, Building2, Shield, Gauge, Mail, AlertTriangle, ArrowRight } from "lucide-react"
import {
  useConfiguracoesData,
  type ConfiguracoesSectionId,
  type ConfigField,
  type ConfigToggle,
} from "@/lib/hooks/use-configuracoes-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"

const SECTION_ICON: Record<ConfiguracoesSectionId, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  empresa: Building2,
  metas: Gauge,
  alertas: Bell,
  relatorios: Mail,
  seguranca: Shield,
}

const SECTION_ORDER: ConfiguracoesSectionId[] = [
  "empresa",
  "metas",
  "alertas",
  "relatorios",
  "seguranca",
]

export default function ConfiguracoesPage() {
  const data = useConfiguracoesData()
  const user = useCurrentUser()
  const [activeSection, setActiveSection] = useState<ConfiguracoesSectionId>("empresa")

  const { hasConnections, header, banner, emptyValueLabel, sections } = data

  // O campo "Contato responsável" sempre reflete o usuário logado.
  const segurancaFields: ConfigField[] = sections.seguranca.fields.map((f) =>
    f.label === "Contato responsável" ? { ...f, value: user.name } : f,
  )

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} description={header.description} />

      {!hasConnections && (
        <div
          role="status"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--amber-100, #fef3c7)" }}
            >
              <AlertTriangle className="h-4 w-4" strokeWidth={1.8} style={{ color: "var(--amber-700, #b45309)" }} />
            </span>
            <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
              {banner.title}
            </p>
          </div>
          <Link
            href={banner.ctaHref}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition sm:self-auto"
            style={{ backgroundColor: "var(--brand-navy)" }}
          >
            {banner.ctaLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Seções" className="rounded-2xl border border-border bg-card p-3 h-fit">
          {SECTION_ORDER.map((id) => (
            <SectionLink
              key={id}
              icon={SECTION_ICON[id]}
              label={sections[id].menuLabel}
              active={activeSection === id}
              onClick={() => setActiveSection(id)}
            />
          ))}
        </nav>

        <div className="space-y-6">
          {activeSection === "empresa" && (
            <FieldsSection
              titulo={sections.empresa.titulo}
              descricao={sections.empresa.descricao}
              fields={sections.empresa.fields}
              emptyValueLabel={emptyValueLabel}
            />
          )}

          {activeSection === "metas" && (
            <FieldsSection
              titulo={sections.metas.titulo}
              descricao={sections.metas.descricao}
              fields={sections.metas.fields}
              emptyValueLabel={emptyValueLabel}
            />
          )}

          {activeSection === "alertas" && (
            <TogglesSection
              titulo={sections.alertas.titulo}
              descricao={sections.alertas.descricao}
              toggles={sections.alertas.toggles}
              disabled={!hasConnections}
            />
          )}

          {activeSection === "relatorios" && (
            <TogglesSection
              titulo={sections.relatorios.titulo}
              descricao={sections.relatorios.descricao}
              toggles={sections.relatorios.toggles}
              disabled={!hasConnections}
            />
          )}

          {activeSection === "seguranca" && (
            <FieldsSection
              titulo={sections.seguranca.titulo}
              descricao={sections.seguranca.descricao}
              fields={segurancaFields}
              emptyValueLabel={emptyValueLabel}
            />
          )}
        </div>
      </div>
    </>
  )
}

function FieldsSection({
  titulo,
  descricao,
  fields,
  emptyValueLabel,
}: {
  titulo: string
  descricao: string
  fields: ConfigField[]
  emptyValueLabel: string
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
      <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
        {titulo}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <Field
            key={field.label}
            label={field.label}
            value={field.value}
            hint={field.hint}
            emptyValueLabel={emptyValueLabel}
          />
        ))}
      </div>
    </section>
  )
}

function TogglesSection({
  titulo,
  descricao,
  toggles,
  disabled,
}: {
  titulo: string
  descricao: string
  toggles: ConfigToggle[]
  disabled: boolean
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-7 md:p-8">
      <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
        {titulo}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
      <div className="mt-6 space-y-3">
        {toggles.map((t) => (
          <Toggle
            key={t.id}
            label={t.label}
            description={t.description}
            on={t.on && !disabled}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
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

function Field({
  label,
  value,
  hint,
  emptyValueLabel,
}: {
  label: string
  value: string | null
  hint?: string
  emptyValueLabel: string
}) {
  const isEmpty = value === null || value === ""
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <div
        className="mt-1.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold"
        style={{ color: isEmpty ? "var(--slate-400, #94a3b8)" : "var(--brand-navy)" }}
      >
        {isEmpty ? emptyValueLabel : value}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function Toggle({
  label,
  description,
  on = false,
  disabled = false,
}: {
  label: string
  description: string
  on?: boolean
  disabled?: boolean
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3.5"
      style={{ opacity: disabled ? 0.55 : 1 }}
    >
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
        aria-disabled={disabled}
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
