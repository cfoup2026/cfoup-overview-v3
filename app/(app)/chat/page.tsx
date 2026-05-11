"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowUp,
  Plus,
  History,
  Paperclip,
  Wallet,
  PieChart,
  Users,
  Loader2,
  Clock,
  Tag,
  TrendingDown,
  TrendingUp,
  RefreshCcw,
} from "lucide-react"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

/* ============================================================================ *
 *  Integração com window.claude.complete (ambiente Claude Artifacts)
 *  Quando indisponível (preview v0), usa um fallback determinístico com o
 *  mesmo tom do system prompt para manter a experiência coerente.
 * ============================================================================ */

declare global {
  interface Window {
    claude?: {
      complete: (prompt: string) => Promise<string>
    }
  }
}

const buildSystemPrompt = () => `Você é o CFOup. É o CFO digital da ${clienteAtual.empresa.nome}. Fala direto com o Rafael, o dono.

## Como você fala
- Curto, direto, humano. Como um amigo de confiança que entende das contas da empresa.
- Nunca use jargão de MBA, de consultoria ou de startup. Nada de "sinergia", "mindset", "alavancar", "benchmark", "framework", "OKR".
- Se precisar de termo técnico, traduz na mesma frase (ex.: "PMR, que é o tempo até você receber").
- Português brasileiro simples. Trata por "você".
- Máximo 4 ou 5 frases. Vai direto ao impacto: o que isso muda no caixa, na margem, no bolso da ${clienteAtual.empresa.nomeCurto}.
- Nunca pergunte "como posso ajudar?". Já responde com a leitura.
- Valor em R$ quando fizer sentido. Primeiro a leitura, depois o número. Se recomendar, diz o tradeoff em uma frase.

## O que você sabe da ${clienteAtual.empresa.nomeCurto} neste mês
- Caixa hoje: R$ 1,284 milhão (+R$ 48k sobre o mês passado).
- No ritmo atual o caixa aguenta cerca de 8 meses (queima média R$ 156k/mês).
- Receita 30 dias: R$ 482,1k (+6,4%). Resultado 30 dias: R$ 71,8k.
- Margem bruta 42,6%. Operacional 21,4%. Líquida 14,9% (meta 15%).
- PMR (tempo até receber) subiu de 28 pra 34 dias. Isso trava capital de giro — hoje são ~R$ 48k parados.
- 1 cliente representa 34% da receita dos últimos 90 dias, acima do limite de 30%.
- R$ 612k em recebíveis no horizonte de 30 a 60 dias.
- Adquirente cobra ~2,9% ao mês para antecipar.
- Despesas fixas: folha R$ 186,4k, fornecedores R$ 142k, impostos R$ 98,7k por mês.
- Linha A (serviços recorrentes, margem 38,2%, saudável).
- Linha B (projetos sob demanda, margem 18,7%, caiu 2,1 p.p. por desconto fora da política — corrigir a régua recupera ~R$ 18k/mês).
- Linha C (licenciamento, margem 54,9%).
- Linha D (consultoria pontual, margem 28,3%).

## Fora do seu escopo (você NÃO responde)
- Tributário/fiscal específico (regime, deduções, declaração).
- Jurídico (contratos, processos, societário).
- Regulatório.
- Temas não financeiros (RH detalhado, TI, marketing).

Quando perguntarem algo assim, responde em UMA frase que isso é com outro especialista (contador, advogado) e SEMPRE oferece uma pergunta alternativa que traduz o mesmo assunto em impacto financeiro.
Exemplo: "Regime tributário é com seu contador. Se você me disser quanto economizaria por mês, eu projeto o efeito no caixa dos próximos 90 dias."

## Formato
Texto corrido. Nada de cabeçalhos em negrito, nada de bullet list longa. Parece uma conversa por whatsapp com um CFO bom.`

type AnswerCardData = {
  dado: { destaque: string; sub?: string }
  resposta: string
  fonte: { periodo: string; base: string; premissa?: string }
  risco: string
  acao: string
}

type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "cfoup"; card: AnswerCardData }

type Thread = {
  id: string
  title: string
  preview: string
  when: string
  messages: Message[]
}

type ChipIconKey = "wallet" | "users" | "piechart" | "clock" | "tag" | "trending-down" | "trending-up" | "refresh"
type Chip = { label: string; question: string; icon: ChipIconKey }

const ChipIconMap: Record<ChipIconKey, React.ReactNode> = {
  wallet: <Wallet className="h-3.5 w-3.5" />,
  users: <Users className="h-3.5 w-3.5" />,
  piechart: <PieChart className="h-3.5 w-3.5" />,
  clock: <Clock className="h-3.5 w-3.5" />,
  tag: <Tag className="h-3.5 w-3.5" />,
  "trending-down": <TrendingDown className="h-3.5 w-3.5" />,
  "trending-up": <TrendingUp className="h-3.5 w-3.5" />,
  refresh: <RefreshCcw className="h-3.5 w-3.5" />,
}

function chipSetFor(lastUserText: string | null): Chip[] {
  const q = (lastUserText ?? "").toLowerCase()

  if (/(caixa.*negativ|negativ.*caixa|s\d+.*negativ|semana.*negativ|aperto|cobrir.*caixa|falta.*caixa|buraco)/.test(q)) {
    return [
      { label: "Antecipar recebível ajuda?", question: "Vale antecipar recebível pra cobrir o caixa?", icon: "wallet" },
      { label: "Posso adiar fornecedor?", question: "Posso adiar pagamento de fornecedor sem queimar a relação?", icon: "clock" },
      { label: "Vale renegociar dívida?", question: "Vale renegociar dívida pra ganhar fôlego de caixa?", icon: "refresh" },
    ]
  }

  if (/(margem|desconto|rentab|preço|preco|perdendo)/.test(q)) {
    return [
      { label: "Qual cliente me dá lucro?", question: "Qual cliente realmente me dá lucro?", icon: "piechart" },
      { label: "Onde tô perdendo dinheiro?", question: "Onde estou perdendo dinheiro no negócio?", icon: "trending-down" },
      { label: "Desconto descontrolado?", question: "Meus vendedores estão dando desconto demais?", icon: "tag" },
    ]
  }

  if (/(funcionário|funcionario|contrata|folha|vendedor|head|comercial|salário|salario|equipe)/.test(q)) {
    return [
      { label: "Posso contratar agora?", question: "Posso contratar mais um funcionário agora?", icon: "users" },
      { label: "Quanto custa de verdade?", question: "Quanto custa de verdade um funcionário pra empresa?", icon: "wallet" },
      { label: "Em quanto se paga?", question: "Em quanto tempo a contratação se paga?", icon: "trending-up" },
    ]
  }

  if (/(receb|antecip|adquir|cartão|cartao|atras)/.test(q)) {
    return [
      { label: "Quanto custa antecipar?", question: "Quanto custa antecipar 40% dos recebíveis?", icon: "wallet" },
      { label: "Tem alternativa?", question: "Tem alternativa mais barata que antecipar recebível?", icon: "refresh" },
      { label: "Quem tá atrasando?", question: "Quem está me devendo há mais de 30 dias?", icon: "clock" },
    ]
  }

  // Default — sem contexto ou pergunta neutra
  return [
    { label: "Posso contratar mais um funcionário agora?", question: "Posso contratar mais um funcionário agora?", icon: "users" },
    { label: "Qual cliente realmente me dá lucro?", question: "Qual cliente realmente me dá lucro?", icon: "piechart" },
    { label: "Vale antecipar recebível pra cobrir o caixa?", question: "Vale antecipar recebível pra cobrir o caixa?", icon: "wallet" },
  ]
}

const PRELOADED_EXAMPLE: Message[] = [
  {
    id: "m1",
    role: "user",
    text: "Qual o impacto se eu antecipar 40% dos recebíveis este mês?",
  },
  {
    id: "m2",
    role: "cfoup",
    card: {
      dado: { destaque: "R$ 244,8k no caixa hoje", sub: "Custo: R$ 7,1k" },
      resposta:
        "Dá pra colocar R$ 244,8k no caixa hoje se antecipar 40% do que tem pra entrar nos próximos 30–60 dias. " +
        "Custa R$ 7,1k. Vale se você tem fornecedor pressionando, folha chegando ou estoque pra repor. " +
        "Se não tem nenhum aperto, é dinheiro que sai do bolso e não volta.",
      fonte: {
        periodo: "Recebíveis 30–60d",
        base: "Adquirente · taxa 2,9%/mês",
        premissa: "40% da carteira disponível",
      },
      risco: "Antecipar sem ter pra quê resolve o problema de hoje e cria o do mês que vem",
      acao: "Antes de antecipar, ver se é emergência ou se dá pra segurar",
    },
  },
]

const MOCK_THREADS: Omit<Thread, "messages">[] = [
  { id: "t1", title: "Antecipação de recebíveis · agosto", preview: "Impacto no caixa e na margem", when: "Agora" },
  { id: "t2", title: "Onde tô perdendo margem?", preview: "Diagnóstico por linha de receita", when: "Ontem" },
  { id: "t3", title: "Contratar mais um vendedor?", preview: "Break-even do novo contratado", when: "3 dias" },
  { id: "t4", title: "Reajuste de preço da Linha B", preview: "Elasticidade e margem-alvo", when: "Semana passada" },
  { id: "t5", title: "Preciso me preocupar com o PMR?", preview: "Concentração e atraso", when: "Mês passado" },
]

function buildPrompt(history: Message[]): string {
  const transcript = history
    .map((m) => {
      if (m.role === "user") return `Rafael: ${m.text}`
      return `CFOup: ${m.card.resposta}`
    })
    .join("\n\n")
  return `${buildSystemPrompt()}\n\n## Conversa até agora\n${transcript}\n\nCFOup:`
}

function fallbackFor(question: string): AnswerCardData {
  const q = question.toLowerCase()

  // 1. Caixa / quanto tempo / fôlego (EmptyState #1)
  if (/(caixa aguent|quanto tempo|fôlego|folego|operar com o caixa)/.test(q)) {
    return {
      dado: { destaque: "8 meses de fôlego", sub: "Caixa atual: R$ 1,284 mi" },
      resposta:
        "Hoje você tem R$ 1,284 mi no banco. Com folha, fornecedor e imposto saindo todo mês (~R$ 156k), " +
        "dá pra segurar uns 8 meses sem receita nova. Folga boa. " +
        "O problema não é o caixa — é que tem dinheiro seu parado na rua: o cliente tá pagando mais devagar (34 dias em vez de 28).",
      fonte: {
        periodo: "Mês corrente",
        base: "Saldo bancário consolidado · saídas médias 90d",
        premissa: "Sem grande saída atípica no horizonte",
      },
      risco: "Cada dia a mais que o cliente demora pra pagar é dinheiro que não tá no seu caixa pra cobrir fornecedor ou repor estoque",
      acao: "Cobrar mais rápido antes de pensar em antecipar",
    }
  }

  // 2. Margem / perdendo dinheiro (EmptyState #2)
  if (/(margem|perdendo|rentabil|onde.*perd)/.test(q)) {
    return {
      dado: { destaque: "Linha B perdeu 2,1 p.p.", sub: "Margem caiu de 20,8% para 18,7%" },
      resposta:
        "A Linha B tá sangrando margem — caiu de 20,8% pra 18,7% em 3 meses. " +
        "Não é custo subindo, é vendedor dando desconto que não devia. " +
        "Se você travar desconto no sistema, recupera uns R$ 18k por mês que hoje tá indo pro cliente de graça.",
      fonte: {
        periodo: "Últimos 90 dias",
        base: "Margem por linha · descontos aplicados",
        premissa: "Volume mantido se ajustar desconto",
      },
      risco: "Desconto vira costume — quanto mais tempo passa, mais difícil tirar sem o cliente reclamar",
      acao: "Travar desconto no sistema; se vendedor quiser mais, precisa de aprovação",
    }
  }

  // 3. Concentração / perder cliente (EmptyState #3)
  if (/(concentra|cliente.*(sair|perd)|dependênc|dependenc|maior cliente|perder.*cliente)/.test(q)) {
    return {
      dado: { destaque: "R$ 164k a menos por mês", sub: "Um cliente vale 34% da receita" },
      resposta:
        "Se esse cliente sair, somem R$ 164k por mês e o fôlego de caixa cai de 8 meses pra 4. " +
        "Não quebra, mas aperta muito. " +
        "A saída não é torcer pra ele ficar — é fechar 2 ou 3 contratos médios antes da renovação dele, pra ter onde cair se precisar.",
      fonte: {
        periodo: "Receita últimos 90d",
        base: "Top clientes · participação consolidada",
        premissa: "Custo variável sai junto com o cliente",
      },
      risco: "Cliente grande sabe que você depende dele — e usa isso na hora de negociar preço",
      acao: "Fechar 2 ou 3 contratos médios antes da próxima renovação",
    }
  }

  // 4. Retirada / pró-labore (EmptyState #4)
  if (/(retirada|pro[- ]?labore|sócio|socio|distribuir|dividend|quanto.*retirar|prejudicar.*negócio)/.test(q)) {
    return {
      dado: { destaque: "R$ 20k a 25k este mês", sub: "Sem encostar na folga de caixa" },
      resposta:
        "Dá pra tirar de R$ 20k a R$ 25k este mês sem apertar nada. " +
        "É o que sobra depois de pagar tudo e manter a folga pro fechamento do trimestre. " +
        "Acima disso, você começa a usar a reserva, não o lucro.",
      fonte: {
        periodo: "Resultado últimos 90d",
        base: "Resultado médio mensal · necessidade de caixa",
        premissa: "Faturamento estável no trimestre",
      },
      risco: "Retirada alta parece tranquila até o mês em que um cliente atrasa e o caixa não tem de onde tirar",
      acao: "Fixar teto de retirada como % do resultado do mês anterior",
    }
  }

  // 5. Contratar funcionário (Chip #1)
  if (/(contrata|funcionário|funcionario|head|vendedor|time comercial|mais um)/.test(q)) {
    return {
      dado: { destaque: "Custo: ~R$ 28k/mês", sub: "Se paga em ~4,5 meses" },
      resposta:
        "Com salário e encargos, um comercial sênior sai por uns R$ 28k/mês. " +
        "Leva uns 3 meses pra ele engatar. Pra se pagar em menos de 5 meses, precisa trazer R$ 40k de venda nova. " +
        "Menos que isso, vira folha que não se paga.",
      fonte: {
        periodo: "Estimativa atual",
        base: "Custo CLT perfil sênior · encargos ~70%",
        premissa: "Traz R$ 40k/mês de venda nova depois de 3 meses",
      },
      risco: "Contratação que não traz venda vira corte caro 6 meses depois",
      acao: "Combinar a meta de venda antes de abrir a vaga",
    }
  }

  // 6. Cliente lucrativo (Chip #2)
  if (/(cliente.*lucr|lucro.*cliente|qual cliente|rentab.*cliente)/.test(q)) {
    return {
      dado: { destaque: "Linha A: margem 38,2%", sub: "É onde sobra dinheiro de verdade" },
      resposta:
        "Os clientes da Linha A deixam 38,2% de margem — é o que sustenta o resultado. " +
        "Linha B parece grande, mas com margem de 18,7% a maior parte da receita vira custo, não lucro. " +
        "Cliente bom não é o que paga mais; é o que deixa margem.",
      fonte: {
        periodo: "Últimos 90 dias",
        base: "Margem por linha de receita",
        premissa: "Custos diretos alocados por linha",
      },
      risco: "Vendedor que bate meta de receita bruta pode estar trazendo volume na linha errada e afundando o resultado",
      acao: "Comissionar por margem, não por receita bruta",
    }
  }

  // 7. Antecipar recebível (Chip #3)
  if (/antecip/.test(q)) {
    return {
      dado: { destaque: "R$ 244,8k no caixa hoje", sub: "Custo: R$ 7,1k" },
      resposta:
        "Dá pra colocar R$ 244,8k no caixa hoje se antecipar 40% do que tem pra entrar nos próximos 30–60 dias. " +
        "Custa R$ 7,1k. Vale se você tem fornecedor pressionando, folha chegando ou estoque pra repor. " +
        "Se não tem nenhum aperto, é dinheiro que sai do bolso e não volta.",
      fonte: {
        periodo: "Recebíveis 30–60d",
        base: "Adquirente · taxa 2,9%/mês",
        premissa: "40% da carteira disponível",
      },
      risco: "Antecipar sem ter pra quê resolve o problema de hoje e cria o do mês que vem",
      acao: "Antes de antecipar, ver se é emergência ou se dá pra segurar",
    }
  }

  // Default — sem âncora suficiente
  return {
    dado: { destaque: "Posso ajudar — me dá uma âncora" },
    resposta:
      "Consigo te ajudar com isso, mas preciso de algo concreto pra calcular o impacto: um valor, um prazo ou uma decisão. " +
      "Exemplo: quanto falta, em qual semana e qual alternativa você tá considerando. " +
      "Aí eu te devolvo o efeito direto em caixa e resultado.",
    fonte: { periodo: "—", base: "Dados conectados · mês corrente" },
    risco: "Sem âncora, qualquer resposta é palpite — e palpite não decide nada",
    acao: "Reescrever a pergunta com um valor, um prazo ou uma decisão concreta",
  }
}

// LLM real entra em round seguinte com prompt que pede JSON dos 5 campos.
// Por ora, render é sempre via fallback determinístico — garante que nenhuma
// resposta seja texto inventado.
async function askClaude(history: Message[]): Promise<AnswerCardData> {
  await new Promise((r) => setTimeout(r, 700))
  const last = history[history.length - 1]
  const text = last && last.role === "user" ? last.text : ""
  return fallbackFor(text)
}

/* ============================================================================ *
 *  Página
 * ============================================================================ */

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatInner />
    </Suspense>
  )
}

function ChatInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [threads, setThreads] = useState<Thread[]>(() =>
    MOCK_THREADS.map((t) => ({
      ...t,
      messages: t.id === "t1" ? PRELOADED_EXAMPLE : [],
    })),
  )
  const [activeId, setActiveId] = useState<string | null>("t1")
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const handledQuery = useRef(false)

  const active = activeId ? threads.find((t) => t.id === activeId) ?? null : null

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [active?.messages.length, pending])

  const submit = useCallback(
    async (raw: string, targetId?: string) => {
      const text = raw.trim()
      if (!text || pending) return

      let tid = targetId ?? activeId
      const isCreatingFromDraft = !tid

      if (isCreatingFromDraft) {
        tid = `t-${Date.now()}`
        const derived = text.length > 52 ? text.slice(0, 52) + "…" : text
        const fresh: Thread = {
          id: tid,
          title: derived,
          preview: text.length > 60 ? text.slice(0, 60) + "…" : text,
          when: "Agora",
          messages: [],
        }
        setThreads((prev) => [fresh, ...prev])
        setActiveId(tid)
      }

      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text }

      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === tid)
        if (idx === -1) return prev
        const target = prev[idx]
        const isFirstMessage = target.messages.length === 0 || target.title === "Nova conversa"
        const newTitle = isFirstMessage
          ? (text.length > 52 ? text.slice(0, 52) + "…" : text)
          : target.title
        const updated: Thread = {
          ...target,
          title: newTitle,
          preview: text.length > 60 ? text.slice(0, 60) + "…" : text,
          when: "Agora",
          messages: [...target.messages, userMsg],
        }
        const others = prev.filter((t) => t.id !== tid)
        return [updated, ...others]
      })
      setDraft("")
      setPending(true)

      const current = threads.find((t) => t.id === tid)
      const historyForCall = [...(current?.messages ?? []), userMsg]

      const card = await askClaude(historyForCall)
      const cfoupMsg: Message = { id: `c-${Date.now()}`, role: "cfoup", card }
      setThreads((prev) =>
        prev.map((t) => (t.id === tid ? { ...t, messages: [...t.messages, cfoupMsg] } : t)),
      )
      setPending(false)
    },
    [activeId, pending, threads],
  )

  // Trata ?q=...&auto=1
  useEffect(() => {
    if (handledQuery.current) return
    const q = searchParams.get("q")
    const auto = searchParams.get("auto")
    if (!q) return
    handledQuery.current = true

    const newId = `t-${Date.now()}`
    const newThread: Thread = {
      id: newId,
      title: q.length > 52 ? q.slice(0, 52) + "…" : q,
      preview: "Agora",
      when: "Agora",
      messages: [],
    }
    setThreads((prev) => [newThread, ...prev])
    setActiveId(newId)

    // Limpa a URL
    router.replace("/chat", { scroll: false })

    if (auto === "1") {
      // Dispara automaticamente
      setTimeout(() => {
        submit(q, newId)
      }, 50)
    } else {
      setDraft(q)
      setTimeout(() => textarea.current?.focus(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startNewConversation() {
    setActiveId(null)
    setDraft("")
    setTimeout(() => textarea.current?.focus(), 50)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* Histórico de conversas */}
        <aside
          aria-label="Histórico de conversas"
          className="hidden border-r border-border bg-muted/40 lg:flex lg:flex-col"
        >
          <div className="px-6 pb-4 pt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Chat CFOup
            </p>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight" style={{ color: "var(--brand-navy)" }}>
              Suas conversas
            </h1>
          </div>
          <div className="px-4">
            <button
              type="button"
              onClick={startNewConversation}
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-[var(--brand-navy)] shadow-sm transition hover:border-[var(--brand-blue)]/40"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              Nova conversa
            </button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto px-3 pb-6">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Recentes
            </p>
            <ul className="space-y-0.5">
              {threads.map((t) => {
                const isActive = t.id === activeId
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(t.id)}
                      className={cn(
                        "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition",
                        isActive ? "bg-white shadow-sm ring-1 ring-border" : "hover:bg-white/70",
                      )}
                    >
                      <span
                        className="line-clamp-1 text-[13px] font-semibold leading-tight"
                        style={{ color: isActive ? "var(--brand-navy)" : "var(--slate-700)" }}
                      >
                        {t.title}
                      </span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">{t.preview}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t.when}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Área principal */}
        <div className="flex flex-col bg-background">
          <header className="mb-3 flex flex-wrap items-start justify-between gap-3 px-6 md:px-10 lg:px-12">
            <div>
              <h1
                className="text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
                style={{ color: "var(--brand-navy)" }}
              >
                Chat CFOup
              </h1>
            </div>

            <button
              type="button"
              onClick={startNewConversation}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-[var(--brand-navy)] lg:hidden"
            >
              <History className="h-4 w-4" />
              Nova conversa
            </button>
          </header>

          {/* Mensagens */}
          <div ref={scroller} className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 22rem)" }}>
            <div className="mx-auto w-full max-w-3xl px-5 py-10 md:py-12 md:px-8">
              {(!active || (active.messages.length === 0 && !pending)) && <EmptyState onPick={(q) => submit(q)} />}
              {active?.messages.map((m) =>
                m.role === "user" ? <UserBubble key={m.id} text={m.text} /> : <AnswerCard key={m.id} card={m.card} />,
              )}
              {pending && <PendingBubble />}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background px-5 py-5 md:px-8 md:py-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {(() => {
                  const lastUser = active
                    ? [...active.messages].reverse().find((m) => m.role === "user") as { role: "user"; text: string } | undefined
                    : undefined
                  const chips = chipSetFor(lastUser?.text ?? null)
                  return chips.map((c) => (
                    <SuggestionChip
                      key={c.question}
                      icon={ChipIconMap[c.icon]}
                      label={c.label}
                      onClick={() => submit(c.question)}
                    />
                  ))
                })()}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(draft)
                }}
                className="relative rounded-2xl border border-border bg-card shadow-[0_1px_0_rgba(15,23,42,0.02),0_8px_24px_-16px_rgba(15,23,42,0.12)] transition focus-within:border-[var(--brand-blue)]/60 focus-within:shadow-[0_0_0_4px_rgba(21,103,200,0.08)]"
              >
                <label htmlFor="ask" className="sr-only">
                  Digite sua pergunta
                </label>
                <textarea
                  id="ask"
                  ref={textarea}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      submit(draft)
                    }
                  }}
                  rows={2}
                  placeholder="Pergunte sobre caixa, margens, recebíveis, clientes, cenários…"
                  className="block w-full resize-none rounded-2xl bg-transparent px-5 pb-14 pt-4 text-[14px] leading-relaxed text-[var(--brand-navy)] placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-muted"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Anexar contexto
                    </button>
                    <span className="hidden text-muted-foreground/70 md:inline">·</span>
                    <span className="hidden md:inline">
                      Enter envia · <kbd className="font-mono text-[10px]">Shift</kbd>+
                      <kbd className="font-mono text-[10px]">Enter</kbd> nova linha
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!draft.trim() || pending}
                    aria-label="Enviar pergunta"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                    ) : (
                      <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── helpers visuais ───────── */

function UserBubble({ text }: { text: string }) {
  return (
    <div className="mb-10 flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-tr-md px-4 py-3 text-[14px] leading-relaxed"
        style={{
          background: "var(--slate-100)",
          color: "var(--brand-navy)",
        }}
      >
        {text}
      </div>
    </div>
  )
}

function AnswerCard({ card }: { card: AnswerCardData }) {
  return (
    <div className="mb-12 flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <CfoupLogo showWordmark={false} size={32} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            CFOup
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Mesa de decisão
          </span>
        </div>

        {/* Slot 1 — Dado */}
        <p className="text-[22px] font-extrabold leading-tight" style={{ color: "var(--brand-navy)" }}>
          {card.dado.destaque}
        </p>
        {card.dado.sub && (
          <p className="mt-1 text-[11px] text-muted-foreground">{card.dado.sub}</p>
        )}

        <div className="my-4 border-t border-border" />

        {/* Slot 2 — Resposta */}
        <p className="text-[14px] leading-relaxed text-[var(--slate-700)]">{card.resposta}</p>

        <div className="my-4 border-t border-border" />

        {/* Slot 3 — Fonte */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          FONTE · {card.fonte.periodo} • {card.fonte.base}
          {card.fonte.premissa && ` • premissa: ${card.fonte.premissa}`}
        </p>

        {/* Slot 4 — Risco */}
        <p className="mt-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700/80">RISCO</span>
          <span className="ml-2 text-[13px] text-[var(--slate-700)]">{card.risco}</span>
        </p>

        {/* Slot 5 — Ação */}
        <p className="mt-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--brand-cyan)" }}>AÇÃO</span>
          <span className="ml-2 text-[13px] text-[var(--slate-700)]">{card.acao}</span>
        </p>
      </div>
    </div>
  )
}

function PendingBubble() {
  return (
    <div className="mb-12 flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <CfoupLogo showWordmark={false} size={32} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline gap-2">
          <span className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            CFOup
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            escrevendo…
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--slate-500)]">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--brand-cyan)]" />
          <span
            className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--brand-blue)]"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--brand-navy)]"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  const examples = [
    "Quanto tempo minha empresa consegue operar com o caixa atual?",
    "Onde estou perdendo dinheiro no negócio?",
    "O que acontece se eu perder meu maior cliente?",
    "Quanto posso retirar da empresa sem prejudicar o negócio?",
  ]
  return (
    <div className="mb-10 rounded-2xl border border-border bg-card p-6 md:p-7">
      <h2 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
        Pergunte sobre caixa, margem, clientes, fornecedores ou cenários.
      </h2>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {examples.map((ex) => (
          <li key={ex}>
            <button
              type="button"
              onClick={() => onPick(ex)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-left text-[13px] font-semibold text-[var(--slate-700)] transition hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-navy)]"
            >
              {ex}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SuggestionChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--slate-700)] transition hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-navy)]"
    >
      <span className="text-[var(--brand-blue)]">{icon}</span>
      {label}
    </button>
  )
}
