import { clienteAtual } from "@/lib/clientes/cliente-atual"
import AnaliseFinanceiraShell from "@/components/analise-financeira/analise-financeira-shell"

export default function AnaliseFinanceiraPage() {
  return <AnaliseFinanceiraShell cliente={clienteAtual} />
}
