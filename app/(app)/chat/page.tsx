"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowUp,
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
import { PageHeader } from "@/components/page-header"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

/* ============================================================================ *
 *  Chat CFOup — MVP
 *  Sem dados conectados → responde honestamente. Nunca devolve número
 *  inventado, persona fictícia, métrica fixa, cliente ou linha fictícia.
 *  Quando o Núcleo de Dados estiver plugado, a função respostaSemDados()
 *  é substituída pelo roteamento à LLM usando buildSystemPrompt() + contexto
 *  real do cliente.
 * ============================================================================ */

const buildSystemPrompt = () => `Você é o CFOup. É o CFO digital da ${clienteAtual.empresa.nome}. Fala direto com o dono da empresa.

## Como você fala
- Curto, direto, humano. Como um amigo de confiança que entende das contas da empresa.
- Nunca use jargão de MBA, de consultoria ou de startup. Nada de "sinergia", "mindset", "alavancar", "benchmark", "framework", "OKR".
- Se precisar de termo técnico, traduz na mesma frase (ex.: "PMR, que é o tempo até você receber").
- Português brasileiro simples. Trata por "você".
- Máximo 4 ou 5 frases. Vai direto ao impacto: o que isso muda no caixa, na margem, no bolso.
- Nunca pergunte "como posso ajudar?". Já responde com a leitura.
- Valor em R$ apenas quando vier do dado conectado. Sem dado, não afirma número.

## Sem dados conectados
Quando não houver dado real do cliente para fundamentar a resposta:
- Não inventa caixa, margem, receita, fôlego, antecipação, custo, cliente, fornecedor.
- Não cita linha de produto, nome de cliente, fornecedor ou banco.
- Responde com uma das três frases padrão (sem dados / conceitual / fora de escopo) e direciona para conectar banco, faturamento ou recebíveis.

## Fora do seu escopo (você NÃO responde com parecer)
- Tributário/fiscal específico (regime, deduções, declaração).
- Jurídico (contratos, processos, societário).
- Regulatório.
- Temas não financeiros (RH detalhado, TI, marketing).

Quando perguntarem algo assim, responde em UMA frase que isso é com outro especialista (contador, advogado, RH). Quando houver dado conectado, pode traduzir em impacto financeiro; sem dado, apenas reconhece o escopo.

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
      { label: "Vale antecipar recebível?", question: "Vale antecipar recebível pra cobrir o caixa?", icon: "wallet" },
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

function relatedQuestionsFor(lastUserText: string | null): string[] {
  const q = (lastUserText ?? "").toLowerCase()

  // Caixa / fôlego / aperto
  if (/(caixa.*negativ|negativ.*caixa|s\d+.*negativ|semana.*negativ|aperto|cobrir.*caixa|falta.*caixa|buraco|fôlego|folego|quanto tempo|caixa aguent|operar com o caixa)/.test(q)) {
    return [
      "Vale antecipar recebível pra cobrir o caixa?",
      "Posso adiar pagamento de fornecedor sem queimar a relação?",
      "Quem está me devendo há mais de 30 dias?",
      "Vale renegociar dívida pra ganhar fôlego?",
      "A folha do mês cabe no caixa?",
      "Em qual semana o caixa fica mais apertado?",
    ]
  }

  // Margem / rentabilidade
  if (/(margem|desconto|rentab|preço|preco|perdendo|onde.*perd|lucr.*produto|lucr.*linha)/.test(q)) {
    return [
      "Qual cliente realmente me dá lucro?",
      "Qual linha de produto sustenta o resultado?",
      "Meus vendedores estão dando desconto demais?",
      "Que custo cresceu mais nos últimos meses?",
      "Tenho margem pra aumentar preço sem perder cliente?",
      "Onde o resultado vai sangrando sem ninguém perceber?",
    ]
  }

  // Contratação / folha
  if (/(funcionário|funcionario|contrata|folha|vendedor|head|comercial|salário|salario|equipe|admit|demit)/.test(q)) {
    return [
      "Posso contratar mais um funcionário agora?",
      "Quanto custa de verdade um funcionário pra empresa?",
      "Em quanto tempo a contratação se paga?",
      "Qual o impacto da contratação no caixa do trimestre?",
      "Qual o ponto de equilíbrio de uma vaga nova?",
      "Vale CLT ou PJ pra esse perfil?",
    ]
  }

  // Recebíveis / cobrança / antecipação
  if (/(receb|antecip|adquir|cartão|cartao|atras|inadimpl|cliente.*pag|cobrar|cobrança|cobranca)/.test(q)) {
    return [
      "Vale antecipar recebível pra cobrir o caixa?",
      "Tem alternativa mais barata que antecipar?",
      "Quem está me devendo há mais de 30 dias?",
      "Qual minha taxa real de inadimplência?",
      "Posso oferecer desconto pra pagamento antecipado?",
      "Que cliente concentra mais recebível em atraso?",
    ]
  }

  // Concentração / perda de cliente
  if (/(concentra|cliente.*(sair|perd)|dependênc|dependenc|maior cliente|perder.*cliente)/.test(q)) {
    return [
      "O que acontece se eu perder meu maior cliente?",
      "Estou dependente demais de poucos clientes?",
      "Qual cliente realmente me dá lucro?",
      "Quanto tempo eu sobreviveria sem o cliente top?",
      "Que contratos médios fechar antes da próxima renovação?",
    ]
  }

  // Retirada / dividendos / sócios
  if (/(retirada|pro[- ]?labore|sócio|socio|distribuir|dividend|quanto.*retirar|prejudicar.*negócio)/.test(q)) {
    return [
      "Quanto posso retirar este mês sem prejudicar o negócio?",
      "Quanto devo deixar de reserva no caixa da empresa?",
      "Estou tirando do lucro ou da reserva?",
      "Vale aumentar a retirada agora ou esperar fechar o trimestre?",
    ]
  }

  // Default — sem contexto ainda
  return [
    "Quanto tempo minha empresa consegue operar com o caixa atual?",
    "Onde estou perdendo dinheiro no negócio?",
    "O que acontece se eu perder meu maior cliente?",
    "Quanto posso retirar da empresa sem prejudicar o negócio?",
    "Posso contratar mais um funcionário agora?",
    "Vale antecipar recebível pra cobrir o caixa?",
  ]
}

/* ============================================================================ *
 *  Classificação de pergunta + respostas honestas (sem dados conectados)
 * ============================================================================ */

type TipoPergunta = "fora_escopo" | "conceitual" | "sobre_empresa"

function classificarPergunta(text: string): TipoPergunta {
  const q = text.toLowerCase()

  // Fora de escopo: tributário, jurídico, regulatório, RH detalhado
  if (
    /(tribut|fiscal|regime tribut|simples nacional|lucro presumido|lucro real|deduç|deduc|advog|jurídic|juridic|processo judic|contrato societ|trabalhist|rescis|sindical|regulat)/.test(
      q,
    )
  ) {
    return "fora_escopo"
  }

  // Conceitual: "o que é", "como funciona", "qual a diferença", "quando faz sentido"
  if (
    /(o que (é|e) |o que significa|como funciona|qual a diferença|qual a diferenca|quando faz sentido|para que serve|pra que serve)/.test(
      q,
    )
  ) {
    return "conceitual"
  }

  return "sobre_empresa"
}

const MSG_SEM_DADOS =
  "Não tenho dados suficientes para calcular isso ainda. Conecte banco, faturamento ou recebíveis pra eu responder com base real."

const MSG_CONCEITUAL =
  "Posso explicar o conceito, mas não posso afirmar o impacto na sua empresa sem dados conectados."

const MSG_FORA_ESCOPO =
  "Isso é tema para contador, advogado ou especialista. Posso analisar apenas o impacto financeiro quando houver dados conectados."

function respostaSemDados(question: string): AnswerCardData {
  const tipo = classificarPergunta(question)
  const baseFonte = { periodo: "—", base: "Sem dados conectados" }

  if (tipo === "fora_escopo") {
    return {
      dado: { destaque: "Fora do escopo financeiro" },
      resposta: MSG_FORA_ESCOPO,
      fonte: baseFonte,
      risco: "Parecer técnico fora do financeiro é com o especialista responsável",
      acao: "Levar ao contador, advogado ou consultor de RH conforme o tema",
    }
  }

  if (tipo === "conceitual") {
    return {
      dado: { destaque: "Conceito, sem número da empresa" },
      resposta: MSG_CONCEITUAL,
      fonte: baseFonte,
      risco: "Conceito não substitui número — decisão real precisa do seu caixa",
      acao: "Conectar banco, faturamento ou recebíveis pra ver o impacto no seu caso",
    }
  }

  return {
    dado: { destaque: "Aguardando dados conectados", sub: "Banco · Faturamento · Recebíveis" },
    resposta: MSG_SEM_DADOS,
    fonte: baseFonte,
    risco: "Sem dado conectado, qualquer número é palpite",
    acao: "Conectar banco, faturamento ou recebíveis em Configurações",
  }
}

// No MVP, askCFOup sempre responde via respostaSemDados — nenhum número
// inventado sai daqui. Quando o Núcleo de Dados estiver plugado, troca-se a
// implementação pra rotear à LLM com buildSystemPrompt() + contexto real.
async function askCFOup(history: Message[]): Promise<AnswerCardData> {
  await new Promise((r) => setTimeout(r, 700))
  const last = history[history.length - 1]
  const text = last && last.role === "user" ? last.text : ""
  return respostaSemDados(text)
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

  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const handledQuery = useRef(false)

  // Derivar lastUser e related uma vez
  const lastUser = [...messages].reverse().find((m) => m.role === "user") as
    | { id: string; role: "user"; text: string }
    | undefined
  const related = relatedQuestionsFor(lastUser?.text ?? null)
  const chips = chipSetFor(lastUser?.text ?? null)

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [messages.length, pending])

  const submit = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || pending) return

      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text }
      setMessages((prev) => [...prev, userMsg])
      setDraft("")
      setPending(true)

      const card = await askCFOup([...messages, userMsg])
      const cfoupMsg: Message = { id: `c-${Date.now()}`, role: "cfoup", card }
      setMessages((prev) => [...prev, cfoupMsg])
      setPending(false)
    },
    [messages, pending],
  )

  // Trata ?q=...&auto=1
  useEffect(() => {
    if (handledQuery.current) return
    const q = searchParams.get("q")
    const auto = searchParams.get("auto")
    if (!q) return
    handledQuery.current = true
    router.replace("/chat", { scroll: false })

    if (auto === "1") {
      setTimeout(() => submit(q), 50)
    } else {
      setDraft(q)
      setTimeout(() => textarea.current?.focus(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* Perguntas relacionadas */}
        <aside
          aria-label="Perguntas relacionadas"
          className="hidden border-r border-border bg-muted/40 lg:flex lg:flex-col"
        >
          <div className="mb-3 px-6 pt-10">
            <h2
              className="text-base font-bold leading-tight tracking-tight"
              style={{ color: "var(--brand-navy)" }}
            >
              Continue a decisão
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <ul className="space-y-1">
              {related.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => submit(q)}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[var(--slate-700)] transition hover:bg-white/70 hover:text-[var(--brand-navy)]"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Área principal */}
        <div className="flex flex-col bg-background">
          <div className="px-6 md:px-10 lg:px-12">
            <PageHeader eyebrow="Mesa de Decisão" title="Chat CFOup" />
          </div>

          {/* Mensagens */}
          <div ref={scroller} className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 22rem)" }}>
            <div className="mx-auto w-full max-w-3xl px-5 py-10 md:py-12 md:px-8">
              {messages.length === 0 && !pending && <EmptyState onPick={(q) => submit(q)} />}
              {messages.map((m) =>
                m.role === "user" ? <UserBubble key={m.id} text={m.text} /> : <AnswerCard key={m.id} card={m.card} />,
              )}
              {pending && <PendingBubble />}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background px-5 py-5 md:px-8 md:py-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <SuggestionChip
                    key={c.question}
                    icon={ChipIconMap[c.icon]}
                    label={c.label}
                    onClick={() => submit(c.question)}
                  />
                ))}
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          FONTE · {card.fonte.periodo} • {card.fonte.base}
          {card.fonte.premissa && ` • premissa: ${card.fonte.premissa}`}
        </p>

        {/* Slot 4 — Risco */}
        <p className="mt-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--brand-warning)" }}>RISCO</span>
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
    <div className="mb-10 rounded-2xl border border-border bg-card p-4 md:p-5">
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
