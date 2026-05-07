// ---------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------
export type DRELinhaAV = {
  id: string
  label: string
  isSubtotal?: boolean
  isLucroLiquido?: boolean
  valores: { ano: string; rs: number | null; av: number | null }[]
}

export type DRELinhaAH = {
  id: string
  label: string
  isSubtotal?: boolean
  isLucroLiquido?: boolean
  direcaoFavoravel: "cresce" | "cai"
  valores: { ano: string; rs: number }[]
  deltas: { intervalo: string; pct: number }[]
}

export type DREComentario = {
  id: string
  titulo: string
  corpo: string
  status: "positivo" | "atencao" | "info"
}

export type DREData = {
  intro: string
  legendaAV: string
  legendaAH: string
  linhasAV: DRELinhaAV[]
  linhasAH: DRELinhaAH[]
  comentarios: DREComentario[]
  glossario: { termo: string; definicao: string }[]
}

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
  dre: DREData
}

// ---------------------------------------------------------------------
// Mock Gregorutt
// ---------------------------------------------------------------------
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

  dre: {
    intro:
      "Mostra quanto a empresa vendeu, quanto gastou, e quanto sobrou de lucro em 2023, 2024 e 2025.",

    legendaAV:
      "A coluna **AV** mostra quanto cada linha representa do que a empresa recebeu depois dos impostos. Exemplo: folha de pagamento em 17,3% significa que de cada R$ 100 que a empresa recebe, R$ 17,30 vão para salários.",

    legendaAH:
      "As colunas Δ mostram quanto cada linha cresceu ou caiu de um ano para o outro, em porcentagem. Verde é bom para a empresa. Vermelho é ruim.",

    linhasAV: [
      {
        id: "receita-bruta",
        label: "Receita Bruta de Vendas",
        valores: [
          { ano: "2023", rs: 1905833, av: 113.9 },
          { ano: "2024", rs: 1945627, av: 114.4 },
          { ano: "2025", rs: 2534115, av: 115.7 },
        ],
      },
      {
        id: "cancelamentos",
        label: "(–) Cancelamentos e devoluções",
        valores: [
          { ano: "2023", rs: -47, av: 0.0 },
          { ano: "2024", rs: -4909, av: -0.3 },
          { ano: "2025", rs: -6248, av: -0.3 },
        ],
      },
      {
        id: "impostos-vendas",
        label: "(–) Impostos sobre vendas",
        valores: [
          { ano: "2023", rs: -232248, av: -13.9 },
          { ano: "2024", rs: -240423, av: -14.1 },
          { ano: "2025", rs: -338049, av: -15.4 },
        ],
      },
      {
        id: "receita-liquida",
        label: "= Receita Líquida",
        isSubtotal: true,
        valores: [
          { ano: "2023", rs: 1673538, av: 100.0 },
          { ano: "2024", rs: 1700295, av: 100.0 },
          { ano: "2025", rs: 2189818, av: 100.0 },
        ],
      },
      {
        id: "cpv",
        label: "(–) Custo dos Produtos Vendidos",
        valores: [
          { ano: "2023", rs: -651522, av: -38.9 },
          { ano: "2024", rs: -540513, av: -31.8 },
          { ano: "2025", rs: -534508, av: -24.4 },
        ],
      },
      {
        id: "lucro-bruto",
        label: "= Lucro Bruto",
        isSubtotal: true,
        valores: [
          { ano: "2023", rs: 1022016, av: 61.1 },
          { ano: "2024", rs: 1159782, av: 68.2 },
          { ano: "2025", rs: 1655311, av: 75.6 },
        ],
      },
      {
        id: "despesas-entrega",
        label: "(–) Despesas com entrega",
        valores: [
          { ano: "2023", rs: -2781, av: -0.2 },
          { ano: "2024", rs: -4268, av: -0.3 },
          { ano: "2025", rs: -4796, av: -0.2 },
        ],
      },
      {
        id: "despesas-pessoal",
        label: "(–) Despesas com pessoal",
        valores: [
          { ano: "2023", rs: -346882, av: -20.7 },
          { ano: "2024", rs: -400320, av: -23.5 },
          { ano: "2025", rs: -377761, av: -17.3 },
        ],
      },
      {
        id: "impostos-taxas",
        label: "(–) Impostos, taxas e contribuições",
        valores: [
          { ano: "2023", rs: -14697, av: -0.9 },
          { ano: "2024", rs: -4338, av: -0.3 },
          { ano: "2025", rs: -853, av: 0.0 },
        ],
      },
      {
        id: "despesas-gerais",
        label: "(–) Despesas gerais",
        valores: [
          { ano: "2023", rs: -182704, av: -10.9 },
          { ano: "2024", rs: -218713, av: -12.9 },
          { ano: "2025", rs: -299977, av: -13.7 },
        ],
      },
      {
        id: "despesas-financeiras",
        label: "(–) Despesas financeiras",
        valores: [
          { ano: "2023", rs: -103, av: 0.0 },
          { ano: "2024", rs: null, av: null },
          { ano: "2025", rs: null, av: null },
        ],
      },
      {
        id: "despesas-operacionais",
        label: "= Despesas Operacionais",
        isSubtotal: true,
        valores: [
          { ano: "2023", rs: -547167, av: -32.7 },
          { ano: "2024", rs: -627639, av: -36.9 },
          { ano: "2025", rs: -683387, av: -31.2 },
        ],
      },
      {
        id: "lucro-liquido",
        label: "= Lucro Líquido do Exercício",
        isSubtotal: true,
        isLucroLiquido: true,
        valores: [
          { ano: "2023", rs: 474849, av: 28.4 },
          { ano: "2024", rs: 532143, av: 31.3 },
          { ano: "2025", rs: 971923, av: 44.4 },
        ],
      },
    ],

    linhasAH: [
      {
        id: "receita-bruta-ah",
        label: "Receita Bruta",
        direcaoFavoravel: "cresce",
        valores: [
          { ano: "2023", rs: 1905833 },
          { ano: "2024", rs: 1945627 },
          { ano: "2025", rs: 2534115 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 2.1 },
          { intervalo: "25/24", pct: 30.2 },
          { intervalo: "25/23", pct: 33.0 },
        ],
      },
      {
        id: "receita-liquida-ah",
        label: "Receita Líquida",
        isSubtotal: true,
        direcaoFavoravel: "cresce",
        valores: [
          { ano: "2023", rs: 1673538 },
          { ano: "2024", rs: 1700295 },
          { ano: "2025", rs: 2189818 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 1.6 },
          { intervalo: "25/24", pct: 28.8 },
          { intervalo: "25/23", pct: 30.8 },
        ],
      },
      {
        id: "cpv-ah",
        label: "CPV (custo de produção)",
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -651522 },
          { ano: "2024", rs: -540513 },
          { ano: "2025", rs: -534508 },
        ],
        deltas: [
          { intervalo: "24/23", pct: -17.1 },
          { intervalo: "25/24", pct: -1.1 },
          { intervalo: "25/23", pct: -18.0 },
        ],
      },
      {
        id: "lucro-bruto-ah",
        label: "Lucro Bruto",
        isSubtotal: true,
        direcaoFavoravel: "cresce",
        valores: [
          { ano: "2023", rs: 1022016 },
          { ano: "2024", rs: 1159782 },
          { ano: "2025", rs: 1655311 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 13.5 },
          { intervalo: "25/24", pct: 42.7 },
          { intervalo: "25/23", pct: 62.0 },
        ],
      },
      {
        id: "despesas-pessoal-ah",
        label: "Despesas com pessoal (folha)",
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -346882 },
          { ano: "2024", rs: -400320 },
          { ano: "2025", rs: -377761 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 15.4 },
          { intervalo: "25/24", pct: -5.6 },
          { intervalo: "25/23", pct: 8.9 },
        ],
      },
      {
        id: "despesas-gerais-ah",
        label: "Despesas gerais",
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -182704 },
          { ano: "2024", rs: -218713 },
          { ano: "2025", rs: -299977 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 19.7 },
          { intervalo: "25/24", pct: 37.2 },
          { intervalo: "25/23", pct: 64.2 },
        ],
      },
      {
        id: "impostos-taxas-ah",
        label: "Impostos, taxas e contribuições",
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -14697 },
          { ano: "2024", rs: -4338 },
          { ano: "2025", rs: -853 },
        ],
        deltas: [
          { intervalo: "24/23", pct: -70.5 },
          { intervalo: "25/24", pct: -80.3 },
          { intervalo: "25/23", pct: -94.2 },
        ],
      },
      {
        id: "despesas-entrega-ah",
        label: "Despesas com entrega",
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -2781 },
          { ano: "2024", rs: -4268 },
          { ano: "2025", rs: -4796 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 53.5 },
          { intervalo: "25/24", pct: 12.4 },
          { intervalo: "25/23", pct: 72.5 },
        ],
      },
      {
        id: "despesas-operacionais-ah",
        label: "Despesas Operacionais",
        isSubtotal: true,
        direcaoFavoravel: "cai",
        valores: [
          { ano: "2023", rs: -547167 },
          { ano: "2024", rs: -627639 },
          { ano: "2025", rs: -683387 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 14.7 },
          { intervalo: "25/24", pct: 8.9 },
          { intervalo: "25/23", pct: 24.9 },
        ],
      },
      {
        id: "lucro-liquido-ah",
        label: "Lucro Líquido do Ano",
        isSubtotal: true,
        isLucroLiquido: true,
        direcaoFavoravel: "cresce",
        valores: [
          { ano: "2023", rs: 474849 },
          { ano: "2024", rs: 532143 },
          { ano: "2025", rs: 971923 },
        ],
        deltas: [
          { intervalo: "24/23", pct: 12.1 },
          { intervalo: "25/24", pct: 82.6 },
          { intervalo: "25/23", pct: 104.7 },
        ],
      },
    ],

    comentarios: [
      {
        id: "cpv",
        titulo: "Custo de produção (CPV)",
        status: "atencao",
        corpo:
          "Em 2023, para cada R$ 100 que a empresa vendia, gastava **R$ 39 para produzir**. Em 2025, gasta só **R$ 24**. O custo total quase não mudou em reais (R$ 651 mil em 2023, R$ 534 mil em 2025), mas as vendas cresceram 31%. Essa diferença é grande demais para ser só eficiência — possíveis causas estão nas perguntas ao contador.",
      },
      {
        id: "folha",
        titulo: "Folha de pagamento",
        status: "atencao",
        corpo:
          "A folha subiu 15% em 2024 (chegando a R$ 23,50 de cada R$ 100 vendidos) e **caiu 5,6% em 2025** (R$ 17,30 de cada R$ 100). É raro a folha cair num ano em que a empresa vendeu 30% a mais. Pode ser demissão, redução de pró-labore dos sócios, contratação de alguém como MEI (que sai da folha), ou a despesa foi lançada em outra linha.",
      },
      {
        id: "despesas-gerais",
        titulo: "Despesas gerais",
        status: "atencao",
        corpo:
          "Cresceu 64% em três anos (R$ 183 mil para R$ 300 mil). É a única despesa que vem subindo de peso no faturamento de forma constante. Sem saber o que está dentro, não dá para dizer se é investimento (marketing, sistema, consultoria) ou gasto que deveria estar em outra conta.",
      },
      {
        id: "impostos-taxas",
        titulo: "Impostos, taxas e contribuições",
        status: "info",
        corpo:
          "Caiu de R$ 14,7 mil para R$ 853 (queda de 94%). Linha pequena, mas a queda é muito grande. Provavelmente uma taxa específica deixou de existir ou foi lançada em outro lugar.",
      },
      {
        id: "impostos-vendas",
        titulo: "Impostos sobre vendas",
        status: "atencao",
        corpo:
          "De cada R$ 100 vendidos, a empresa paga **R$ 15,40 de imposto** em 2025. Em 2023 eram R$ 13,90. A alíquota está subindo porque o faturamento está subindo e a empresa está entrando em faixas mais caras do Simples Nacional.",
      },
      {
        id: "despesas-financeiras",
        titulo: "Despesas financeiras",
        status: "positivo",
        corpo:
          "Praticamente zero nos três anos. A empresa não tem empréstimo no banco, não tem financiamento, não desconta duplicata. Tudo gira com dinheiro próprio.",
      },
      {
        id: "cancelamentos",
        titulo: "Cancelamentos e devoluções",
        status: "info",
        corpo:
          "Subiu de R$ 47 em 2023 para R$ 6,2 mil em 2025. Em valor é pouco (0,3% da receita). Mas o salto é grande. Antes não se registrava devolução, ou mudou o perfil dos clientes.",
      },
      {
        id: "lucro",
        titulo: "Lucro do ano",
        status: "positivo",
        corpo:
          "Mais que dobrou em três anos: R$ 475 mil em 2023, R$ 972 mil em 2025. As vendas subiram só 31% no mesmo período. Quase todo o crescimento do lucro veio da margem maior, não de vender mais.",
      },
    ],

    glossario: [
      {
        termo: "Receita Bruta",
        definicao:
          "Tudo que a empresa faturou, antes de tirar qualquer imposto. É o 'total na nota fiscal'.",
      },
      {
        termo: "Receita Líquida",
        definicao:
          "O que sobra da Receita Bruta depois de tirar os impostos sobre vendas e as devoluções. É o valor 'real' que a empresa tem para pagar suas contas.",
      },
      {
        termo: "CPV (Custo dos Produtos Vendidos)",
        definicao:
          "Tudo que a empresa gastou especificamente para produzir o que vendeu: matéria-prima, insumos, embalagem, mão-de-obra direta de produção. Não inclui folha administrativa, aluguel de escritório, marketing.",
      },
      {
        termo: "Lucro Bruto",
        definicao:
          "O que sobra depois de pagar o custo de produção. É Receita Líquida menos CPV. Mostra se o negócio em si (vender mais caro do que custa produzir) funciona.",
      },
      {
        termo: "Margem Bruta",
        definicao:
          "Lucro Bruto dividido pela Receita Líquida, em porcentagem. Responde: 'de cada R$ 100 vendidos, quantos R$ sobram depois de pagar o que custa produzir?'",
      },
      {
        termo: "Despesas Operacionais",
        definicao:
          "Todos os outros gastos da empresa que não são o custo de produção: folha administrativa, aluguel, luz, telefone, marketing, contador, sistemas, entrega, etc.",
      },
      {
        termo: "Lucro Líquido",
        definicao:
          "O que sobra no final, depois de tudo. Receita menos impostos menos custo de produção menos todas as despesas. É o 'lucro' propriamente dito.",
      },
      {
        termo: "Margem Líquida",
        definicao:
          "Lucro Líquido dividido pela Receita Líquida, em porcentagem. Responde: 'de cada R$ 100 vendidos, quantos R$ viram lucro no final?'",
      },
      {
        termo: "Análise Vertical (AV)",
        definicao:
          "Cada linha mostrada como porcentagem do total daquele ano. No DRE, usa-se a Receita Líquida como base. Serve para comparar anos diferentes lado a lado e ver se a estrutura está mudando.",
      },
      {
        termo: "Análise Horizontal (AH)",
        definicao:
          "Mostra de quanto por cento cada linha cresceu ou caiu entre um ano e outro. Serve para entender o ritmo das mudanças.",
      },
      {
        termo: "Reclassificação contábil",
        definicao:
          "Quando o contador muda a conta em que uma despesa é registrada. Ex: uma assessoria que estava em 'Pessoal' passa a ser lançada em 'Despesas Gerais'. O gasto é o mesmo, mas aparece em linha diferente — e isso distorce comparações entre anos.",
      },
      {
        termo: "Simples Nacional",
        definicao:
          "Regime tributário para empresas que faturam até R$ 4,8 milhões por ano. Paga um imposto único que junta vários (IRPJ, CSLL, PIS, COFINS, ICMS, ISS). A alíquota sobe conforme o faturamento anual aumenta.",
      },
      {
        termo: "Lucro Presumido",
        definicao:
          "Outro regime tributário. A Receita Federal 'presume' uma margem de lucro padrão e cobra imposto sobre ela, não sobre o lucro real. Pode ser mais barato que o Simples em algumas situações.",
      },
      {
        termo: "Pró-labore",
        definicao:
          "O salário mensal que os sócios tiram da empresa pelo trabalho que fazem nela. É obrigatório registrar em folha e recolhe INSS. Diferente de distribuição de lucros.",
      },
    ],
  },
}
