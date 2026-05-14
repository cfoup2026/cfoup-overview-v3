// Configuração de status do checklist mensal
// Labels e símbolos para microlegenda

import type { ChecklistStatus } from "@/lib/types/analise-financeira"

export type ChecklistStatusConfig = {
  label: string
  symbol: string
  color: string
}

export const CHECKLIST_STATUS_CONFIG: Record<ChecklistStatus, ChecklistStatusConfig> = {
  concluido: { label: "Concluído", symbol: "✔", color: "var(--brand-green)" },
  atencao: { label: "Atenção", symbol: "⚠", color: "var(--brand-warning)" },
  pendente: { label: "Não iniciado", symbol: "○", color: "var(--muted-foreground)" },
  aguardando: { label: "Aguardando validação", symbol: "◌", color: "var(--brand-blue)" },
}

// Ordem do ciclo de toggle
export const CHECKLIST_STATUS_CYCLE: ChecklistStatus[] = ["pendente", "concluido", "atencao", "aguardando"]
