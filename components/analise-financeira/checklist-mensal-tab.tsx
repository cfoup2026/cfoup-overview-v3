"use client"

import { useState } from "react"
import type { ChecklistMensalData, ChecklistStatus } from "@/lib/types/analise-financeira"
import { CHECKLIST_STATUS_CONFIG, CHECKLIST_STATUS_CYCLE } from "@/lib/analise-financeira/constants/checklist"

type Props = {
  dados: ChecklistMensalData
}

// Status icon e cor
function StatusIcon({ status }: { status: ChecklistStatus }) {
  const config = CHECKLIST_STATUS_CONFIG[status]
  
  if (status === "concluido" || status === "atencao") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold"
        style={{ backgroundColor: config.color, color: "white" }}
      >
        {status === "concluido" ? "✓" : "⚠"}
      </span>
    )
  }
  if (status === "aguardando") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-dashed text-[11px]"
        style={{ borderColor: config.color, color: config.color }}
      >
        {config.symbol}
      </span>
    )
  }
  // pendente
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px]"
      style={{ borderColor: config.color, color: config.color }}
    >
      {config.symbol}
    </span>
  )
}

export function ChecklistMensalTab({ dados }: Props) {
  // Estado local para toggle de status (mock, sem persistência)
  const [statusMap, setStatusMap] = useState<Record<string, ChecklistStatus>>(() => {
    const map: Record<string, ChecklistStatus> = {}
    dados.grupos.forEach((grupo, gIdx) => {
      grupo.itens.forEach((item, iIdx) => {
        map[`${gIdx}-${iIdx}`] = item.status
      })
    })
    return map
  })

  const toggleStatus = (key: string) => {
    setStatusMap((prev) => {
      const current = prev[key]
      const currentIdx = CHECKLIST_STATUS_CYCLE.indexOf(current)
      const next = CHECKLIST_STATUS_CYCLE[(currentIdx + 1) % CHECKLIST_STATUS_CYCLE.length]
      return { ...prev, [key]: next }
    })
  }

  return (
    <section className="space-y-6">
      {/* Microlegenda */}
      <div className="flex justify-end">
        <p className="text-[11px] text-muted-foreground">
          <span style={{ color: CHECKLIST_STATUS_CONFIG.concluido.color }}>{CHECKLIST_STATUS_CONFIG.concluido.symbol}</span> {CHECKLIST_STATUS_CONFIG.concluido.label}
          <span className="mx-1.5">·</span>
          <span style={{ color: CHECKLIST_STATUS_CONFIG.atencao.color }}>{CHECKLIST_STATUS_CONFIG.atencao.symbol}</span> {CHECKLIST_STATUS_CONFIG.atencao.label}
          <span className="mx-1.5">·</span>
          <span style={{ color: CHECKLIST_STATUS_CONFIG.pendente.color }}>{CHECKLIST_STATUS_CONFIG.pendente.symbol}</span> {CHECKLIST_STATUS_CONFIG.pendente.label}
          <span className="mx-1.5">·</span>
          <span style={{ color: CHECKLIST_STATUS_CONFIG.aguardando.color }}>{CHECKLIST_STATUS_CONFIG.aguardando.symbol}</span> {CHECKLIST_STATUS_CONFIG.aguardando.label}
        </p>
      </div>

      {dados.grupos.map((grupo, gIdx) => (
        <div
          key={gIdx}
          className="rounded-2xl border border-border bg-white p-5 md:p-6"
        >
          {/* Eyebrow do grupo */}
          <p
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {grupo.titulo}
          </p>

          {/* Itens */}
          <div className="space-y-1">
            {grupo.itens.map((item, iIdx) => {
              const key = `${gIdx}-${iIdx}`
              const status = statusMap[key]

              return (
                <button
                  key={iIdx}
                  type="button"
                  onClick={() => toggleStatus(key)}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:bg-muted/40"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <StatusIcon status={status} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[13px] font-medium leading-snug"
                      style={{ color: "var(--brand-navy)" }}
                    >
                      {item.titulo}
                    </p>
                    {item.contexto && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {item.contexto}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Nota de rodapé */}
      <p className="text-center text-[11px] text-muted-foreground">
        Clique em qualquer item para alternar o status. Dados mockados — persistência em desenvolvimento.
      </p>
    </section>
  )
}
