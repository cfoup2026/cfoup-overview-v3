"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Upload, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import {
  useConfiguracoesData,
  type ConfiguracoesField,
  type ConfiguracoesToggle,
  type ConfiguracoesUserProfile,
  type ConfiguracoesUser,
} from "@/lib/hooks/use-configuracoes-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"

export default function ConfiguracoesPage() {
  const user = useCurrentUser()
  const data = useConfiguracoesData({ name: user.name, email: user.email })
  const cnpjFileInputRef = useRef<HTMLInputElement>(null)

  const [empresaForm, setEmpresaForm] = useState({
    cnpj: data.empresa.fields.cnpj.value ?? "",
    razaoSocial: data.empresa.fields.razaoSocial.value ?? "",
    setor: data.empresa.fields.setor.value ?? "",
    regime: data.empresa.fields.regime.value ?? "",
    apelido: data.empresa.fields.apelido.value ?? "",
    moeda: data.empresa.fields.moeda.value ?? "",
    inicioFiscal: data.empresa.fields.inicioFiscal.value ?? "",
    contato: data.empresa.fields.contatoResponsavel.value ?? "",
    email: data.empresa.fields.emailResponsavel.value ?? "",
    telefone: data.empresa.fields.telefone.value ?? "",
  })

  function updateEmpresa<K extends keyof typeof empresaForm>(k: K, v: string) {
    setEmpresaForm((s) => ({ ...s, [k]: v }))
  }

  const [users, setUsers] = useState<ConfiguracoesUser[]>(data.equipe.users)

  function addUser() {
    setUsers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), nome: "", email: "", perfil: "operacional" },
    ])
  }

  function updateUser(id: string, patch: Partial<Omit<ConfiguracoesUser, "id">>) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  function handleCnpjFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // TODO: parser real do cartão CNPJ (preencher empresa.fields automaticamente)
    console.log("Cartão CNPJ recebido:", file.name)
  }

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
          <button
            type="button"
            onClick={() => cnpjFileInputRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-blue)]"
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={2.2} />
            {data.banner.ctaLabel}
          </button>
          <input
            ref={cnpjFileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleCnpjFileSelected}
            className="hidden"
            aria-hidden
            tabIndex={-1}
          />
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
            {data.empresa.title}
          </h2>
          {data.empresa.description && (
            <p className="mt-1 text-sm text-muted-foreground">{data.empresa.description}</p>
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field field={data.empresa.fields.cnpj} value={empresaForm.cnpj} onChange={(v) => updateEmpresa("cnpj", v)} emptyLabel={data.emptyFieldLabel} />
            </div>
            <Field field={data.empresa.fields.razaoSocial} value={empresaForm.razaoSocial} onChange={(v) => updateEmpresa("razaoSocial", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.setor} value={empresaForm.setor} onChange={(v) => updateEmpresa("setor", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.regime} value={empresaForm.regime} onChange={(v) => updateEmpresa("regime", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.apelido} value={empresaForm.apelido} onChange={(v) => updateEmpresa("apelido", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.moeda} value={empresaForm.moeda} onChange={(v) => updateEmpresa("moeda", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.inicioFiscal} value={empresaForm.inicioFiscal} onChange={(v) => updateEmpresa("inicioFiscal", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.contatoResponsavel} value={empresaForm.contato} onChange={(v) => updateEmpresa("contato", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.emailResponsavel} value={empresaForm.email} onChange={(v) => updateEmpresa("email", v)} emptyLabel={data.emptyFieldLabel} />
            <Field field={data.empresa.fields.telefone} value={empresaForm.telefone} onChange={(v) => updateEmpresa("telefone", v)} emptyLabel={data.emptyFieldLabel} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
            {data.equipe.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.equipe.description}</p>

          <div className="mt-6 space-y-2">
            {users.map((u) => {
              const styles = PROFILE_BADGE_STYLES[u.perfil]
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <input
                      type="text"
                      value={u.nome}
                      onChange={(e) => updateUser(u.id, { nome: e.target.value })}
                      placeholder="Nome do usuário"
                      className="bg-transparent text-sm font-semibold text-[var(--brand-navy)] placeholder:font-medium placeholder:text-muted-foreground focus:outline-none"
                    />
                    <input
                      type="email"
                      value={u.email}
                      onChange={(e) => updateUser(u.id, { email: e.target.value })}
                      placeholder="email@empresa.com"
                      className="bg-transparent text-xs text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <select
                    value={u.perfil}
                    onChange={(e) => updateUser(u.id, { perfil: e.target.value as ConfiguracoesUserProfile })}
                    className="cursor-pointer appearance-none rounded-full px-2.5 py-1 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
                    style={{ background: styles.bg, color: styles.color }}
                  >
                    <option value="admin">Admin</option>
                    <option value="operacional">Operacional</option>
                    <option value="contador">Contador</option>
                    <option value="leitura">Leitura</option>
                  </select>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addUser}
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
  operacional: { bg: "rgba(56,184,232,0.12)", color: "var(--brand-navy)" },
  contador: { bg: "var(--muted)", color: "var(--brand-navy)" },
  leitura: { bg: "var(--muted)", color: "var(--slate-600)" },
}

function Field({
  field,
  value,
  onChange,
  emptyLabel,
}: {
  field: ConfiguracoesField
  value: string
  onChange: (v: string) => void
  emptyLabel: string
}) {
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? emptyLabel}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-[var(--brand-navy)] placeholder:font-medium placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
      />
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
