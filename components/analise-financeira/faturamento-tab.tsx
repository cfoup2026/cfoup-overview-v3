"use client"

import { BlocoOperacionalTab } from "./bloco-operacional-tab"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  dados: BlocoOperacional
}

export function FaturamentoTab({ dados }: Props) {
  return <BlocoOperacionalTab dados={dados} />
}
