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
    "Contas que juntam o DRE e o Balanço para mostrar quanto a empresa ganha, quanto tem guardado e se tem dívida.",

  glossario: [
    {
      termo: "ROE (Retorno sobre Patrimônio)",
      definicao:
        "O lucro do ano dividido pelo patrimônio dos sócios, em porcentagem. Responde: a cada R$ 100 que os sócios têm dentro da empresa, quantos viraram lucro neste ano?",
    },
    {
      termo: "ROA (Retorno sobre Ativo)",
      definicao:
        "O lucro do ano dividido por tudo que a empresa tem. Responde: a cada R$ 100 de patrimônio, quantos viraram lucro? Quando o ROA é quase igual ao ROE, quer dizer que a empresa não tem dívida.",
    },
    {
      termo: "Alavancagem",
      definicao:
        "Usar dinheiro de banco ou financiamento para crescer mais rápido do que o dinheiro próprio permitiria.",
    },
    {
      termo: "Endividamento",
      definicao:
        "Quanto do patrimônio da empresa veio de dívida, em vez de vir do dinheiro dos sócios.",
    },
    {
      termo: "Liquidez",
      definicao:
        "Capacidade da empresa de pagar as contas. Se tem muito dinheiro e pouca dívida, a liquidez é alta.",
    },
    {
      termo: "Capital de Giro Líquido",
      definicao:
        "Diferença entre o que a empresa tem de curto prazo e o que ela deve de curto prazo. Se for positivo, tem folga para tocar o dia-a-dia. Se for negativo, tem problema.",
    },
  ],
}
