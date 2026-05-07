// ---------------------------------------------------------------------
// Conteúdo universal — Análise Financeira
// ---------------------------------------------------------------------

export const conteudoSintese = {
  vereditoLabel: "Veredito",
  alertsLabels: {
    critico: "Crítico",
    atencao: "Atenção",
    controle: "Controle",
  },
  leituraExecutivaLabel: "Leitura executiva",
  subBlocosLabels: {
    funcionou: "O que funcionou",
    preocupa: "O que preocupa",
    fazerAgora: "O que fazer agora",
    acoes: "Ações priorizadas",
  },
}

export const conteudoCaixa = {
  intro:
    "Posição de caixa atual, fluxo dos últimos exercícios e projeção de runway. Dados extraídos de extratos bancários e notas fiscais.",
  kpis: {
    saldoAtual: "Saldo atual",
    runway: "Runway",
    entradas: "Entradas (últ. 30d)",
    saidas: "Saídas (últ. 30d)",
  },
  tabela: {
    titulo: "Fluxo de caixa · 2023–2025",
    source: "Extratos bancários + NFs",
    colunas: ["Categoria", "2023", "2024", "2025", "Var. 2025/2024"],
  },
  categorias: [
    { id: "recebimentos", label: "Recebimentos de clientes" },
    { id: "fornecedores", label: "Pagamentos a fornecedores" },
    { id: "folha", label: "Folha de pagamento" },
    { id: "despesas", label: "Despesas operacionais" },
    { id: "impostos", label: "Impostos e encargos" },
    { id: "fluxo-operacional", label: "Fluxo operacional líquido", isSubtotal: true },
    { id: "capex", label: "Capex / investimentos" },
    { id: "variacao-liquida", label: "Variação líquida de caixa", isSubtotal: true },
  ],
  atencaoTemplate: "Insights aparecem após conexão dos dados.",
  veredictTemplate: "Aguardando conexão dos dados.",
  acoesTitulo: "Ações de caixa",
  acoesEmptyState: "Ações são geradas a partir dos dados conectados.",
}

export const conteudoClientes = {
  // TODO: PR seguinte
}

export const conteudoFaturamento = {
  // TODO: PR seguinte
}

export const conteudoFornecedor = {
  // TODO: PR seguinte
}

export const conteudoCiclo = {
  // TODO: PR seguinte
}

export const conteudoAuditoria = {
  // TODO: PR seguinte
}

export const conteudoChecklist = {
  // TODO: PR seguinte
}
