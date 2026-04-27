import {
  Landmark,
  FileUp,
  Receipt,
  Boxes,
  ArrowRight,
  RefreshCcw,
  AlertTriangle,
  XCircle,
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
    title: "Upload de arquivo",
    description: "OFX, CSV, XLSX",
    icon: FileUp,
    status: "available",
    cta: "Enviar arquivo",
  },
  {
    id: "enotas",
    title: "Notas fiscais eNotas",
    description: "Importa NF-e emitidas e recebidas para reconciliação fiscal.",
    icon: Receipt,
    status: "coming-soon",
  },
  {
    id: "erp",
    title: "Sistema ERP",
    description: "Integração com ERPs para vendas, estoque e custos por linha.",
    icon: Boxes,
    status: "coming-soon",
  },
]

const ACTIVE_CONNECTIONS: ActiveConnection[] = [
  {
    id: "itau",
    title: "Banco Itaú",
    subtitle: "CC 12345-6",
    status: "syncing",
    message: "Sincronizando",
  },
  {
    id: "ofx",
    title: "extrato_marco_2026.ofx",
    subtitle: "Upload de arquivo",
    status: "warning",
    message: "Reclassificar 12 lançamentos",
  },
  {
    id: "bradesco",
    title: "Banco Bradesco",
    subtitle: "CC 9876-5",
    status: "error",
    message: "Erro de autenticação",
  },
]

export default function ConexoesPage() {
  return (
    <>
      <PageHeader
        title="Conexões"
        description="Conecte as fontes de dados que alimentam o CFOup"
      />

      <section aria-labelledby="conexoes-fontes" className="mb-10">
        <h2 id="conexoes-fontes" className="sr-only">
          Fontes disponíveis
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SOURCES.map((source) => (
            <SourceCard key={source.id} source={source} />
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
          {ACTIVE_CONNECTIONS.length > 0 && (
            <span className="hidden text-xs font-semibold text-muted-foreground md:inline-flex md:items-center md:gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              {ACTIVE_CONNECTIONS.length} fontes
            </span>
          )}
        </header>

        {ACTIVE_CONNECTIONS.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {ACTIVE_CONNECTIONS.map((connection) => (
              <ActiveConnectionRow key={connection.id} connection={connection} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function SourceCard({ source }: { source: Source }) {
  const Icon = source.icon
  const isAvailable = source.status === "available"

  return (
    <article
      className={`flex flex-col rounded-2xl border border-border bg-card p-6 transition ${
        isAvailable ? "hover:border-[var(--brand-blue)]/40 hover:shadow-sm" : "opacity-60"
      }`}
      aria-disabled={!isAvailable}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background"
          style={{ color: "var(--brand-blue)" }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <StatusBadge status={source.status} />
      </div>

      <h3
        className="mt-5 text-base font-bold leading-snug"
        style={{ color: "var(--brand-navy)" }}
      >
        {source.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{source.description}</p>

      <div className="mt-6 flex flex-1 items-end">
        {isAvailable && source.cta ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue)]"
          >
            {source.cta}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            Disponível em breve
          </span>
        )}
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: SourceStatus }) {
  if (status === "available") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: "rgba(54,186,88,0.12)",
          color: "var(--brand-green-dark)",
        }}
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--brand-green)" }}
        />
        Disponível
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
    >
      Em breve
    </span>
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
    dot: "#eab308",
    badgeBg: "rgba(234,179,8,0.14)",
    badgeColor: "#92610b",
    icon: AlertTriangle,
  },
  error: {
    dot: "var(--brand-red)",
    badgeBg: "rgba(200,30,30,0.10)",
    badgeColor: "var(--brand-red-dark)",
    icon: XCircle,
  },
}
