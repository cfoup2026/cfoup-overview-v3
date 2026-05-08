"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function ClientesTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="B"
      titulo="Clientes"
      src="593 clientes únicos · 2023-2025 · jornada + concentração"
      dados={dados}
    />
  )
}
