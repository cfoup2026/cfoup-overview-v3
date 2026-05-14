// ---------------------------------------------------------------------
// Conteúdo universal (texto estático) — Análise Contábil
// Separado dos dados de cliente para facilitar tradução/edição.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Síntese Executiva — conteúdo universal
// ---------------------------------------------------------------------
export type SinteseConteudoUniversal = {
  glossario: { termo: string; definicao: string }[]
}

export const conteudoSintese: SinteseConteudoUniversal = {
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
}

// ---------------------------------------------------------------------
// DRE — conteúdo universal
// ---------------------------------------------------------------------
export type ExecutiveCardsConteudo = {
  leitura: { titulo: string; texto: string }
  acoes: { titulo: string; itens: string[] }
}

export type DREConteudoUniversal = {
  executiveCardsAV: ExecutiveCardsConteudo
  executiveCardsAH: ExecutiveCardsConteudo
  glossario: { termo: string; definicao: string }[]
}

export const conteudoDRE: DREConteudoUniversal = {
  executiveCardsAV: {
    leitura: {
      titulo: "Leitura da análise",
      texto: "Margem líquida avançou 16 pontos entre 2023 e 2025 (28,4% → 44,4%). O CPV caiu de 38,9% para 24,4% da receita líquida no período — principal ganho de margem. Despesas com pessoal reduziram de 20,7% para 17,3%. Despesas gerais subiram de 10,9% para 13,7%.",
    },
    acoes: {
      titulo: "Pontos de ação — DRE",
      itens: [
        "CPV caiu 14,5 pontos (38,9% → 24,4%) — verificar se houve mudança de critério contábil ou ganho real de eficiência.",
        "Despesas gerais subiram 2,8 pontos (10,9% → 13,7%) — mapear composição para entender origem do aumento.",
        "Lucro bruto saltou de 61,1% para 75,6% da receita líquida — estrutura de custos está mais leve.",
      ],
    },
  },
  executiveCardsAH: {
    leitura: {
      titulo: "Leitura da análise",
      texto: "Receita líquida cresceu +30,8% entre 2023 e 2025. Lucro líquido cresceu +104,7% no mesmo período (R$ 474.849 → R$ 971.923). CPV caiu -18,0% em valor absoluto, mesmo com receita subindo. Despesas gerais cresceram +64,2%, acima da receita.",
    },
    acoes: {
      titulo: "Pontos de ação — DRE",
      itens: [
        "CPV caiu -18,0% enquanto receita cresceu +30,8% — validar se houve mudança de critério ou terceirização.",
        "Despesas gerais cresceram +64,2% no período, acima da receita (+30,8%) — investigar composição.",
        "Lucro bruto cresceu +62,0% vs lucro líquido +104,7% — ganho de alavancagem operacional confirmado.",
      ],
    },
  },
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
}

// ---------------------------------------------------------------------
// Balanço Patrimonial — conteúdo universal
// ---------------------------------------------------------------------
export type BPConteudoUniversal = {
  intro: string
  legendaAV: string
  legendaAH: string
  executiveCardsAV: ExecutiveCardsConteudo
  executiveCardsAH: ExecutiveCardsConteudo
  glossario: { termo: string; definicao: string }[]
}

export const conteudoBP: BPConteudoUniversal = {
  intro:
    "Mostra o que a empresa tinha, o que devia, e qual era o patrimônio dos sócios no encerramento de cada exercício.",

  legendaAV:
    "A coluna **AV** mostra quanto cada linha representa do total. Exemplo: se o saldo em banco é 93,5%, de cada R$ 100 de patrimônio da empresa, R$ 93,50 estão no banco.",

  legendaAH:
    "As colunas Δ mostram quanto cada linha cresceu ou caiu de um ano para o outro. Verde é favorável; vermelho é desfavorável; cinza é neutro.",

  executiveCardsAV: {
    leitura: {
      titulo: "Leitura da análise",
      texto: "Saldo em banco representa 93,5% do ativo total em 2025 — subiu de 89,4% em 2023. Patrimônio líquido é 94,5% do passivo + PL, indicando que a empresa opera quase inteiramente com capital próprio. Passivo circulante (dívidas de curto prazo) caiu de 9,0% para 5,5% do total.",
    },
    acoes: {
      titulo: "Pontos de ação — Balanço",
      itens: [
        "Saldo em banco de 93,5% do ativo é atípico — verificar se está rendendo ou parado em conta corrente.",
        "Estoque caiu de 7,7% para 3,8% do ativo — confirmar se produção sob demanda ou problema de abastecimento.",
        "Ativo não-circulante de apenas 2,7% do ativo — mapear se há máquinas/imóveis fora do balanço.",
      ],
    },
  },
  executiveCardsAH: {
    leitura: {
      titulo: "Leitura da análise",
      texto: "Ativo total cresceu +104,2% entre 2023 e 2025 (R$ 760 mil → R$ 1,55 milhão). Saldo em banco cresceu +113,7% no período — praticamente todo o crescimento do ativo foi para caixa. Patrimônio líquido cresceu +111,9%, acompanhando o caixa. Lucros acumulados cresceram +113,9%.",
    },
    acoes: {
      titulo: "Pontos de ação — Balanço",
      itens: [
        "Saldo em banco +113,7% vs ativo +104,2% — todo lucro gerado está indo para o caixa, não para investimento.",
        "Máquinas e instalações +86,6% no período (R$ 22 mil → R$ 41 mil) — investimento baixo para o porte.",
        "Impostos a recolher +80,4% — crescendo no ritmo do faturamento, sem acúmulo irregular.",
      ],
    },
  },

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

// ---------------------------------------------------------------------
// Ao Contador — conteúdo universal
// ---------------------------------------------------------------------
export type AoContadorConteudoUniversal = {
  intro: string
  glossario: { termo: string; definicao: string }[]
}

export const conteudoAoContador: AoContadorConteudoUniversal = {
  intro:
    "Perguntas técnicas que só o contador responde — sobre como as contas foram registradas e como os impostos foram apurados. Lista pra o dono levar à próxima conversa com o escritório de contabilidade.",

  glossario: [
    {
      termo: "PEPS / Custo Médio",
      definicao:
        "Formas de avaliar o estoque. PEPS (Primeiro que Entra, Primeiro que Sai): o custo do estoque segue a ordem de chegada da matéria-prima. Custo Médio: a cada compra nova, tira a média do que está no estoque.",
    },
    {
      termo: "Mão-de-obra direta",
      definicao:
        "Salário de quem trabalha na produção — o operário da fábrica, por exemplo. Entra no custo de produção. Diferente da folha administrativa, que entra em Despesas.",
    },
    {
      termo: "Custos Indiretos de Fabricação",
      definicao:
        "Gastos da produção que não dá para ligar a um produto específico: energia da fábrica, aluguel do galpão, manutenção da máquina. Também fazem parte do custo de produção.",
    },
    {
      termo: "Depreciação Acumulada",
      definicao:
        "Conta que mostra quanto já foi depreciado dos ativos ao longo dos anos.",
    },
    {
      termo: "Incorporação de lucros ao Capital",
      definicao:
        "Transformar o lucro guardado em capital social da empresa. Aumenta o capital sem que os sócios precisem colocar dinheiro novo.",
    },
    {
      termo: "Anexo do Simples",
      definicao:
        "Categorias dentro do Simples Nacional. Anexo II é indústria. Anexo III é serviços em geral. Anexo IV é serviços específicos. Anexo V é outros serviços. Cada um tem alíquota diferente.",
    },
    {
      termo: "Alíquota efetiva",
      definicao:
        "Imposto que a empresa realmente paga, em porcentagem do faturamento. Diferente da alíquota de tabela.",
    },
    {
      termo: "Conciliação bancária",
      definicao:
        "Conferir se o saldo que está no livro da contabilidade bate com o saldo do extrato do banco.",
    },
    {
      termo: "Aplicações financeiras",
      definicao:
        "Investimentos que a empresa fez: CDB, tesouro direto, fundo, LCI. Diferente de 'Bancos conta movimento', que é dinheiro em conta corrente.",
    },
    {
      termo: "Operação entre empresas do grupo",
      definicao:
        "Quando uma empresa dos sócios vende ou compra de outra empresa dos mesmos sócios. Precisa ser lançada certinho para não distorcer o resultado de cada empresa.",
    },
    {
      termo: "Notas Explicativas",
      definicao:
        "Texto que acompanha o balanço e o DRE, explicando as contas, os métodos usados e eventos importantes do ano.",
    },
    {
      termo: "Livro Razão / Livro Diário",
      definicao:
        "Livros oficiais da contabilidade. O Razão mostra todos os lançamentos, conta por conta. O Diário mostra todos os lançamentos em ordem de data.",
    },
  ],
}


