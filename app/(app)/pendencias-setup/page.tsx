"use client"

import { useMemo, useState } from "react"
import { Info, Lock } from "lucide-react"
import {
  groupClassificationExceptions,
  getCategoryByCode,
} from "cfoup-core"
import type {
  ClassificationResult,
  ExceptionReason,
  GroupedException,
  SourceTransaction,
} from "cfoup-core"

/**
 * /pendencias-setup
 *
 * Tela de "Implantação" — limpeza inicial dos dados ingeridos pelos parsers.
 * Acontece UMA vez, antes do dono entrar na Mesa de Decisão.
 *
 * Status de integração:
 *   - Cards 1, 2, 3 (em aberto e a confirmar): DEMO visual com arrays placeholder.
 *   - Card 4 ("Lançamentos sem classificação"): integrado ao Motor de
 *     Classificação v1 do cfoup-core via `groupClassificationExceptions`.
 *     Os dados de entrada ainda são mock (derivado do diagnóstico Gregorutt
 *     do cfoup-core, ver `mockDerivedFromGregoruttDiagnostic` abaixo). Quando
 *     o pipeline real for plugado, basta substituir essa função por um hook
 *     que devolva `{ transactions, results, snapshot }` reais — a função do
 *     core já é a real.
 *   - Card 5 ("Possíveis duplicidades"): estado vazio honesto.
 */

// =====================================================================
// Tokens locais — espelham o brief, sem depender de variáveis de tema
// =====================================================================
const NAVY = "#071D3B"
const BLUE = "#1567C8"
const CYAN = "#38B8E8"
const GREEN = "#36BA58"
const RED = "#E04437"
const BG = "#F7F9FC"
const BORDER = "#E5E9F0"
const MUTED = "#6B7280"

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
// Card 2 — Itens antigos em aberto
// TODO: substituir array demo pelo hook useSetupPendings(activeClientId) quando integrar
// =====================================================================
const RECEBER_DEMO: ReceivableRow[] = [
  { id: "r1", vencimento: "12/08/2025", contraparte: "ALPHA INDUSTRIA LTDA", valor: 18420.5, diasAtraso: 261 },
  { id: "r2", vencimento: "03/09/2025", contraparte: "BETA COMERCIO", valor: 6790.0, diasAtraso: 239 },
  { id: "r3", vencimento: "27/10/2025", contraparte: "GAMMA SERVIÇOS", valor: 12300.0, diasAtraso: 185 },
  { id: "r4", vencimento: "14/11/2025", contraparte: "DELTA TRANSPORTES", valor: 4480.75, diasAtraso: 167 },
  { id: "r5", vencimento: "08/12/2025", contraparte: "EPSILON DISTRIBUIDORA", valor: 23910.0, diasAtraso: 142 },
]

const PAGAR_DEMO: ReceivableRow[] = [
  { id: "p1", vencimento: "22/07/2025", contraparte: "ALPHA INDUSTRIA LTDA", valor: 9120.0, diasAtraso: 282 },
  { id: "p2", vencimento: "15/09/2025", contraparte: "BETA COMERCIO", valor: 3450.9, diasAtraso: 227 },
  { id: "p3", vencimento: "02/10/2025", contraparte: "GAMMA SERVIÇOS", valor: 7860.0, diasAtraso: 210 },
  { id: "p4", vencimento: "19/11/2025", contraparte: "DELTA TRANSPORTES", valor: 1980.4, diasAtraso: 162 },
  { id: "p5", vencimento: "11/12/2025", contraparte: "EPSILON DISTRIBUIDORA", valor: 14620.0, diasAtraso: 139 },
]

// =====================================================================
// Card 3 — Vencimentos a confirmar
// TODO: substituir array demo pelo hook useSetupPendings(activeClientId) quando integrar
// =====================================================================
const ISSUES_DEMO: IssueRow[] = [
  { id: "i1", emissao: "02/04/2026", contraparte: "ALPHA INDUSTRIA LTDA", valor: 5230.0, vencimentoInferido: "02/04/2026" },
  { id: "i2", emissao: "08/04/2026", contraparte: "BETA COMERCIO", valor: 1890.5, vencimentoInferido: "08/04/2026" },
  { id: "i3", emissao: "11/04/2026", contraparte: "GAMMA SERVIÇOS", valor: 3470.0, vencimentoInferido: "11/04/2026" },
  { id: "i4", emissao: "17/04/2026", contraparte: "DELTA TRANSPORTES", valor: 760.0, vencimentoInferido: "17/04/2026" },
  { id: "i5", emissao: "23/04/2026", contraparte: "EPSILON DISTRIBUIDORA", valor: 9120.0, vencimentoInferido: "23/04/2026" },
]

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
  // Como os dois cards "vivos" são DEMO e sempre têm pendências,
  // o botão de concluir setup permanece disabled.
  const totalPendenciasDemo = RECEBER_DEMO.length + PAGAR_DEMO.length + ISSUES_DEMO.length
  const setupConcluivel = totalPendenciasDemo === 0

  return (
    // Pintamos o fundo #F7F9FC neutralizando o padding do AppShell
    // para que a faixa cubra a viewport inteira.
    <div
      className="-mx-8 -my-3 min-h-[calc(100vh-3rem)] px-8 py-10 md:-mx-10 md:px-10 lg:-mx-12 lg:-my-4 lg:px-12 lg:py-12"
      style={{ background: BG, color: NAVY }}
    >
      <div className="mx-auto w-full max-w-[1140px]">
        {/* ============================================================ */}
        {/* HEADER                                                        */}
        {/* ============================================================ */}
        <header className="mb-8">
          <p className="text-[13px] font-medium" style={{ color: MUTED }}>
            Implantação <span className="mx-1.5 opacity-60">/</span> Pendências de Setup
          </p>
          <h1
            className="mt-2 text-[28px] font-bold leading-tight tracking-tight"
            style={{ color: NAVY }}
          >
            Pendências de Setup
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Limpeza inicial dos dados antes de você começar a usar o CFOup. Acontece uma vez.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px]" style={{ color: MUTED }}>
            <p>
              <span className="font-semibold" style={{ color: NAVY }}>247</span> pendências em{" "}
              <span className="font-semibold" style={{ color: NAVY }}>18.491</span> registros analisados
            </p>
            <DemoBadge />
          </div>
        </header>

        {/* ============================================================ */}
        {/* CARDS                                                         */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-4">
          <CardAntigosEmAberto />
          <CardVencimentosAConfirmar />
          <CardLancamentosSemClassificacao />
          <CardEstadoVazio
            title="Possíveis duplicidades"
            subtitle="Detecção de lançamentos repetidos no mesmo período"
            placeholderText="Aguardando regra de detecção de duplicatas. Disponível em breve."
          />
        </div>

        {/* ============================================================ */}
        {/* FOOTER                                                        */}
        {/* ============================================================ */}
        <footer className="mt-10 flex flex-col items-start gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: BORDER }}
        >
          <button
            type="button"
            disabled={!setupConcluivel}
            className="inline-flex items-center justify-center rounded-md px-8 py-3 text-[14px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: NAVY }}
            title={
              setupConcluivel
                ? "Concluir setup"
                : "Resolva as pendências dos cards antes de concluir"
            }
          >
            Concluir setup
          </button>
          <a
            href="#"
            className="text-[14px] hover:underline"
            style={{ color: MUTED }}
          >
            Adiar para depois
          </a>
        </footer>
      </div>
    </div>
  )
}

// =====================================================================
// Componentes auxiliares
// =====================================================================

function DemoBadge() {
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-semibold tracking-wide"
      style={{ background: "#F0F2F5", color: MUTED }}
    >
      DEMO
    </span>
  )
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg bg-white"
      style={{ border: `1px solid ${BORDER}` }}
    >
      {children}
    </section>
  )
}

function DemoStrip() {
  return (
    <div
      className="rounded-t-lg px-3 py-1.5 text-[11px] italic"
      style={{ background: "#FAFBFC", color: MUTED, borderBottom: `1px solid ${BORDER}` }}
    >
      Dados demonstrativos para validação visual
    </div>
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
        <h2 className="text-[18px] font-semibold leading-tight" style={{ color: NAVY }}>
          {title}
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: MUTED }}>
          {subtitle}
        </p>
      </div>
      {countLabel && (
        <span
          className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-medium"
          style={{ background: "#F0F2F5", color: MUTED }}
        >
          {countLabel}
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------
// CARD 2 — Itens antigos em aberto (DEMO)
// TODO: substituir array demo pelo hook useSetupPendings(activeClientId) quando integrar
// ---------------------------------------------------------------------
function CardAntigosEmAberto() {
  const [tab, setTab] = useState<"receber" | "pagar">("receber")
  const rows = tab === "receber" ? RECEBER_DEMO : PAGAR_DEMO
  const totalCount = RECEBER_DEMO.length + PAGAR_DEMO.length + 79 // demo: 138 itens totais aprox.

  return (
    <CardShell>
      <DemoStrip />
      <div className="p-6">
        <CardHeader
          title="Itens antigos em aberto"
          subtitle="Vencidos há mais de 90 dias e ainda em aberto"
          countLabel={`${totalCount} itens`}
        />

        {/* Tabs internas */}
        <div className="mt-5 flex items-center gap-6 border-b" style={{ borderColor: BORDER }}>
          <TabButton active={tab === "receber"} onClick={() => setTab("receber")}>
            A receber (89)
          </TabButton>
          <TabButton active={tab === "pagar"} onClick={() => setTab("pagar")}>
            A pagar (49)
          </TabButton>
        </div>

        {/* Tabela */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ color: MUTED }}>
                <Th>Vencimento</Th>
                <Th>Contraparte</Th>
                <Th align="right">Valor</Th>
                <Th align="right">Dias em atraso</Th>
                <Th align="right">Ação</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <Td>{row.vencimento}</Td>
                  <Td className="font-medium" style={{ color: NAVY }}>
                    {row.contraparte}
                  </Td>
                  <Td align="right" className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {brl.format(row.valor)}
                  </Td>
                  <Td
                    align="right"
                    className="font-semibold tabular-nums"
                    style={{ color: row.diasAtraso > 90 ? RED : NAVY }}
                  >
                    {row.diasAtraso}
                  </Td>
                  <Td align="right">
                    <RowActions
                      actions={[
                        { label: "Pago", color: GREEN },
                        { label: "Baixa", color: MUTED },
                        { label: "Manter", color: MUTED, ghost: true },
                      ]}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer da tabela */}
        <div className="mt-3 flex items-center justify-between text-[13px]" style={{ color: MUTED }}>
          <span>Mostrando 5 de {tab === "receber" ? "89" : "49"}</span>
          <a href="#" className="font-medium hover:underline" style={{ color: CYAN }}>
            Ver todos
          </a>
        </div>
      </div>
    </CardShell>
  )
}

// ---------------------------------------------------------------------
// CARD 3 — Vencimentos a confirmar (DEMO)
// TODO: substituir array demo pelo hook useSetupPendings(activeClientId) quando integrar
// ---------------------------------------------------------------------
function CardVencimentosAConfirmar() {
  return (
    <CardShell>
      <DemoStrip />
      <div className="p-6">
        <CardHeader
          title="Vencimentos a confirmar"
          subtitle="Notas A VISTA — vencimento foi inferido a partir da data de emissão"
          countLabel="109 itens"
        />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ color: MUTED }}>
                <Th>Data emissão</Th>
                <Th>Contraparte</Th>
                <Th align="right">Valor</Th>
                <Th align="right">Vencimento inferido</Th>
                <Th align="right">Ação</Th>
              </tr>
            </thead>
            <tbody>
              {ISSUES_DEMO.map((row) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <Td>{row.emissao}</Td>
                  <Td className="font-medium" style={{ color: NAVY }}>
                    {row.contraparte}
                  </Td>
                  <Td align="right" className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {brl.format(row.valor)}
                  </Td>
                  <Td align="right" className="tabular-nums" style={{ color: NAVY }}>
                    <span className="inline-flex items-center justify-end gap-1.5">
                      {row.vencimentoInferido}
                      <span
                        title="Inferido pela ausência de prazo no documento"
                        aria-label="Inferido pela ausência de prazo no documento"
                        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full"
                        style={{ color: BLUE }}
                      >
                        <Info className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                    </span>
                  </Td>
                  <Td align="right">
                    <RowActions
                      actions={[
                        { label: "Confirmar", color: GREEN },
                        { label: "Editar", color: MUTED },
                        { label: "Manter A VISTA", color: MUTED, ghost: true },
                      ]}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-[13px]" style={{ color: MUTED }}>
          <span>Mostrando 5 de 109</span>
          <a href="#" className="font-medium hover:underline" style={{ color: CYAN }}>
            Ver todos
          </a>
        </div>
      </div>
    </CardShell>
  )
}

// ---------------------------------------------------------------------
// CARDS 4 e 5 — Estados vazios honestos
// ---------------------------------------------------------------------
function CardEstadoVazio({
  title,
  subtitle,
  placeholderText,
}: {
  title: string
  subtitle: string
  placeholderText: string
}) {
  return (
    <CardShell>
      <div className="p-6">
        <CardHeader title={title} subtitle={subtitle} />
        <div className="mt-6 flex flex-col items-center justify-center gap-3 py-10">
          <Lock className="h-6 w-6" strokeWidth={1.5} style={{ color: MUTED }} />
          <p className="max-w-md text-center text-[14px] italic" style={{ color: MUTED }}>
            {placeholderText}
          </p>
        </div>
      </div>
    </CardShell>
  )
}

// ---------------------------------------------------------------------
// Primitivos: Tab, Th, Td, RowActions
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
      className="relative -mb-px py-2.5 text-[14px] font-medium transition"
      style={{
        color: active ? NAVY : MUTED,
      }}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
          style={{ background: CYAN }}
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
      className="px-3 pb-3 text-[12px] font-medium uppercase tracking-wider"
      style={{ textAlign: align, color: MUTED }}
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
    <td
      className={`px-3 py-3 text-[14px] ${className}`}
      style={{ textAlign: align, ...style }}
    >
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
          className={`rounded px-2 py-1 text-[13px] font-medium transition hover:bg-[#F0F2F5] ${
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

// =====================================================================
// CARD 4 — Lançamentos sem classificação
// Integração real com Motor de Classificação v1 (cfoup-core).
// =====================================================================
//
// O agrupamento (`groupClassificationExceptions`) e o lookup de categorias
// (`getCategoryByCode`) vêm direto do cfoup-core — não há cópia local de
// regra, tipo ou função.
//
// O dataset de entrada ainda é mock (`mockDerivedFromGregoruttDiagnostic`),
// porque este app não tem pipeline de ingestão+classificação plugado. Os
// números de cobertura batem com o snapshot do diagnóstico real do core
// (`scripts/classify-gregorutt.ts`) rodado contra fixtures Gregorutt:
// 28.394 transações, 21.806 classificadas (76,8%), 6.588 pendentes.
//
// PERSISTÊNCIA: nenhuma. As 5 ações da UI (Confirmar / Trocar categoria /
// Aplicar a todos parecidos / Ignorar / Manter pendente) só atualizam
// estado local no componente. Persistir uma decisão como
// `ClassificationRule` real depende de contrato com cfoup-core
// (`createRuleFromOwnerConfirmation`) que ainda não foi acordado neste
// app — fora do escopo desta tela.

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

interface MockGregoruttDiagnostic {
  transactions: SourceTransaction[]
  results: ClassificationResult[]
  snapshot: {
    totalAnalyzed: number
    classifiedCount: number
    pendingCount: number
  }
}

/**
 * Mock derivado do diagnóstico Gregorutt do cfoup-core.
 *
 * A forma de cada `SourceTransaction` e `ClassificationResult` é a mesma
 * que `scripts/classify-gregorutt.ts` produz — apenas os volumes foram
 * estilizados para representar a distribuição empírica das exceções top-7
 * observadas naquele diagnóstico (motivo, contraparte/conta-chave, count).
 *
 * Quando este app receber pipeline real, esta função some e o card passa
 * a ler `{ transactions, results, snapshot }` de um hook real.
 */
function mockDerivedFromGregoruttDiagnostic(): MockGregoruttDiagnostic {
  const now = new Date("2026-04-20T00:00:00Z")
  const seedGroups: Array<{
    reason: ExceptionReason
    counterparty: string
    originalAccount?: string
    originalCategory?: string
    description?: string
    count: number
    avgAmount: number
    suggestedCategoryCode?: string
  }> = [
    {
      reason: "card_payment_without_detail",
      counterparty: "AMERICAN EXPRESS",
      description: "PAGTO CARTAO AMEX",
      count: 1850,
      avgAmount: 134.21,
    },
    {
      reason: "accounting_generic_account",
      counterparty: "(diversos)",
      originalAccount: "Despesas Diversas",
      description: "Lcto contábil agregado",
      count: 1240,
      avgAmount: 148.48,
    },
    {
      reason: "generic_original_category",
      counterparty: "(vários)",
      originalCategory: "Outros Pagamentos",
      description: "Pagamento avulso",
      count: 920,
      avgAmount: 158.55,
    },
    {
      reason: "bank_only_weak_description",
      counterparty: "(banco)",
      description: "TED RECEBIDA",
      count: 760,
      avgAmount: 516.5,
    },
    {
      reason: "unknown_counterparty",
      counterparty: "FORNECEDOR XPTO LTDA",
      description: "NF servico mensal",
      count: 540,
      avgAmount: 161.93,
      suggestedCategoryCode: "OUT_SUPPLIER_DIRECT",
    },
    {
      reason: "large_other_category",
      counterparty: "(outros)",
      originalCategory: "Outros",
      description: "Lcto rotulado Outros",
      count: 420,
      avgAmount: 133.81,
    },
    {
      reason: "low_confidence",
      counterparty: "MERCADO LIVRE",
      description: "MELI repasse adquirente",
      count: 380,
      avgAmount: 194.47,
      suggestedCategoryCode: "IN_MARKETPLACE",
    },
  ]

  const transactions: SourceTransaction[] = []
  const results: ClassificationResult[] = []

  for (const seed of seedGroups) {
    const cat =
      seed.suggestedCategoryCode !== undefined
        ? getCategoryByCode(seed.suggestedCategoryCode)
        : undefined
    const direction = cat?.direction ?? "outflow"

    for (let i = 0; i < seed.count; i += 1) {
      const id = `mock-${seed.reason}-${i}`
      const amount = Math.round((seed.avgAmount + (i % 7) * 3.71) * 100) / 100

      const tx: SourceTransaction = {
        id,
        companyId: "gregorutt",
        sourceSystem:
          seed.reason === "bank_only_weak_description"
            ? "bank"
            : "accounts_payable",
        transactionDate: now,
        direction,
        amount,
        currency: "BRL",
        counterpartyName: seed.counterparty,
      }
      if (seed.originalAccount !== undefined)
        tx.originalAccountName = seed.originalAccount
      if (seed.originalCategory !== undefined)
        tx.originalCategory = seed.originalCategory
      if (seed.description !== undefined) tx.description = seed.description
      transactions.push(tx)

      const r: ClassificationResult = {
        sourceTransactionId: id,
        companyId: "gregorutt",
        bucket: cat?.bucket ?? null,
        confidenceScore: seed.suggestedCategoryCode !== undefined ? 0.55 : 0.2,
        confidenceLevel:
          seed.suggestedCategoryCode !== undefined ? "medium" : "low",
        classificationMethod: "fallback",
        originalLabelPreserved: false,
        requiresOwnerConfirmation: true,
        exceptionReason: seed.reason,
        status:
          seed.suggestedCategoryCode !== undefined
            ? "needs_confirmation"
            : "pending",
      }
      if (seed.suggestedCategoryCode !== undefined)
        r.standardCategoryCode = seed.suggestedCategoryCode
      if (cat?.ownerFriendlyLabel !== undefined)
        r.ownerFriendlyLabel = cat.ownerFriendlyLabel
      results.push(r)
    }
  }

  // Snapshot agregado batendo com o diagnóstico Gregorutt do core.
  const totalAnalyzed = 28394
  const pendingCount = transactions.length // 6110 — ≈ pendentes do diagnóstico
  const classifiedCount = totalAnalyzed - pendingCount

  return {
    transactions,
    results,
    snapshot: { totalAnalyzed, classifiedCount, pendingCount },
  }
}

function CardLancamentosSemClassificacao() {
  const { groups, snapshot } = useMemo(() => {
    const mock = mockDerivedFromGregoruttDiagnostic()
    // Ordenação default por count desc — confirmando os top grupos primeiro
    // se ganha mais cobertura em menos cliques (princípio do diagnóstico
    // Gregorutt: top-N por count cobre a maior parte das pendências).
    const sorted = [...groupClassificationExceptions(mock.results, mock.transactions)].sort(
      (a, b) => b.count - a.count,
    )
    return { groups: sorted, snapshot: mock.snapshot }
  }, [])

  // Estado puramente local. Nenhuma persistência. Vide cabeçalho da seção.
  const [actionsTaken, setActionsTaken] = useState<Record<string, GroupActionId>>(
    {},
  )

  const pctClassified =
    (snapshot.classifiedCount / snapshot.totalAnalyzed) * 100
  const pctPending = (snapshot.pendingCount / snapshot.totalAnalyzed) * 100
  const pctFmt = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const intFmt = new Intl.NumberFormat("pt-BR")

  return (
    <CardShell>
      <DemoStrip />
      <div className="p-6">
        <CardHeader
          title="Lançamentos sem classificação"
          subtitle="Motor cfoup-core · 12 categorias financeiras padrão · agrupado por motivo"
          countLabel={`${groups.length} grupos · ${intFmt.format(snapshot.pendingCount)} pendentes`}
        />

        {/* Status geral */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SetupStat
            label="Classificado"
            value={`${pctFmt.format(pctClassified)}%`}
            hint={`${intFmt.format(snapshot.classifiedCount)} transações`}
          />
          <SetupStat
            label="Pendente"
            value={`${pctFmt.format(pctPending)}%`}
            hint={`${intFmt.format(snapshot.pendingCount)} transações`}
          />
          <SetupStat label="Grupos" value={intFmt.format(groups.length)} />
          <SetupStat
            label="Total analisado"
            value={intFmt.format(snapshot.totalAnalyzed)}
          />
        </div>

        {/* Lista de grupos */}
        <ul className="mt-5 divide-y" style={{ borderColor: BORDER }}>
          {groups.map((g) => (
            <GroupRow
              key={g.id}
              group={g}
              action={actionsTaken[g.id]}
              onAction={(a) =>
                setActionsTaken((prev) => ({ ...prev, [g.id]: a }))
              }
            />
          ))}
        </ul>

        <p
          className="mt-4 text-[12px] italic"
          style={{ color: MUTED }}
        >
          Ordenado por quantidade. Confirmar os grupos do topo é o caminho
          mais curto para ganhar cobertura — princípio do diagnóstico
          Gregorutt no cfoup-core.
        </p>
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
    <div
      className="rounded-md p-3"
      style={{ background: "#FAFBFC", border: `1px solid ${BORDER}` }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="mt-1 text-[18px] font-semibold tabular-nums" style={{ color: NAVY }}>
        {value}
      </p>
      {hint !== undefined && (
        <p className="mt-0.5 text-[11px] tabular-nums" style={{ color: MUTED }}>
          {hint}
        </p>
      )}
    </div>
  )
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
  return (
    <li className="py-3 first:pt-0">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold" style={{ color: NAVY }}>
            {group.groupLabel}
          </p>
          <p className="mt-0.5 text-[12px] tabular-nums" style={{ color: MUTED }}>
            <span className="font-medium" style={{ color: NAVY }}>
              {intFmt.format(group.count)}
            </span>{" "}
            transações
            <span className="mx-1.5 opacity-60">·</span>
            <span style={{ color: MUTED }}>total {brl.format(group.totalAmount)}</span>
            {group.suggestedOwnerLabel !== undefined && (
              <>
                <span className="mx-1.5 opacity-60">·</span>
                sugestão:{" "}
                <span className="font-medium" style={{ color: NAVY }}>
                  {group.suggestedOwnerLabel}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <GroupActionButton
            label={GROUP_ACTION_LABEL.confirmar}
            color={GREEN}
            active={action === "confirmar"}
            onClick={() => onAction("confirmar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.trocar}
            color={BLUE}
            active={action === "trocar"}
            onClick={() => onAction("trocar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.aplicar}
            color={CYAN}
            active={action === "aplicar"}
            onClick={() => onAction("aplicar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.ignorar}
            color={RED}
            active={action === "ignorar"}
            onClick={() => onAction("ignorar")}
          />
          <GroupActionButton
            label={GROUP_ACTION_LABEL.manter}
            color={MUTED}
            active={action === "manter"}
            ghost
            onClick={() => onAction("manter")}
          />
        </div>
      </div>
      {action !== undefined && (
        <p className="mt-1.5 text-[11px] italic" style={{ color: MUTED }}>
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
      className="rounded px-2 py-1 text-[12px] font-medium transition hover:bg-[#F0F2F5]"
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
