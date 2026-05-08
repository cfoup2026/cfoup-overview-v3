import { clienteAtual } from "@/lib/clientes/cliente-atual"
import { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"
import AnaliseFinanceiraShell from "@/components/analise-financeira/analise-financeira-shell"

export default function AnaliseFinanceiraPage() {
  return (
    <AnaliseFinanceiraShell
      cliente={{
        nome: clienteAtual.empresa?.nome ?? "—",
        dadosFinanceiros: clienteAtual.dadosFinanceiros,
      }}
      conteudo={conteudoAnaliseFinanceira}
    />
  )
}
