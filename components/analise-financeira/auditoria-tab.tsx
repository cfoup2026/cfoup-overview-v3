"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function AuditoriaTab({ dados }: Props) {
  return (
    <BlocoOperacionalTab
      letra="C"
      titulo="Auditoria de Contas a Receber e Contas a Pagar"
      src="Posição em 20/04/2026"
      dados={dados}
    />
  )
}
