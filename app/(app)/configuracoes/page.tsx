"use client"

import Link from "next/link"
import { Upload, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import {
  useConfiguracoesData,
  type ConfiguracoesField,
  type ConfiguracoesToggle,
  type ConfiguracoesUserProfile,
} from "@/lib/hooks/use-configuracoes-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"

export default function ConfiguracoesPage() {
  const user = useCurrentUser()
  const data = useConfiguracoesData({ name: user.name, email: user.email })

  return (
    <>
      <PageHeader
        eyebrow={data.header.eyebrow}
        title={data.header.title}
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
              <Upload className="h-4 w-4" strokeWidth={2} />
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
            <Upload className="h-3.5 w-3.5" strokeWidth={2.2} />
            {data.banner.ctaLabel}
          </Link>
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
            {data.empresa.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.empresa.description}</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field field={data.empresa.fields.cnpj} emptyLabel={data.emptyFieldLabel} />
            </div>
            <Field field={data.empresa.fields.razaoSocial} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.setor} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.regime} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.apelido} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.moeda} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.inicioFiscal} emptyLabel={data.emptyFieldLabel} />
            <Field
              field={data.empresa.fields.contatoResponsavel}
              emptyLabel={data.emptyFieldLabel}
            />
            <Field
              field={data.empresa.fields.emailResponsavel}
              emptyLabel={data.emptyFieldLabel}
            />
            <Field field={data.empresa.fields.telefone} emptyLabel={data.emptyFieldLabel} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
            {data.equipe.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.equipe.description}</p>

          <div className="mt-6 space-y-2">
            {data.equipe.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
                    {user.nome}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
                </div>
                <ProfileBadge
                  perfil={user.perfil}
                  label={data.equipe.profileLabels[user.perfil]}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition hover:border-[var(--brand-blue)]/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            {data.equipe.addLabel}
          </button>
        </section>
      </div>
    </>
  )
}

const PROFILE_BADGE_STYLES: Record<ConfiguracoesUserProfile, { bg: string; color: string }> = {
  admin: { bg: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" },
  financeiro: { bg: "rgba(56,184,232,0.12)", color: "var(--brand-navy)" },
  contador: { bg: "var(--muted)", color: "var(--brand-navy)" },
  leitura: { bg: "var(--muted)", color: "var(--slate-600)" },
}

function ProfileBadge({ perfil, label }: { perfil: ConfiguracoesUserProfile; label: string }) {
  const styles = PROFILE_BADGE_STYLES[perfil]
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: styles.bg, color: styles.color }}
    >
      {label}
    </span>
  )
}

function Field({ field, emptyLabel }: { field: ConfiguracoesField; emptyLabel: string }) {
  const isEmpty = !field.value
  return (
    <div>
      <label className="flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {field.label}
        {field.source === "auto" && (
          <span
            className="ml-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
          >
            AUTO
          </span>
        )}
      </label>
      <div
        className={`mt-1.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm ${
          isEmpty ? "font-medium text-muted-foreground" : "font-semibold"
        }`}
        style={isEmpty ? undefined : { color: "var(--brand-navy)" }}
      >
        {isEmpty ? field.placeholder ?? emptyLabel : field.value}
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
