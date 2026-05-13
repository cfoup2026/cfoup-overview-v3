"use client"

import { Info } from "lucide-react"
import {
  groupClassificationExceptions,
} from "cfoup-core"
import type {
  ClassificationResult,
  ExceptionReason,
  GroupedException,
  SourceTransaction,
} from "cfoup-core"
import { PageHeader } from "@/components/page-header"

/**
 * /pendencias-setup → Itens em Aberto
 *
 * Tela de "Implantação" — limpeza inicial dos dados ingeridos pelos parsers.
 * Acontece UMA vez, antes do dono entrar na Mesa de Decisão.
 *
 * A rota permanece /pendencias-setup; o label visível foi atualizado para
 * "Itens em Aberto" (sidebar e PageHeader).
 *
 * Status de integração:
 *   - Todos os 4 cards exibem empty states honestos até dados reais chegarem.
 *   - Componentes auxiliares (SetupStat, GroupRow, GroupActionButton, etc.)
 *     foram preservados para reuso quando hook real for plugado.
 */

// =====================================================================
// Tipos
// =====================================================================
type ReceivableRow = {
  id: string
  vencimento: string
  contraparte: string
  valor: number
  diasAtraso: number
}

type IssueRow = {
  id: string
  emissao: string
  contraparte: string
  valor: number
  vencimentoInferido: string
}

// =====================================================================
// Helpers
// =====================================================================
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
})

// =====================================================================
// Página
// =====================================================================
export default function PendenciasSetupPage() {
  // TODO: ler de hook real (hasConnections && dadosMinimosProcessados)
  const setupConcluivel = false

  return (
    <>
      <PageHeader
        eyebrow="Implantação"
        title="Itens em Aberto"
        description="Limpeza inicial dos dados antes de você começar a usar o CFOup. Acontece uma vez."
      />

      {/* ============================================================ */}
      {/* CARDS                                                         */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4">
        <CardAntigosEmAberto />
        <CardVencimentosAConfirmar />
        <CardLancamentosSemClassificacao />
        <CardShell>
          <div className="p-5 md:p-6">
            <CardHeader title="Possíveis duplicidades" subtitle="Detecção de lançamentos repetidos no mesmo período" />
            <CardEmptyState message="Detecção de duplicidades será executada após importação de dados." />
          </div>
        </CardShell>
      </div>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <footer className="mt-10 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={!setupConcluivel}
            className="inline-flex items-center justify-center rounded-md bg-[var(--brand-navy)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:cursor-not-allowed disabled:opacity-50"
            title="Conecte pelo menos uma fonte de dados para concluir a implantação."
          >
            Concluir setup
          </button>
          <p className="text-[11px] text-muted-foreground">
            Conecte pelo menos uma fonte de dados para concluir a implantação.
          </p>
        </div>
        <a
          href="#"
          className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
        >
          Adiar para depois
        </a>
      </footer>
    </>
  )
}

// =====================================================================
// Componentes auxiliares
// =====================================================================

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      {children}
    </section>
  )
}

function CardHeader({
  title,
  subtitle,
  countLabel,
}: {
  title: string
  subtitle: string
  countLabel?: string
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-base font-bold leading-tight text-[var(--brand-navy)]">
          {title}
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
      </div>
      {countLabel && (
        <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
          {countLabel}
        </span>
      )}
    </div>
  )
}

function CardEmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-2 py-10 text-center">
      <p className="text-[13px] font-medium text-muted-foreground">{message}</p>
      {hint && <p className="max-w-md text-[12px] text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------
// CARD 1 — Itens antigos em aberto
// ---------------------------------------------------------------------
function CardAntigosEmAberto() {
  return (
    <CardShell>
      <div className="p-5 md:p-6">
        <CardHeader title="Itens antigos em aberto" subtitle="Vencidos há mais de 90 dias e ainda em aberto" />
        <CardEmptyState
          message="Nenhum dado importado ainda."
          hint="Conecte uma fonte ou importe arquivos para o CFOup identificar itens em aberto."
        />
      </div>
    </CardShell>
  )
}

// ---------------------------------------------------------------------
// CARD 2 — Vencimentos a confirmar
// ---------------------------------------------------------------------
function CardVencimentosAConfirmar() {
  return (
    <CardShell>
      <div className="p-5 md:p-6">
        <CardHeader title="Vencimentos a confirmar" subtitle="Notas A VISTA — vencimento inferido a partir da data de emissão" />
        <CardEmptyState
          message="Aguardando importação de notas fiscais."
          hint="Vencimentos a confirmar aparecem após importação de NF-e ou ERP."
        />
      </div>
    </CardShell>
  )
}

// ---------------------------------------------------------------------
// CARD 3 — Lançamentos sem classificação
// TODO: integrar hook real
//   const { groups, snapshot } = useSetupClassificationData()
//   se snapshot.pendingCount > 0 → renderizar grid de 4 SetupStat + <ul> com GroupRow.map(groups)
//   senão → <CardEmptyState ... />
// ---------------------------------------------------------------------

type GroupActionId =
  | "confirmar"
  | "trocar"
  | "aplicar"
  | "ignorar"
  | "manter"

const GROUP_ACTION_LABEL: Record<GroupActionId, string> = {
  confirmar: "Confirmar",
  trocar: "Trocar categoria",
  aplicar: "Aplicar a todos parecidos",
  ignorar: "Ignorar",
  manter: "Manter pendente",
}

interface MockClientDiagnostic {
  transactions: SourceTransaction[]
  results: ClassificationResult[]
  snapshot: {
    totalAnalyzed: number
    classifiedCount: number
    pendingCount: number
    totalGroups: number
  }
}

function CardLancamentosSemClassificacao() {
  return (
    <CardShell>
      <div className="p-5 md:p-6">
        <CardHeader title="Lançamentos sem classificação" subtitle="Motor cfoup-core · 12 categorias financeiras padrão" />
        <CardEmptyState
          message="Aguardando dados reais para análise."
          hint="Após importar dados, o motor agrupa pendências por contraparte e exibe sugestões de categoria."
        />
      </div>
    </CardShell>
  )
}

function SetupStat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[1.25rem] font-extrabold tabular-nums text-[var(--brand-navy)]">
        {value}
      </p>
      {hint !== undefined && (
        <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

/**
 * Extrai a contraparte de dentro das aspas no `groupLabel` produzido pelo
 * core (ex: `Classificação com baixa confiança — "AVANZI QUIMICA LTDA"`
 * → `AVANZI QUIMICA LTDA`). Cai no label inteiro se o formato não bater.
 */
function extractCounterparty(groupLabel: string): string {
  const m = groupLabel.match(/"([^"]+)"$/)
  return m?.[1] ?? groupLabel
}

function GroupRow({
  group,
  action,
  onAction,
}: {
  group: GroupedException
  action: GroupActionId | undefined
  onAction: (a: GroupActionId) => void
}) {
  const intFmt = new Intl.NumberFormat("pt-BR")
  const counterparty = extractCounterparty(group.groupLabel)
  const suggestion = group.suggestedOwnerLabel
  return (
    <li className="py-3 first:pt-0">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[var(--brand-navy)]">
            {counterparty}
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
            <span className="font-medium text-[var(--brand-navy)]">
              {intFmt.format(group.count)}
            </span>{" "}
            transações
            <span className="mx-1.5 opacity-60">·</span>
            <span>total {brl.format(group.totalAmount)}</span>
            {suggestion !== undefined && (
              <>
                <span className="mx-1.5 opacity-60">·</span>
                sugestão:{" "}
                <span className="font-medium text-[var(--brand-navy)]">
                  {suggestion}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <GroupActionButton
            label={GROUP_ACTION_LABEL.confirmar}
            color="var(--brand-green)"
            active={action === "confirmar"}
            onClick={() => onAction("confirmar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.trocar}
            color="var(--brand-blue)"
            active={action === "trocar"}
            onClick={() => onAction("trocar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.aplicar}
            color="var(--brand-cyan)"
            active={action === "aplicar"}
            onClick={() => onAction("aplicar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.ignorar}
            color="var(--brand-error-soft)"
            active={action === "ignorar"}
            onClick={() => onAction("ignorar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.manter}
            color="var(--muted-foreground)"
            active={action === "manter"}
            ghost
            onClick={() => onAction("manter")}
          />
        </div>
      </div>
      {action !== undefined && (
        <p className="mt-1.5 text-[11px] italic text-muted-foreground">
          {GROUP_ACTION_LABEL[action]} — ação visual local, ainda sem
          persistência (contrato com cfoup-core não definido).
        </p>
      )}
    </li>
  )
}

function GroupActionButton({
  label,
  color,
  active,
  ghost,
  onClick,
}: {
  label: string
  color: string
  active: boolean
  ghost?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded px-2 py-1 text-[12px] font-medium transition hover:bg-muted"
      style={{
        color: active ? "#FFFFFF" : color,
        background: active ? color : ghost ? "transparent" : undefined,
        border: active ? `1px solid ${color}` : `1px solid transparent`,
      }}
    >
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------
// Primitivos: Tab, Th, Td, RowActions (preservados para reuso futuro)
// ---------------------------------------------------------------------
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative -mb-px py-2.5 text-[13px] font-medium transition ${
        active ? "text-[var(--brand-navy)]" : "text-muted-foreground"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--brand-cyan)]"
        />
      )}
    </button>
  )
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className="px-3 pb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      style={{ textAlign: align }}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  align = "left",
  className = "",
  style,
}: {
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <td className={`px-3 py-3 text-[13px] ${className}`} style={{ textAlign: align, ...style }}>
      {children}
    </td>
  )
}

type Action = { label: string; color: string; ghost?: boolean }

function RowActions({ actions }: { actions: Action[] }) {
  return (
    <div className="inline-flex items-center gap-1">
      {actions.map((action, idx) => (
        <button
          key={action.label}
          type="button"
          className={`rounded px-2 py-1 text-[12px] font-medium transition hover:bg-muted ${
            idx > 0 ? "ml-0.5" : ""
          }`}
          style={{
            color: action.color,
            background: action.ghost ? "transparent" : undefined,
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
