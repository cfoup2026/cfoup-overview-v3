"use client"

import { useState } from "react"
import type { ChecklistMensalData, ChecklistStatus } from "@/lib/types/analise-financeira"

type Props = {
  dados: ChecklistMensalData
}

// Status icon e cor
function StatusIcon({ status }: { status: ChecklistStatus }) {
  if (status === "concluido") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold"
        style={{ backgroundColor: "var(--brand-green)", color: "white" }}
      >
        ✓
      </span>
    )
  }
  if (status === "atencao") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold"
        style={{ backgroundColor: "var(--brand-warning)", color: "white" }}
      >
        ⚠
      </span>
    )
  }
  if (status === "aguardando") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-dashed text-[11px]"
        style={{ borderColor: "var(--brand-blue)", color: "var(--brand-blue)" }}
      >
        ◌
      </span>
    )
  }
  // pendente
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px]"
      style={{ borderColor: "var(--muted-foreground)", color: "var(--muted-foreground)" }}
    >
      ○
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
      // Ciclo: pendente → concluido → atencao → aguardando → pendente
      const cycle: ChecklistStatus[] = ["pendente", "concluido", "atencao", "aguardando"]
      const currentIdx = cycle.indexOf(current)
      const next = cycle[(currentIdx + 1) % cycle.length]
      return { ...prev, [key]: next }
    })
  }

  return (
    <section className="space-y-6">
      {/* Microlegenda */}
      <div className="flex justify-end">
        <p className="text-[11px] text-muted-foreground">
          <span style={{ color: "var(--brand-green)" }}>✔</span> Concluído
          <span className="mx-1.5">·</span>
          <span style={{ color: "var(--brand-warning)" }}>⚠</span> Atenção
          <span className="mx-1.5">·</span>
          <span style={{ color: "var(--muted-foreground)" }}>○</span> Não iniciado
          <span className="mx-1.5">·</span>
          <span style={{ color: "var(--brand-blue)" }}>◌</span> Aguardando validação
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
