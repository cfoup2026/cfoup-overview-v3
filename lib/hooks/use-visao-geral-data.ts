/**
 * useVisaoGeralData — fonte única de dados da página Visão Geral.
 *
 * ARQUITETURA
 * -----------
 * Esta página é genérica — serve para qualquer empresa cliente do CFOup.
 * Os dados vêm dinamicamente: números da empresa (AR/AP/Vendas/Banco) e
 * textos narrativos (headline, resumo, alertas, descrição do crítico)
 * gerados pela camada de análise + LLM a cada visita.
 *
 * HOJE (mock)
 * -----------
 * Retorna valores fictícios para manter a UI funcionando enquanto a camada
 * de dados + LLM não está conectada. Todos os campos existem e têm o shape
 * final — a única coisa que muda na próxima iteração é de onde eles vêm.
 *
 * PRÓXIMOS PASSOS
 * ---------------
 * 1. Trocar os retornos mock por fetch a /api/visao-geral?companyId=...
 * 2. Essa rota vai:
 *    a. Buscar dados da empresa no Supabase (AR/AP/Vendas/Banco).
 *    b. Rodar a camada de análise (findings estruturados).
 *    c. Chamar LLM para gerar os textos narrativos em cima dos findings.
 *    d. Retornar o objeto VisaoGeralData completo.
 * 3. A UI não muda — continua consumindo este hook.
 */

"use client"

export type DrilldownIcon = "receber" | "pagar" | "antigos" | "concentracao"

export type VisaoGeralData = {
  greeting: string
  userName: string
  headline: string
  resumoEyebrow: string
  resumoTitulo: string
  resumoTexto: string
  saldoAtual: {
    value: string | null
    status: "ok" | "pending"
  }
  cardsDrilldown: Array<{
    href: string
    eyebrow: string
    icon: DrilldownIcon
    total: string
    count: string
    hint: string
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

// TODO: substituir por fetch real via rota /api/visao-geral
// A resposta real virá: dados da empresa + findings + textos gerados por LLM.
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

export function useVisaoGeralData(): VisaoGeralData {
  return {
    greeting: getGreeting(),
    userName: "Roger",
    headline: "a operação está rodando, mas os números ainda precisam ser separados.",
    resumoEyebrow: "Resumo do momento",
    resumoTitulo: "O primeiro passo aqui é separar o que está no banco do que ainda está no sistema.",
    resumoTexto:
      "Com isso limpo, fica mais fácil entender o que realmente falta receber, o que precisa ser pago e o que ainda pede revisão.",
    saldoAtual: {
      value: null,
      status: "pending",
    },
    cardsDrilldown: [
      {
        href: "/contas-a-receber",
        eyebrow: "Contas a receber",
        icon: "receber",
        total: "R$ 342,8k",
        count: "10 títulos",
        hint: "2 vencidos · 3 vencem em 7 dias",
      },
      {
        href: "/contas-a-pagar",
        eyebrow: "Contas a pagar",
        icon: "pagar",
        total: "R$ 280,2k",
        count: "9 títulos",
        hint: "1 vencido · 3 vencem em 7 dias",
      },
      {
        href: "/itens-antigos",
        eyebrow: "Itens antigos",
        icon: "antigos",
        total: "R$ 112,5k",
        count: "8 itens",
        hint: "4 acima de 90 dias",
      },
    ],
    alertas: [
      {
        severity: "warning",
        title: "Recebimentos vencidos pedem cobrança",
        body: "Há títulos vencidos que pedem cobrança ou regularização no sistema.",
      },
      {
        severity: "warning",
        title: "Itens antigos pedem revisão",
        body: "Há itens antigos em aberto que podem precisar de baixa, correção ou limpeza.",
      },
      {
        severity: "info",
        title: "Lançamentos pedem conferência",
        body: "Há registros que podem estar sem classificação correta, duplicados ou pendentes de revisão.",
      },
    ],
    topClientes: [
      { name: "Cliente em validação", share: 0 },
      { name: "Cliente em validação", share: 0 },
      { name: "Cliente em validação", share: 0 },
      { name: "Cliente em validação", share: 0 },
      { name: "Cliente em validação", share: 0 },
    ],
    topFornecedores: [
      { name: "Fornecedor em validação", share: 0 },
      { name: "Fornecedor em validação", share: 0 },
      { name: "Fornecedor em validação", share: 0 },
      { name: "Fornecedor em validação", share: 0 },
      { name: "Fornecedor em validação", share: 0 },
    ],
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
      name: "Cliente em validação",
      description: "Participação na receita, prazo e margem em validação",
      href: "/clientes/concentracao",
    },
    fornecedorCritico: {
      name: "Fornecedor em validação",
      description: "Concentração e atraso em validação",
      href: "/fornecedores/atraso",
    },
    promptsSugeridos: [
      "Qual cliente mais pesa no meu risco hoje?",
      "Qual fornecedor mais pressiona meu caixa?",
      "O que merece atenção primeiro: receber, pagar ou margem?",
      "Onde está meu principal risco neste momento?",
    ],
  }
}
