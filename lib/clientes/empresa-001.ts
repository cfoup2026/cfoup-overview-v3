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

export type FontesImportadas = {
  dre: boolean
  balanco: boolean
  razao: boolean
  balancete: boolean
  diarioGeral: boolean
}

export type AnaliseContabilData = {
  empresa: { nome: string; nomeCurto: string; cnpj: string; regime: string }
  periodos: string[]
  emitidoEm: string
  fontesRecebidas: string
  statusAnalise: "Completa" | "Parcial" | "Aguardando arquivos"
  fontesImportadas: FontesImportadas
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
}

// ---------------------------------------------------------------------
// Dados do cliente piloto
// ---------------------------------------------------------------------
export const dadosCliente: AnaliseContabilData = {
  empresa: {
    nome: "Empresa Demonstração Ltda",
    nomeCurto: "Empresa Demo",
    cnpj: "00.000.000/0001-00",
    regime: "Simples Nacional",
  },
  periodos: ["2023", "2024", "2025"],
  emitidoEm: "21/04/2026",
  fontesRecebidas: "DRE, Balanço Patrimonial",
  statusAnalise: "Completa",
  fontesImportadas: {
    dre: true,
    balanco: true,
    razao: false,
    balancete: false,
    diarioGeral: false,
  },

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
          "Entender o que mudou na estrutura de custos antes de projetar 2026 em cima desse novo patamar.",
      },
      {
        numero: "02",
        titulo: "Dinheiro parado no banco",
        corpo:
          "O saldo em conta bancária passou de **R$ 679 mil em 2023** para **R$ 955 mil em 2024** e **R$ 1,45 milhão em 2025**. Sem dívida, sem grande investimento, sem distribuição formal.",
        chatCfoup:
          "O balanço registra o valor como 'Bancos conta movimento'. Se estiver em conta corrente, perde pra inflação. Se estiver em aplicação, deveria estar lançado como 'Aplicações Financeiras'. Se estiver em outra empresa do grupo, não apareceria aqui. Vale confirmar onde esse dinheiro está de fato.",
      },
      {
        numero: "03",
        titulo: "Lucro que ninguém tirou",
        corpo:
          "Capital social de **R$ 5 mil**. Lucro acumulado: **R$ 1,45 milhão**. Nos últimos três anos, a empresa deu quase R$ 2 milhões de lucro e não tem registro de nenhuma distribuição formal aos sócios.",
        chatCfoup:
          "Formalizar distribuição anual de lucros é isenta de IR, protege o sócio em caso de fiscalização, e libera capital pessoal para diversificar patrimônio fora da empresa.",
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
      { id: "bp-5", titulo: "Impostos a recolher", corpo: "Subiu 80% em três anos, no mesmo ritmo das vendas. Em 2025, metade é Simples Nacional e metade é ICMS-ST (imposto que a empresa paga antecipado no lugar do cliente dela).", status: "info" },
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
  // DADOS FINANCEIROS — Análise Financeira
  // =====================================================================
  dadosFinanceiros: {
    hero: {
      subTitulo: "Operação · Vendas · Recebíveis · Caixa · Ciclo",
      descricao: "Análise operacional do negócio em 2023, 2024 e 2025 cruzando vendas (NFs), contas a pagar, contas a receber e caixa bancário — com leitura, fatos e ações priorizadas.",
      exercicios: "2023 · 2024 · 2025 · Q1-2026",
      cobertura: "9.903 NFs · 6.880 títulos · 6.364 lançamentos",
      fonte: "ERP + extratos bancários",
      dataBase: "20/04/2026",
    },
    sintese: {
      veredito: "Você cresceu, mas ficou mais dependente — e ainda não transformou esse crescimento em caixa e previsibilidade.",
      kpis: [
        { label: "Faturamento Q1-2026", valor: "R$ 0,94M", contexto: "+11,7% vs Q1-2025", href: "/analise-financeira?tab=faturamento" },
        { label: "Clientes ativos", valor: "376", contexto: "−15 vs 2024", href: "/analise-financeira?tab=clientes" },
        { label: "Concentração Top 1", valor: "9,6%", contexto: "SUPRICORP · 69 dias prazo", href: "/analise-financeira?tab=clientes" },
        { label: "Base em queda", valor: "70", contexto: "−R$ 285k em risco", href: "/analise-financeira?tab=clientes" },
        { label: "Caixa visível", valor: "27%", contexto: "R$ 73k/mês fora do radar", href: "/analise-financeira?tab=caixa" },
      ],
      alertas: [
        { nivel: "critico", texto: "SUPRICORP virou dependência crítica: 9,6% da receita, paga em 69 dias, puxou 56% do crescimento de Q1.", href: "/analise-financeira?tab=clientes" },
        { nivel: "atencao", texto: "Saldo líquido de clientes é negativo: 70 em queda + 58 perdidos superam os 43 em alta.", href: "/analise-financeira?tab=clientes" },
        { nivel: "controle", texto: "Caixa incompleto: R$ 73 mil/mês circulam fora do banco analisado.", href: "/analise-financeira?tab=caixa" },
      ],
      leitura: {
        principal: "O faturamento cresceu 21% em 2025, mas a base de clientes encolheu e a concentração aumentou. O crescimento veio de poucos motores, especialmente SUPRICORP, que sozinha puxou 37% do avanço do ano.",
        oQueFuncionou: "Aquisição funciona: 79 clientes novos em 2025. O canal de entrada está saudável. A margem bruta declarada se manteve acima de 50%.",
        oQuePreocupa: "A retenção é o problema: mais clientes em queda (70) do que em alta (43). A margem real de caixa está ~10% abaixo da declarada. O caixa visível representa apenas 27% do fluxo real.",
        oQueFazerAgora: "Consolidar a visão de caixa, proteger SUPRICORP com contrato, e atacar os 70 em queda antes de buscar volume novo.",
      },
      acoes: [
        { titulo: "Reunião SUPRICORP", descricao: "Entender pipeline 2026 e renegociar prazo de 69 para 45 dias.", href: "/analise-financeira?tab=clientes" },
        { titulo: "Plano de retenção", descricao: "Listar os 70 em queda e atribuir a vendedor para diagnóstico em 30 dias.", href: "/analise-financeira?tab=clientes" },
        { titulo: "Consolidação de caixa", descricao: "Integrar todos os bancos e separar movimento pessoal dos sócios.", href: "/analise-financeira?tab=caixa" },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO A — FATURAMENTO
    // -----------------------------------------------------------------
    faturamento: {
      veredito: "Você cresceu, mas não ficou mais saudável — crescimento concentrado em poucos clientes.",
      leitura: "A empresa cresceu forte em 2025, mas o crescimento <strong>mudou de natureza</strong>: veio com menos clientes, menos notas e maior concentração em poucos motores. Sem a contribuição extraordinária do top 1, o crescimento teria ficado perto de <strong>13%, não 21%</strong>. O Q1-2026 segue positivo, mas em ritmo menor — confirmar se 2025 foi início de uma nova fase ou apenas um pico concentrado.",
      kpis: [
        { label: "Q1-2026 (mais recente)", valor: "R$ 0,94<span class='unit'>M</span>", delta: "+11,7% vs Q1-2025 · ritmo abaixo de 2025", deltaType: "warn" as const, highlight: true },
        { label: "Faturamento 2025", valor: "R$ 3,70<span class='unit'>M</span>", delta: "+21,0% contra 2024", deltaType: "up" as const },
        { label: "Margem Bruta declarada", valor: "51,9<span class='unit'>%</span>", delta: "−0,8 p.p. · margem real ~48%", deltaType: "flat" as const },
        { label: "Receita média por cliente", valor: "R$ 9.838", delta: "+25,8% — atenção: base menor", deltaType: "warn" as const },
        { label: "Clientes ativos no ano", valor: "376", delta: "−15 contra 2024 · base encolhendo", deltaType: "down" as const },
      ],
      alertas: [
        { nivel: "critico" as const, titulo: "SUPRICORP virou cliente crítico", texto: "Saiu de R$ 16k em 2023 para <b>R$ 354k em 2025</b> (9,6% da sua receita). Sozinha puxou 37% do seu crescimento e <b>paga em 69 dias</b>. Sem segundo lugar próximo." },
        { nivel: "atencao" as const, titulo: "Margem não acompanhou crescimento", texto: "Receita +21%, margem bruta declarada caiu 0,8 p.p. <b>Margem real de caixa ~48%</b> (cadastro de custo do produto está defasado em ~10%)." },
      ],
      evidenceBlocks: [
        {
          titulo: "Ver os números detalhados",
          tipo: "grid-4-paineis" as const,
          paineis: [
            {
              id: "A.1",
              titulo: "Indicadores anuais",
              conteudo: `<table style="width:100%; font-size:12px;">
                <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;"></th><th style="text-align:right; padding:6px 0;">2023</th><th style="text-align:right; padding:6px 0;">2024</th><th style="text-align:right; padding:6px 0;">2025</th><th style="text-align:right; padding:6px 0;">Δ 24→25</th></tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">Faturamento</td><td style="text-align:right;">R$ 2,52M</td><td style="text-align:right;">R$ 3,06M</td><td style="text-align:right; font-weight:bold;">R$ 3,70M</td><td style="text-align:right; color:var(--brand-green);">+21,0%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">CMV declarado</td><td style="text-align:right;">R$ 1,19M</td><td style="text-align:right;">R$ 1,45M</td><td style="text-align:right;">R$ 1,78M</td><td style="text-align:right; color:var(--brand-red);">+22,8%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Margem Bruta</td><td style="text-align:right;">52,8%</td><td style="text-align:right;">52,7%</td><td style="text-align:right;">51,9%</td><td style="text-align:right; color:var(--brand-warning);">−0,8 p.p.</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">NFs emitidas</td><td style="text-align:right;">4.521</td><td style="text-align:right;">4.389</td><td style="text-align:right;">4.187</td><td style="text-align:right; color:var(--brand-red);">−4,6%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Clientes únicos</td><td style="text-align:right;">402</td><td style="text-align:right;">391</td><td style="text-align:right;">376</td><td style="text-align:right; color:var(--brand-red);">−15</td></tr>
                  <tr><td style="padding:6px 0;">Receita média/cliente</td><td style="text-align:right;">R$ 6.269</td><td style="text-align:right;">R$ 7.820</td><td style="text-align:right; font-weight:bold;">R$ 9.838</td><td style="text-align:right; color:var(--brand-green);">+25,8%</td></tr>
                </tbody>
              </table>`,
              notaRodape: "Receita cresce, base encolhe. O crescimento veio de faturar mais em cima de menos clientes.",
              notaMarker: "fato" as const,
            },
            {
              id: "A.2",
              titulo: "Sazonalidade (índice 100)",
              conteudo: `<div style="display:flex; gap:4px; align-items:end; height:60px; margin-bottom:12px;">
                <div style="flex:1; background:var(--brand-green); height:100%; border-radius:2px;" title="Mar: 119"></div>
                <div style="flex:1; background:var(--brand-warning); height:70%; border-radius:2px;" title="Abr: 85"></div>
                <div style="flex:1; background:var(--brand-blue); height:80%; border-radius:2px;" title="Mai: 95"></div>
                <div style="flex:1; background:var(--brand-blue); height:85%; border-radius:2px;" title="Jun: 98"></div>
                <div style="flex:1; background:var(--brand-warning); height:65%; border-radius:2px;" title="Jul: 78"></div>
                <div style="flex:1; background:var(--brand-green); height:95%; border-radius:2px;" title="Ago: 112"></div>
                <div style="flex:1; background:var(--brand-green); height:100%; border-radius:2px;" title="Set: 118"></div>
                <div style="flex:1; background:var(--brand-blue); height:82%; border-radius:2px;" title="Out: 96"></div>
                <div style="flex:1; background:var(--brand-green); height:95%; border-radius:2px;" title="Nov: 115"></div>
                <div style="flex:1; background:var(--brand-warning); height:60%; border-radius:2px;" title="Dez: 72"></div>
                <div style="flex:1; background:var(--brand-warning); height:55%; border-radius:2px;" title="Jan: 68"></div>
                <div style="flex:1; background:var(--brand-warning); height:70%; border-radius:2px;" title="Fev: 84"></div>
              </div>
              <table style="width:100%; font-size:11px;">
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:4px 0; color:var(--brand-green); font-weight:600;">Picos</td><td style="text-align:right;">Mar, Set, Nov</td><td style="text-align:right;">115-119</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:4px 0; color:var(--brand-warning); font-weight:600;">Vales</td><td style="text-align:right;">Dez, Jan, Fev</td><td style="text-align:right;">68-84</td></tr>
                <tr><td style="padding:4px 0;">Q4/total</td><td style="text-align:right;">23,5%</td><td style="text-align:right; color:var(--brand-ink-muted);">levemente abaixo de 25%</td></tr>
              </table>`,
              notaRodape: "Padrão sazonal típico de distribuição. Q1 é vale natural — comparar YoY, não MoM.",
              notaMarker: "leitura" as const,
            },
            {
              id: "A.3",
              titulo: "Crescimento Q1",
              conteudo: `<table style="width:100%; font-size:12px;">
                <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;"></th><th style="text-align:right; padding:6px 0;">Q1-2024</th><th style="text-align:right; padding:6px 0;">Q1-2025</th><th style="text-align:right; padding:6px 0;">Q1-2026</th><th style="text-align:right; padding:6px 0;">Δ YoY</th></tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">Faturamento</td><td style="text-align:right;">R$ 712k</td><td style="text-align:right;">R$ 841k</td><td style="text-align:right; font-weight:bold;">R$ 940k</td><td style="text-align:right; color:var(--brand-green);">+11,7%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Crescimento YoY</td><td style="text-align:right; color:var(--brand-ink-muted);">—</td><td style="text-align:right; color:var(--brand-green);">+18,1%</td><td style="text-align:right; color:var(--brand-warning);">+11,7%</td><td style="text-align:right;"></td></tr>
                  <tr><td style="padding:6px 0;">vs ano cheio</td><td style="text-align:right; color:var(--brand-ink-muted);">23,3%</td><td style="text-align:right; color:var(--brand-ink-muted);">22,7%</td><td style="text-align:right; color:var(--brand-ink-muted);">25,4%*</td><td style="text-align:right;"></td></tr>
                </tbody>
              </table>`,
              notaRodape: "*Se Q1-2026 representar 25% do ano, projeção anual = R$ 3,76M (estável vs 2025). Se ritmo desacelerar, pode fechar abaixo.",
              notaMarker: "hipotese" as const,
            },
            {
              id: "A.4",
              titulo: "Quem puxou o crescimento 2025",
              conteudo: `<table style="width:100%; font-size:12px;">
                <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Cliente</th><th style="text-align:right; padding:6px 0;">2024</th><th style="text-align:right; padding:6px 0;">2025</th><th style="text-align:right; padding:6px 0;">Δ</th><th style="text-align:right; padding:6px 0;">% do Δ</th></tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600; color:var(--brand-warning);">1. SUPRICORP</td><td style="text-align:right;">R$ 215k</td><td style="text-align:right;">R$ 354k</td><td style="text-align:right; color:var(--brand-green);">+R$ 139k</td><td style="text-align:right; font-weight:600; color:var(--brand-warning);">21,8%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">2. CLIENTE_U</td><td style="text-align:right;">R$ 78k</td><td style="text-align:right;">R$ 112k</td><td style="text-align:right; color:var(--brand-green);">+R$ 34k</td><td style="text-align:right;">5,3%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">3. CLIENTE_V</td><td style="text-align:right;">R$ 65k</td><td style="text-align:right;">R$ 89k</td><td style="text-align:right; color:var(--brand-green);">+R$ 24k</td><td style="text-align:right;">3,8%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">4. CLIENTE_W</td><td style="text-align:right;">R$ 54k</td><td style="text-align:right;">R$ 72k</td><td style="text-align:right; color:var(--brand-green);">+R$ 18k</td><td style="text-align:right;">2,8%</td></tr>
                  <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">5. CLIENTE_X</td><td style="text-align:right;">R$ 48k</td><td style="text-align:right;">R$ 63k</td><td style="text-align:right; color:var(--brand-green);">+R$ 15k</td><td style="text-align:right;">2,3%</td></tr>
                  <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">Top 5 combinado</td><td style="text-align:right;"></td><td style="text-align:right;"></td><td style="text-align:right; font-weight:bold; color:var(--brand-green);">+R$ 230k</td><td style="text-align:right; font-weight:bold;">36,0%</td></tr>
                </tbody>
              </table>`,
              notaRodape: "SUPRICORP sozinha = 21,8% do crescimento total. Top 5 = 36%. Crescimento concentrado em poucos motores.",
              notaMarker: "trajetoria" as const,
            },
          ],
        },
      ],
      acoes: [
        { texto: "<b>Reunião com SUPRICORP em 2 semanas</b> — entender pipeline 2026 e renegociar prazo de pagamento (hoje 69 dias).", meta: "Risco: 9,6% da receita" },
        { texto: "<b>Reconciliar custo dos top 10 SKUs</b> com o preço real pago aos fornecedores (ACF, NOVAPLASTICS, AVANZI).", meta: "Gap ~10% entre NF e caixa" },
        { texto: "<b>Plano comercial Q2: meta de 20 clientes novos</b> para compensar os 15 que sumiram.", meta: "Receita esperada: R$ 16-30k/mês" },
        { texto: "<b>Cross-sell nos 145 estáveis de cauda longa</b> — se metade dobrar para R$ 5k, são <b>+R$ 180k/ano</b>.", meta: "Mais barato que aquisição" },
        { texto: "<b>Monitorar Q2-2026</b> — se crescimento YoY cair abaixo de 10%, acionar plano de expansão de base.", meta: "Indicador de alerta precoce" },
      ],
      glossario: [
        { termo: "NF", definicao: "= Nota Fiscal." },
        { termo: "Q1, Q2, Q3, Q4", definicao: "= trimestres do ano (Q1 = Jan+Fev+Mar; Q4 = Out+Nov+Dez)." },
        { termo: "YoY (ano contra ano)", definicao: "= compara o mesmo período de anos diferentes (ex: Q1-2026 vs Q1-2025)." },
        { termo: "SKU", definicao: "= cada produto no seu cadastro. Cada item tem seu código único." },
        { termo: "Margem Bruta declarada", definicao: "= margem calculada pelo custo que está cadastrado na nota fiscal. Pode estar desatualizada vs realidade." },
        { termo: "CMV", definicao: "= Custo da Mercadoria Vendida. O que você pagou pelo produto que vendeu." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO B — CLIENTES
    // -----------------------------------------------------------------
    clientes: {
      veredito: "Sua aquisição funciona; sua retenção não.",
      leitura: "Você tem uma base estável relevante e continua trazendo clientes novos. O problema está no meio da carteira: <strong>perdeu 58 clientes em 2025</strong> e outros <strong>70 já vêm caindo</strong> ano após ano. O gargalo comercial hoje não é captação; é retenção.",
      kpis: [
        { label: "Universo 3 anos", valor: "593", delta: "clientes únicos 2023-2025", deltaType: "flat" as const },
        { label: "Estáveis", valor: "223", delta: "37,6% da base · compraram nos 3 anos", deltaType: "flat" as const },
        { label: "Em queda contínua", valor: "70", delta: "−R$ 285k em risco · caindo a cada ano", deltaType: "down" as const },
        { label: "Perdidos em 2025", valor: "58", delta: "−R$ 233k de receita perdida", deltaType: "down" as const },
        { label: "Conquistados 2025", valor: "79", delta: "Canal de aquisição saudável", deltaType: "up" as const },
      ],
      alertas: [
        { nivel: "critico" as const, titulo: "Saldo líquido negativo", texto: "43 em alta menos 70 em queda = <b>−27 clientes em deterioração</b>. Esse é o dado mais importante da aba." },
        { nivel: "atencao" as const, titulo: "Top 1 = 9,6% da receita", texto: "SUPRICORP sozinha vale quase 10% do faturamento. Se sair, abre buraco de <b>R$ 354k/ano</b>." },
        { nivel: "controle" as const, titulo: "Aquisição funcionando", texto: "79 clientes novos em 2025. O canal de entrada está saudável — o problema é a retenção." },
      ],
      ctas: [
        {
          eyebrow: "Ação executiva",
          texto: "Exporte a lista completa de clientes perdidos (58), em queda (70) e em alta (43) para trabalhar com seu time comercial. Os dados estão prontos para ação.",
          ctaLabel: "⬇ Baixar planilha Excel",
          isExport: true,
        },
      ],
      evidenceBlocks: [
        {
          titulo: "Top 10 clientes perdidos em 2025",
          tipo: "tabela-clientes" as const,
          colunas: ["Cliente", "2024", "2025", "Δ"],
          clientes: [
            { nome: "CLIENTE_A", valor2024: 45000, valor2025: 0, delta: -45000 },
            { nome: "CLIENTE_B", valor2024: 38000, valor2025: 0, delta: -38000 },
            { nome: "CLIENTE_C", valor2024: 32000, valor2025: 0, delta: -32000 },
            { nome: "CLIENTE_D", valor2024: 28000, valor2025: 0, delta: -28000 },
            { nome: "CLIENTE_E", valor2024: 24000, valor2025: 0, delta: -24000 },
            { nome: "CLIENTE_F", valor2024: 19000, valor2025: 0, delta: -19000 },
            { nome: "CLIENTE_G", valor2024: 15000, valor2025: 0, delta: -15000 },
            { nome: "CLIENTE_H", valor2024: 12000, valor2025: 0, delta: -12000 },
            { nome: "CLIENTE_I", valor2024: 11000, valor2025: 0, delta: -11000 },
            { nome: "CLIENTE_J", valor2024: 9000, valor2025: 0, delta: -9000 },
          ],
          subtotalLabel: "Subtotal Top 10",
          subtotalValor: -233000,
          notaRodape: "58 clientes perdidos em 2025. Critério: compraram em 2023 e 2024, não compraram em 2025.",
        },
        {
          titulo: "Top 10 clientes em queda contínua",
          tipo: "tabela-clientes" as const,
          colunas: ["Cliente", "2024", "2025", "Δ"],
          clientes: [
            { nome: "CLIENTE_K", valor2024: 52000, valor2025: 35000, delta: -17000, deltaPercent: -33 },
            { nome: "CLIENTE_L", valor2024: 48000, valor2025: 32000, delta: -16000, deltaPercent: -33 },
            { nome: "CLIENTE_M", valor2024: 41000, valor2025: 28000, delta: -13000, deltaPercent: -32 },
            { nome: "CLIENTE_N", valor2024: 38000, valor2025: 26000, delta: -12000, deltaPercent: -32 },
            { nome: "CLIENTE_O", valor2024: 35000, valor2025: 24000, delta: -11000, deltaPercent: -31 },
            { nome: "CLIENTE_P", valor2024: 32000, valor2025: 23000, delta: -9000, deltaPercent: -28 },
            { nome: "CLIENTE_Q", valor2024: 29000, valor2025: 21000, delta: -8000, deltaPercent: -28 },
            { nome: "CLIENTE_R", valor2024: 26000, valor2025: 19000, delta: -7000, deltaPercent: -27 },
            { nome: "CLIENTE_S", valor2024: 24000, valor2025: 18000, delta: -6000, deltaPercent: -25 },
            { nome: "CLIENTE_T", valor2024: 22000, valor2025: 17000, delta: -5000, deltaPercent: -23 },
          ],
          subtotalLabel: "Subtotal Top 10",
          subtotalValor: -104000,
          notaRodape: "70 clientes em queda contínua. Critério: compraram nos 3 anos, mas caindo ano a ano.",
        },
        {
          titulo: "Top 10 clientes em alta contínua",
          tipo: "tabela-clientes" as const,
          colunas: ["Cliente", "2024", "2025", "Δ"],
          clientes: [
            { nome: "SUPRICORP", valor2024: 215000, valor2025: 354000, delta: 139000, deltaPercent: 65, obs: "Top 1" },
            { nome: "CLIENTE_U", valor2024: 78000, valor2025: 112000, delta: 34000, deltaPercent: 44 },
            { nome: "CLIENTE_V", valor2024: 65000, valor2025: 89000, delta: 24000, deltaPercent: 37 },
            { nome: "CLIENTE_W", valor2024: 54000, valor2025: 72000, delta: 18000, deltaPercent: 33 },
            { nome: "CLIENTE_X", valor2024: 48000, valor2025: 63000, delta: 15000, deltaPercent: 31 },
            { nome: "CLIENTE_Y", valor2024: 42000, valor2025: 54000, delta: 12000, deltaPercent: 29 },
            { nome: "CLIENTE_Z", valor2024: 38000, valor2025: 48000, delta: 10000, deltaPercent: 26 },
            { nome: "CLIENTE_AA", valor2024: 35000, valor2025: 44000, delta: 9000, deltaPercent: 26 },
            { nome: "CLIENTE_AB", valor2024: 32000, valor2025: 40000, delta: 8000, deltaPercent: 25 },
            { nome: "CLIENTE_AC", valor2024: 29000, valor2025: 36000, delta: 7000, deltaPercent: 24 },
          ],
          subtotalLabel: "Subtotal Top 10",
          subtotalValor: 276000,
          notaRodape: "43 clientes em alta contínua. Critério: compraram nos 3 anos, crescendo ano a ano.",
        },
        {
          titulo: "Ver categorias de jornada e top clientes",
          tipo: "dois-paineis" as const,
          painelEsquerdo: {
            titulo: "B.1 · Jornada das 593 categorias",
            conteudo: `<table style="width:100%; font-size:12px;">
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">Estáveis (3 anos)</td><td style="text-align:right;">223</td><td style="text-align:right; color:var(--brand-ink-muted);">37,6%</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Em alta contínua</td><td style="text-align:right;">43</td><td style="text-align:right; color:var(--brand-green);">+R$ 540k</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Em queda contínua</td><td style="text-align:right;">70</td><td style="text-align:right; color:var(--brand-red);">−R$ 285k</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Perdidos em 2025</td><td style="text-align:right;">58</td><td style="text-align:right; color:var(--brand-red);">−R$ 233k</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Conquistados 2025</td><td style="text-align:right;">79</td><td style="text-align:right; color:var(--brand-green);">Novos</td></tr>
              <tr><td style="padding:6px 0;">Outros (esporádicos)</td><td style="text-align:right;">120</td><td style="text-align:right; color:var(--brand-ink-muted);">Cauda longa</td></tr>
            </table>`,
          },
          painelDireito: {
            titulo: "B.2 · Top 5 clientes 2025",
            conteudo: `<table style="width:100%; font-size:12px;">
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">1. SUPRICORP</td><td style="text-align:right;">R$ 354k</td><td style="text-align:right; color:var(--brand-warning);">9,6%</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">2. CLIENTE_U</td><td style="text-align:right;">R$ 112k</td><td style="text-align:right;">3,0%</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">3. CLIENTE_V</td><td style="text-align:right;">R$ 89k</td><td style="text-align:right;">2,4%</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">4. CLIENTE_W</td><td style="text-align:right;">R$ 72k</td><td style="text-align:right;">1,9%</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">5. CLIENTE_X</td><td style="text-align:right;">R$ 63k</td><td style="text-align:right;">1,7%</td></tr>
              <tr><td style="padding:6px 0; font-weight:600;">Top 5 total</td><td style="text-align:right; font-weight:600;">R$ 690k</td><td style="text-align:right; font-weight:600; color:var(--brand-warning);">18,6%</td></tr>
            </table>
            <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">Concentração moderada: Top 5 = 18,6%. Risco está no Top 1 (SUPRICORP = 9,6%).</p>`,
          },
        },
      ],
      acoes: [
        { texto: "<b>Listar os 70 clientes em queda</b> e atribuir a vendedor para diagnóstico em 30 dias.", meta: "~R$ 285k/ano em risco" },
        { texto: "<b>Programa \"Save\"</b>: ligar nos 58 que sumiram em 2025.", meta: "Receita 2024: R$ 233k" },
        { texto: "<b>Plano de proteção SUPRICORP</b>: contrato de fornecimento com prazo definido.", meta: "Risco: R$ 354k/ano" },
        { texto: "<b>Análise dos 79 novos de 2025</b>: como entraram? Replicar canal.", meta: "Aquisição funciona" },
        { texto: "<b>Separar \"cauda longa\" dos estratégicos</b>: focar retenção onde há margem.", meta: "120 clientes esporádicos" },
      ],
      glossario: [
        { termo: "Universo de 3 anos", definicao: "= total de clientes diferentes que compraram em 2023, 2024 ou 2025 (sem contar duplicados)." },
        { termo: "Cliente estável", definicao: "= cliente que comprou em todos os 3 anos (2023, 2024 e 2025). É o coração da sua base." },
        { termo: "Cliente em queda contínua", definicao: "= cliente que compra nos 3 anos, mas a receita anual está caindo ano a ano." },
        { termo: "Cliente perdido em 2025", definicao: "= cliente que comprou em 2023 e 2024 mas não comprou nada em 2025." },
        { termo: "Cauda longa", definicao: "= parte grande da base de clientes que, individualmente, compra pouco." },
        { termo: "Concentração", definicao: "= quanto da sua receita depende de poucos clientes. Acima de 15% num só cliente é risco alto." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO C — AUDITORIA
    // -----------------------------------------------------------------
    auditoria: {
      veredito: "Sua posição está organizada — não aparece nenhum problema grave aqui.",
      leitura: "Você tem <strong>R$ 533 mil a receber</strong> e <strong>R$ 258 mil a pagar</strong>, então o saldo está a seu favor. A maior parte ainda está no prazo, o que mostra controle. O único ponto para limpar são <strong>R$ 53 mil com mais de 120 dias</strong>, que parecem mais pendência de lançamento no ERP do que dinheiro realmente perdido.",
      kpis: [
        { label: "A receber em aberto", valor: "R$ 533<span class='unit'>k</span>", delta: "49% ainda no prazo", deltaType: "flat" as const },
        { label: "A pagar em aberto", valor: "R$ 258<span class='unit'>k</span>", delta: "80% ainda no prazo", deltaType: "flat" as const },
        { label: "Saldo (Receber − Pagar)", valor: "+R$ 276<span class='unit'>k</span>", delta: "Posição positiva", deltaType: "up" as const },
        { label: "Sujeira contábil (>120 dias)", valor: "R$ 53<span class='unit'>k</span>", delta: "Limpar com ERP · não é dívida real", deltaType: "warn" as const },
      ],
      alertas: [
        { nivel: "controle" as const, titulo: "Carteira organizada", texto: "A maior parte dos títulos ainda está no prazo. Dos que atrasaram, só <b>6-7%</b> estão em atraso longo (mais de 120 dias)." },
        { nivel: "controle" as const, titulo: "Saldo a seu favor", texto: "Você tem <b>R$ 276k a mais para receber do que para pagar</b>. Não está devendo fornecedor." },
        { nivel: "atencao" as const, titulo: "SILAVA Lavanderia · cliente crônico", texto: "R$ 17k em atraso em <b>13 títulos</b>, alguns com mais de 8 meses. <b>Decidir se vale continuar atendendo.</b>" },
      ],
      ctas: [
        {
          eyebrow: "Ação executiva",
          texto: "R$ 117 mil a receber em atraso >30 dias (19 clientes) e R$ 18 mil a pagar em atraso (10 fornecedores). Listas prontas para cobrança e pente fino.",
          ctaLabel: "⬇ Baixar lista de atrasos",
          isExport: true,
        },
      ],
      evidenceBlocks: [
        {
          titulo: "Ver detalhamento por faixa de atraso",
          tipo: "dois-paineis" as const,
          painelEsquerdo: {
            titulo: "C.1 · Contas a Receber por faixa de atraso",
            conteudo: `<table style="width:100%; font-size:12px;">
              <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Faixa</th><th style="text-align:right; padding:6px 0;">Valor</th><th style="text-align:right; padding:6px 0;">%</th></tr></thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-green); font-weight:600;">Ainda no prazo</td><td style="text-align:right;">R$ 263k</td><td style="text-align:right;">49,3%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">0-30 dias</td><td style="text-align:right;">R$ 153k</td><td style="text-align:right;">28,7%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-warning);">31-60 dias</td><td style="text-align:right;">R$ 42k</td><td style="text-align:right;">7,9%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-warning);">61-90 dias</td><td style="text-align:right;">R$ 28k</td><td style="text-align:right;">5,3%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-red);">91-120 dias</td><td style="text-align:right;">R$ 18k</td><td style="text-align:right;">3,4%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-red); font-weight:600;">>120 dias</td><td style="text-align:right;">R$ 29k</td><td style="text-align:right;">5,4%</td></tr>
                <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">TOTAL</td><td style="text-align:right; font-weight:bold;">R$ 533k</td><td style="text-align:right; font-weight:bold;">100%</td></tr>
              </tbody>
            </table>
            <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">22% em atraso >30 dias (R$ 117k em 19 clientes). Maior parte ainda controlada.</p>`,
          },
          painelDireito: {
            titulo: "C.2 · Contas a Pagar por faixa de atraso",
            conteudo: `<table style="width:100%; font-size:12px;">
              <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Faixa</th><th style="text-align:right; padding:6px 0;">Valor</th><th style="text-align:right; padding:6px 0;">%</th></tr></thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-green); font-weight:600;">Ainda no prazo</td><td style="text-align:right;">R$ 206k</td><td style="text-align:right;">79,8%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">0-30 dias</td><td style="text-align:right;">R$ 34k</td><td style="text-align:right;">13,2%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-warning);">31-60 dias</td><td style="text-align:right;">R$ 8k</td><td style="text-align:right;">3,1%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-warning);">61-90 dias</td><td style="text-align:right;">R$ 4k</td><td style="text-align:right;">1,6%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-red);">91-120 dias</td><td style="text-align:right;">R$ 2k</td><td style="text-align:right;">0,8%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; color:var(--brand-red); font-weight:600;">>120 dias</td><td style="text-align:right;">R$ 4k</td><td style="text-align:right;">1,5%</td></tr>
                <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">TOTAL</td><td style="text-align:right; font-weight:bold;">R$ 258k</td><td style="text-align:right; font-weight:bold;">100%</td></tr>
              </tbody>
            </table>
            <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">7% em atraso >30 dias (R$ 18k em 10 fornecedores). Posição muito saudável.</p>`,
          },
        },
        {
          titulo: "Ver top 15 clientes com títulos vencidos há mais de 30 dias",
          tipo: "html" as const,
          conteudo: `<table style="width:100%; font-size:12px;">
            <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Cliente</th><th style="text-align:right; padding:6px 0;">Nº títulos</th><th style="text-align:right; padding:6px 0;">Valor</th><th style="text-align:right; padding:6px 0;">Pior atraso</th></tr></thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600; color:var(--brand-warning);">1. SILAVA Lavanderia</td><td style="text-align:right;">13</td><td style="text-align:right;">R$ 17.200</td><td style="text-align:right; color:var(--brand-red);">248 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">2. CLIENTE_AA</td><td style="text-align:right;">5</td><td style="text-align:right;">R$ 12.800</td><td style="text-align:right; color:var(--brand-warning);">95 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">3. CLIENTE_AB</td><td style="text-align:right;">4</td><td style="text-align:right;">R$ 11.500</td><td style="text-align:right; color:var(--brand-warning);">78 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">4. CLIENTE_AC</td><td style="text-align:right;">3</td><td style="text-align:right;">R$ 9.800</td><td style="text-align:right; color:var(--brand-warning);">65 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">5. CLIENTE_AD</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 8.400</td><td style="text-align:right;">52 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">6. CLIENTE_AE</td><td style="text-align:right;">3</td><td style="text-align:right;">R$ 7.900</td><td style="text-align:right;">48 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">7. CLIENTE_AF</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 7.200</td><td style="text-align:right;">45 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">8. CLIENTE_AG</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 6.800</td><td style="text-align:right;">42 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">9. CLIENTE_AH</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 6.200</td><td style="text-align:right;">38 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">10. CLIENTE_AI</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 5.800</td><td style="text-align:right;">36 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">11. CLIENTE_AJ</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 5.400</td><td style="text-align:right;">35 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">12. CLIENTE_AK</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 4.900</td><td style="text-align:right;">34 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">13. CLIENTE_AL</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 4.500</td><td style="text-align:right;">33 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">14. CLIENTE_AM</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 4.200</td><td style="text-align:right;">32 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">15. CLIENTE_AN</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 3.900</td><td style="text-align:right;">31 dias</td></tr>
              <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">Top 15 (dos 19)</td><td style="text-align:right; font-weight:bold;">42</td><td style="text-align:right; font-weight:bold;">R$ 116.500</td><td style="text-align:right;"></td></tr>
            </tbody>
          </table>
          <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">SILAVA concentra 15% do valor em atraso com 13 títulos. Demais são atrasos pontuais e recuperáveis.</p>`,
        },
        {
          titulo: "Ver fornecedores com títulos em atraso há mais de 30 dias",
          tipo: "html" as const,
          conteudo: `<table style="width:100%; font-size:12px;">
            <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Fornecedor</th><th style="text-align:right; padding:6px 0;">Nº títulos</th><th style="text-align:right; padding:6px 0;">Valor</th><th style="text-align:right; padding:6px 0;">Pior atraso</th></tr></thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">1. FORNEC_A</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 4.200</td><td style="text-align:right;">68 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">2. FORNEC_B</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 3.100</td><td style="text-align:right;">52 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">3. FORNEC_C</td><td style="text-align:right;">2</td><td style="text-align:right;">R$ 2.800</td><td style="text-align:right;">48 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">4. FORNEC_D</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 2.400</td><td style="text-align:right;">45 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">5. FORNEC_E</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 1.800</td><td style="text-align:right;">42 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">6. FORNEC_F</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 1.400</td><td style="text-align:right;">38 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">7. FORNEC_G</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 1.100</td><td style="text-align:right;">35 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">8. FORNEC_H</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 800</td><td style="text-align:right;">33 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">9. FORNEC_I</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 600</td><td style="text-align:right;">32 dias</td></tr>
              <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">10. FORNEC_J</td><td style="text-align:right;">1</td><td style="text-align:right;">R$ 500</td><td style="text-align:right;">31 dias</td></tr>
              <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">TOTAL (10 fornecedores)</td><td style="text-align:right; font-weight:bold;">12</td><td style="text-align:right; font-weight:bold;">R$ 18.700</td><td style="text-align:right;"></td></tr>
            </tbody>
          </table>
          <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">Valores baixos e pulverizados. Provável pendência de lançamento, não inadimplência real.</p>`,
        },
      ],
      acoes: [
        { texto: "<b>Baixar títulos >120 dias</b> com o contador — a maioria é sujeira, não dívida real.", meta: "R$ 53k para limpar" },
        { texto: "<b>Decisão sobre SILAVA</b>: cobrar, renegociar ou cortar.", meta: "R$ 17k em 13 títulos" },
        { texto: "<b>Cobrança ativa nos R$ 117k</b> em atraso >30 dias (19 clientes).", meta: "Lista pronta para ação" },
        { texto: "<b>Pente fino nos R$ 18k</b> a pagar em atraso — confirmar se são pendências reais.", meta: "10 fornecedores" },
      ],
      glossario: [
        { termo: "CR (Contas a Receber)", definicao: "= dinheiro que os clientes ainda vão te pagar por vendas já feitas." },
        { termo: "CP (Contas a Pagar)", definicao: "= dinheiro que você ainda vai pagar a fornecedores por compras já feitas." },
        { termo: "Aging (faixa de atraso)", definicao: "= agrupamento de títulos por quantos dias estão vencidos (0-30, 31-60, etc.)." },
        { termo: "ERP de gestão", definicao: "= sistema operacional da empresa onde se lançam vendas, compras e pagamentos. Distinto do sistema contábil." },
      ],
    },

    // -----------------------------------------------------------------
    // BLOCO D — FORNECEDORES
    // -----------------------------------------------------------------
    fornecedores: {
      veredito: "Seu custo está sob controle, mas dois pontos fugiram do ritmo: embalagens e diárias.",
      leitura: "No geral, a operação ficou mais enxuta e sem dependência perigosa de um fornecedor só. O problema é que <strong>embalagens cresceram bem acima da receita</strong> e <strong>diárias dispararam enquanto a folha caiu</strong>, o que sugere troca de estrutura fixa por terceirização. Isso pode ser ganho de flexibilidade ou começo de problema — depende do motivo.",
      kpis: [
        { label: "Total pago a fornecedores 2025", valor: "R$ 3,21<span class='unit'>M</span>", delta: "contra faturamento R$ 3,70M", deltaType: "flat" as const },
        { label: "Custo da mercadoria (caixa)", valor: "R$ 1,66<span class='unit'>M</span>", delta: "52% do total · Insumos + Embalagens", deltaType: "flat" as const },
        { label: "Pago / Faturamento", valor: "86,9<span class='unit'>%</span>", delta: "melhorou 8 p.p. vs 2023 (~95%)", deltaType: "up" as const },
        { label: "Top fornecedor", valor: "ACF Embalagens", delta: "R$ 322k · 10% do total", deltaType: "flat" as const },
      ],
      alertas: [
        { nivel: "atencao" as const, titulo: "Diárias +45% em 2025", texto: "R$ 143k → R$ 221k. Folha caiu 4%. <b>Está trocando CLT por terceirizado.</b> Pode estar criando passivo trabalhista." },
        { nivel: "atencao" as const, titulo: "Embalagens +40% (vs receita +21%)", texto: "Custo de embalagem cresceu 2× a receita. Confirmar se foi <b>estoque antecipado</b> (saudável) ou <b>consumo real maior</b> (problema)." },
        { nivel: "controle" as const, titulo: "Eficiência operacional melhorou", texto: "Custo total / faturamento caiu de 95% (2023) para 87% (2025). <b>8 p.p. de melhora em 2 anos.</b>" },
      ],
      evidenceBlocks: [
        {
          titulo: "Ver fornecedores e categorias de gasto",
          tipo: "dois-paineis-2-3" as const,
          painelEsquerdo: {
            titulo: "D.1 · Top 5 fornecedores 2025",
            conteudo: `<table style="width:100%; font-size:12px;">
              <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Fornecedor</th><th style="text-align:right; padding:6px 0;">Pago</th><th style="text-align:right; padding:6px 0;">%</th></tr></thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">1. ACF Embalagens</td><td style="text-align:right;">R$ 322k</td><td style="text-align:right;">10,0%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">2. NOVAPLASTICS</td><td style="text-align:right;">R$ 228k</td><td style="text-align:right;">7,1%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">3. AVANZI</td><td style="text-align:right;">R$ 195k</td><td style="text-align:right;">6,1%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">4. CHEM SUPPLY</td><td style="text-align:right;">R$ 168k</td><td style="text-align:right;">5,2%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">5. TRANSLOG</td><td style="text-align:right;">R$ 142k</td><td style="text-align:right;">4,4%</td></tr>
                <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">Top 5 combinados</td><td style="text-align:right; font-weight:bold;">R$ 1,06M</td><td style="text-align:right; font-weight:bold;">32,8%</td></tr>
              </tbody>
            </table>
            <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">Concentração saudável: nenhum fornecedor passa de 10%. Top 5 = ~1/3 do total.</p>`,
          },
          painelDireito: {
            titulo: "D.2 · Categorias de gasto 2023 → 2025",
            conteudo: `<table style="width:100%; font-size:12px;">
              <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:6px 0;">Categoria</th><th style="text-align:right; padding:6px 0;">2023</th><th style="text-align:right; padding:6px 0;">2024</th><th style="text-align:right; padding:6px 0;">2025</th><th style="text-align:right; padding:6px 0;">Δ 23→25</th></tr></thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600;">Insumos</td><td style="text-align:right;">R$ 785k</td><td style="text-align:right;">R$ 821k</td><td style="text-align:right;">R$ 836k</td><td style="text-align:right; color:var(--brand-green);">+6%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600; color:var(--brand-warning);">Embalagens</td><td style="text-align:right;">R$ 589k</td><td style="text-align:right;">R$ 712k</td><td style="text-align:right;">R$ 828k</td><td style="text-align:right; color:var(--brand-red);">+40%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Energia / Utilidades</td><td style="text-align:right;">R$ 245k</td><td style="text-align:right;">R$ 268k</td><td style="text-align:right;">R$ 289k</td><td style="text-align:right; color:var(--brand-ink-muted);">+18%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Frete / Logística</td><td style="text-align:right;">R$ 198k</td><td style="text-align:right;">R$ 215k</td><td style="text-align:right;">R$ 234k</td><td style="text-align:right; color:var(--brand-ink-muted);">+18%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Folha terceirizada</td><td style="text-align:right;">R$ 312k</td><td style="text-align:right;">R$ 298k</td><td style="text-align:right;">R$ 301k</td><td style="text-align:right; color:var(--brand-green);">−4%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0; font-weight:600; color:var(--brand-warning);">Diárias / Autônomos</td><td style="text-align:right;">R$ 143k</td><td style="text-align:right;">R$ 178k</td><td style="text-align:right;">R$ 221k</td><td style="text-align:right; color:var(--brand-red);">+45%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Manutenção / Equip.</td><td style="text-align:right;">R$ 156k</td><td style="text-align:right;">R$ 142k</td><td style="text-align:right;">R$ 168k</td><td style="text-align:right; color:var(--brand-ink-muted);">+8%</td></tr>
                <tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 0;">Outros</td><td style="text-align:right;">R$ 178k</td><td style="text-align:right;">R$ 195k</td><td style="text-align:right;">R$ 332k</td><td style="text-align:right; color:var(--brand-warning);">+86%</td></tr>
                <tr style="border-top:2px solid var(--border); background:var(--muted);"><td style="padding:6px 0; font-weight:bold;">TOTAL</td><td style="text-align:right; font-weight:bold;">R$ 2,61M</td><td style="text-align:right; font-weight:bold;">R$ 2,83M</td><td style="text-align:right; font-weight:bold;">R$ 3,21M</td><td style="text-align:right; font-weight:bold; color:var(--brand-ink-muted);">+23%</td></tr>
              </tbody>
            </table>
            <p style="margin-top:12px; font-size:11px; color:var(--brand-ink-muted);">Embalagens e Diárias puxaram o custo acima da receita (+21%). Insumos ficaram controlados.</p>`,
          },
        },
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
        { termo: "SKU", definicao: "= cada produto no seu cadastro. Cada item tem seu código único." },
        { termo: "Hedge de estoque", definicao: "= comprar mais estoque agora pra se proteger de aumento de preço depois." },
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
        { label: "Saldo inicial (05/03/2025)", valor: "R$ 20<span class='unit'>k</span>", delta: "validado por extrato físico", deltaType: "flat" as const },
        { label: "Saldo atual (~31/03/2026)", valor: "R$ 34<span class='unit'>k</span>", delta: "+R$ 14k em 13 meses", deltaType: "flat" as const },
        { label: "Meses positivos / negativos", valor: "6 / 7", delta: "Mais meses queimando que gerando", deltaType: "warn" as const },
        { label: "Pior mês", valor: "−R$ 32<span class='unit'>k</span>", delta: "Novembro/2025", deltaType: "down" as const },
      ],
      alertas: [
        { nivel: "critico" as const, titulo: "R$ 734k circulando fora do banco", texto: "O banco captou menos do que o sistema registra. <b>R$ 73k/mês</b> de fluxo invisível. <b>Confirmar com contador qual outra conta está ativa.</b>" },
        { nivel: "atencao" as const, titulo: "Sem reserva de caixa", texto: "+R$ 14k em 13 meses = <b>operação no empate</b>. Caixa atual cobre só 4 dias de saída." },
        { nivel: "atencao" as const, titulo: "Mais meses negativos que positivos", texto: "7 meses negativos contra 6 positivos. <b>Pior mês foi Nov/25 (R$ −32k)</b> — evento específico daquele mês." },
      ],
      acoes: [
        { texto: "<b>Identificar a outra conta bancária</b> com o contador — verificar se é outra PJ ou conta pessoal.", meta: "R$ 73k/mês fora" },
        { texto: "<b>Consolidar visão de caixa de TODAS as contas</b>.", meta: "Sem isso, projeção incompleta" },
        { texto: "<b>Implementar fluxo de caixa de 13 semanas</b>, atualizado toda sexta.", meta: "Modelo existe" },
        { texto: "<b>Definir caixa mínimo operacional</b>: 1 mês de saída = R$ 254k.", meta: "Hoje R$ 34k = ~4 dias" },
      ],
      evidenceBlocks: [
        {
          titulo: "Ver movimento mês a mês (13 meses)",
          tipo: "movimento-mensal" as const,
          movimentos: [
            { mes: "Mar/25", entradas: 89000, saidas: 82000, saldo: 7000 },
            { mes: "Abr/25", entradas: 76000, saidas: 91000, saldo: -15000 },
            { mes: "Mai/25", entradas: 95000, saidas: 88000, saldo: 7000 },
            { mes: "Jun/25", entradas: 82000, saidas: 79000, saldo: 3000 },
            { mes: "Jul/25", entradas: 78000, saidas: 85000, saldo: -7000 },
            { mes: "Ago/25", entradas: 91000, saidas: 84000, saldo: 7000 },
            { mes: "Set/25", entradas: 103000, saidas: 92000, saldo: 11000, isMelhor: true },
            { mes: "Out/25", entradas: 88000, saidas: 95000, saldo: -7000 },
            { mes: "Nov/25", entradas: 54000, saidas: 86000, saldo: -32000, isPior: true },
            { mes: "Dez/25", entradas: 72000, saidas: 78000, saldo: -6000 },
            { mes: "Jan/26", entradas: 98000, saidas: 89000, saldo: 9000 },
            { mes: "Fev/26", entradas: 85000, saidas: 81000, saldo: 4000 },
            { mes: "Mar/26", entradas: 112000, saidas: 79000, saldo: 33000 },
          ],
          totalEntradas: 1123000,
          totalSaidas: 1109000,
          mediaEntradas: 86385,
          mediaSaidas: 85308,
          notaRodape: "Fonte: extrato bancário validado. Valores arredondados para facilitar leitura.",
        },
      ],
      glossario: [
        { termo: "Fluxo de caixa", definicao: "= entrada e saída de dinheiro do banco ao longo do tempo." },
        { termo: "Reserva de caixa", definicao: "= dinheiro guardado na conta pra cobrir imprevistos ou meses mais fracos." },
        { termo: "Runway", definicao: "= quanto tempo seu caixa aguenta se a receita zerar hoje." },
        { termo: "Caixa mínimo operacional", definicao: "= valor de segurança que a conta não deveria ficar abaixo (recomendação: 1 mês de saída)." },
        { termo: "Consolidar caixa", definicao: "= juntar todas as contas bancárias numa visão só, pra ver o dinheiro real que entra e sai da empresa." },
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

    // -----------------------------------------------------------------
    // CHECKLIST MENSAL
    // -----------------------------------------------------------------
    checklistMensal: {
      grupos: [
        {
          titulo: "Caixa e Liquidez",
          itens: [
            { titulo: "Conferir saldo bancário e liquidez atual", contexto: "Meta runway acima de 90 dias", status: "concluido" as const },
            { titulo: "Reconciliar todas as contas bancárias do mês", contexto: "5 bancos sincronizados", status: "concluido" as const },
            { titulo: "Identificar outra conta com movimento operacional", contexto: "R$ 73k/mês fora do banco principal", status: "atencao" as const },
            { titulo: "Atualizar fluxo de caixa 13 semanas", contexto: "Última atualização há 9 dias", status: "pendente" as const },
          ],
        },
        {
          titulo: "Clientes e Concentração",
          itens: [
            { titulo: "Revisar clientes em queda contínua", contexto: "70 clientes valem R$ 285k em 2025", status: "atencao" as const },
            { titulo: "Cobrar recebíveis vencidos >45 dias", contexto: "Maior pendência: R$ 41k", status: "atencao" as const },
            { titulo: "Ligar nos 10 maiores clientes perdidos em 2025", contexto: "Receita 2024 perdida: R$ 233k", status: "pendente" as const },
            { titulo: "Mapear top 5 clientes do mês", contexto: "Top 5 = 24% da receita", status: "concluido" as const },
          ],
        },
        {
          titulo: "Margem e Custos",
          itens: [
            { titulo: "Verificar gap margem NF vs caixa", contexto: "Hoje em ~10% · atualizar custo dos top 10 SKUs", status: "atencao" as const },
            { titulo: "Conferir crescimento de Diárias vs Folha CLT", contexto: "Diárias +45%, Folha −4%", status: "atencao" as const },
            { titulo: "Conferir top 5 fornecedores do mês", contexto: "Top 2 embalagens = 17% do pago", status: "concluido" as const },
            { titulo: "Negociar volume com fornecedores principais", contexto: "Categoria +40% vs receita +21%", status: "pendente" as const },
          ],
        },
        {
          titulo: "Ciclo Financeiro",
          itens: [
            { titulo: "Calcular DSO e PMP do mês", contexto: "DSO 24d · PMP 31d · folga 7 dias", status: "concluido" as const },
            { titulo: "Verificar se PMP caiu abaixo de 28 dias", contexto: "Volatilidade no ano: 21-49 dias", status: "atencao" as const },
            { titulo: "Revisar política de prazo padrão por cliente", contexto: "Regra: 30 dias · aprovação direta acima de 45", status: "pendente" as const },
          ],
        },
        {
          titulo: "Auditoria e Dados",
          itens: [
            { titulo: "Validar itens sem classificação", contexto: "27 lançamentos categorizados ontem", status: "concluido" as const },
            { titulo: "Limpar títulos >120 dias no ERP", contexto: "R$ 53k em pendências de lançamento", status: "atencao" as const },
            { titulo: "Reconciliar duplicidades em CR e CP", contexto: "4 duplicidades resolvidas no mês", status: "concluido" as const },
            { titulo: "Decidir sobre cliente crônico", contexto: "13 títulos em atraso · paga em 121 dias", status: "atencao" as const },
          ],
        },
      ],
    },
  },
}
