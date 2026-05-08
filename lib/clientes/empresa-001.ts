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
}

// ---------------------------------------------------------------------
// Tipos Balanço Patrimonial
// ---------------------------------------------------------------------
export type BPLinhaAV = {
  id: string
  label: string
  isHeaderSecao?: boolean
  isSubtotal?: boolean
  valores: { ano: string; rs: number | null; av: number | null }[]
}

export type BPLinhaAH = {
  id: string
  label: string
  isHeaderSecao?: boolean
  isSubtotal?: boolean
  direcaoFavoravel: "cresce" | "cai" | "neutra"
  valores: { ano: string; rs: number }[]
  deltas: { intervalo: string; pct: number }[]
}

export type BPComentario = {
  id: string
  titulo: string
  corpo: string
  status: "positivo" | "atencao" | "info"
}

export type BPDadosCliente = {
  linhasAV: BPLinhaAV[]
  linhasAH: BPLinhaAH[]
  comentarios: BPComentario[]
}

// ---------------------------------------------------------------------
// Tipos Indicadores
// ---------------------------------------------------------------------
export type IndicadorLinha = {
  id: string
  label: string
  valoresPorAno: { ano: string; valor: string }[]
  explicacao: string
}

export type IndicadorComentario = {
  id: string
  titulo: string
  corpo: string
  status: "positivo" | "atencao" | "info"
}

export type IndicadoresDadosCliente = {
  linhas: IndicadorLinha[]
  comentarios: IndicadorComentario[]
}

// ---------------------------------------------------------------------
// Tipos Ao Contador
// ---------------------------------------------------------------------
export type GrupoAoContador = {
  id: string
  numero: number
  titulo: string
  contexto: string
  perguntas: string[]
}

export type AoContadorDadosCliente = {
  grupos: GrupoAoContador[]
}

// ---------------------------------------------------------------------
// Tipos Conclusão
// ---------------------------------------------------------------------
export type CardConclusao = {
  id: string
  titulo: string
  paragrafo: string
}

export type ConclusaoDadosCliente = {
  cards: CardConclusao[]
}

export type AnaliseContabilData = {
  empresa: { nome: string; nomeCurto: string; cnpj: string; regime: string }
  periodos: string[]
  emitidoEm: string
  sintese: {
    intro: string
    fatos: { numero: string; titulo: string; corpo: string; chatCfoup: string }[]
    kpis: { label: string; valor: string; comentario: string }[]
    comoUsar: { navegacao: string; oQueAnalisamos: string }
  }
  dre: DREData
  balanco: BPDadosCliente
  indicadores: IndicadoresDadosCliente
  aoContador: AoContadorDadosCliente
  conclusao: ConclusaoDadosCliente
}

// ---------------------------------------------------------------------
// Dados do cliente piloto
// ---------------------------------------------------------------------
export const dadosCliente: AnaliseContabilData = {
  empresa: {
    nome: "Gregorutt Indústria e Comércio Ltda",
    nomeCurto: "Gregorutt",
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
  },

  // =====================================================================
  // BALANÇO PATRIMONIAL — dados do cliente piloto
  // =====================================================================
  balanco: {
    linhasAV: [
      // ATIVO
      { id: "ativo-header", label: "ATIVO", isHeaderSecao: true, valores: [{ ano: "2023", rs: 760051, av: 100.0 }, { ano: "2024", rs: 1033417, av: 100.0 }, { ano: "2025", rs: 1551939, av: 100.0 }] },
      { id: "ativo-circulante", label: "Ativo Circulante", isSubtotal: true, valores: [{ ano: "2023", rs: 737792, av: 97.1 }, { ano: "2024", rs: 998870, av: 96.7 }, { ano: "2025", rs: 1510391, av: 97.3 }] },
      { id: "saldo-banco", label: "Saldo em banco", valores: [{ ano: "2023", rs: 679171, av: 89.4 }, { ano: "2024", rs: 955146, av: 92.4 }, { ano: "2025", rs: 1451458, av: 93.5 }] },
      { id: "estoque-mp", label: "Estoque de matéria-prima", valores: [{ ano: "2023", rs: 58621, av: 7.7 }, { ano: "2024", rs: 43724, av: 4.2 }, { ano: "2025", rs: 58933, av: 3.8 }] },
      { id: "ativo-nao-circulante", label: "Ativo Não-Circulante", isSubtotal: true, valores: [{ ano: "2023", rs: 22260, av: 2.9 }, { ano: "2024", rs: 34548, av: 3.3 }, { ano: "2025", rs: 41548, av: 2.7 }] },
      { id: "moveis-utensilios", label: "Móveis e utensílios", valores: [{ ano: "2023", rs: 3499, av: 0.5 }, { ano: "2024", rs: 3499, av: 0.3 }, { ano: "2025", rs: 3499, av: 0.2 }] },
      { id: "maquinas-equip", label: "Máquinas e equipamentos", valores: [{ ano: "2023", rs: 17762, av: 2.3 }, { ano: "2024", rs: 17762, av: 1.7 }, { ano: "2025", rs: 17762, av: 1.1 }] },
      { id: "computadores-inst", label: "Computadores e instalações", valores: [{ ano: "2023", rs: 1000, av: 0.1 }, { ano: "2024", rs: 13288, av: 1.3 }, { ano: "2025", rs: 20288, av: 1.3 }] },
      // PASSIVO + PL
      { id: "passivo-header", label: "PASSIVO + PL", isHeaderSecao: true, valores: [{ ano: "2023", rs: 760051, av: 100.0 }, { ano: "2024", rs: 1033417, av: 100.0 }, { ano: "2025", rs: 1551939, av: 100.0 }] },
      { id: "passivo-circulante", label: "Passivo Circulante", isSubtotal: true, valores: [{ ano: "2023", rs: 68156, av: 9.0 }, { ano: "2024", rs: 39379, av: 3.8 }, { ano: "2025", rs: 85977, av: 5.5 }] },
      { id: "fornecedores", label: "A pagar para fornecedores", valores: [{ ano: "2023", rs: 40498, av: 5.3 }, { ano: "2024", rs: 6179, av: 0.6 }, { ano: "2025", rs: 38587, av: 2.5 }] },
      { id: "impostos-recolher", label: "Impostos a recolher", valores: [{ ano: "2023", rs: 23328, av: 3.1 }, { ano: "2024", rs: 27892, av: 2.7 }, { ano: "2025", rs: 42076, av: 2.7 }] },
      { id: "folha-pagar", label: "Folha a pagar (INSS, FGTS)", valores: [{ ano: "2023", rs: 4330, av: 0.6 }, { ano: "2024", rs: 5307, av: 0.5 }, { ano: "2025", rs: 5314, av: 0.3 }] },
      { id: "patrimonio-liquido", label: "Patrimônio Líquido", isSubtotal: true, valores: [{ ano: "2023", rs: 691896, av: 91.0 }, { ano: "2024", rs: 994039, av: 96.2 }, { ano: "2025", rs: 1465962, av: 94.5 }] },
      { id: "capital-social", label: "Capital Social", valores: [{ ano: "2023", rs: 5000, av: 0.7 }, { ano: "2024", rs: 5000, av: 0.5 }, { ano: "2025", rs: 5000, av: 0.3 }] },
      { id: "reserva-legal", label: "Reserva Legal", valores: [{ ano: "2023", rs: 7107, av: 0.9 }, { ano: "2024", rs: 7107, av: 0.7 }, { ano: "2025", rs: 7107, av: 0.5 }] },
      { id: "lucros-acumulados", label: "Lucros Acumulados", valores: [{ ano: "2023", rs: 679789, av: 89.4 }, { ano: "2024", rs: 981932, av: 95.0 }, { ano: "2025", rs: 1453855, av: 93.7 }] },
    ],
    linhasAH: [
      { id: "saldo-banco", label: "Saldo em banco", direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 679171 }, { ano: "2024", rs: 955146 }, { ano: "2025", rs: 1451458 }], deltas: [{ intervalo: "24/23", pct: 40.6 }, { intervalo: "25/24", pct: 52.0 }, { intervalo: "25/23", pct: 113.7 }] },
      { id: "estoque", label: "Estoque", direcaoFavoravel: "neutra", valores: [{ ano: "2023", rs: 58621 }, { ano: "2024", rs: 43724 }, { ano: "2025", rs: 58933 }], deltas: [{ intervalo: "24/23", pct: -25.4 }, { intervalo: "25/24", pct: 34.8 }, { intervalo: "25/23", pct: 0.5 }] },
      { id: "maquinas-inst", label: "Máquinas e instalações", direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 22260 }, { ano: "2024", rs: 34548 }, { ano: "2025", rs: 41548 }], deltas: [{ intervalo: "24/23", pct: 55.2 }, { intervalo: "25/24", pct: 20.3 }, { intervalo: "25/23", pct: 86.6 }] },
      { id: "total-ativo", label: "TOTAL DO ATIVO", isSubtotal: true, direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 760051 }, { ano: "2024", rs: 1033417 }, { ano: "2025", rs: 1551939 }], deltas: [{ intervalo: "24/23", pct: 36.0 }, { intervalo: "25/24", pct: 50.2 }, { intervalo: "25/23", pct: 104.2 }] },
      { id: "fornecedores-ah", label: "A pagar a fornecedores", direcaoFavoravel: "cai", valores: [{ ano: "2023", rs: 40498 }, { ano: "2024", rs: 6179 }, { ano: "2025", rs: 38587 }], deltas: [{ intervalo: "24/23", pct: -84.7 }, { intervalo: "25/24", pct: 524.5 }, { intervalo: "25/23", pct: -4.7 }] },
      { id: "impostos-ah", label: "Impostos a recolher", direcaoFavoravel: "cai", valores: [{ ano: "2023", rs: 23328 }, { ano: "2024", rs: 27892 }, { ano: "2025", rs: 42076 }], deltas: [{ intervalo: "24/23", pct: 19.6 }, { intervalo: "25/24", pct: 50.8 }, { intervalo: "25/23", pct: 80.4 }] },
      { id: "folha-ah", label: "Folha a pagar (INSS, FGTS)", direcaoFavoravel: "neutra", valores: [{ ano: "2023", rs: 4330 }, { ano: "2024", rs: 5307 }, { ano: "2025", rs: 5314 }], deltas: [{ intervalo: "24/23", pct: 22.6 }, { intervalo: "25/24", pct: 0.1 }, { intervalo: "25/23", pct: 22.7 }] },
      { id: "passivo-circulante-ah", label: "= Passivo Circulante", isSubtotal: true, direcaoFavoravel: "cai", valores: [{ ano: "2023", rs: 68156 }, { ano: "2024", rs: 39379 }, { ano: "2025", rs: 85977 }], deltas: [{ intervalo: "24/23", pct: -42.2 }, { intervalo: "25/24", pct: 118.3 }, { intervalo: "25/23", pct: 26.1 }] },
      { id: "capital-social-ah", label: "Capital Social", direcaoFavoravel: "neutra", valores: [{ ano: "2023", rs: 5000 }, { ano: "2024", rs: 5000 }, { ano: "2025", rs: 5000 }], deltas: [{ intervalo: "24/23", pct: 0.0 }, { intervalo: "25/24", pct: 0.0 }, { intervalo: "25/23", pct: 0.0 }] },
      { id: "reserva-legal-ah", label: "Reserva Legal", direcaoFavoravel: "neutra", valores: [{ ano: "2023", rs: 7107 }, { ano: "2024", rs: 7107 }, { ano: "2025", rs: 7107 }], deltas: [{ intervalo: "24/23", pct: 0.0 }, { intervalo: "25/24", pct: 0.0 }, { intervalo: "25/23", pct: 0.0 }] },
      { id: "lucros-acumulados-ah", label: "Lucros Acumulados", direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 679789 }, { ano: "2024", rs: 981932 }, { ano: "2025", rs: 1453855 }], deltas: [{ intervalo: "24/23", pct: 44.4 }, { intervalo: "25/24", pct: 48.1 }, { intervalo: "25/23", pct: 113.9 }] },
      { id: "patrimonio-liquido-ah", label: "= Patrimônio Líquido", isSubtotal: true, direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 691896 }, { ano: "2024", rs: 994039 }, { ano: "2025", rs: 1465962 }], deltas: [{ intervalo: "24/23", pct: 43.7 }, { intervalo: "25/24", pct: 47.5 }, { intervalo: "25/23", pct: 111.9 }] },
      { id: "total-passivo-pl-ah", label: "TOTAL DO PASSIVO + PL", isSubtotal: true, direcaoFavoravel: "cresce", valores: [{ ano: "2023", rs: 760051 }, { ano: "2024", rs: 1033417 }, { ano: "2025", rs: 1551939 }], deltas: [{ intervalo: "24/23", pct: 36.0 }, { intervalo: "25/24", pct: 50.2 }, { intervalo: "25/23", pct: 104.2 }] },
    ],
    comentarios: [
      { id: "bp-1", titulo: "Saldo em banco · 93,5% do patrimônio", corpo: "De cada R$ 100 do patrimônio da empresa, R$ 93,50 estão no banco. No total, R$ 1,45 milhão. Isso paga 2 anos de despesa sem vender nada. Não se sabe pelo balanço se esse dinheiro está rendendo em alguma aplicação, se está guardado para comprar algo grande, ou se está mesmo parado na conta corrente.", status: "atencao" },
      { id: "bp-2", titulo: "Estoque", corpo: "Entre R$ 44 mil e R$ 59 mil nos três anos — pouco, para uma indústria que vende R$ 2,5 milhões por ano. Quer dizer que a empresa **produz sob pedido**: compra matéria-prima, fabrica e entrega rápido. Não fica com produto parado.", status: "info" },
      { id: "bp-3", titulo: "Máquinas e equipamentos", corpo: "R$ 41,5 mil em 2025. Pouco, para uma indústria desse tamanho. Duas possibilidades: (1) a empresa usa galpão e máquinas que não são dela (alugado, ou dos sócios em nome pessoal), ou (2) as máquinas estão registradas pelo valor original, sem atualização. Também não aparece depreciação no balanço.", status: "atencao" },
      { id: "bp-4", titulo: "A pagar para fornecedores", corpo: "Oscilou entre os anos: R$ 40 mil, R$ 6 mil, R$ 39 mil. Isso é normal — depende de uma fatura grande ter sido paga em 30/12 ou em 02/01. Nada relevante.", status: "info" },
      { id: "bp-5", titulo: "Impostos a recolher", corpo: "Subiu 80% em três anos, no mesmo ritmo das vendas. Em 2025, metade é Simples Nacional e metade é ICMS-ST (imposto que a Gregorutt paga antecipado no lugar do cliente dela).", status: "info" },
      { id: "bp-6", titulo: "R$ 5 mil de capital, R$ 1,45 milhão de lucro guardado", corpo: "Quando os sócios abriram a empresa, colocaram **R$ 5 mil**. Hoje o lucro acumulado é **R$ 1,45 milhão**. Só nos últimos três anos, a empresa deu R$ 1,98 milhão de lucro — e não tem registro de distribuição formal aos sócios. Ou os sócios retiraram via pró-labore (que está dentro da folha), ou deixaram tudo dentro da empresa.", status: "atencao" },
      { id: "bp-7", titulo: "Sem dívida nenhuma", corpo: "A empresa não tem empréstimo, não tem financiamento, não tem leasing. Todo o crescimento foi feito com dinheiro próprio. Sem risco financeiro, mas também sem uso de banco para crescer mais rápido.", status: "positivo" },
      { id: "bp-8", titulo: "Saldo do banco e patrimônio crescem juntos", corpo: "Em três anos, o saldo em banco cresceu 113,7%. O patrimônio dos sócios cresceu 111,9%. A diferença é quase zero. Na prática: **todo lucro que a empresa dá vai para o banco**. Não vira máquina nova, não vira distribuição para os sócios, não vira estoque.", status: "info" },
    ],
  },

  // =====================================================================
  // INDICADORES — dados do cliente piloto
  // =====================================================================
  indicadores: {
    linhas: [
      { id: "margem-bruta", label: "Margem Bruta", valoresPorAno: [{ ano: "2023", valor: "61,1%" }, { ano: "2024", valor: "68,2%" }, { ano: "2025", valor: "75,6%" }], explicacao: "De cada R$ 100 vendidos, R$ 76 sobram depois de pagar o custo de produção." },
      { id: "margem-liquida", label: "Margem Líquida", valoresPorAno: [{ ano: "2023", valor: "28,4%" }, { ano: "2024", valor: "31,3%" }, { ano: "2025", valor: "44,4%" }], explicacao: "De cada R$ 100 vendidos, R$ 44 viram lucro no final." },
      { id: "roe", label: "Retorno sobre Patrimônio (ROE)", valoresPorAno: [{ ano: "2023", valor: "68,6%" }, { ano: "2024", valor: "53,5%" }, { ano: "2025", valor: "66,3%" }], explicacao: "Para cada R$ 100 de patrimônio dos sócios, a empresa gerou R$ 66 de lucro no ano." },
      { id: "roa", label: "Retorno sobre Ativo (ROA)", valoresPorAno: [{ ano: "2023", valor: "62,5%" }, { ano: "2024", valor: "51,5%" }, { ano: "2025", valor: "62,6%" }], explicacao: "Para cada R$ 100 que a empresa tem, gerou R$ 63 de lucro. Igual ao ROE porque não tem dívida." },
      { id: "faturamento-banco", label: "Quanto do faturamento fica em banco", valoresPorAno: [{ ano: "2023", valor: "40,6%" }, { ano: "2024", valor: "56,2%" }, { ano: "2025", valor: "66,3%" }], explicacao: "Em 2025, o banco equivale a 8 meses de faturamento." },
      { id: "anos-despesa-caixa", label: "Quantos anos de despesa cabem no caixa", valoresPorAno: [{ ano: "2023", valor: "1,24 ano" }, { ano: "2024", valor: "1,52 ano" }, { ano: "2025", valor: "2,12 anos" }], explicacao: "O que tem em caixa paga 2 anos de despesa sem vender nada." },
      { id: "folha-faturamento", label: "Folha / Faturamento Líquido", valoresPorAno: [{ ano: "2023", valor: "20,7%" }, { ano: "2024", valor: "23,5%" }, { ano: "2025", valor: "17,3%" }], explicacao: "Queda em 2025 apesar da receita crescer 30%." },
      { id: "endividamento", label: "Nível de endividamento", valoresPorAno: [{ ano: "2023", valor: "9,0%" }, { ano: "2024", valor: "3,8%" }, { ano: "2025", valor: "5,5%" }], explicacao: "Só contas do dia-a-dia (fornecedor, imposto). Zero dívida com banco." },
      { id: "capital-giro", label: "Capital de Giro Líquido", valoresPorAno: [{ ano: "2023", valor: "R$ 669 mil" }, { ano: "2024", valor: "R$ 959 mil" }, { ano: "2025", valor: "R$ 1,42 mi" }], explicacao: "Igual ao caixa. A operação não precisa de dinheiro girando." },
    ],
    comentarios: [
      { id: "ind-1", titulo: "Empresa ganha muito em cada venda", corpo: "R$ 44 de lucro em cada R$ 100 vendidos é muito para uma indústria pequena. No ritmo atual, a empresa devolve 100% do investimento dos sócios a cada 18 meses.", status: "positivo" },
      { id: "ind-2", titulo: "Mas o dinheiro não trabalha", corpo: "O retorno sobre o patrimônio e sobre o ativo são quase iguais. Isso acontece porque **a empresa não usa dinheiro de banco para crescer**. Além disso, quase todo o patrimônio está parado em banco. O lucro é grande porque a margem é grande, não porque o patrimônio está trabalhando.", status: "atencao" },
      { id: "ind-3", titulo: "Muito caixa, zero dívida", corpo: "Com 2 anos de despesa pagos no caixa e sem dívida, não há risco financeiro. O oposto do que acontece na maioria das PMEs — aqui o desafio é o que fazer com o excesso.", status: "positivo" },
    ],
  },

  // =====================================================================
  // AO CONTADOR — dados do cliente piloto
  // =====================================================================
  aoContador: {
    grupos: [
      {
        id: "ac-1",
        numero: 1,
        titulo: "Sobre o custo de produção que caiu",
        contexto: "O CPV caiu 17% em 2024 e ficou quase igual em 2025, mesmo com faturamento 30% maior.",
        perguntas: [
          "Mudou alguma coisa na forma de registrar o custo de produção entre 2023 e 2025? Por exemplo, energia da fábrica, aluguel do galpão ou depreciação que antes entravam no custo passaram para outra linha?",
          "Como o estoque é avaliado — PEPS, custo médio, outro método? Mudou o método em algum ano?",
          "O CPV inclui só matéria-prima, ou também mão-de-obra da produção e outros custos da fábrica?",
          "Em 2024 ou 2025 foi feita alguma reclassificação que mexeu nas contas do CPV?",
        ],
      },
      {
        id: "ac-2",
        numero: 2,
        titulo: "Sobre a ausência de depreciação",
        contexto: "As máquinas e equipamentos aparecem sempre pelo valor original, sem depreciação registrada nos três anos.",
        perguntas: [
          "Por que não aparece conta de Depreciação Acumulada no balanço?",
          "As máquinas já estão todas depreciadas por completo, ou a contabilidade optou por não registrar depreciação?",
          "Para empresa do Simples Nacional, qual é a orientação adotada sobre depreciação — não registra, registra só no DRE, ou registra também no balanço?",
          "As Instalações que foram adicionadas em 2024 (R$ 12,3 mil) e 2025 (R$ 19,3 mil) estão sendo depreciadas?",
        ],
      },
      {
        id: "ac-3",
        numero: 3,
        titulo: "Sobre a Reserva Legal parada",
        contexto: "A Reserva Legal manteve exatamente R$ 7.106,60 nos três anos, mesmo com lucro grande.",
        perguntas: [
          "A Reserva Legal já atingiu o teto de 20% do capital social e por isso não é mais alimentada?",
          "Se sim, por que o capital social nunca foi aumentado com incorporação de lucros nesses três anos?",
          "Existe alguma regra específica no contrato social sobre o destino do lucro?",
        ],
      },
      {
        id: "ac-4",
        numero: 4,
        titulo: "Sobre a distribuição de lucros",
        contexto: "O lucro guardado subiu de R$ 680 mil para R$ 1,45 milhão sem registro de distribuição formal.",
        perguntas: [
          "Nos três anos houve distribuição de lucros aos sócios? Se sim, em qual conta foi registrada?",
          "Se não teve distribuição formal, existe alguma ata assinada pelos sócios sobre manter o lucro na empresa?",
          "Tem alguma conta de 'Dividendos a Pagar' ou 'Lucros a Distribuir' no Passivo que não apareceu no balanço resumido?",
        ],
      },
      {
        id: "ac-5",
        numero: 5,
        titulo: "Sobre o Simples Nacional e o ICMS-ST",
        contexto: "A alíquota sobre vendas subiu de 13,9% para 15,4% em três anos. Em 2025, a Substituição Tributária a recolher é quase igual ao Simples Nacional a recolher.",
        perguntas: [
          "Em qual anexo do Simples a empresa está — Anexo II (indústria) ou Anexo III (serviços)?",
          "Qual a faixa atual de faturamento anual e qual alíquota efetiva está sendo aplicada?",
          "Qual foi o valor anual de ICMS-ST pago em 2025? Esse valor está no custo de produção ou em outra linha?",
          "Já foi feita simulação entre Simples Nacional e Lucro Presumido para o faturamento atual?",
        ],
      },
      {
        id: "ac-6",
        numero: 6,
        titulo: "Sobre como as despesas são classificadas",
        contexto: "'Despesas Gerais' cresceu 64% em três anos. A folha caiu 5,6% em 2025 num ano de vendas +30%.",
        perguntas: [
          "Qual o critério usado para separar uma despesa entre 'Despesas Gerais', 'Despesas com Pessoal', 'Despesas com Entrega' ou 'Impostos e Taxas'?",
          "Pode mandar o detalhamento da conta 'Despesas Gerais' por sub-conta, nos três anos?",
          "Alguma despesa mudou de linha entre os anos, e isso explica a queda da folha e o crescimento das Despesas Gerais em 2025?",
          "O pró-labore dos sócios está dentro de 'Despesas com Pessoal' ou em outra conta?",
        ],
      },
      {
        id: "ac-7",
        numero: 7,
        titulo: "Sobre o saldo em banco",
        contexto: "O balanço de 2025 mostra R$ 1.451.458 em 'Bancos Conta Movimento'.",
        perguntas: [
          "Esse saldo corresponde à soma de quais contas bancárias (banco e número)?",
          "Com que frequência é feita a conciliação bancária — todo mês, todo trimestre, só no fim do ano? Em 31/12/2025 o saldo contábil bateu com o extrato real?",
          "Tem aplicação financeira (CDB, fundo, tesouro) que não está dentro de 'Bancos Conta Movimento'? Onde aparece no balanço?",
          "A contabilidade recebe os extratos direto do banco ou a empresa envia os lançamentos já consolidados?",
        ],
      },
      {
        id: "ac-8",
        numero: 8,
        titulo: "Sobre o que a contabilidade vê",
        contexto: "A contabilidade costuma registrar o que tem nota fiscal. Em PMEs, é comum ter movimentação que fica de fora.",
        perguntas: [
          "A contabilidade lança só o que tem nota fiscal, ou também trabalha com recibo e extrato?",
          "Tem outras empresas do mesmo grupo societário (mesmos sócios) cuja contabilidade também é feita aí no escritório? Quais?",
          "Tem alguma operação conhecida entre a empresa e outra empresa dos mesmos sócios?",
          "O escritório tem conhecimento de bens operacionais (veículo, máquina, marca) que estão no nome pessoal dos sócios ou em outra empresa do grupo?",
        ],
      },
      {
        id: "ac-9",
        numero: 9,
        titulo: "Sobre cancelamentos, devoluções e estoque",
        contexto: "Os cancelamentos saltaram de R$ 47 em 2023 para R$ 6,2 mil em 2025. O estoque oscilou cerca de 25% entre os anos.",
        perguntas: [
          "O que explica o salto de cancelamentos e devoluções a partir de 2024? Mudou a forma de registrar, ou mudou a operação?",
          "A variação de estoque entre os anos (R$ 59 mil → R$ 44 mil → R$ 59 mil) corresponde a contagem física real em 31/12, ou é ajuste contábil de fechamento?",
          "O estoque registrado inclui só matéria-prima, ou também produto em produção e produto acabado?",
        ],
      },
      {
        id: "ac-10",
        numero: 10,
        titulo: "Sobre documentos e formalidades",
        contexto: "Três anos de resultados relevantes sem movimentação societária formal aparente.",
        perguntas: [
          "Existem Notas Explicativas do balanço que não foram enviadas no material?",
          "O Livro Razão e o Livro Diário da empresa estão em dia? Pode disponibilizar?",
          "Houve alteração contratual nos últimos três anos — entrada ou saída de sócio, mudança de capital, mudança de objeto social?",
        ],
      },
    ],
  },

  // =====================================================================
  // CONCLUSÃO — dados do cliente piloto
  // =====================================================================
  conclusao: {
    cards: [
      {
        id: "vai-bem",
        titulo: "A empresa vai bem",
        paragrafo: "A empresa está melhor que a média das pequenas indústrias do Brasil. Não tem dívida, tem muito caixa, o lucro vem crescendo, e a margem está em 44%. Olhando só os números contábeis, não há nenhum sinal de problema financeiro.",
      },
      {
        id: "dinheiro-parado",
        titulo: "Mas tem dinheiro demais parado",
        paragrafo: "Tanta saúde esconde um outro tema: R$ 1,45 milhão estão em banco, equivalente a 2 anos de despesa. Esse dinheiro não está virando máquina nova, não está sendo distribuído aos sócios, não está sendo usado em aquisição. O balanço registra como 'Bancos conta movimento', mas o contador e o dono precisam confirmar se está mesmo em conta corrente ou se parte está aplicado em algum lugar.",
      },
      {
        id: "tres-duvidas",
        titulo: "Três coisas que os números não respondem",
        paragrafo: "Três dúvidas não podem ser resolvidas só olhando DRE e balanço: (1) por que o custo de produção caiu tanto em 2024 e ficou parado em 2025 — se foi mudança real ou reclassificação; (2) o que está dentro de 'Despesas Gerais', linha que cresceu 64% em três anos; (3) o que os sócios pretendem fazer com o R$ 1,45 milhão guardado. Enquanto essas três perguntas não forem respondidas, qualquer recomendação é só chute.",
      },
      {
        id: "proximo-passo",
        titulo: "Próximo passo",
        paragrafo: "Obter as respostas do dono (sobre vendas, clientes, intenção com o caixa) e do contador (sobre como as contas foram lançadas, depreciação, apuração do Simples). Depois, cruzar com o fluxo de caixa real da empresa — contas a pagar, contas a receber, movimentação bancária — e com a operação que passa por outras empresas do grupo. Só depois disso é possível fazer uma recomendação financeira com base real.",
      },
      {
        id: "resumo",
        titulo: "Resumo em uma frase",
        paragrafo: "A empresa é um caso raro: R$ 44 de lucro em cada R$ 100 vendidos, zero dívida, R$ 1,45 milhão em banco. O desafio não é ganhar dinheiro — é decidir o que fazer com ele.",
      },
    ],
  },

  // =====================================================================
  // DADOS FINANCEIROS — Análise Financeira
  // =====================================================================
  dadosFinanceiros: {
    hero: {
      subTitulo: "Operação · Vendas · Recebíveis · Caixa · Ciclo",
      descricao: "Análise operacional do negócio em 2023, 2024 e 2025 cruzando vendas (NFs), contas a pagar, contas a receber e caixa bancário — com leitura, fatos e ações priorizadas.",
      exercicios: "2023 · 2024 · 2025 · Q1-2026",
      cobertura: "9.903 NFs · 6.880 títulos · 6.364 lançamentos",
      fonte: "SIFWIN/FKN + extratos bancários",
      dataBase: "20/04/2026",
    },
    sintese: {
      tese: "Você cresceu, mas ficou mais dependente — e ainda não transformou esse crescimento em caixa e previsibilidade.",
      decisoes: [
        {
          titulo: "SUPRICORP",
          descricao: "reduzir dependência e melhorar prazo de recebimento.",
          meta: "9,6% da receita · paga em 69 dias · puxou 56% do crescimento de Q1-2026",
        },
        {
          titulo: "Base ativa",
          descricao: "atacar os 70 clientes em queda e os 58 já perdidos antes de buscar mais volume. Reter quem já é seu custa menos que conquistar novo.",
          meta: "Lista completa no Bloco B",
        },
        {
          titulo: "Caixa completo",
          descricao: "consolidar todos os bancos e separar o que é operação do que é movimento pessoal dos sócios.",
          meta: "R$ 73 mil/mês circulam fora do banco analisado",
        },
      ],
      callout: "Crescer, a Gregorutt já sabe. O próximo passo é ganhar controle sobre cliente, caixa e previsibilidade.",
    },

    // -----------------------------------------------------------------
    // BLOCO A — FATURAMENTO
    // -----------------------------------------------------------------
    faturamento: {
      veredito: "Você cresceu, mas não ficou mais saudável — crescimento concentrado em poucos clientes.",
      leitura: "A Gregorutt cresceu forte em 2025, mas o crescimento <strong>mudou de natureza</strong>: veio com menos clientes, menos notas e maior concentração em poucos motores, especialmente a <strong>SUPRICORP</strong>. Isso sugere que a empresa não expandiu a base — <strong>ela passou a faturar mais em cima de menos relações comerciais</strong>. Sem a contribuição extraordinária da SUPRICORP, o crescimento do ano teria ficado perto de <strong>13%, não 21%</strong>.",
      kpis: [
        { label: "Q1-2026 (mais recente)", valor: "R$ 0,94<span class='unit'>M</span>", delta: "↑ +11,7% vs Q1-2025 · ritmo abaixo de 2025", deltaType: "warn", highlight: true },
        { label: "Faturamento 2025", valor: "R$ 3,70<span class='unit'>M</span>", delta: "↑ +21,0% contra 2024", deltaType: "up" },
        { label: "Margem Bruta declarada", valor: "51,9<span class='unit'>%</span>", delta: "→ −0,8 p.p. · margem real ~48%", deltaType: "flat" },
        { label: "Receita média por cliente", valor: "R$ 9.838", delta: "↑ +25,8% — atenção: base menor", deltaType: "warn" },
        { label: "Clientes ativos no ano", valor: "376", delta: "↓ −15 contra 2024 · base encolhendo", deltaType: "down" },
      ],
      alertas: [
        { nivel: "critico", titulo: "SUPRICORP virou cliente crítico", texto: "Saiu de R$ 16k em 2023 para <b>R$ 354k em 2025</b> (9,6% da sua receita). Sozinha puxou 37% do seu crescimento e <b>paga em 69 dias</b>. Sem segundo lugar próximo." },
        { nivel: "atencao", titulo: "Margem não acompanhou crescimento", texto: "Receita +21%, margem bruta declarada caiu 0,8 p.p. <b>Margem real de caixa ~48%</b> (cadastro de custo do produto está defasado em ~10%)." },
      ],
      acoes: [
        { texto: "<b>Reunião com SUPRICORP em 2 semanas</b> — entender pipeline 2026 e renegociar prazo de pagamento (hoje 69 dias).", meta: "Risco: 9,6% da receita" },
        { texto: "<b>Reconciliar custo dos top 10 SKUs</b> com o preço real pago aos fornecedores (ACF, NOVAPLASTICS, AVANZI).", meta: "Gap ~10% entre NF e caixa" },
        { texto: "<b>Plano comercial Q2: meta de 20 clientes novos</b> para compensar os 15 que sumiram.", meta: "Receita esperada: R$ 16-30k/mês" },
        { texto: "<b>Cross-sell nos 145 estáveis de cauda longa</b> — se metade dobrar para R$ 5k, são <b>+R$ 180k/ano</b>.", meta: "Mais barato que aquisição" },
      ],
      glossario: [
        { termo: "NF", definicao: "= Nota Fiscal." },
        { termo: "Q1, Q2, Q3, Q4", definicao: "= trimestres do ano (Q1 = Jan+Fev+Mar; Q4 = Out+Nov+Dez)." },
        { termo: "YoY (ano contra ano)", definicao: "= compara o mesmo período de anos diferentes (ex: Q1-2026 vs Q1-2025)." },
        { termo: "SKU", definicao: "= cada produto no seu cadastro. Cada item tem seu código único." },
        { termo: "Margem Bruta declarada", definicao: "= margem calculada pelo custo que está cadastrado na nota fiscal. Pode estar desatualizada vs realidade." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO B — CLIENTES
    // -----------------------------------------------------------------
    clientes: {
      veredito: "Você está perdendo mais clientes do que ganhando — e concentrando receita em menos motores.",
      leitura: "A base tem <strong>593 clientes únicos em 3 anos</strong>, mas só <strong>223 são estáveis</strong> (compraram nos 3 anos). Os <strong>70 em queda</strong> e <strong>58 perdidos</strong> superam os <strong>43 em alta</strong>. Enquanto a receita total subiu, o saldo líquido de clientes é <strong>negativo</strong>: você está concentrando mais, não expandindo.",
      kpis: [
        { label: "Universo de 3 anos", valor: "593", delta: "clientes únicos 2023-2025", deltaType: "flat" },
        { label: "Estáveis (3 anos)", valor: "223", delta: "37,6% da base · o coração", deltaType: "flat" },
        { label: "Em alta contínua", valor: "43", delta: "+R$ 540k de ganho em 2025", deltaType: "up" },
        { label: "Em queda contínua", valor: "70", delta: "−R$ 285k em risco", deltaType: "down" },
        { label: "Perdidos em 2025", valor: "58", delta: "−R$ 233k de receita 2024", deltaType: "down" },
      ],
      alertas: [
        { nivel: "critico", titulo: "Saldo líquido negativo", texto: "Crescendo (43) menos caindo (70) = <b>−27 clientes em deterioração</b>. Esse é o dado mais importante da aba." },
        { nivel: "atencao", titulo: "Top 1 = 9,6% da receita", texto: "SUPRICORP sozinha vale quase 10% do faturamento. Se sair, abre um buraco de <b>R$ 354k/ano</b>." },
        { nivel: "controle", titulo: "Aquisição funcionando", texto: "79 clientes novos em 2025. O canal de aquisição está saudável — o problema é a retenção." },
      ],
      acoes: [
        { texto: "<b>Listar os 70 clientes em queda</b> e atribuir a vendedor para diagnóstico em 30 dias.", meta: "~R$ 400k/ano em risco" },
        { texto: "<b>Programa \"Save\"</b>: ligar nos 58 que sumiram em 2025.", meta: "Receita 2024: R$ 233k" },
        { texto: "<b>Plano de proteção SUPRICORP</b>: contrato de fornecimento com prazo definido.", meta: "Risco: R$ 354k/ano" },
        { texto: "<b>Análise dos 79 novos de 2025</b>: como entraram? Replicar canal.", meta: "Aquisição funciona" },
      ],
      glossario: [
        { termo: "Universo de 3 anos", definicao: "= total de clientes diferentes que compraram em 2023, 2024 ou 2025 (sem contar duplicados)." },
        { termo: "Cliente estável", definicao: "= cliente que comprou em todos os 3 anos (2023, 2024 e 2025). É o coração da sua base." },
        { termo: "Cliente em queda contínua", definicao: "= cliente que compra nos 3 anos, mas a receita anual está caindo ano a ano." },
        { termo: "Cliente perdido em 2025", definicao: "= cliente que comprou em 2023 e 2024 mas não comprou nada em 2025." },
        { termo: "Cauda longa", definicao: "= parte grande da base de clientes que, individualmente, compra pouco." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO C — AUDITORIA
    // -----------------------------------------------------------------
    auditoria: {
      veredito: "Sua posição está organizada — não aparece nenhum problema grave aqui.",
      leitura: "Você tem <strong>R$ 533 mil a receber</strong> e <strong>R$ 258 mil a pagar</strong>, então o saldo está a seu favor. A maior parte ainda está no prazo, o que mostra controle. O único ponto para limpar são <strong>R$ 53 mil com mais de 120 dias</strong>, que parecem mais pendência do ERP do que dinheiro realmente perdido.",
      kpis: [
        { label: "A receber em aberto", valor: "R$ 533<span class='unit'>k</span>", delta: "49% ainda no prazo", deltaType: "flat" },
        { label: "A pagar em aberto", valor: "R$ 258<span class='unit'>k</span>", delta: "80% ainda no prazo", deltaType: "flat" },
        { label: "Saldo (Receber − Pagar)", valor: "+R$ 276<span class='unit'>k</span>", delta: "Posição positiva", deltaType: "up" },
        { label: "Sujeira contábil (>120 dias)", valor: "R$ 53<span class='unit'>k</span>", delta: "Limpar com contador · não é dívida real", deltaType: "warn" },
      ],
      alertas: [
        { nivel: "controle", titulo: "Carteira organizada", texto: "A maior parte dos títulos ainda está no prazo. Dos que atrasaram, só <b>6-7%</b> estão em atraso longo (mais de 120 dias)." },
        { nivel: "controle", titulo: "Saldo a seu favor", texto: "Você tem <b>R$ 276k a mais para receber do que para pagar</b>. Não está devendo fornecedor." },
        { nivel: "atencao", titulo: "SILAVA Lavanderia · cliente crônico", texto: "R$ 17k em atraso em <b>13 títulos</b>, alguns com mais de 8 meses. <b>Decidir se vale continuar atendendo.</b>" },
      ],
      acoes: [
        { texto: "<b>Baixar títulos >120 dias</b> com o contador — a maioria é sujeira, não dívida real.", meta: "R$ 53k para limpar" },
        { texto: "<b>Decisão sobre SILAVA</b>: cobrar, renegociar ou cortar.", meta: "R$ 17k em 13 títulos" },
        { texto: "<b>Cobrança ativa nos R$ 117k</b> em atraso >30 dias (19 clientes).", meta: "Lista pronta para ação" },
      ],
      glossario: [
        { termo: "Contas a Receber (CR)", definicao: "= dinheiro que os clientes ainda vão te pagar por vendas já feitas." },
        { termo: "Contas a Pagar (CP)", definicao: "= dinheiro que você ainda vai pagar a fornecedores por compras já feitas." },
        { termo: "Sujeira contábil", definicao: "= títulos que aparecem no sistema mas já foram pagos/recebidos, ou que são tão antigos que não serão cobrados." },
        { termo: "Atraso >120 dias", definicao: "= título vencido há mais de 4 meses. Geralmente indica problema real ou erro de registro." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO D — FORNECEDORES
    // -----------------------------------------------------------------
    fornecedores: {
      veredito: "Operação mais enxuta, mas embalagens e diárias cresceram acima do esperado.",
      leitura: "No geral, a operação ficou mais enxuta e sem dependência perigosa de um fornecedor só. O problema é que <strong>embalagens cresceram bem acima da receita</strong> e <strong>diárias dispararam enquanto a folha caiu</strong>, o que sugere troca de estrutura fixa por terceirização. Isso pode ser ganho de flexibilidade ou começo de problema.",
      kpis: [
        { label: "Total pago a fornecedores 2025", valor: "R$ 3,21<span class='unit'>M</span>", delta: "contra faturamento R$ 3,70M", deltaType: "flat" },
        { label: "Custo da mercadoria (caixa)", valor: "R$ 1,66<span class='unit'>M</span>", delta: "Insumos + Embalagens = 52%", deltaType: "flat" },
        { label: "Pago / Faturamento", valor: "86,9<span class='unit'>%</span>", delta: "vs ~95% em 2023 — melhorou 8 p.p.", deltaType: "up" },
        { label: "Top fornecedor", valor: "ACF", delta: "R$ 322k · 10% do total", deltaType: "flat" },
      ],
      alertas: [
        { nivel: "atencao", titulo: "Diárias subiram 45% em 2025", texto: "R$ 143k → R$ 221k. Folha caiu 4%. <b>Está trocando CLT por terceirizado.</b> Pode estar criando passivo trabalhista." },
        { nivel: "atencao", titulo: "Embalagens +40% (vs receita +21%)", texto: "Custo de embalagem cresceu 2× a receita. Confirmar se foi <b>estoque antecipado</b> (saudável) ou <b>consumo real maior</b> (problema)." },
        { nivel: "controle", titulo: "Eficiência operacional melhorou", texto: "Custo total / faturamento caiu de 95% (2023) para 87% (2025). <b>8 p.p. de melhora em 2 anos.</b>" },
      ],
      acoes: [
        { texto: "<b>Negociar volume com ACF + NOVAPLASTICS</b> (juntas 17% do que você paga).", meta: "Embalagens +40%" },
        { texto: "<b>Investigar a explosão de Diárias</b> (+R$ 78k): mapear quem, quando, por que.", meta: "Risco trabalhista" },
        { texto: "<b>Atualizar custo real dos top 10 produtos no ERP</b> — gap de ~10%.", meta: "Margem real menor" },
        { texto: "<b>Controle mensal Insumos por NF de venda</b>: detectar perdas.", meta: "Insumos +6% vs receita +21%" },
      ],
      glossario: [
        { termo: "CMV (Custo da Mercadoria Vendida)", definicao: "= quanto você gasta com matéria-prima, insumos e embalagem pra produzir o que vende." },
        { termo: "CMV de caixa", definicao: "= CMV calculado pelo que realmente saiu do banco (diferente do CMV da nota fiscal)." },
        { termo: "Passivo trabalhista", definicao: "= risco de ter que pagar direitos de trabalhador depois, mesmo sem CLT, se a justiça reconhecer vínculo." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO E — CAIXA
    // -----------------------------------------------------------------
    caixa: {
      veredito: "A conta bancária analisada não está acumulando reserva — e a leitura final ainda depende de consolidar os demais bancos.",
      leitura: "Mesmo com muito movimento, esta conta quase não acumulou saldo ao longo de <strong>13 meses</strong>. Isso mostra que ela funciona mais como <strong>passagem</strong> do que como <strong>formação de reserva</strong>. Para entender se isso vem da operação ou de saídas fora dela, ainda falta consolidar os demais bancos.",
      kpis: [
        { label: "Saldo inicial (05/03/2025)", valor: "R$ 20<span class='unit'>k</span>", delta: "validado por extrato físico", deltaType: "flat" },
        { label: "Saldo atual (~31/03/2026)", valor: "R$ 34<span class='unit'>k</span>", delta: "+R$ 14k em 13 meses", deltaType: "flat" },
        { label: "Meses positivos / negativos", valor: "6 / 7", delta: "Mais meses queimando que gerando", deltaType: "warn" },
        { label: "Pior mês", valor: "−R$ 32<span class='unit'>k</span>", delta: "Novembro/2025", deltaType: "down" },
      ],
      alertas: [
        { nivel: "critico", titulo: "R$ 734k circulando fora do banco", texto: "O banco captou menos do que o sistema registra. <b>R$ 73k/mês</b> de fluxo invisível. <b>Confirmar com contador qual outra conta está ativa.</b>" },
        { nivel: "atencao", titulo: "Sem reserva de caixa", texto: "+R$ 14k em 13 meses = <b>operação no empate</b>. Caixa atual cobre só 4 dias de saída." },
        { nivel: "atencao", titulo: "Mais meses negativos que positivos", texto: "7 meses negativos contra 6 positivos. <b>Pior mês foi Nov/25 (R$ −32k)</b> — evento específico daquele mês." },
      ],
      acoes: [
        { texto: "<b>Identificar a outra conta bancária</b> com o contador — verificar se é outra PJ ou conta pessoal.", meta: "R$ 73k/mês fora" },
        { texto: "<b>Consolidar visão de caixa de TODAS as contas</b>.", meta: "Sem isso, projeção incompleta" },
        { texto: "<b>Implementar fluxo de caixa de 13 semanas</b>, atualizado toda sexta.", meta: "Modelo existe" },
        { texto: "<b>Definir caixa mínimo operacional</b>: 1 mês de saída = R$ 254k.", meta: "Hoje R$ 34k = ~4 dias" },
      ],
      glossario: [
        { termo: "Fluxo de caixa", definicao: "= entrada e saída de dinheiro do banco ao longo do tempo." },
        { termo: "Reserva de caixa", definicao: "= dinheiro guardado na conta pra cobrir imprevistos ou meses mais fracos." },
        { termo: "Runway", definicao: "= quanto tempo seu caixa aguenta se a receita zerar hoje." },
        { termo: "Caixa mínimo operacional", definicao: "= valor de segurança que a conta não deveria ficar abaixo (recomendação: 1 mês de saída)." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO F — CICLO
    // -----------------------------------------------------------------
    ciclo: {
      veredito: "Ciclo bom, porém frágil — a folga é curta e pode sumir rápido.",
      leitura: "Hoje você <strong>recebe antes de pagar</strong>, e isso ajuda o caixa. Em média, o cliente paga em <strong>24 dias</strong> e você paga o fornecedor em <strong>31 dias</strong> — ou seja, o fornecedor financia <strong>7 dias</strong> da sua operação. O problema é que <strong>essa folga é curta e pode sumir rápido</strong>.",
      kpis: [
        { label: "Prazo médio de recebimento", valor: "24,1<span class='unit'>d</span>", delta: "estável mês a mês — cobrança funciona", deltaType: "flat" },
        { label: "Prazo médio de pagamento", valor: "31,4<span class='unit'>d</span>", delta: "volátil (21 a 49 dias) — varia muito", deltaType: "warn" },
        { label: "Folga (receber vs pagar)", valor: "7<span class='unit'> dias</span>", delta: "Fornecedor financia 7 dias da operação", deltaType: "up" },
      ],
      alertas: [
        { nivel: "controle", titulo: "Recebimento estável em 24 dias", texto: "O prazo médio de recebimento não se deteriorou ao longo do ano. <b>A cobrança está funcionando.</b>" },
        { nivel: "atencao", titulo: "Folga de 7 dias é curta e volátil", texto: "O prazo de pagamento variou entre <b>21 e 49 dias</b>. Se cair pra 21 dias, a folga some e vira <b>déficit de 3 dias</b>." },
      ],
      acoes: [
        { texto: "<b>Política de prazo padrão por cliente</b>: 30 dias como regra. Acima de 45 dias só com aprovação.", meta: "Trava crescimento fora de controle" },
        { texto: "<b>Proteger o prazo de pagamento</b>: negociar cláusula mínima de 30 dias nos principais fornecedores.", meta: "ACF, NOVAPLASTICS, AVANZI" },
        { texto: "<b>Monitorar PMR e PMP mensalmente</b>: criar alerta se folga cair abaixo de 5 dias.", meta: "Antecipar pressão" },
      ],
      glossario: [
        { termo: "PMR (Prazo Médio de Recebimento)", definicao: "= quantos dias, em média, o cliente demora pra pagar depois que você emite a nota." },
        { termo: "PMP (Prazo Médio de Pagamento)", definicao: "= quantos dias, em média, você demora pra pagar o fornecedor depois que ele emite a nota." },
        { termo: "Ciclo de caixa", definicao: "= diferença entre PMR e PMP. Se positivo, você paga antes de receber (ruim). Se negativo, recebe antes de pagar (bom)." },
        { termo: "Fornecedor financia", definicao: "= quando o prazo de pagamento é maior que o de recebimento, o fornecedor está 'emprestando' dinheiro pra você operar." },
      ],
    },
  },
}
