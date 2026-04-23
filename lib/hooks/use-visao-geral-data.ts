"use client"

// TODO: substituir por fetch real quando o backend estiver disponível.
// Este hook é o único ponto de entrada de dados da tela /visao-geral.
// Hoje retorna MOCK com os mesmos valores que estavam hard-coded no JSX.

export type DrilldownIcon = "receber" | "pagar" | "antigos" | "concentracao"

export type VisaoGeralData = {
  greeting: string
  userName: string
  headline: string
  resumoEyebrow: string
  resumoTitulo: string
  resumoTexto: string
  saldoAtual: { value: string | null; status: "ok" | "pending" }
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
  indicadoresClientes: { prazoMedio: string; margemMedia: string; atrasoMedio: string }
  indicadoresFornecedores: { prazoMedio: string; topShareCusto: string; atrasoMedio: string }
  clienteCritico: { name: string; description: string; href: string }
  fornecedorCritico: { name: string; description: string; href: string }
  promptsSugeridos: Array<string>
}

const MOCK_DATA: VisaoGeralData = {
  greeting: "Bom dia",
  userName: "Roger",
  headline: "A operação está rodando, mas os números ainda precisam ser separados.",
  resumoEyebrow: "Resumo do momento",
  resumoTitulo: "O primeiro passo aqui é separar o que está no banco do que ainda está no sistema.",
  resumoTexto:
    "Com isso limpo, fica mais fácil entender o que realmente falta receber, o que precisa ser pago e o que ainda pede revisão.",
  saldoAtual: { value: "R$ 43.677", status: "ok" },
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
    { name: "Construtora Andrade", share: 24 },
    { name: "Metalúrgica Vitória", share: 16 },
    { name: "Grupo Sertanejo", share: 12 },
    { name: "Laticínios Bela Vista", share: 9 },
    { name: "Transportadora Linha Azul", share: 7 },
  ],
  topFornecedores: [
    { name: "Plastibras Insumos", share: 16 },
    { name: "Aços São Paulo", share: 14 },
    { name: "Metalfix Ferramentas", share: 6 },
    { name: "Transportadora Linha Sul", share: 5 },
    { name: "Energia SP", share: 4 },
  ],
  indicadoresClientes: {
    prazoMedio: "42 dias",
    margemMedia: "18%",
    atrasoMedio: "18 dias",
  },
  indicadoresFornecedores: {
    prazoMedio: "14 dias",
    topShareCusto: "43%",
    atrasoMedio: "7 dias",
  },
  clienteCritico: {
    name: "Cliente em validação",
    description: "Participação na receita, prazo e margem em validação",
    href: "/clientes/concentracao",
  },
  fornecedorCritico: {
    name: "Plastibras Insumos",
    description: "R$ 44,2k · 1 título vencido há 7 dias e outro com suspeita de duplicidade",
    href: "/fornecedores/atraso",
  },
  promptsSugeridos: [
    "Qual cliente mais pesa no meu risco hoje?",
    "Qual fornecedor mais pressiona meu caixa?",
    "O que merece atenção primeiro: receber, pagar ou margem?",
    "Onde está meu principal risco neste momento?",
  ],
}

export function useVisaoGeralData(): VisaoGeralData {
  // TODO: trocar por fetch real (SWR) quando o backend estiver pronto.
  return MOCK_DATA
}
