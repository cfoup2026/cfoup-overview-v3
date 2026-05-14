// Configuração de níveis de alerta
// Compartilhado entre sintese-tab e bloco-operacional-tab

export type NivelAlerta = "critico" | "atencao" | "controle"

export type NivelConfig = {
  label: string
  color: string
}

export const NIVEL_CONFIG: Record<NivelAlerta, NivelConfig> = {
  critico: { label: "Crítico", color: "var(--brand-red)" },
  atencao: { label: "Atenção", color: "var(--brand-warning)" },
  controle: { label: "Controle", color: "var(--brand-green)" },
}
