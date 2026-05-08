"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function FaturamentoTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="A"
      titulo="Faturamento"
      src="9.903 notas fiscais · 2023 a Abril/2026 · LR Dias excluído"
      dados={dados}
    />
  )
}
