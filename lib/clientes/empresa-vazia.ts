import type { AnaliseContabilData } from "./empresa-001"
import type { AnaliseFinanceiraDados, BlocoOperacional, ChecklistMensalData, SinteseFinanceiraData, HeroFinanceiro, FontesImportadas } from "@/lib/types/analise-financeira"

// ---------------------------------------------------------------------
// Empresa vazia — cliente novo sem fontes importadas
// Estrutura mínima para compilar e renderizar empty states
// ---------------------------------------------------------------------
export const dadosClienteVazio: AnaliseContabilData = {
  empresa: {
    nome: "Empresa não configurada",
    nomeCurto: "—",
    cnpj: "—",
    regime: "—",
  },
  periodos: [],
  emitidoEm: "—",
  fontesRecebidas: "Nenhuma",
  statusAnalise: "Aguardando arquivos",
  fontesImportadas: {
    dre: false,
    balanco: false,
    razao: false,
    balancete: false,
    diarioGeral: false,
  },

  sintese: {
    intro: "",
    fatos: [],
    kpis: [],
    comoUsar: { navegacao: "", oQueAnalisamos: "" },
  },

  dre: {
    intro: "",
    legendaAV: "",
    legendaAH: "",
    linhasAV: [],
    linhasAH: [],
    comentarios: [],
  },

  balanco: {
    linhasAV: [],
    linhasAH: [],
    comentarios: [],
  },

  indicadores: {
    linhas: [],
    comentarios: [],
  },

  aoContador: {
    grupos: [],
  },
}

// ---------------------------------------------------------------------
// Dados Financeiros vazios — Análise Financeira
// ---------------------------------------------------------------------

const fontesImportadasVazias: FontesImportadas = {
  cr: false,
  cp: false,
  vendas: false,
  banco: false,
  estoque: false,
}

const heroVazio: HeroFinanceiro = {
  subTitulo: "Operação · Vendas · Recebíveis · Caixa · Ciclo",
  descricao: "Importe seus dados para gerar a análise financeira completa do seu negócio.",
  exercicios: "—",
  cobertura: "—",
  fonte: "Aguardando importação",
  dataBase: "—",
}

const sinteseVazia: SinteseFinanceiraData = {
  veredito: "",
  kpis: [],
  alertas: [],
  leitura: {
    principal: "",
    oQueFuncionou: "",
    oQuePreocupa: "",
    oQueFazerAgora: "",
  },
  acoes: [],
}

function criarBlocoVazio(letra: string, titulo: string, src: string = "Aguardando dados"): BlocoOperacional {
  return {
    tabMeta: { letra, titulo, src },
    veredito: "",
    leitura: "",
    kpis: [],
    alertas: [],
    acoes: [],
    glossario: [],
    evidenceBlocks: [],
    ctas: [],
  }
}

const checklistMensalVazio: ChecklistMensalData = {
  grupos: [],
}

export const dadosFinanceirosVazios: AnaliseFinanceiraDados = {
  fontesImportadas: fontesImportadasVazias,
  hero: heroVazio,
  sintese: sinteseVazia,
  faturamento: criarBlocoVazio("A", "Faturamento"),
  clientes: criarBlocoVazio("B", "Clientes"),
  auditoria: criarBlocoVazio("C", "Auditoria de Contas a Receber e Contas a Pagar"),
  fornecedores: criarBlocoVazio("D", "Fornecedores"),
  caixa: criarBlocoVazio("E", "Caixa Bancário"),
  ciclo: criarBlocoVazio("F", "Ciclo de Caixa"),
  checklistMensal: checklistMensalVazio,
}
