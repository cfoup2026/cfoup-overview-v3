export type AnaliseContabilData = {
  empresa: { nome: string; cnpj: string; regime: string }
  periodos: string[]
  emitidoEm: string
  sintese: {
    intro: string
    fatos: { numero: string; titulo: string; corpo: string; chatCfoup: string }[]
    kpis: { label: string; valor: string; comentario: string }[]
    comoUsar: { navegacao: string; oQueAnalisamos: string }
    glossario: { termo: string; definicao: string }[]
  }
}

export const gregoruttData: AnaliseContabilData = {
  empresa: {
    nome: "Gregorutt Indústria e Comércio Ltda",
    cnpj: "05.218.914/0001-47",
    regime: "Simples Nacional",
  },
  periodos: ["2023", "2024", "2025"],
  emitidoEm: "21/04/2026",

  sintese: {
    intro:
      "Três anos, três realidades diferentes. 2023 foi um ano parado e saudável. 2024 a empresa apertou os custos sem crescer. 2025 foi o ano do salto — vendeu 30% a mais sem gastar praticamente nada a mais para produzir.",

    fatos: [
      {
        numero: "01",
        titulo: "A empresa ganha mais em cada venda",
        corpo:
          "De cada R$ 100 vendidos, sobravam **R$ 61 em 2023** depois de pagar o custo de produção. Em **2024 foram R$ 68**. Em **2025, R$ 76**. No lucro final (depois de todas as despesas), eram **R$ 28 em 2023, R$ 31 em 2024 e R$ 44 em 2025** para cada R$ 100 vendidos.",
        chatCfoup:
          "Chat CFOup: entender o que mudou na estrutura de custos antes de projetar 2026 em cima desse novo patamar.",
      },
      {
        numero: "02",
        titulo: "Dinheiro parado no banco",
        corpo:
          "O saldo em conta bancária passou de **R$ 679 mil em 2023** para **R$ 955 mil em 2024** e **R$ 1,45 milhão em 2025**. Sem dívida, sem grande investimento, sem distribuição formal.",
        chatCfoup:
          "Chat CFOup: o balanço registra o valor como 'Bancos conta movimento'. Se estiver em conta corrente, perde pra inflação. Se estiver em aplicação, deveria estar lançado como 'Aplicações Financeiras'. Se estiver em outra empresa do grupo, não apareceria aqui. Vale confirmar onde esse dinheiro está de fato.",
      },
      {
        numero: "03",
        titulo: "Lucro que ninguém tirou",
        corpo:
          "Capital social de **R$ 5 mil**. Lucro acumulado: **R$ 1,45 milhão**. Nos últimos três anos, a empresa deu quase R$ 2 milhões de lucro e não tem registro de nenhuma distribuição formal aos sócios.",
        chatCfoup:
          "Chat CFOup: formalizar distribuição anual de lucros é isenta de IR, protege o sócio em caso de fiscalização, e libera capital pessoal para diversificar patrimônio fora da empresa.",
      },
    ],

    kpis: [
      {
        label: "Quanto vendeu em 2025",
        valor: "R$ 2,19 mi",
        comentario: "30% a mais que 2024 e 2023",
      },
      {
        label: "Lucro de 2025",
        valor: "R$ 972 mil",
        comentario: "Margem 44%, vale simular Lucro Presumido",
      },
      {
        label: "Lucro por R$ 100 vendidos",
        valor: "R$ 44",
        comentario: "Era R$ 28 em 2023 e R$ 31 em 2024",
      },
      {
        label: "Do patrimônio em banco",
        valor: "93,5%",
        comentario: "Paga 2 anos de despesa operacional",
      },
      {
        label: "Liquidez Corrente 2025",
        valor: "17,6x",
        comentario: "Média PME: 1,5 a 2,0x",
      },
    ],

    comoUsar: {
      navegacao:
        "Use as abas no topo. **DRE** e **Balanço** trazem análise detalhada e comentários em cada linha. **Indicadores** cruza o que a empresa vende com o patrimônio que ela tem. **Perguntas ao Contador** são os pontos que os números sozinhos não respondem. **Glossário** explica cada termo técnico usado aqui. Para tirar dúvidas sobre os números deste relatório, use o **Chat CFOup**.",
      oQueAnalisamos:
        "Olhamos apenas o DRE e o Balanço Patrimonial dos períodos analisados, emitidos pela contabilidade na data de emissão acima. **Não cruzamos ainda com o fluxo de caixa real** (contas a pagar, contas a receber, extrato bancário). Isso é o próximo passo.",
    },

    glossario: [
      {
        termo: "DRE",
        definicao:
          "Demonstração do Resultado. Relatório do resultado de um ano inteiro: quanto a empresa vendeu, o que gastou para produzir, folha, impostos, despesas em geral, e o lucro que sobrou.",
      },
      {
        termo: "Balanço Patrimonial",
        definicao:
          "Relatório que mostra a posição da empresa em 31/12 de cada ano — tudo que ela tem, tudo que ela deve, e o que sobra para os sócios.",
      },
      {
        termo: "Capital Social",
        definicao:
          "O valor que os sócios registraram oficialmente quando abriram a empresa.",
      },
      {
        termo: "Lucro Acumulado",
        definicao:
          "A soma de todos os lucros que a empresa deu desde que foi fundada e que nunca foram distribuídos para os sócios.",
      },
      {
        termo: "Distribuição de lucros",
        definicao:
          "Retirada formal de parte do lucro para os sócios, com registro em ata e no livro contábil. Isenta de imposto de renda até certo limite.",
      },
      {
        termo: "Liquidez Corrente",
        definicao:
          "Divide o que a empresa tem de curto prazo pelo que ela deve de curto prazo. Abaixo de 1,0x = risco; 1,5x a 2,0x = saudável; acima de 2,5x = vale investigar onde está aplicado.",
      },
    ],
  },
}
