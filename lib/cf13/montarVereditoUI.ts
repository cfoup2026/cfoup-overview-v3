import type { CF13Output } from 'cfoup-core/cf13/contract'

/**
 * Escopo de leitura da UI — reusado pelos demais montadores.
 * `consolidado` agrega todas as unidades; `unidade` filtra por LE.
 */
export type Escopo =
  | { tipo: 'consolidado' }
  | { tipo: 'unidade'; legalEntityId: string }

/**
 * Veredito traduzido pra termos da UI (CF13 UI Contract Item 5 §2).
 *
 * `categoria`:
 *  - `sem_dados`: cliente sem ingestão (decisão fora deste módulo).
 *  - `dados_insuficientes`: cobertura insuficiente — bloqueia veredito.
 *  - demais: derivados de `cf13.veredito.<escopo>.categoria`.
 *
 * `severidade`: mapa de cores/intensidades para tokens de UI.
 */
export type VereditoUI = {
  categoria:
    | 'sem_dados'
    | 'dados_insuficientes'
    | 'limpo'
    | 'atencao'
    | 'alerta'
    | 'critico'
  titulo: string
  mensagem: string
  severidade: 'neutra' | 'positiva' | 'atencao' | 'aviso_forte' | 'negativa'
  semanaCritica?: string
  valorCritico?: number
  unidadeCritica?: string
  acaoSugerida?: { rotulo: string; tipo: string }
}

/**
 * TODO (Passo 7): implementar conforme CF13 UI Contract Item 5 §2.
 * Mapear `cf13.veredito.<escopo>.categoria` → `VereditoUI.categoria`,
 * derivar `severidade` por categoria, montar `titulo`/`mensagem`
 * usando `cf13.veredito.<escopo>.texto` + `detalhe` estruturado.
 */
export function montarVereditoUI(
  _cf13: CF13Output,
  _escopo: Escopo = { tipo: 'consolidado' },
): VereditoUI {
  throw new Error(
    'montarVereditoUI: not implemented (CF13 UI Contract Item 5)',
  )
}
