"use client"

import { useState } from "react"
import Link from "next/link"
import type { BlocoOperacional, MovimentoMes, SaidaRecorrente } from "@/lib/types/analise-financeira"

type Props = {
  letra: string
  titulo: string
  src: string
  dados: BlocoOperacional
}

const NIVEL_CONFIG: Record<string, { label: string; color: string }> = {
  critico: { label: "Crítico", color: "var(--brand-red)" },
  atencao: { label: "Atenção", color: "var(--brand-warning)" },
  controle: { label: "Controle", color: "var(--brand-green)" },
}

// Formata valor em R$ com k/M
function fmtVal(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000) return `R$ ${Math.round(v / 1_000)}k`
  return `R$ ${v}`
}

// Componente para tabela de movimentação mensal
function TabelaMovimentoMensal({
  movimentos,
  totalEntradas,
  totalSaidas,
  mediaEntradas,
  mediaSaidas,
  notaRodape,
}: {
  movimentos: MovimentoMes[]
  totalEntradas?: number
  totalSaidas?: number
  mediaEntradas?: number
  mediaSaidas?: number
  notaRodape?: string
}) {
  const maxSaldo = Math.max(...movimentos.map((m) => Math.abs(m.saldo)))

  return (
    <div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="py-2 pl-3 text-left font-semibold text-muted-foreground">Mês</th>
            <th className="py-2 pr-3 text-right font-semibold text-muted-foreground">Entradas</th>
            <th className="py-2 pr-3 text-right font-semibold text-muted-foreground">Saídas</th>
            <th className="py-2 pr-3 text-right font-semibold text-muted-foreground">Saldo</th>
            <th className="w-24 py-2 pr-3 text-right font-semibold text-muted-foreground" />
          </tr>
        </thead>
        <tbody>
          {movimentos.map((m, idx) => {
            const saldoColor = m.saldo >= 0 ? "var(--brand-green)" : "var(--brand-red)"
            const barWidth = maxSaldo > 0 ? (Math.abs(m.saldo) / maxSaldo) * 100 : 0
            const barColor = m.saldo >= 0 ? "var(--brand-green)" : "var(--brand-red)"

            return (
              <tr
                key={idx}
                className={`border-b border-border/50 ${m.isMelhor ? "bg-green-50" : m.isPior ? "bg-red-50" : ""}`}
              >
                <td className="py-2 pl-3 font-medium" style={{ color: "var(--brand-navy)" }}>
                  {m.mes}
                  {m.isMelhor && (
                    <span className="ml-2 text-[10px] font-semibold uppercase" style={{ color: "var(--brand-green)" }}>
                      Melhor
                    </span>
                  )}
                  {m.isPior && (
                    <span className="ml-2 text-[10px] font-semibold uppercase" style={{ color: "var(--brand-red)" }}>
                      Pior
                    </span>
                  )}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums" style={{ color: "var(--brand-ink-muted)" }}>
                  {fmtVal(m.entradas)}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums" style={{ color: "var(--brand-ink-muted)" }}>
                  {fmtVal(m.saidas)}
                </td>
                <td className="py-2 pr-3 text-right font-semibold tabular-nums" style={{ color: saldoColor }}>
                  {m.saldo >= 0 ? "+" : ""}
                  {fmtVal(m.saldo)}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex h-3 w-full items-center justify-end">
                    <div
                      className="h-2 rounded-sm"
                      style={{ width: `${barWidth}%`, backgroundColor: barColor, minWidth: barWidth > 0 ? 4 : 0 }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        {(totalEntradas || totalSaidas) && (
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/50">
              <td className="py-2 pl-3 font-bold" style={{ color: "var(--brand-navy)" }}>
                Total
              </td>
              <td className="py-2 pr-3 text-right font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                {totalEntradas ? fmtVal(totalEntradas) : "—"}
              </td>
              <td className="py-2 pr-3 text-right font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                {totalSaidas ? fmtVal(totalSaidas) : "—"}
              </td>
              <td
                className="py-2 pr-3 text-right font-bold tabular-nums"
                style={{
                  color:
                    (totalEntradas || 0) - (totalSaidas || 0) >= 0 ? "var(--brand-green)" : "var(--brand-red)",
                }}
              >
                {(totalEntradas || 0) - (totalSaidas || 0) >= 0 ? "+" : ""}
                {fmtVal((totalEntradas || 0) - (totalSaidas || 0))}
              </td>
              <td />
            </tr>
            {(mediaEntradas || mediaSaidas) && (
              <tr className="bg-muted/30">
                <td className="py-2 pl-3 text-[11px] italic text-muted-foreground">Média mensal</td>
                <td className="py-2 pr-3 text-right text-[11px] italic tabular-nums text-muted-foreground">
                  {mediaEntradas ? fmtVal(mediaEntradas) : "—"}
                </td>
                <td className="py-2 pr-3 text-right text-[11px] italic tabular-nums text-muted-foreground">
                  {mediaSaidas ? fmtVal(mediaSaidas) : "—"}
                </td>
                <td />
                <td />
              </tr>
            )}
          </tfoot>
        )}
      </table>
      {notaRodape && (
        <p className="mt-3 text-[11px] italic text-muted-foreground">{notaRodape}</p>
      )}
    </div>
  )
}

// Componente para tabela de saídas recorrentes
function TabelaSaidasRecorrentes({
  saidas,
  totalSaidas,
}: {
  saidas: SaidaRecorrente[]
  totalSaidas?: number
}) {
  return (
    <div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="py-2 pl-3 text-left font-semibold text-muted-foreground">Categoria</th>
            <th className="py-2 pr-3 text-right font-semibold text-muted-foreground">Valor médio</th>
            <th className="py-2 pr-3 text-left font-semibold text-muted-foreground">Recorrência</th>
            <th className="py-2 pr-3 text-left font-semibold text-muted-foreground">Leitura</th>
            <th className="py-2 pr-3 text-left font-semibold text-muted-foreground">Ação</th>
          </tr>
        </thead>
        <tbody>
          {saidas.map((s, idx) => (
            <tr key={idx} className="border-b border-border/50">
              <td className="py-2 pl-3 font-medium" style={{ color: "var(--brand-navy)" }}>
                {s.categoria}
              </td>
              <td className="py-2 pr-3 text-right font-semibold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                {fmtVal(s.valorMedio)}
              </td>
              <td className="py-2 pr-3 text-[11px] text-muted-foreground">{s.recorrencia}</td>
              <td className="py-2 pr-3 text-[11px]" style={{ color: "var(--brand-ink-muted)" }}>
                {s.leitura}
              </td>
              <td className="py-2 pr-3 text-[11px]" style={{ color: "var(--brand-blue)" }}>
                {s.acao || "—"}
              </td>
            </tr>
          ))}
        </tbody>
        {totalSaidas && (
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/50">
              <td className="py-2 pl-3 font-bold" style={{ color: "var(--brand-navy)" }}>
                Total
              </td>
              <td className="py-2 pr-3 text-right font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                {fmtVal(totalSaidas)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

export function BlocoOperacionalTab({ letra, titulo, src, dados }: Props) {
  const [glossOpen, setGlossOpen] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState<Record<number, boolean>>({})

  const toggleEvidence = (idx: number) => {
    setEvidenceOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section>
      {/* VEREDITO */}
      <div className="rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Veredito · Bloco {letra}
        </p>
        <p
          className="max-w-3xl text-[15px] md:text-[16px] font-semibold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.veredito}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">{src}</p>
      </div>

      {/* LEITURA */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          A leitura
        </p>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--brand-ink-muted)" }}
          dangerouslySetInnerHTML={{ __html: dados.leitura }}
        />
      </div>

      {/* KPIs */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          KPIs-chave
        </p>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              dados.kpis.length === 5
                ? "repeat(5, 1fr)"
                : dados.kpis.length === 3
                  ? "repeat(3, 1fr)"
                  : "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {dados.kpis.map((kpi, idx) => {
            const deltaColor =
              kpi.deltaType === "up"
                ? "var(--brand-green)"
                : kpi.deltaType === "down"
                  ? "var(--brand-red)"
                  : kpi.deltaType === "warn"
                    ? "var(--brand-warning)"
                    : undefined

            const content = (
              <>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p
                  className="mt-1 text-xl font-bold tabular-nums"
                  style={{ color: "var(--brand-navy)" }}
                  dangerouslySetInnerHTML={{ __html: kpi.valor }}
                />
                <p
                  className="mt-1 text-[11px] tabular-nums"
                  style={{ color: deltaColor || "var(--brand-ink-muted)" }}
                >
                  {kpi.delta}
                </p>
              </>
            )

            if (kpi.href) {
              return (
                <Link
                  key={idx}
                  href={kpi.href}
                  className="block rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-[var(--brand-blue)]/40 hover:bg-muted/50"
                >
                  {content}
                </Link>
              )
            }

            return (
              <div key={idx} className="rounded-lg border border-border bg-muted/30 p-3">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* ALERTAS — GRID 3 COLUNAS */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Alertas operacionais
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {dados.alertas.map((alerta, idx) => {
            const config = NIVEL_CONFIG[alerta.nivel] || { label: alerta.nivel, color: "var(--brand-blue)" }

            const content = (
              <div className="flex h-full flex-col rounded-lg border border-border p-4">
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: config.color }}
                >
                  {config.label}
                </p>
                <p className="mb-2 text-[13px] font-semibold leading-snug" style={{ color: "var(--brand-navy)" }}>
                  {alerta.titulo}
                </p>
                <p
                  className="flex-1 text-[12px] leading-relaxed"
                  style={{ color: "var(--brand-ink-muted)" }}
                  dangerouslySetInnerHTML={{ __html: alerta.texto }}
                />
              </div>
            )

            if (alerta.href) {
              return (
                <Link
                  key={idx}
                  href={alerta.href}
                  className="block transition-colors hover:opacity-80"
                >
                  {content}
                </Link>
              )
            }

            return <div key={idx}>{content}</div>
          })}
        </div>
      </div>

      {/* EVIDENCE BLOCKS (opcional) */}
      {dados.evidenceBlocks && dados.evidenceBlocks.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Detalhamento
          </p>
          <div className="space-y-3">
            {dados.evidenceBlocks.map((block, idx) => (
              <div key={idx} className="rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleEvidence(idx)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold transition-colors hover:bg-muted/30"
                  style={{ color: "var(--brand-navy)", background: evidenceOpen[idx] ? "var(--muted)" : "white" }}
                >
                  <span>{block.titulo}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none transition-transform ${
                      evidenceOpen[idx] ? "rotate-45 bg-[var(--brand-blue)] text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    +
                  </span>
                </button>
                {evidenceOpen[idx] && (
                  <div className="border-t border-border bg-white p-4">
                    {/* Tipo: HTML simples */}
                    {block.tipo === "html" && block.conteudo && (
                      <div
                        className="text-[13px] leading-relaxed"
                        style={{ color: "var(--brand-ink-muted)" }}
                        dangerouslySetInnerHTML={{ __html: block.conteudo }}
                      />
                    )}

                    {/* Tipo: Movimento mensal */}
                    {block.tipo === "movimento-mensal" && block.movimentos && (
                      <TabelaMovimentoMensal
                        movimentos={block.movimentos}
                        totalEntradas={block.totalEntradas}
                        totalSaidas={block.totalSaidas}
                        mediaEntradas={block.mediaEntradas}
                        mediaSaidas={block.mediaSaidas}
                        notaRodape={block.notaRodape}
                      />
                    )}

                    {/* Tipo: Saídas recorrentes */}
                    {block.tipo === "saidas-recorrentes" && block.saidas && (
                      <TabelaSaidasRecorrentes saidas={block.saidas} totalSaidas={block.totalSaidas2} />
                    )}

                    {/* Tipo: Dois painéis lado a lado */}
                    {block.tipo === "dois-paineis" && block.painelEsquerdo && block.painelDireito && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-border">
                          <div className="border-b border-border bg-muted/30 px-4 py-2">
                            <h4 className="text-[12px] font-semibold" style={{ color: "var(--brand-navy)" }}>
                              {block.painelEsquerdo.titulo}
                            </h4>
                          </div>
                          <div
                            className="p-4 text-[12px] leading-relaxed"
                            style={{ color: "var(--brand-ink-muted)" }}
                            dangerouslySetInnerHTML={{ __html: block.painelEsquerdo.conteudo }}
                          />
                        </div>
                        <div className="rounded-lg border border-border">
                          <div className="border-b border-border bg-muted/30 px-4 py-2">
                            <h4 className="text-[12px] font-semibold" style={{ color: "var(--brand-navy)" }}>
                              {block.painelDireito.titulo}
                            </h4>
                          </div>
                          <div
                            className="p-4 text-[12px] leading-relaxed"
                            style={{ color: "var(--brand-ink-muted)" }}
                            dangerouslySetInnerHTML={{ __html: block.painelDireito.conteudo }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs (opcional) */}
      {dados.ctas && dados.ctas.length > 0 && (
        <div className="mt-6 space-y-3">
          {dados.ctas.map((cta, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-2 border-[var(--brand-blue)]/20 bg-[var(--brand-blue)]/5 p-6 md:p-8"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
                {cta.eyebrow}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                {cta.texto}
              </p>
              <Link
                href={cta.href}
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                {cta.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* AÇÕES PRIORIZADAS — BLOCO FORTE */}
      <div className="mt-6 rounded-2xl border-2 border-border bg-muted/20 p-6 md:p-8">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Ações priorizadas · Bloco {letra}
        </p>
        <div className="space-y-4">
          {dados.acoes.map((acao, idx) => {
            const content = (
              <div className="flex gap-4 rounded-xl border border-border bg-white p-4 transition-colors hover:border-[var(--brand-blue)]/40">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold"
                  style={{ backgroundColor: "var(--brand-blue)", color: "white" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--brand-navy)" }}
                    dangerouslySetInnerHTML={{ __html: acao.texto }}
                  />
                  <p className="mt-1 text-[11px] italic text-muted-foreground">{acao.meta}</p>
                </div>
              </div>
            )

            if (acao.href) {
              return (
                <Link key={idx} href={acao.href} className="block">
                  {content}
                </Link>
              )
            }

            return <div key={idx}>{content}</div>
          })}
        </div>
      </div>

      {/* GLOSSÁRIO */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setGlossOpen(!glossOpen)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-6 py-4 text-left text-[13px] font-semibold transition-all hover:bg-muted/30"
          style={{ color: "var(--brand-navy)" }}
        >
          <span>
            <span className="mr-3 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
              Glossário
            </span>
            Bloco {letra} · {titulo}
          </span>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none transition-transform ${
              glossOpen ? "rotate-45 bg-[var(--brand-blue)] text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            +
          </span>
        </button>
        {glossOpen && (
          <div className="mt-[-1px] rounded-b-2xl border border-t-0 border-border bg-white px-6 py-4">
            {dados.glossario.map((item, idx) => (
              <div key={idx} className="border-b border-border py-3 last:border-b-0">
                <dt className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>
                  {item.termo}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                  {item.definicao}
                </dd>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
