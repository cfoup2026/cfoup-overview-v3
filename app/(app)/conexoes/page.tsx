"use client"

import { useState, useRef, type ChangeEvent } from "react"
import {
  Landmark,
  FileUp,
  Receipt,
  Boxes,
  ArrowRight,
  RefreshCcw,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"

type SourceStatus = "available" | "coming-soon"

type Source = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  status: SourceStatus
  cta?: string
}

type ConnectionStatus = "syncing" | "warning" | "error"

type ActiveConnection = {
  id: string
  title: string
  subtitle: string
  status: ConnectionStatus
  message: string
}

// Mock inline — quando o Núcleo de Dados existir, vira hook (useConexoesData).
const SOURCES: Source[] = [
  {
    id: "open-finance",
    title: "Bancos via Open Finance",
    description:
      "Conecte contas correntes, poupanças e cartões para sincronizar lançamentos automaticamente.",
    icon: Landmark,
    status: "available",
    cta: "Conectar banco",
  },
  {
    id: "upload",
    title: "Importar arquivo",
    description:
      "Importe extratos bancários, planilhas de ERP, notas fiscais e arquivos contábeis. Aceita XLSX, CSV, OFX, PDF.",
    icon: FileUp,
    status: "available",
    cta: "Importar arquivos",
  },
  {
    id: "enotas",
    title: "Notas fiscais eNotas",
    description: "Importa NF-e emitidas e recebidas para reconciliação fiscal.",
    icon: Receipt,
    status: "available",
    cta: "Conectar eNotas",
  },
  {
    id: "erp",
    title: "Sistema ERP",
    description: "Integração com ERPs para vendas, estoque e custos por linha.",
    icon: Boxes,
    status: "available",
    cta: "Conectar ERP",
  },
]

const BANKS = ["Itaú", "Bradesco", "Santander", "Banco do Brasil", "Caixa", "Nubank", "Inter", "Sicoob"]
const ERPS = ["Omie", "ContaAzul", "Bling", "Tiny", "TOTVS", "SAP", "Sankhya"]

export default function ConexoesPage() {
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([])
  const [openModal, setOpenModal] = useState<"banks" | "enotas" | "erp" | null>(null)
  const [enotasToken, setEnotasToken] = useState("")
  const [selectedErp, setSelectedErp] = useState(ERPS[0])
  const uploadInputRef = useRef<HTMLInputElement>(null)

  function addConnection(c: Omit<ActiveConnection, "id">) {
    setActiveConnections((prev) => [...prev, { id: crypto.randomUUID(), ...c }])
    setOpenModal(null)
  }

  function handleSourceAction(sourceId: string) {
    if (sourceId === "upload") return uploadInputRef.current?.click()
    if (sourceId === "open-finance") return setOpenModal("banks")
    if (sourceId === "enotas") return setOpenModal("enotas")
    if (sourceId === "erp") return setOpenModal("erp")
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    addConnection({
      title: file.name,
      subtitle: "Upload de arquivo",
      status: "syncing",
      message: "Importado · aguardando classificação",
    })
    e.target.value = ""
  }
  return (
    <>
      <PageHeader
        eyebrow="Implantação"
        title="Conexões"
        description="Conecte as fontes de dados que alimentam o CFOup"
      />

      <section aria-labelledby="conexoes-fontes" className="mb-10">
        <h2 id="conexoes-fontes" className="sr-only">
          Fontes disponíveis
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SOURCES.map((source) => (
            <SourceCard key={source.id} source={source} onAction={handleSourceAction} />
          ))}
        </div>
      </section>

      <section aria-labelledby="conexoes-ativas">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="conexoes-ativas"
              className="text-lg font-bold"
              style={{ color: "var(--brand-navy)" }}
            >
              Conexões ativas
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe o status de cada fonte conectada ao CFOup.
            </p>
          </div>
          {activeConnections.length > 0 && (
            <span className="hidden text-xs font-semibold text-muted-foreground md:inline-flex md:items-center md:gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              {activeConnections.length} fontes
            </span>
          )}
        </header>

        {activeConnections.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {activeConnections.map((connection) => (
              <ActiveConnectionRow key={connection.id} connection={connection} />
            ))}
          </ul>
        )}
      </section>

      <input
        ref={uploadInputRef}
        type="file"
        accept=".pdf,.csv,.xlsx,.xls,.ofx"
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />

      {openModal === "banks" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                  Conectar banco
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Selecione seu banco para iniciar via Open Finance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div className="mt-5 space-y-1.5">
              {BANKS.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() =>
                    addConnection({
                      title: bank,
                      subtitle: "Open Finance",
                      status: "syncing",
                      message: "Aguardando autenticação",
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13px] font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-blue)]/40 hover:bg-muted/40"
                >
                  {bank}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {openModal === "enotas" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                  Conectar eNotas
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Informe seu token de API eNotas para importar NF-e automaticamente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div className="mt-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Token API eNotas
              </label>
              <input
                type="text"
                value={enotasToken}
                onChange={(e) => setEnotasToken(e.target.value)}
                placeholder="Cole seu token aqui"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-navy)] transition hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  addConnection({
                    title: "eNotas",
                    subtitle: "Notas fiscais",
                    status: "syncing",
                    message: "Aguardando validação do token",
                  })
                  setEnotasToken("")
                }}
                className="rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--brand-blue)]"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal === "erp" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                  Conectar ERP
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Selecione o ERP usado pela empresa.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div className="mt-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sistema ERP
              </label>
              <select
                value={selectedErp}
                onChange={(e) => setSelectedErp(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
              >
                {ERPS.map((erp) => (
                  <option key={erp} value={erp}>
                    {erp}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-navy)] transition hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() =>
                  addConnection({
                    title: selectedErp,
                    subtitle: "ERP",
                    status: "syncing",
                    message: "Aguardando configuração",
                  })
                }
                className="rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--brand-blue)]"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SourceCard({ source, onAction }: { source: Source; onAction: (id: string) => void }) {
  const Icon = source.icon

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-4 transition hover:border-[var(--brand-blue)]/40 hover:shadow-sm">
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background"
        style={{ color: "var(--brand-blue)" }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>

      <h3
        className="mt-3 text-[15px] font-bold leading-snug"
        style={{ color: "var(--brand-navy)" }}
      >
        {source.title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{source.description}</p>

      <div className="mt-4 flex flex-1 items-end">
        <button
          type="button"
          onClick={() => onAction(source.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--brand-blue)]"
        >
          {source.cta}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-6 py-14 text-center"
      role="status"
    >
      <p className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
        Nenhuma fonte conectada ainda.
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Comece pelo banco principal.
      </p>
    </div>
  )
}

function ActiveConnectionRow({ connection }: { connection: ActiveConnection }) {
  const visual = STATUS_VISUALS[connection.status]
  const StatusIcon = visual.icon

  return (
    <li className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-start gap-3 md:items-center">
        <span
          aria-hidden
          className="mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full md:mt-0"
          style={{ backgroundColor: visual.dot }}
        />
        <div className="min-w-0">
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            {connection.title}
            <span className="font-medium text-muted-foreground"> · {connection.subtitle}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
            {connection.message}
          </p>
        </div>
      </div>

      <span
        className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold md:inline-flex"
        style={{
          background: visual.badgeBg,
          color: visual.badgeColor,
        }}
      >
        {StatusIcon && <StatusIcon className="h-3.5 w-3.5" strokeWidth={1.5} />}
        {connection.message}
      </span>
    </li>
  )
}

const STATUS_VISUALS: Record<
  ConnectionStatus,
  {
    dot: string
    badgeBg: string
    badgeColor: string
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }> | null
  }
> = {
  syncing: {
    dot: "var(--brand-green)",
    badgeBg: "rgba(54,186,88,0.12)",
    badgeColor: "var(--brand-green-dark)",
    icon: RefreshCcw,
  },
  warning: {
    dot: "var(--brand-warning)",
    badgeBg: "rgba(224,139,0,0.12)",
    badgeColor: "var(--brand-warning)",
    icon: AlertTriangle,
  },
  error: {
    dot: "var(--brand-red)",
    badgeBg: "rgba(200,30,30,0.10)",
    badgeColor: "var(--brand-red-dark)",
    icon: XCircle,
  },
}
