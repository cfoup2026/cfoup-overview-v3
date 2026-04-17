"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Sparkles, Plus, History, Paperclip, BookOpen, TrendingUp, Wallet, PieChart } from "lucide-react"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "cfoup"
  content: string
  sources?: string[]
}

const initialThread: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "Qual o impacto se eu antecipar 40% dos recebíveis este mês?",
  },
  {
    id: "m2",
    role: "cfoup",
    content:
      "Considerando R$ 612k em recebíveis no horizonte de 30 a 60 dias, antecipar 40% libera cerca de R$ 244,8k no caixa imediato. A taxa média do seu banco adquirente hoje é de 2,9% ao mês — o custo estimado da operação fica em R$ 7,1k.",
    sources: ["Banco PJ · Adquirente", "Fluxo de Caixa · 30/60d"],
  },
  {
    id: "m3",
    role: "cfoup",
    content:
      "Como Sua empresa já opera com 8,2 meses de runway e margem líquida estável em 14,9%, a antecipação faz sentido apenas se existir um uso claro para o caixa — aporte em estoque, redução de passivo caro ou aceleração comercial. Caso contrário, o custo corrói margem sem contrapartida.",
    sources: ["Visão Geral · Saúde financeira", "Margens · 90 dias"],
  },
]

const threads = [
  { id: "t1", title: "Antecipação de recebíveis · agosto", preview: "Impacto no caixa e na margem", when: "Agora" },
  { id: "t2", title: "Onde estou perdendo margem?", preview: "Diagnóstico por linha de receita", when: "Ontem" },
  { id: "t3", title: "Contratar mais um vendedor?", preview: "Ponto de equilíbrio do novo head", when: "3 dias" },
  { id: "t4", title: "Revisão de preço da Linha B", preview: "Elasticidade e margem alvo", when: "Semana passada" },
  { id: "t5", title: "Preciso me preocupar com o PMR?", preview: "Concentração e atraso de recebimento", when: "Mês passado" },
]

export default function PerguntePage() {
  const [messages, setMessages] = useState<Message[]>(initialThread)
  const [draft, setDraft] = useState("")
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [messages.length])

  function send(text?: string) {
    const value = (text ?? draft).trim()
    if (!value) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: value }
    const reply: Message = {
      id: `c-${Date.now() + 1}`,
      role: "cfoup",
      content:
        "Recebi sua pergunta. O CFOup está conectado às suas fontes e usará os dados reais de Sua empresa para responder com contexto em instantes.",
      sources: ["Visão Geral", "Conexões ativas"],
    }
    setMessages((prev) => [...prev, userMsg, reply])
    setDraft("")
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
              Pergunte ao CFOup
            </p>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight" style={{ color: "var(--brand-navy)" }}>
              Suas conversas
            </h1>
          </div>
          <div className="px-4">
            <button
              type="button"
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
              {threads.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition",
                      i === 0 ? "bg-white shadow-sm ring-1 ring-border" : "hover:bg-white/70",
                    )}
                  >
                    <span
                      className="line-clamp-1 text-[13px] font-semibold leading-tight"
                      style={{ color: i === 0 ? "var(--brand-navy)" : "var(--slate-700)" }}
                    >
                      {t.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{t.preview}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {t.when}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border bg-white/70 px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              As respostas usam as fontes conectadas de Sua empresa.
            </div>
          </div>
        </aside>

        {/* Área principal do chat */}
        <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background lg:min-h-screen">
          <header className="border-b border-border px-6 py-5 md:px-10 lg:px-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div>
                  <h1 className="text-[1.35rem] font-extrabold leading-tight" style={{ color: "var(--brand-navy)" }}>
                    Pergunte ao CFOup
                  </h1>
                  <p className="text-[13px] text-muted-foreground">
                    Conversa sobre Sua empresa · contexto conectado em tempo real
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-[var(--brand-navy)] md:inline-flex lg:hidden"
              >
                <History className="h-4 w-4" />
                Histórico
              </button>
            </div>
          </header>

          {/* Mensagens */}
          <div ref={scroller} className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8">
              {messages.map((m) =>
                m.role === "user" ? <UserBubble key={m.id} text={m.content} /> : <CfoupBubble key={m.id} message={m} />,
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background px-5 py-5 md:px-8 md:py-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                <SuggestionChip
                  icon={<Wallet className="h-3.5 w-3.5" />}
                  label="Como está meu runway hoje?"
                  onClick={() => send("Como está meu runway hoje?")}
                />
                <SuggestionChip
                  icon={<PieChart className="h-3.5 w-3.5" />}
                  label="Onde estou perdendo margem?"
                  onClick={() => send("Onde estou perdendo margem nos últimos 60 dias?")}
                />
                <SuggestionChip
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="Posso aumentar retirada este mês?"
                  onClick={() => send("Posso aumentar retirada este mês sem comprometer o caixa?")}
                />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send()
                }}
                className="relative rounded-2xl border border-border bg-card shadow-[0_1px_0_rgba(15,23,42,0.02),0_8px_24px_-16px_rgba(15,23,42,0.12)] transition focus-within:border-[var(--brand-blue)]/60 focus-within:shadow-[0_0_0_4px_rgba(21,103,200,0.08)]"
              >
                <label htmlFor="ask" className="sr-only">
                  Digite sua pergunta ao CFOup
                </label>
                <textarea
                  id="ask"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  rows={2}
                  placeholder="Pergunte sobre caixa, margens, pagamentos, clientes, cenários…"
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
                      Enter para enviar · <kbd className="font-mono text-[10px]">Shift</kbd>+
                      <kbd className="font-mono text-[10px]">Enter</kbd> para nova linha
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Enviar pergunta"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </div>
              </form>
              <p className="mt-3 text-[11px] text-muted-foreground">
                O CFOup responde com base nos dados conectados de Sua empresa. Revise antes de decidir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── helpers ───────── */

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

function CfoupBubble({ message }: { message: Message }) {
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
        <p className="text-[15px] leading-relaxed text-[var(--slate-700)]">{message.content}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.sources.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--brand-cyan)" }}
                />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
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
