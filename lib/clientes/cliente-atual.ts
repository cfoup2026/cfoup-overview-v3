/**
 * Cliente atual ativo na sessão.
 *
 * Default: empresa-vazia (sem dados importados).
 * empresa-001 é fixture interna para demos/testes via import direto.
 */
import { dadosClienteVazio, dadosFinanceirosVazios } from "./empresa-vazia"

export const clienteAtual = {
  empresa: dadosClienteVazio.empresa,
  dadosContabeis: dadosClienteVazio,
  dadosFinanceiros: dadosFinanceirosVazios,
}
