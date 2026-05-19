"use client"

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import { Upload, Plus, CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import {
  useConfiguracoesData,
  type ConfiguracoesField,
  type ConfiguracoesToggle,
  type ConfiguracoesUserProfile,
  type ConfiguracoesUser,
} from "@/lib/hooks/use-configuracoes-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import { useCompanyProfile } from "@/lib/hooks/use-company-profile"
import {
  updateCompanyProfileAction,
  importCnpjCardAction,
  type ProfileSaveState,
  type ImportCnpjState,
} from "@/lib/auth/profile-actions"

// Regimes permitidos pelo CHECK constraint do schema (companies.regime).
const REGIME_OPTIONS = [
  { value: "", label: "Selecionar regime tributário" },
  { value: "simples_nacional", label: "Simples Nacional" },
  { value: "lucro_presumido", label: "Lucro Presumido" },
  { value: "lucro_real", label: "Lucro Real" },
  { value: "mei", label: "MEI" },
] as const

export default function ConfiguracoesPage() {
  const user = useCurrentUser()
  const data = useConfiguracoesData({ name: user.name, email: user.email })
  const { company, loading: companyLoading, refresh: refreshCompany } = useCompanyProfile()
  const cnpjFileInputRef = useRef<HTMLInputElement>(null)

  // Form da empresa — controlado, sincroniza com `company` quando carrega/refresh.
  // Campos vindos do DB (CP#03.5) + campos do bloco Empresa da UI antiga.
  const [empresaForm, setEmpresaForm] = useState({
    name: "",
    short_name: "",
    cnpj: "",
    regime: "",
    telefone: "",
    email: "",
    contato_responsavel: "",
    // Campos do Cartão CNPJ (visíveis abaixo dos campos manuais)
    endereco_completo: "",
    cnae_principal_codigo: "",
    cnae_principal_descricao: "",
    porte: "",
    situacao_cadastral: "",
    data_situacao_cadastral: "",
    data_abertura: "",
    // Metadata do import (escondido, vai junto com o save)
    cartao_cnpj_file_name: "",
    cartao_cnpj_imported_at: "",
  })

  // Carrega do DB quando company chega.
  useEffect(() => {
    if (!company) return
    setEmpresaForm({
      name: company.name ?? "",
      short_name: company.short_name ?? "",
      cnpj: company.cnpj ?? "",
      regime: company.regime ?? "",
      telefone: company.telefone ?? "",
      email: company.email ?? "",
      contato_responsavel: company.contato_responsavel ?? "",
      endereco_completo: company.endereco_completo ?? "",
      cnae_principal_codigo: company.cnae_principal_codigo ?? "",
      cnae_principal_descricao: company.cnae_principal_descricao ?? "",
      porte: company.porte ?? "",
      situacao_cadastral: company.situacao_cadastral ?? "",
      data_situacao_cadastral: company.data_situacao_cadastral ?? "",
      data_abertura: company.data_abertura ?? "",
      cartao_cnpj_file_name: company.cartao_cnpj_file_name ?? "",
      cartao_cnpj_imported_at: company.cartao_cnpj_imported_at ?? "",
    })
  }, [company])

  function updateEmpresa<K extends keyof typeof empresaForm>(k: K, v: string) {
    setEmpresaForm((s) => ({ ...s, [k]: v }))
  }

  // --- Save action (UPDATE companies) ----------------------------
  const [saveState, saveDispatch, savePending] = useActionState<
    ProfileSaveState | undefined,
    FormData
  >(updateCompanyProfileAction, undefined)

  useEffect(() => {
    if (saveState?.ok) refreshCompany()
  }, [saveState, refreshCompany])

  // --- Import Cartão CNPJ (extract → autofill, não salva) --------
  const [importState, importDispatch, importPending] = useActionState<
    ImportCnpjState | undefined,
    FormData
  >(importCnpjCardAction, undefined)

  // Quando import retorna fields, popular form (autofill).
  useEffect(() => {
    if (!importState?.ok || !importState.fields) return
    const f = importState.fields
    setEmpresaForm((prev) => ({
      ...prev,
      // Razão social, fantasia, CNPJ só sobrescrevem se PDF trouxer
      name: f.nomeEmpresarial ?? prev.name,
      short_name: f.nomeFantasia ?? prev.short_name,
      cnpj: f.cnpj ?? prev.cnpj,
      // Regime NÃO vem do cartão — não tocar (decisão CP#03.5)
      telefone: f.telefone ?? prev.telefone,
      email: f.email ?? prev.email,
      // contato_responsavel também não vem do cartão
      endereco_completo: f.enderecoCompleto ?? prev.endereco_completo,
      cnae_principal_codigo: f.cnaePrincipalCodigo ?? prev.cnae_principal_codigo,
      cnae_principal_descricao: f.cnaePrincipalDescricao ?? prev.cnae_principal_descricao,
      porte: f.porte ?? prev.porte,
      situacao_cadastral: f.situacaoCadastral ?? prev.situacao_cadastral,
      data_situacao_cadastral: f.dataSituacaoCadastral ?? prev.data_situacao_cadastral,
      data_abertura: f.dataAbertura ?? prev.data_abertura,
      cartao_cnpj_file_name: importState.fileName ?? prev.cartao_cnpj_file_name,
      cartao_cnpj_imported_at: importState.importedAt ?? prev.cartao_cnpj_imported_at,
    }))
  }, [importState])

  function handleCnpjFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    // dispatch de useActionState precisa ser chamado dentro de um
    // transition para o React rastrear o pending corretamente.
    startTransition(() => {
      importDispatch(fd)
    })
    // Limpa o input para permitir reimport do mesmo arquivo
    e.target.value = ""
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

  return (
    <>
      <PageHeader eyebrow={data.header.eyebrow} title={data.header.title} />

      {/* Banner de upload do Cartão CNPJ — sempre visível, é o caminho oficial */}
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
              Importe o PDF do Cartão CNPJ para preencher automaticamente os campos abaixo. Você revisa antes de salvar.
            </p>
            {importState?.ok && importState.fields && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-green-dark)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Campos preenchidos com base em {importState.fileName}. Revise e clique em Salvar.
              </p>
            )}
            {importState && !importState.ok && importState.error && (
              <p className="mt-1 text-xs font-medium text-[var(--brand-red)]">{importState.error}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => cnpjFileInputRef.current?.click()}
          disabled={importPending || companyLoading}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" strokeWidth={2.2} />
          {importPending ? "Lendo..." : data.banner.ctaLabel}
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

      <div className="space-y-6">
        {/* ============================================================ */}
        {/* SEÇÃO EMPRESA (com persistência real) - CP#03.5             */}
        {/* ============================================================ */}
        <form action={saveDispatch}>
          {/* Hidden fields para campos do Cartão CNPJ que precisam ir ao DB */}
          <input type="hidden" name="endereco_completo" value={empresaForm.endereco_completo} />
          <input type="hidden" name="cnae_principal_codigo" value={empresaForm.cnae_principal_codigo} />
          <input type="hidden" name="cnae_principal_descricao" value={empresaForm.cnae_principal_descricao} />
          <input type="hidden" name="porte" value={empresaForm.porte} />
          <input type="hidden" name="situacao_cadastral" value={empresaForm.situacao_cadastral} />
          <input type="hidden" name="data_situacao_cadastral" value={empresaForm.data_situacao_cadastral} />
          <input type="hidden" name="data_abertura" value={empresaForm.data_abertura} />
          <input type="hidden" name="cartao_cnpj_file_name" value={empresaForm.cartao_cnpj_file_name} />
          <input type="hidden" name="cartao_cnpj_imported_at" value={empresaForm.cartao_cnpj_imported_at} />

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--brand-navy)" }}>
                  {data.empresa.title}
                </h2>
                {data.empresa.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{data.empresa.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {saveState?.ok && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-green-dark)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Perfil salvo
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savePending || companyLoading}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--brand-navy)] px-4 text-xs font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:opacity-60"
                >
                  {savePending ? "Salvando..." : "Salvar perfil"}
                </button>
              </div>
            </div>

            {saveState && !saveState.ok && saveState.error && (
              <p className="mt-3 rounded-lg border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/5 px-3 py-2 text-xs text-[var(--brand-red)]">
                {saveState.error}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* CNPJ — destaque, coluna inteira */}
              <div className="md:col-span-2">
                <EditableField
                  field={data.empresa.fields.cnpj}
                  name="cnpj"
                  value={empresaForm.cnpj}
                  onChange={(v) => updateEmpresa("cnpj", v)}
                  emptyLabel={data.emptyFieldLabel}
                />
              </div>

              {/* Razão social */}
              <EditableField
                field={data.empresa.fields.razaoSocial}
                name="name"
                value={empresaForm.name}
                onChange={(v) => updateEmpresa("name", v)}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Setor (CNAE descrição — read-only, vem do import) */}
              <ReadOnlyField
                label={data.empresa.fields.setor.label}
                value={
                  empresaForm.cnae_principal_descricao
                    ? `${empresaForm.cnae_principal_codigo ? empresaForm.cnae_principal_codigo + " — " : ""}${empresaForm.cnae_principal_descricao}`
                    : ""
                }
                emptyLabel={data.emptyFieldLabel}
                hint="Do Cartão CNPJ (CNAE principal)"
              />

              {/* Regime — select manual */}
              <RegimeSelect
                value={empresaForm.regime}
                onChange={(v) => updateEmpresa("regime", v)}
                label={data.empresa.fields.regime.label}
              />

              {/* Apelido (short_name) */}
              <EditableField
                field={data.empresa.fields.apelido}
                name="short_name"
                value={empresaForm.short_name}
                onChange={(v) => updateEmpresa("short_name", v)}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Moeda — fixture, sem persistência (CP#03.5 §D3) */}
              <ReadOnlyField
                label={data.empresa.fields.moeda.label}
                value={data.empresa.fields.moeda.value ?? ""}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Início fiscal — fixture, sem persistência */}
              <ReadOnlyField
                label={data.empresa.fields.inicioFiscal.label}
                value={data.empresa.fields.inicioFiscal.value ?? ""}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Contato responsável */}
              <EditableField
                field={data.empresa.fields.contatoResponsavel}
                name="contato_responsavel"
                value={empresaForm.contato_responsavel}
                onChange={(v) => updateEmpresa("contato_responsavel", v)}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* E-mail */}
              <EditableField
                field={data.empresa.fields.emailResponsavel}
                name="email"
                value={empresaForm.email}
                onChange={(v) => updateEmpresa("email", v)}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Telefone */}
              <EditableField
                field={data.empresa.fields.telefone}
                name="telefone"
                value={empresaForm.telefone}
                onChange={(v) => updateEmpresa("telefone", v)}
                emptyLabel={data.emptyFieldLabel}
              />

              {/* Endereço completo — read-only, vem do cartão */}
              <div className="md:col-span-2">
                <ReadOnlyField
                  label="Endereço"
                  value={empresaForm.endereco_completo}
                  emptyLabel={data.emptyFieldLabel}
                  hint="Do Cartão CNPJ"
                />
              </div>

              {/* Linha de metadata cadastral RFB */}
              <ReadOnlyField
                label="Porte"
                value={empresaForm.porte}
                emptyLabel={data.emptyFieldLabel}
                hint="Do Cartão CNPJ (RFB)"
              />
              <ReadOnlyField
                label="Situação cadastral"
                value={
                  empresaForm.situacao_cadastral
                    ? `${empresaForm.situacao_cadastral}${empresaForm.data_situacao_cadastral ? " · " + formatBRDate(empresaForm.data_situacao_cadastral) : ""}`
                    : ""
                }
                emptyLabel={data.emptyFieldLabel}
                hint="Do Cartão CNPJ (RFB)"
              />
              <ReadOnlyField
                label="Data de abertura"
                value={empresaForm.data_abertura ? formatBRDate(empresaForm.data_abertura) : ""}
                emptyLabel={data.emptyFieldLabel}
                hint="Do Cartão CNPJ (RFB)"
              />
              {empresaForm.cartao_cnpj_file_name && (
                <ReadOnlyField
                  label="Último cartão importado"
                  value={`${empresaForm.cartao_cnpj_file_name}${empresaForm.cartao_cnpj_imported_at ? " · " + formatBRDateTime(empresaForm.cartao_cnpj_imported_at) : ""}`}
                  emptyLabel={data.emptyFieldLabel}
                />
              )}
            </div>
          </section>
        </form>

        {/* ============================================================ */}
        {/* SEÇÃO EQUIPE (sem persistência — CP#03.5 §D3)               */}
        {/* ============================================================ */}
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

// ---------- helpers de formatação --------------------------------

function formatBRDate(iso: string): string {
  // "2002-08-01" → "01/08/2002"
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

function formatBRDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
  } catch {
    return iso
  }
}

// ---------- subcomponentes ---------------------------------------

const PROFILE_BADGE_STYLES: Record<ConfiguracoesUserProfile, { bg: string; color: string }> = {
  admin: { bg: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" },
  operacional: { bg: "rgba(56,184,232,0.12)", color: "var(--brand-navy)" },
  contador: { bg: "var(--muted)", color: "var(--brand-navy)" },
  leitura: { bg: "var(--muted)", color: "var(--slate-600)" },
}

function EditableField({
  field,
  name,
  value,
  onChange,
  emptyLabel,
}: {
  field: ConfiguracoesField
  name: string
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
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? emptyLabel}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-[var(--brand-navy)] placeholder:font-medium placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
      />
      {field.hint && <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>}
    </div>
  )
}

function ReadOnlyField({
  label,
  value,
  emptyLabel,
  hint,
}: {
  label: string
  value: string
  emptyLabel: string
  hint?: string
}) {
  return (
    <div>
      <label className="flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        <span
          className="ml-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
        >
          AUTO
        </span>
      </label>
      <div
        className="mt-1.5 w-full rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-semibold text-[var(--brand-navy)]"
        style={{ minHeight: "2.5rem" }}
      >
        {value || <span className="font-medium text-muted-foreground">{emptyLabel}</span>}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function RegimeSelect({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div>
      <label className="flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <select
        name="regime"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-[var(--brand-navy)] transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
      >
        {REGIME_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Regime tributário não vem do Cartão CNPJ — selecione manualmente.
      </p>
    </div>
  )
}

// Toggle existe no hook mas não é usado neste arquivo após a refatoração
// CP#03.5 (outros blocos sem persistência ainda). Tipos importados acima
// servem só para a forma do hook continuar válida.
// Evita warning de imports não usados:
type _UnusedToggle = ConfiguracoesToggle
