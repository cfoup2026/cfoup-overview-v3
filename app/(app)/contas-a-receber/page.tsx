import { LedgerListView, type LedgerItem, type FilterChip } from "@/components/ledger-list-view"

const items: LedgerItem[] = [
  {
    id: "NF 24.812",
    counterparty: "Metalúrgica Ipanema",
    meta: "Contrato recorrente · Pedido 4478",
    dueDate: "2025-11-02",
    daysToDue: 16,
    amount: 48200,
    status: "em-dia",
  },
  {
    id: "NF 24.810",
    counterparty: "Plastech Brasil",
    meta: "Fornecimento de peças · Pedido 4471",
    dueDate: "2025-10-22",
    daysToDue: 5,
    amount: 31400,
    status: "vencendo",
  },
  {
    id: "NF 24.803",
    counterparty: "Indústria Andrade",
    meta: "Lote mensal · Pedido 4460",
    dueDate: "2025-10-19",
    daysToDue: 2,
    amount: 22800,
    status: "vencendo",
  },
  {
    id: "NF 24.788",
    counterparty: "Grupo Montezanto",
    meta: "Pedido 4442 · 1ª parcela de 3",
    dueDate: "2025-10-08",
    daysToDue: -9,
    amount: 54300,
    status: "vencido",
  },
  {
    id: "NF 24.781",
    counterparty: "Tecnopar Indústria",
    meta: "Pedido 4438",
    dueDate: "2025-09-30",
    daysToDue: -17,
    amount: 18900,
    status: "vencido",
  },
  {
    id: "NF 24.766",
    counterparty: "Metalúrgica Ipanema",
    meta: "Pedido 4419",
    dueDate: "2025-09-24",
    daysToDue: -23,
    amount: 41200,
    status: "vencido",
  },
  {
    id: "NF 24.819",
    counterparty: "Soluções Meridian",
    meta: "Pedido 4486",
    dueDate: "2025-11-14",
    daysToDue: 28,
    amount: 26700,
    status: "em-dia",
  },
  {
    id: "NF 24.821",
    counterparty: "Grupo Andrare",
    meta: "Pedido 4491",
    dueDate: "2025-11-20",
    daysToDue: 34,
    amount: 37500,
    status: "em-dia",
  },
  {
    id: "NF 24.825",
    counterparty: "Plastech Brasil",
    meta: "Pedido 4495",
    dueDate: "2025-11-28",
    daysToDue: 42,
    amount: 19800,
    status: "em-dia",
  },
  {
    id: "NF 24.828",
    counterparty: "Metalúrgica Ipanema",
    meta: "Pedido 4498 · última parcela",
    dueDate: "2025-12-05",
    daysToDue: 49,
    amount: 42000,
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

export default function ContasAReceberPage() {
  const total = items.reduce((acc, i) => acc + i.amount, 0)
  const vencidos = items.filter((i) => i.status === "vencido")
  const vencendo = items.filter((i) => i.daysToDue >= 0 && i.daysToDue <= 7)

  return (
    <LedgerListView
      eyebrow="Investigar · a partir da Visão Geral"
      title="Contas a receber"
      description="Todos os títulos que a Gregorutt ainda tem para receber. Investigue vencidos, vencendo e em dia — e filtre por cliente antes de cobrar."
      summary={{
        totalLabel: "Total a receber",
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
      kind="receber"
      chatPrompt="Olha meus contas a receber. Quais clientes estão puxando o prazo pra cima e onde eu devo cobrar primeiro?"
    />
  )
}
