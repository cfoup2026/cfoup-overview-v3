"use client"

import { LedgerListView, type LedgerItem, type FilterChip } from "@/components/ledger-list-view"

const items: LedgerItem[] = [
  {
    id: "BOL 9210",
    counterparty: "Aços São Paulo",
    meta: "Matéria-prima · Pedido 882",
    dueDate: "2025-10-18",
    daysToDue: 1,
    amount: 38400,
    status: "vencendo",
  },
  {
    id: "BOL 9204",
    counterparty: "Transportadora Linha Sul",
    meta: "Fretes mês 09",
    dueDate: "2025-10-20",
    daysToDue: 3,
    amount: 12800,
    status: "vencendo",
  },
  {
    id: "BOL 9198",
    counterparty: "Energia SP",
    meta: "Conta de energia · fábrica",
    dueDate: "2025-10-24",
    daysToDue: 7,
    amount: 9850,
    status: "vencendo",
  },
  {
    id: "BOL 9185",
    counterparty: "Plastibras Insumos",
    meta: "Insumos plásticos · Pedido 878",
    dueDate: "2025-10-10",
    daysToDue: -7,
    amount: 22100,
    status: "vencido",
  },
  {
    id: "BOL 9187",
    counterparty: "Plastibras Insumos",
    meta: "Insumos plásticos · Pedido 878 (DUPLICADA?)",
    dueDate: "2025-10-12",
    daysToDue: -5,
    amount: 22100,
    status: "sem-baixa",
  },
  {
    id: "BOL 9220",
    counterparty: "Folha de pagamento",
    meta: "Setembro · líquido",
    dueDate: "2025-10-30",
    daysToDue: 13,
    amount: 148000,
    status: "em-dia",
  },
  {
    id: "BOL 9225",
    counterparty: "Prefeitura · IPTU",
    meta: "Imóvel industrial",
    dueDate: "2025-11-05",
    daysToDue: 19,
    amount: 8200,
    status: "em-dia",
  },
  {
    id: "BOL 9231",
    counterparty: "Software Contábil LTDA",
    meta: "Mensalidade",
    dueDate: "2025-11-10",
    daysToDue: 24,
    amount: 2400,
    status: "em-dia",
  },
  {
    id: "BOL 9238",
    counterparty: "Metalfix Ferramentas",
    meta: "Reposição de moldes",
    dueDate: "2025-11-15",
    daysToDue: 29,
    amount: 16300,
    status: "em-dia",
  },
]

const filters: FilterChip[] = [
  { id: "all", label: "Tudo" },
  { id: "vencidos", label: "Vencidos", predicate: (i) => i.status === "vencido" },
  {
    id: "vencendo",
    label: "Vence em 7 dias",
    predicate: (i) => i.daysToDue >= 0 && i.daysToDue <= 7,
  },
  { id: "em-dia", label: "Em dia", predicate: (i) => i.status === "em-dia" },
]

export default function ContasAPagarPage() {
  const total = items.reduce((acc, i) => acc + i.amount, 0)
  const vencidos = items.filter((i) => i.status === "vencido")
  const vencendo = items.filter((i) => i.daysToDue >= 0 && i.daysToDue <= 7)

  return (
    <LedgerListView
      eyebrow="Investigar · a partir da Visão Geral"
      title="Contas a pagar"
      description="Tudo que a Gregorutt precisa pagar nos próximos dias. Confira o que vence essa semana, o que está vencido e o que pode estar duplicado antes de liberar pagamento."
      summary={{
        totalLabel: "Total a pagar",
        total,
        countLabel: "títulos em aberto",
        count: items.length,
        extra: [
          {
            label: "Vencidos",
            value: `${vencidos.length} · ${(vencidos.reduce((a, i) => a + i.amount, 0) / 1000).toFixed(1)}k`,
          },
          {
            label: "Vence em 7 dias",
            value: `${vencendo.length} · ${(vencendo.reduce((a, i) => a + i.amount, 0) / 1000).toFixed(1)}k`,
          },
        ],
      }}
      items={items}
      filters={filters}
      kind="pagar"
      chatPrompt="Olha meus contas a pagar. Alguma duplicidade, algo vencido que eu deveria ter pago, e qual a ordem ideal pra liquidar essa semana?"
    />
  )
}
