"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function FornecedoresTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="D"
      titulo="Fornecedores"
      src="Pagamentos 2023-2025 · 432 fornecedores únicos"
      dados={dados}
    />
  )
}
