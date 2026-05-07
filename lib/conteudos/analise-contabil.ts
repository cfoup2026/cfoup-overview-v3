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
    "Mostra o que a empresa tinha, o que devia, e qual era o patrimônio dos sócios no encerramento de cada exercício.",

  legendaAV:
    "A coluna **AV** mostra quanto cada linha representa do total. Exemplo: se o saldo em banco é 93,5%, de cada R$ 100 de patrimônio da empresa, R$ 93,50 estão no banco.",

  legendaAH:
    "As colunas Δ mostram quanto cada linha cresceu ou caiu de um ano para o outro. Verde é favorável; vermelho é desfavorável; cinza é neutro.",

  glossario: [
    {
      termo: "Ativo",
      definicao:
        "Tudo que a empresa tem de valor: dinheiro em caixa e banco, estoque, máquinas, equipamentos, imóveis, valores a receber de clientes.",
    },
    {
      termo: "Ativo Circulante",
      definicao:
        "O que a empresa tem e pode virar dinheiro em até 12 meses: saldo em banco, estoque, duplicatas a receber.",
    },
    {
      termo: "Ativo Não-Circulante",
      definicao:
        "O que a empresa tem e não vai virar dinheiro tão rápido: máquinas, veículos, imóveis, equipamentos — ativos 'de uso', não de venda.",
    },
    {
      termo: "Passivo",
      definicao:
        "Tudo que a empresa deve para alguém: fornecedores, impostos a pagar, salários a pagar, empréstimos, financiamentos.",
    },
    {
      termo: "Passivo Circulante",
      definicao:
        "O que a empresa precisa pagar em até 12 meses: fornecedores, impostos do mês, folha, INSS, FGTS.",
    },
    {
      termo: "Patrimônio Líquido (PL)",
      definicao:
        "O que sobra depois de tirar tudo que a empresa deve do que ela tem. É a 'parte dos sócios' na empresa. Se vendesse tudo e pagasse todas as dívidas, seria isso que sobraria.",
    },
    {
      termo: "Capital Social",
      definicao:
        "O dinheiro que os sócios colocaram oficialmente na empresa. Fica registrado no contrato social e no CNPJ.",
    },
    {
      termo: "Lucros Acumulados",
      definicao:
        "Soma de todos os lucros que a empresa já deu e que nunca foram distribuídos para os sócios. Fica guardado dentro da empresa.",
    },
    {
      termo: "Reserva Legal",
      definicao:
        "Parte do lucro que a lei obriga a empresa a guardar, até chegar a 20% do capital social.",
    },
    {
      termo: "Depreciação",
      definicao:
        "Perda de valor das máquinas, veículos e equipamentos com o tempo. Se uma máquina custou R$ 50 mil e dura 10 anos, a contabilidade reduz R$ 5 mil por ano do valor dela no balanço.",
    },
    {
      termo: "Substituição Tributária (ICMS-ST)",
      definicao:
        "Modelo de cobrança do ICMS em que o primeiro da cadeia (quem vende para o varejista) já paga o imposto que seria do varejista.",
    },
    {
      termo: "Capital de Giro",
      definicao:
        "Dinheiro que a empresa precisa para tocar o dia-a-dia: comprar matéria-prima, pagar folha, pagar aluguel antes de receber dos clientes.",
    },
    {
      termo: "Leasing",
      definicao:
        "Aluguel de longo prazo, geralmente de máquina ou veículo, com opção de compra no final. Não aparece como dívida da mesma forma que empréstimo, mas é um compromisso a pagar.",
    },
  ],
}

// ---------------------------------------------------------------------
// Indicadores — conteúdo universal
// ---------------------------------------------------------------------
export type IndicadoresConteudoUniversal = {
  intro: string
  glossario: { termo: string; definicao: string }[]
}

export const conteudoIndicadores: IndicadoresConteudoUniversal = {
  intro:
    "Indicadores financeiros resumem a saúde da empresa em poucos números. Cada um responde uma pergunta diferente: a empresa é lucrativa? Tem dinheiro para pagar as contas? Está usando bem o capital dos sócios?",

  glossario: [
    {
      termo: "Margem Bruta",
      definicao:
        "Quanto sobra da venda depois de pagar o custo do produto. Fórmula: (Receita − Custo) ÷ Receita. Se é 36%, de cada R$ 100 vendido, R$ 36 sobram antes de pagar despesas.",
    },
    {
      termo: "Margem Líquida",
      definicao:
        "Quanto sobra de lucro limpo depois de pagar tudo: custo, despesa, imposto. Fórmula: Lucro Líquido ÷ Receita. Se é 19%, de cada R$ 100 vendido, R$ 19 viram lucro.",
    },
    {
      termo: "Liquidez Corrente",
      definicao:
        "Quantos reais a empresa tem para cada R$ 1 que ela deve no curto prazo. Fórmula: Ativo Circulante ÷ Passivo Circulante. Se é 2x, ela tem R$ 2 para cada R$ 1 de dívida imediata.",
    },
    {
      termo: "Endividamento",
      definicao:
        "Quanto do patrimônio da empresa é financiado por dívida. Fórmula: Passivo ÷ Ativo. Se é 10%, de cada R$ 100 de patrimônio, R$ 10 são dívida.",
    },
    {
      termo: "ROE (Retorno sobre PL)",
      definicao:
        "Quanto o lucro do ano representa do patrimônio dos sócios. Fórmula: Lucro Líquido ÷ Patrimônio Líquido. Se é 30%, cada R$ 100 investido rendeu R$ 30 de lucro.",
    },
    {
      termo: "Giro do Ativo",
      definicao:
        "Quantas vezes o ativo 'girou' em vendas no ano. Fórmula: Receita ÷ Ativo Total. Se é 2x, a empresa vendeu o dobro do tamanho do seu patrimônio.",
    },
  ],
}
