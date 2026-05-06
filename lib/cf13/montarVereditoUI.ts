import type { CF13Output, VereditoCategoria } from 'cfoup-core/cf13/contract'

/**
 * Escopo de leitura da UI — reusado pelos demais montadores.
 * `consolidado` agrega todas as unidades; `unidade` filtra por LE.
 */
export type Escopo =
  | { tipo: 'consolidado' }
  | { tipo: 'unidade'; legalEntityId: string }

/**
 * Severidade da UI — tokens neutros (sem cor literal).
 * O `FluxoDeCaixaScreen` traduz pra Tailwind/CSS no render.
 */
export type SeveridadeUI =
  | 'neutra'
  | 'positiva'
  | 'atencao'
  | 'aviso_forte'
  | 'negativa'

export type CategoriaUI =
  | 'sem_dados'
  | 'dados_insuficientes'
  | 'limpo'
  | 'atencao'
  | 'alerta'
  | 'critico'

export type VereditoUI = {
  categoria: CategoriaUI
  titulo: string
  mensagem: string
  severidade: SeveridadeUI
  semanaCritica?: string
  valorCritico?: number
  unidadeCritica?: string
  acaoSugerida?: { rotulo: string; tipo: string }
}

/* ─────────── Tabelas determinísticas ─────────── */

/** Categoria do core → categoria UI (1:1, idêntico no v0). */
const CATEGORIA_BY_CORE: Readonly<Record<VereditoCategoria, CategoriaUI>> = {
  dados_insuficientes: 'dados_insuficientes',
  critico: 'critico',
  alerta: 'alerta',
  atencao: 'atencao',
  limpo: 'limpo',
}

/** Mapping UI: categoria → severidade visual. */
const SEVERIDADE_BY_CATEGORIA: Readonly<Record<CategoriaUI, SeveridadeUI>> = {
  sem_dados: 'neutra',
  dados_insuficientes: 'neutra',
  limpo: 'positiva',
  atencao: 'atencao',
  alerta: 'aviso_forte',
  critico: 'negativa',
}

/** Título PT-BR por categoria — texto curto pro banner. */
const TITULO_BY_CATEGORIA: Readonly<Record<CategoriaUI, string>> = {
  sem_dados: 'Sem dados conectados',
  dados_insuficientes: 'Dados insuficientes',
  limpo: 'Caixa saudável',
  atencao: 'Atenção',
  alerta: 'Alerta',
  critico: 'Crítico',
}

/* ─────────── Função principal ─────────── */

/**
 * Lê `cf13.veredito.<escopo>` e devolve o objeto pronto pro banner do
 * `FluxoDeCaixaScreen`. Mapeamento UI puro — sem regra financeira.
 *
 * `mensagem` vem do `texto` já renderizado pelo Stage 7 do core
 * (templates determinísticos §6.2, formatação BR sem `Intl`).
 */
export function montarVereditoUI(
  cf13: CF13Output,
  escopo: Escopo = { tipo: 'consolidado' },
): VereditoUI {
  const fonte =
    escopo.tipo === 'consolidado'
      ? cf13.veredito.consolidado
      : cf13.veredito.unidades.find(
          (u) => u.legalEntityId === escopo.legalEntityId,
        )

  if (fonte === undefined) {
    return {
      categoria: 'sem_dados',
      titulo: TITULO_BY_CATEGORIA.sem_dados,
      mensagem: 'Cliente sem ingestão de dados ainda.',
      severidade: 'neutra',
    }
  }

  const categoria: CategoriaUI = CATEGORIA_BY_CORE[fonte.categoria]
  const severidade = SEVERIDADE_BY_CATEGORIA[categoria]

  const ui: VereditoUI = {
    categoria,
    titulo: TITULO_BY_CATEGORIA[categoria],
    mensagem: fonte.texto,
    severidade,
  }

  /* Detalhes opcionais — derivados do `detalhe` estruturado do core. */
  const det = fonte.detalhe
  if (det.tipo === 'critico') {
    ui.semanaCritica = det.semanaData
    ui.valorCritico = det.faltante
  } else if (det.tipo === 'alerta') {
    ui.valorCritico = det.minimoOperacional - det.saldoProjetado
  }

  return ui
}
