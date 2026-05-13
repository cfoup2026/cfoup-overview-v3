import type { AnaliseContabilData } from "./empresa-001"

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
