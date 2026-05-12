import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

type Status = "saudavel" | "pressionando" | "risco" | "estavel"

const STATUS_STYLES: Record<Status, { color: string; bg: string }> = {
  saudavel: { color: "var(--brand-green)", bg: "rgba(54,186,88,0.10)" },
  pressionando: { color: "var(--brand-warning)", bg: "rgba(224,139,0,0.12)" },
  risco: { color: "var(--brand-error-soft)", bg: "rgba(209,67,67,0.10)" },
  estavel: { color: "var(--brand-cyan)", bg: "rgba(56,184,232,0.10)" },
}

const STATUS_LABELS: Record<Status, string> = {
  saudavel: "Saudável",
  pressionando: "Pressionando",
  risco: "Risco",
  estavel: "Estável",
}

type Indicator = {
  label: string
  value: string
  delta: string
  refText: string
  status: Status
  leitura: string
}

const INDICADORES: Indicator[] = [
  {
    label: "Margem operacional",
    value: "9,8%",
    delta: "caiu 0,4 ponto",
    refText: "pressão em despesa fixa",
    status: "pressionando",
    leitura: "Resultado pressionado em R$ 14k no mês.",
  },
  {
    label: "Prazo médio de estoque",
    value: "54 dias",
    delta: "subiu 6 dias",
    refText: "giro caiu",
    status: "risco",
    leitura: "R$ 92k a mais presos do que em janeiro.",
  },
  {
    label: "Margem bruta",
    value: "32,4%",
    delta: "subiu 1,1 ponto",
    refText: "vs. ano anterior",
    status: "saudavel",
    leitura: "Ainda segura parte da pressão da operação.",
  },
  {
    label: "Prazo médio de recebimento",
    value: "38 dias",
    delta: "caiu 3 dias",
    refText: "melhor desde jan",
    status: "saudavel",
    leitura: "Cliente pagando mais rápido.",
  },
  {
    label: "Margem líquida",
    value: "7,2%",
    delta: "subiu 0,2 ponto",
    refText: "mês fechado",
    status: "saudavel",
    leitura: "Lucro final ainda positivo, mas com pouco espaço.",
  },
  {
    label: "Prazo médio de pagamento",
    value: "26 dias",
    delta: "subiu 1 dia",
    refText: "ritmo mantido",
    status: "estavel",
    leitura: "Fornecedor pago no mesmo ritmo.",
  },
  {
    label: "Ponto de equilíbrio",
    value: "R$ 248k/mês",
    delta: "",
    refText: "piso da operação",
    status: "estavel",
    leitura: "Valor mínimo para o mês fechar no zero.",
  },
  {
    label: "Receita do mês",
    value: "R$ 312k",
    delta: "+R$ 64k acima do ponto",
    refText: "folga sobre o piso",
    status: "saudavel",
    leitura: "Operação acima do equilíbrio em R$ 64k.",
  },
]

function gerarLeituraCFOup(indicadores: Indicator[]): { h2: string; paragrafo: string } {
  // Encontra indicadores em alerta (Pressionando ou Risco)
  const alertas = indicadores.filter((i) => i.status === "pressionando" || i.status === "risco")
  
  // Encontra indicadores saudáveis relevantes
  const saudaveis = indicadores.filter((i) => i.status === "saudavel")
  
  // Encontra ponto de equilíbrio e receita para posição geral
  const pontoEquilibrio = indicadores.find((i) => i.label === "Ponto de equilíbrio")
  const receita = indicadores.find((i) => i.label === "Receita do mês")
  
  // Monta h2: posição geral + 1 a 2 maiores sinais de atenção
  let h2 = "Operação acima do ponto de equilíbrio"
  
  if (alertas.length > 0) {
    const sinais = alertas.slice(0, 2).map((a) => {
      // Traduz label para linguagem natural
      const labelNatural = a.label === "Prazo médio de estoque" ? "estoque" :
                          a.label === "Prazo médio de recebimento" ? "recebimento" :
                          a.label === "Prazo médio de pagamento" ? "pagamento ao fornecedor" :
                          a.label.toLowerCase()
      
      // Formata delta para incluir valor
      if (a.label.includes("Prazo")) {
        return `${labelNatural} subiu para ${a.value}`
      }
      return `${labelNatural} ${a.delta}`
    })
    
    if (sinais.length === 1) {
      h2 += `, mas com um sinal de atenção: ${sinais[0]}.`
    } else {
      h2 += `, mas com dois sinais de atenção: ${sinais[0]} e ${sinais[1]}.`
    }
  } else {
    h2 += ", sem sinais de alerta no momento."
  }
  
  // Monta parágrafo: folga ou sinal saudável + impacto
  let paragrafo = ""
  
  if (receita && pontoEquilibrio) {
    paragrafo = "A folga existe"
  }
  
  if (alertas.length > 0) {
    const causas = alertas.map((a) => {
      if (a.label === "Margem operacional") return "despesa fixa"
      if (a.label === "Prazo médio de estoque") return "dinheiro parado em estoque"
      return a.refText
    })
    paragrafo += `, mas está sendo consumida por ${causas.join(" e ")}.`
  } else {
    paragrafo = "Indicadores equilibrados, sem pressão imediata."
  }
  
  return { h2, paragrafo }
}

function gerarAtencaoAgora(indicadores: Indicator[]): string {
  const alertas = indicadores.filter((i) => i.status === "pressionando" || i.status === "risco")
  const saudaveis = indicadores.filter((i) => i.status === "saudavel")
  
  if (alertas.length === 0) {
    return "Nenhuma ação urgente no momento. Manter acompanhamento dos indicadores."
  }
  
  // Gera ações práticas baseadas nos alertas
  const acoes: string[] = []
  
  for (const alerta of alertas) {
    if (alerta.label === "Margem operacional") {
      acoes.push("validar despesa fixa do mês")
    }
    if (alerta.label === "Prazo médio de estoque") {
      acoes.push("abrir o estoque por linha/produto")
    }
    if (alerta.label === "Prazo médio de recebimento") {
      acoes.push("revisar cobrança e inadimplência")
    }
    if (alerta.label === "Prazo médio de pagamento") {
      acoes.push("verificar renegociação com fornecedor")
    }
  }
  
  // Negação explícita de causa nos indicadores saudáveis
  const negacoes: string[] = []
  
  const recebimentoSaudavel = saudaveis.find((i) => i.label === "Prazo médio de recebimento")
  const pagamentoSaudavel = saudaveis.find((i) => i.label === "Prazo médio de pagamento" || i.status === "estavel")
  
  if (recebimentoSaudavel) negacoes.push("recebimento")
  if (pagamentoSaudavel || indicadores.find((i) => i.label === "Prazo médio de pagamento" && i.status === "estavel")) {
    negacoes.push("fornecedor")
  }
  
  let resultado = acoes.length > 0 
    ? acoes.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(" e ") + "."
    : ""
  
  if (negacoes.length > 0 && acoes.length > 0) {
    resultado += ` Esses ${acoes.length === 1 ? "ponto explica" : "dois pontos explicam"} melhor a pressão atual do que ${negacoes.join(" ou ")}.`
  }
  
  return resultado
}

export default function IndicadoresPage() {
  const leituraCFOup = gerarLeituraCFOup(INDICADORES)
  const atencaoAgora = gerarAtencaoAgora(INDICADORES)
  return (
    <>
      <PageHeader eyebrow="Mesa de decisão" title="Indicadores" />

      {/* Leitura do CFOup */}
      <section className="mb-6 rounded-2xl border border-border bg-hero-gradient p-4 md:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Leitura do CFOup
        </p>
        <h2
          className="mt-2 text-balance text-[15px] md:text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {leituraCFOup.h2}
        </h2>
        <p className="mt-2 text-pretty text-[13px] leading-relaxed text-[var(--slate-700)]">
          {leituraCFOup.paragrafo}
        </p>
      </section>

      {/* Grid de indicadores — 4 colunas */}
      <section className="mb-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {INDICADORES.map((ind) => (
          <IndicatorCard key={ind.label} {...ind} />
        ))}
      </section>

      {/* Bloco final — Atenção agora */}
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <span
          className="mb-3 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
        >
          Atenção agora
        </span>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          {atencaoAgora}
        </p>
      </section>
    </>
  )
}

function IndicatorCard({ label, value, delta, refText, status, leitura }: Indicator) {
  const styles = STATUS_STYLES[status]
  const statusLabel = STATUS_LABELS[status]

  const hasDelta = delta.length > 0
  const IconComponent = delta.startsWith("+") || delta.startsWith("subiu") ? TrendingUp : delta.startsWith("−") || delta.startsWith("-") || delta.startsWith("caiu") ? TrendingDown : Minus

  const deltaColor =
    status === "saudavel" ? "var(--brand-green-dark)" :
    status === "pressionando" ? "var(--brand-warning)" :
    status === "risco" ? "var(--brand-error-soft)" :
    "var(--brand-cyan)"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3 md:p-4">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: styles.color }}
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.10em]"
          style={{ background: styles.bg, color: styles.color }}
        >
          {statusLabel}
        </span>
      </div>
      <p
        className="text-[1.25rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
      {hasDelta && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: deltaColor }}>
          <IconComponent className="h-3 w-3" />
          {delta}
        </div>
      )}
      <p className="mt-1.5 text-[10px] text-muted-foreground">{refText}</p>
      <p
        className="mt-2.5 border-t border-border pt-2.5 text-[11.5px] leading-relaxed"
        style={{ color: "var(--brand-navy)" }}
      >
        {leitura}
      </p>
    </div>
  )
}
