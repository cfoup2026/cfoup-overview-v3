"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function CicloTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="F"
      titulo="Ciclo de Caixa"
      src="Prazo médio de receber vs prazo médio de pagar · 2025"
      dados={dados}
    />
  )
}
