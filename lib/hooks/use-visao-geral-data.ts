/**
 * useVisaoGeralData — fonte única de dados da página Visão Geral.
 *
 * ARQUITETURA
 * -----------
 * Esta página é genérica. Serve para qualquer empresa cliente do CFOup.
 * Os números vêm da camada de dados (após o dono conectar banco/NF-e/ERP
 * na tela /conexoes). Os textos narrativos (headline, resumo, alertas,
 * descrição do cliente crítico) são gerados pela camada de análise +
 * respostas CFOup, calculados em cima dos dados reais.
 *
 * HOJE: a empresa ainda não tem conexões ativas.
 * `hasConnections: false` → a UI mostra estado vazio em todos os blocos.
 *
 * AMANHÃ: depois que o dono conectar os dados:
 * - hasConnections vira true
 * - o hook busca /api/visao-geral?companyId=...
 * - a mesma UI renderiza os números e textos retornados
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type DrilldownIcon = "receber" | "pagar" | "antigos" | "concentracao"

export type VisaoGeralData = {
  hasConnections: boolean
  headline: string
  resumoEyebrow: string
  resumoTitulo: string
  resumoTexto: string
  saldoAtual: {
    value: string | null
    status: "ok" | "pending"
  }
  variacao: {
    value: string | null
    texto: string | null
  }
  cardsDrilldown: Array<{
    href: string
    eyebrow: string
    icon: DrilldownIcon
    total: string | null
    count: string | null
    hint: string | null
  }>
  alertas: Array<{
    severity: "warning" | "info"
    title: string
    body: string
  }>
  topClientes: Array<{ name: string; share: number }>
  topFornecedores: Array<{ name: string; share: number }>
  indicadoresClientes: {
    prazoMedio: string
    margemMedia: string
    atrasoMedio: string
  }
  indicadoresFornecedores: {
    prazoMedio: string
    topShareCusto: string
    atrasoMedio: string
  }
  clienteCritico: {
    name: string
    description: string
    href: string
  }
  fornecedorCritico: {
    name: string
    description: string
    href: string
  }
  promptsSugeridos: Array<string>
}

// TODO: substituir pelo fetch real a /api/visao-geral?companyId=...
export function useVisaoGeralData(): VisaoGeralData {
  return {
    hasConnections: false,
    headline:
      "conecte seus dados para começar. A mesa de decisão só faz sentido com os números da operação em tempo real.",
    resumoEyebrow: "Antes de começar",
    resumoTitulo: "Nenhuma conexão ativa ainda.",
    resumoTexto:
      "Conecte seu banco, sistema de NF-e e ERP em Conexões. Assim que os dados entrarem, esta tela passa a responder as perguntas que importam.",
    saldoAtual: {
      value: null,
      status: "pending",
    },
    variacao: {
      value: null,
      texto: null,
    },
    cardsDrilldown: [
      {
        href: "/conexoes",
        eyebrow: "Contas a receber",
        icon: "receber",
        total: null,
        count: null,
        hint: null,
      },
      {
        href: "/conexoes",
        eyebrow: "Contas a pagar",
        icon: "pagar",
        total: null,
        count: null,
        hint: null,
      },
      {
        href: "/conexoes",
        eyebrow: "Itens antigos",
        icon: "antigos",
        total: null,
        count: null,
        hint: null,
      },
    ],
    alertas: [],
    topClientes: [],
    topFornecedores: [],
    indicadoresClientes: {
      prazoMedio: "—",
      margemMedia: "—",
      atrasoMedio: "—",
    },
    indicadoresFornecedores: {
      prazoMedio: "—",
      topShareCusto: "—",
      atrasoMedio: "—",
    },
    clienteCritico: {
      name: "—",
      description: "Aguardando dados",
      href: "/conexoes",
    },
    fornecedorCritico: {
      name: "—",
      description: "Aguardando dados",
      href: "/conexoes",
    },
    promptsSugeridos: [
      "Qual cliente mais pesa no meu risco hoje?",
      "Qual fornecedor mais pressiona meu caixa?",
      "O que merece atenção primeiro: receber, pagar ou margem?",
      "Onde está meu principal risco neste momento?",
    ],
  }
}
