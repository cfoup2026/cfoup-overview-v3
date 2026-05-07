// ---------------------------------------------------------------------
// Conteúdo universal (texto estático) — Análise Contábil
// Separado dos dados de cliente para facilitar tradução/edição.
// ---------------------------------------------------------------------

export type BPConteudoUniversal = {
  intro: string
  legendaAV: string
  legendaAH: string
  glossario: { termo: string; definicao: string }[]
}

export const conteudoBP: BPConteudoUniversal = {
  intro:
    "O Balanço Patrimonial mostra o que a empresa tem (Ativo), o que ela deve (Passivo) e o que sobra para os sócios (Patrimônio Líquido) em cada final de exercício.",

  legendaAV:
    "Análise Vertical: cada linha dividida pelo Total do Ativo (ou Total do Passivo+PL). Mostra a estrutura patrimonial em cada ano.",

  legendaAH:
    "Análise Horizontal: variação percentual de cada linha entre os anos. Mostra a evolução de cada conta no tempo.",

  glossario: [
    {
      termo: "Ativo Circulante",
      definicao:
        "Bens e direitos que serão convertidos em dinheiro em até 12 meses: caixa, estoque, contas a receber de curto prazo.",
    },
    {
      termo: "Ativo Não Circulante",
      definicao:
        "Bens e direitos de longo prazo: imóveis, máquinas, veículos, marcas, investimentos que não serão vendidos em menos de 1 ano.",
    },
    {
      termo: "Passivo Circulante",
      definicao:
        "Obrigações que vencem em até 12 meses: contas a pagar a fornecedores, salários, impostos, parcelas de empréstimos de curto prazo.",
    },
    {
      termo: "Passivo Não Circulante",
      definicao:
        "Dívidas de longo prazo: financiamentos bancários, debêntures, qualquer obrigação com vencimento superior a 12 meses.",
    },
    {
      termo: "Patrimônio Líquido (PL)",
      definicao:
        "O que sobra para os sócios depois de pagar todas as dívidas. Inclui capital investido pelos sócios + lucros acumulados que não foram distribuídos.",
    },
    {
      termo: "Liquidez Corrente",
      definicao:
        "Ativo Circulante ÷ Passivo Circulante. Se for maior que 1, a empresa tem mais a receber que a pagar no curto prazo. Ideal é > 1,5.",
    },
    {
      termo: "Capital de Giro",
      definicao:
        "Ativo Circulante − Passivo Circulante. É o dinheiro que sobra para operar o dia a dia depois de cobrir obrigações imediatas.",
    },
    {
      termo: "Imobilizado",
      definicao:
        "Bens físicos usados na operação: máquinas, equipamentos, veículos, móveis, prédios. Depreciam com o tempo.",
    },
    {
      termo: "Intangível",
      definicao:
        "Bens sem forma física que têm valor econômico: marcas, patentes, softwares, fundo de comércio (goodwill).",
    },
    {
      termo: "Reservas de Lucros",
      definicao:
        "Parte do lucro que a empresa decidiu não distribuir aos sócios. Fica guardada para reinvestir, pagar dívidas ou enfrentar crises.",
    },
  ],
}
