import { LedgerListView, type LedgerItem, type FilterChip } from "@/components/ledger-list-view"

/**
 * "Itens antigos para revisar" = tudo que está aberto no sistema há muito tempo:
 * títulos em aberto > 60 dias, lançamentos sem baixa, duplicados em potencial.
 */

const items: LedgerItem[] = [
  {
    id: "NF 24.512",
    counterparty: "Tecnopar Indústria",
    meta: "Pedido 4102 · a receber há 124 dias",
    dueDate: "2025-06-12",
    daysToDue: -127,
    amount: 18600,
    status: "vencido",
  },
  {
    id: "NF 24.498",
    counterparty: "Construtora Velho Oeste",
    meta: "Pedido 4078 · a receber há 168 dias",
    dueDate: "2025-04-28",
    daysToDue: -172,
    amount: 24300,
    status: "vencido",
  },
  {
    id: "NF 24.441",
    counterparty: "Mecânica Zanetti",
    meta: "Pedido 4014 · a receber há 201 dias",
    dueDate: "2025-03-25",
    daysToDue: -206,
    amount: 9450,
    status: "vencido",
  },
  {
    id: "BOL 8804",
    counterparty: "Plastibras Insumos",
    meta: "Duplicado suspeito · mesmo valor, datas próximas",
    dueDate: "2025-07-15",
    daysToDue: -94,
    amount: 22100,
    status: "sem-baixa",
  },
  {
    id: "BOL 8790",
    counterparty: "Transportadora Linha Sul",
    meta: "Frete antigo · pago em banco, sem baixa no sistema",
    dueDate: "2025-07-02",
    daysToDue: -107,
    amount: 4800,
    status: "sem-baixa",
  },
  {
    id: "LCTO 2201",
    counterparty: "Movimento bancário sem categoria",
    meta: "Crédito Banco PJ · origem não identificada",
    dueDate: "2025-06-20",
    daysToDue: -119,
    amount: 12400,
    status: "sem-baixa",
  },
  {
    id: "LCTO 2143",
    counterparty: "Movimento bancário sem categoria",
    meta: "Débito Banco PJ · origem não identificada",
    dueDate: "2025-05-30",
    daysToDue: -140,
    amount: 6700,
    status: "sem-baixa",
  },
  {
    id: "NF 24.380",
    counterparty: "Indústria Ribamar",
    meta: "Pedido 3952 · cliente reclamou de cobrança antiga",
    dueDate: "2025-03-05",
    daysToDue: -226,
    amount: 14200,
    status: "vencido",
  },
]

const filters: FilterChip[] = [
  { id: "all", label: "Tudo" },
  {
    id: "a-receber",
    label: "A receber antigos",
    predicate: (i) => i.status === "vencido" && i.id.startsWith("NF"),
  },
  {
    id: "sem-baixa",
    label: "Lançamentos sem baixa",
    predicate: (i) => i.status === "sem-baixa",
  },
  {
    id: "acima-90",
    label: "Acima de 90 dias",
    predicate: (i) => i.daysToDue < -90,
  },
  {
    id: "acima-180",
    label: "Acima de 180 dias",
    predicate: (i) => i.daysToDue < -180,
  },
]

export default function ItensAntigosPage() {
  const total = items.reduce((acc, i) => acc + i.amount, 0)
  const acima90 = items.filter((i) => i.daysToDue < -90)
  const semBaixa = items.filter((i) => i.status === "sem-baixa")

  return (
    <LedgerListView
      eyebrow="Investigar · a partir da Visão Geral"
      title="Itens antigos para revisar"
      description="Títulos em aberto há muito tempo, lançamentos sem baixa e possíveis duplicidades. Revise antes que eles continuem distorcendo o caixa e os recebíveis."
      summary={{
        totalLabel: "Total em aberto antigo",
        total,
        countLabel: "itens para revisar",
        count: items.length,
        extra: [
          { label: "Acima de 90 dias", value: `${acima90.length} itens` },
          { label: "Sem baixa no sistema", value: `${semBaixa.length} itens` },
        ],
      }}
      items={items}
      filters={filters}
      kind="antigos"
      chatPrompt="Tenho itens antigos em aberto no sistema. Quais valem a pena cobrar, quais devo limpar por baixa contábil e quais podem estar distorcendo meu caixa?"
    />
  )
}
