"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function CaixaTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="E"
      titulo="Caixa Bancário"
      src="13 meses · Mar/2025 a Mar/2026 · saldo validado por extrato físico"
      dados={dados}
    />
  )
}
