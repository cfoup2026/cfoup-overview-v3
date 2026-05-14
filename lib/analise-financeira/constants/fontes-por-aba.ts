import type { FontesImportadas } from "@/lib/types/analise-financeira"

/**
 * Regras mínimas de fontes por aba.
 * Retorna array de fontes faltando (vazio = aba habilitada).
 */

type FonteKey = keyof FontesImportadas

type RegraAba = {
  fontes: FonteKey[]
  labels: Record<FonteKey, string>
}

const FONTE_LABELS: Record<FonteKey, string> = {
  cr: "Contas a Receber",
  cp: "Contas a Pagar",
  vendas: "Notas Fiscais",
  banco: "Extratos Bancários",
  estoque: "Estoque",
}

// Regras mínimas por aba
const REGRAS: Record<string, FonteKey[]> = {
  sintese: ["banco"],
  caixa: ["banco"],
  clientes: ["vendas", "cr"],
  faturamento: ["vendas"],
  fornecedores: ["cp", "banco"],
  ciclo: ["vendas", "cr", "cp"],
  auditoria: ["cr", "cp"],
  checklist: [], // sempre renderiza
}

export function verificarFontesFaltando(
  aba: string,
  fontes: FontesImportadas
): string[] {
  const regra = REGRAS[aba] || []
  const faltando: string[] = []

  for (const fonte of regra) {
    if (!fontes[fonte]) {
      faltando.push(FONTE_LABELS[fonte])
    }
  }

  return faltando
}

export function abaTemDadosSuficientes(
  aba: string,
  fontes: FontesImportadas
): boolean {
  return verificarFontesFaltando(aba, fontes).length === 0
}
