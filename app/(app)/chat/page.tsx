"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowUp,
  Sparkles,
  Plus,
  History,
  Paperclip,
  BookOpen,
  Wallet,
  PieChart,
  Users,
  Loader2,
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
        "Antecipar 40% dos recebíveis (~R$ 612k em 30–60d) coloca o dinheiro no caixa hoje. " +
        "Só faz sentido se você tem destino claro — estoque, dívida cara ou venda travada. " +
        "Sem destino, é R$ 7,1k de custo sem retorno.",
      fonte: {
        periodo: "Recebíveis 30–60d",
        base: "Adquirente · taxa 2,9%/mês",
        premissa: "40% da carteira disponível",
      },
      risco: "Runway hoje em 8 meses; antecipar sem destino reduz folga sem comprar prazo",
      acao: "Definir destino do recurso antes de acionar o adquirente",
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

  // 1. Runway / quanto tempo / fôlego (EmptyState #1)
  if (/(runway|caixa aguent|quanto tempo|fôlego|folego|operar com o caixa)/.test(q)) {
    return {
      dado: { destaque: "~8 meses de runway", sub: "Queima média: R$ 156k/mês" },
      resposta:
        `No ritmo atual, a ${clienteAtual.empresa.nomeCurto} aguenta 8 meses sem receita nova. ` +
        "Folga confortável. A dor não é liquidez — é PMR subindo, travando ~R$ 48k de capital de giro.",
      fonte: { periodo: "Últimos 90 dias", base: "Caixa · Fluxo de saída" },
      risco: "PMR em 34 dias pressiona giro antes de a folga acabar",
      acao: "Apertar cobrança ou renegociar prazos com fornecedores",
    }
  }

  // 2. Margem / perdendo dinheiro (EmptyState #2)
  if (/(margem|perdendo|rentabil|onde.*perd)/.test(q)) {
    return {
      dado: { destaque: "Linha B: margem 18,7%", sub: "Caiu 2,1 p.p. no trimestre" },
      resposta:
        "A bruta geral tá em 42,6%, saudável. Quem puxa pra baixo é a Linha B — desconto fora da política corroeu margem. " +
        "Corrigir a régua de desconto recupera ~R$ 18k/mês direto no resultado.",
      fonte: { periodo: "Últimos 90 dias", base: "DRE por linha de receita" },
      risco: "Manter desconto livre consolida margem baixa como padrão",
      acao: "Revisar política de desconto da Linha B esta semana",
    }
  }

  // 3. Concentração / perder cliente (EmptyState #3)
  if (/(concentra|cliente.*(sair|perd)|dependênc|dependenc|maior cliente|perder.*cliente)/.test(q)) {
    return {
      dado: { destaque: "34% em 1 cliente", sub: "~R$ 164k/mês em risco" },
      resposta:
        "Um cliente vale 34% da receita dos últimos 90 dias — acima do limite saudável de 30%. " +
        "Se ele sair, o runway cai pra metade e a operação aperta forte.",
      fonte: { periodo: "Últimos 90 dias", base: "Receita por cliente" },
      risco: "Dependência alta expõe caixa a evento único",
      acao: "Fechar 2 ou 3 contratos médios antes da próxima renovação",
    }
  }

  // 4. Retirada / pró-labore (EmptyState #4)
  if (/(retirada|pro[- ]?labore|sócio|socio|distribuir|dividend|quanto.*retirar|prejudicar.*negócio)/.test(q)) {
    return {
      dado: { destaque: "R$ 20–25k disponíveis", sub: "Sem tocar no runway" },
      resposta:
        "O operacional tá cobrindo tudo — dá pra aumentar retirada em R$ 20 a 25k este mês sem apertar o caixa. " +
        "Mais que isso começa a comer a folga do fechamento trimestral.",
      fonte: { periodo: "Mês corrente", base: "Caixa · Resultado operacional" },
      risco: "Retirada acima de R$ 25k reduz buffer de segurança",
      acao: "Definir valor fixo e revisar só no próximo trimestre",
    }
  }

  // 5. Contratar funcionário (Chip #1)
  if (/(contrata|funcionário|funcionario|head|vendedor|time comercial|mais um)/.test(q)) {
    return {
      dado: { destaque: "Break-even: 4,5 meses", sub: "Custo carregado: ~R$ 28k/mês" },
      resposta:
        "Novo funcionário em posição comercial custa ~R$ 28k/mês carregado. " +
        "Com ramp-up de 3 meses, o break-even fica em 4,5 meses se trouxer R$ 40k de receita marginal.",
      fonte: { periodo: "Projeção 6 meses", base: "Folha · Receita marginal esperada" },
      risco: "Se meta for menor que R$ 40k/mês, contratação não se paga no ano",
      acao: "Definir meta mínima antes de abrir vaga",
    }
  }

  // 6. Cliente lucrativo (Chip #2)
  if (/(cliente.*lucr|lucro.*cliente|qual cliente|rentab.*cliente)/.test(q)) {
    return {
      dado: { destaque: "Linha C: margem 54,9%", sub: "Licenciamento é o mais rentável" },
      resposta:
        "Clientes de licenciamento (Linha C) dão margem de 54,9% — quase o triplo da Linha B. " +
        "O caminho pra lucro é crescer a base de licenciamento sem diluir em projeto sob demanda.",
      fonte: { periodo: "Últimos 90 dias", base: "DRE por linha · Clientes ativos" },
      risco: "Focar em volume de B reduz margem média do portfólio",
      acao: "Priorizar prospecção de clientes para Linha C",
    }
  }

  // 7. Antecipar recebível (Chip #3)
  if (/antecip/.test(q)) {
    return {
      dado: { destaque: "R$ 244,8k no caixa hoje", sub: "Custo: R$ 7,1k" },
      resposta:
        "Antecipar 40% dos recebíveis (~R$ 612k em 30–60d) coloca o dinheiro no caixa hoje. " +
        "Só faz sentido se você tem destino claro — estoque, dívida cara ou venda travada. " +
        "Sem destino, é R$ 7,1k de custo sem retorno.",
      fonte: {
        periodo: "Recebíveis 30–60d",
        base: "Adquirente · taxa 2,9%/mês",
        premissa: "40% da carteira disponível",
      },
      risco: "Runway hoje em 8 meses; antecipar sem destino reduz folga sem comprar prazo",
      acao: "Definir destino do recurso antes de acionar o adquirente",
    }
  }

  // Default — sem âncora suficiente
  return {
    dado: { destaque: "Sem âncora suficiente" },
    resposta:
      `Pra te dar leitura sólida, me ancora num valor, decisão ou cenário específico da ${clienteAtual.empresa.nomeCurto} — ` +
      "quanto, quando, o quê. Aí eu devolvo o impacto direto em caixa e margem.",
    fonte: { periodo: "—", base: "Dados conectados · mês corrente" },
    risco: "Resposta genérica sobre dados financeiros é exatamente o que o CFOup não faz",
    acao: "Reformula a pergunta com um número ou uma decisão concreta",
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
  const [activeId, setActiveId] = useState<string>("t1")
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const handledQuery = useRef(false)

  const active = threads.find((t) => t.id === activeId) ?? threads[0]

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [active?.messages.length, pending])

  const submit = useCallback(
    async (raw: string, targetId?: string) => {
      const text = raw.trim()
      if (!text || pending) return
      const tid = targetId ?? activeId

      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text }

      setThreads((prev) =>
        prev.map((t) =>
          t.id === tid
            ? {
                ...t,
                preview: text.length > 60 ? text.slice(0, 60) + "…" : text,
                when: "Agora",
                messages: [...t.messages, userMsg],
              }
            : t,
        ),
      )
      setDraft("")
      setPending(true)

      const current = threads.find((t) => t.id === tid)
      const historyForCall = [...(current?.messages ?? []), userMsg]

      const card = await askClaude(historyForCall)
      const cfoupMsg: Message = {
        id: `c-${Date.now()}`,
        role: "cfoup",
        card,
      }
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
    const newId = `t-${Date.now()}`
    setThreads((prev) => [
      {
        id: newId,
        title: "Nova conversa",
        preview: "Pergunta o que precisar",
        when: "Agora",
        messages: [],
      },
      ...prev,
    ])
    setActiveId(newId)
    setDraft("")
    setTimeout(() => textarea.current?.focus(), 50)
  }

  return (
    <div className="-mx-5 -my-8 md:-mx-10 lg:-mx-12 lg:-my-12">
      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:min-h-screen lg:grid-cols-[320px_1fr]">
        {/* Histórico de conversas */}
        <aside
          aria-label="Histórico de conversas"
          className="hidden border-r border-border bg-muted/40 lg:flex lg:flex-col"
        >
          <div className="px-6 pb-4 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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

          <div className="border-t border-border bg-white/70 px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Respostas com base nos dados conectados da {clienteAtual.empresa.nomeCurto}.
            </div>
          </div>
        </aside>

        {/* Área principal */}
        <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background lg:min-h-screen">
          <header className="border-b border-border px-6 py-5 md:px-10 lg:px-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div>
                  <h1 className="text-[1.35rem] font-extrabold leading-tight" style={{ color: "var(--brand-navy)" }}>
                    Chat CFOup
                  </h1>
                  <p className="text-[13px] text-muted-foreground">
                    Conversa sobre {clienteAtual.empresa.nomeCurto} · contexto conectado em tempo real
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startNewConversation}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-[var(--brand-navy)]"
              >
                <History className="h-4 w-4" />
                Nova conversa
              </button>
            </div>
          </header>

          {/* Mensagens */}
          <div ref={scroller} className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8">
              {active.messages.length === 0 && !pending && <EmptyState onPick={(q) => submit(q)} />}
              {active.messages.map((m) =>
                m.role === "user" ? <UserBubble key={m.id} text={m.text} /> : <AnswerCard key={m.id} card={m.card} />,
              )}
              {pending && <PendingBubble />}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background px-5 py-5 md:px-8 md:py-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                <SuggestionChip
                  icon={<Users className="h-3.5 w-3.5" />}
                  label="Posso contratar mais um funcionário agora?"
                  onClick={() => submit("Posso contratar mais um funcionário agora?")}
                />
                <SuggestionChip
                  icon={<PieChart className="h-3.5 w-3.5" />}
                  label="Qual cliente realmente me dá lucro?"
                  onClick={() => submit("Qual cliente realmente me dá lucro?")}
                />
                <SuggestionChip
                  icon={<Wallet className="h-3.5 w-3.5" />}
                  label="Vale antecipar recebível pra cobrir o caixa?"
                  onClick={() => submit("Vale antecipar recebível pra cobrir o caixa?")}
                />
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
                  className="block w-full resize-none rounded-2xl bg-transparent px-5 pb-14 pt-4 text-[15px] leading-relaxed text-[var(--brand-navy)] placeholder:text-muted-foreground focus:outline-none"
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
              <p className="mt-3 text-[11px] text-muted-foreground">
                Respostas baseadas nos dados conectados da {clienteAtual.empresa.nomeCurto}. Revise antes de decidir.
              </p>
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
    <div className="mb-8 flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-tr-md px-4 py-3 text-[15px] leading-relaxed"
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
    <div className="mb-10 flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <CfoupLogo showWordmark={false} size={32} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline gap-2">
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
          <p className="mt-0.5 text-[12px] text-muted-foreground">{card.dado.sub}</p>
        )}

        <div className="my-3 border-t border-border" />

        {/* Slot 2 — Resposta */}
        <p className="text-[15px] leading-relaxed text-[var(--slate-700)]">{card.resposta}</p>

        <div className="my-3 border-t border-border" />

        {/* Slot 3 — Fonte */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
    <div className="mb-10 flex gap-4">
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
    <div className="mb-10 rounded-2xl border border-border bg-card p-8">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        Comece por aqui
      </div>
      <h2 className="mt-2 text-xl font-extrabold" style={{ color: "var(--brand-navy)" }}>
        O que você quer saber sobre a {clienteAtual.empresa.nomeCurto}?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Responde em poucas frases, com os números do mês corrente. Quanto mais específica a pergunta, melhor a leitura.
      </p>
      <ul className="mt-5 grid gap-2 md:grid-cols-2">
        {examples.map((ex) => (
          <li key={ex}>
            <button
              type="button"
              onClick={() => onPick(ex)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-left text-[13px] font-medium text-[var(--slate-700)] transition hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-navy)]"
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
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12.5px] font-medium text-[var(--slate-700)] transition hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-navy)]"
    >
      <span className="text-[var(--brand-blue)]">{icon}</span>
      {label}
    </button>
  )
}
