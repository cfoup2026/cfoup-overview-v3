import type { EventoCaixa, OpeningBalanceSnapshot } from 'cfoup-core'

/**
 * Função central — resolve `dataReferencia` + saldo inicial a partir
 * dos inputs brutos do cliente. **Única fonte de verdade** dessa regra.
 *
 * `dataReferencia` é o início da projeção CF13. Conceito v0:
 *
 *   "última informação confiável dos dados financeiros do cliente"
 *
 *   Em produção conectada e atualizada, isso converge pra "hoje
 *   operacional" porque snapshots novos chegam diariamente. Em
 *   MVP/manual/mock, congela na última data importada.
 *
 *   O saldo bancário é o ground truth do caixa atual:
 *    - Tudo anterior à `dataReferencia` é histórico (calibra
 *      recorrência, confiança, padrões).
 *    - Tudo posterior é projeção (CR/CP em aberto + estimados gerados
 *      pelo Stage 2 do core).
 *
 * Algoritmo determinístico:
 *
 *   1. Se houver `OpeningBalanceSnapshot[]`:
 *      → `dataReferencia` = `max(snapshot.data_referencia)` (ISO YYYY-MM-DD).
 *      → `saldoInicial` = todos os snapshots cuja `data_referencia`
 *        casa com a data escolhida (no caso multi-conta).
 *      → motivo: `'derivado_do_ultimo_snapshot'`.
 *
 *   2. Se snapshots vazios:
 *      → motivo: `'sem_snapshots'`. Caller decide se trata como
 *        "Estado 1 — sem dados conectados" ou propaga erro.
 *      → `dataReferencia` = `null`, `saldoInicial` = `[]`.
 *
 * Não há fallback pra "última data de evento". Spec de produto v0:
 * sem snapshot, sem `dataReferencia` confiável.
 *
 * Hardcode de data (`'2026-04-20'`, etc.) **proibido** em código de
 * produto. Datas literais só em fixtures e testes.
 */

/* ─────────── Tipos públicos ─────────── */

export type MotivoResolucao =
  | 'derivado_do_ultimo_snapshot'
  | 'sem_snapshots'

export type TelemetriaResolucao = {
  /** Total de eventos no input. */
  totalEventos: number
  /** Última data observada em qualquer evento. `null` se não há. */
  ultimoEventoISO: string | null
  /** Total de snapshots no input. */
  totalSnapshots: number
  /** Última `data_referencia` entre os snapshots. `null` se não há. */
  ultimoSnapshotISO: string | null
  /** Quantos snapshots estão na `dataReferencia` escolhida. */
  snapshotsEscolhidos: number
  /** Soma dos `valor` dos snapshots escolhidos (BRL). */
  saldoInicialSomado: number
  /** Eventos com `data principal` < `dataReferencia` (todos os status). */
  eventosHistoricos: number
  /** Eventos com `data principal` >= `dataReferencia`, direção entrada. */
  entradasFuturas: number
  /** Eventos com `data principal` >= `dataReferencia`, direção saída. */
  saidasFuturas: number
  /** Eventos sem data calculável (caso degenerado). */
  eventosSemData: number
}

export type ResolucaoDataReferencia = {
  /** ISO `YYYY-MM-DD`. `null` quando `motivo === 'sem_snapshots'`. */
  dataReferencia: string | null
  /** Snapshots que viram input de `opening_balances` no pipeline.
   *  Mais de 1 quando há múltiplas contas no mesmo dia. */
  saldoInicial: OpeningBalanceSnapshot[]
  motivo: MotivoResolucao
  telemetria: TelemetriaResolucao
}

/* ─────────── Helpers internos ─────────── */

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * Data principal de um evento, na mesma ordem que o pipeline interno
 * usa pra alocação:
 *  - `realizado` → `data_realizada`
 *  - `confirmado`/`estimado`/`pendente` → `data_vencimento` ?? `data_esperada`
 *  - sempre fallback: `data_esperada`
 *
 * Retorna `null` se nenhum candidato é `Date` válido (caso
 * degenerado — Stage 1 do core garante data_esperada).
 */
function dataPrincipalEvento(ev: EventoCaixa): Date | null {
  if (ev.status === 'realizado' && ev.data_realizada instanceof Date) {
    return ev.data_realizada
  }
  if (ev.data_vencimento instanceof Date) return ev.data_vencimento
  if (ev.data_esperada instanceof Date) return ev.data_esperada
  return null
}

/* ─────────── Função principal ─────────── */

export function resolverDataReferencia(
  eventos: readonly EventoCaixa[],
  snapshots: readonly OpeningBalanceSnapshot[],
): ResolucaoDataReferencia {
  /* (1) Última data observada em eventos — só telemetria. */
  let ultimoEventoMs = -Infinity
  let eventosSemData = 0
  for (const ev of eventos) {
    const d = dataPrincipalEvento(ev)
    if (d === null) {
      eventosSemData += 1
      continue
    }
    if (d.getTime() > ultimoEventoMs) ultimoEventoMs = d.getTime()
  }
  const ultimoEventoISO =
    ultimoEventoMs === -Infinity ? null : isoDate(new Date(ultimoEventoMs))

  /* (2) Snapshots com data_referencia válida. */
  const validos = snapshots.filter(
    (s) => s.data_referencia instanceof Date && !Number.isNaN(s.data_referencia.getTime()),
  )

  /* (3) Caso vazio: sem dados conectados. */
  if (validos.length === 0) {
    return {
      dataReferencia: null,
      saldoInicial: [],
      motivo: 'sem_snapshots',
      telemetria: {
        totalEventos: eventos.length,
        ultimoEventoISO,
        totalSnapshots: snapshots.length,
        ultimoSnapshotISO: null,
        snapshotsEscolhidos: 0,
        saldoInicialSomado: 0,
        eventosHistoricos: 0,
        entradasFuturas: 0,
        saidasFuturas: 0,
        eventosSemData,
      },
    }
  }

  /* (4) max(data_referencia). */
  const ultimoMs = validos.reduce(
    (max, s) => Math.max(max, s.data_referencia.getTime()),
    -Infinity,
  )
  const dataReferenciaISO = isoDate(new Date(ultimoMs))

  /* (5) Saldos da data escolhida (multi-conta no mesmo dia). */
  const saldoInicial = validos.filter(
    (s) => isoDate(s.data_referencia) === dataReferenciaISO,
  )
  const saldoInicialSomado = saldoInicial.reduce(
    (sum, s) => sum + (s.valor ?? 0),
    0,
  )

  /* (6) Telemetria temporal vs `dataReferencia`. */
  let eventosHistoricos = 0
  let entradasFuturas = 0
  let saidasFuturas = 0
  for (const ev of eventos) {
    const d = dataPrincipalEvento(ev)
    if (d === null) continue
    if (d.getTime() < ultimoMs) {
      eventosHistoricos += 1
    } else {
      if (ev.direcao === 'entrada') entradasFuturas += 1
      else saidasFuturas += 1
    }
  }

  return {
    dataReferencia: dataReferenciaISO,
    saldoInicial,
    motivo: 'derivado_do_ultimo_snapshot',
    telemetria: {
      totalEventos: eventos.length,
      ultimoEventoISO,
      totalSnapshots: snapshots.length,
      ultimoSnapshotISO: dataReferenciaISO,
      snapshotsEscolhidos: saldoInicial.length,
      saldoInicialSomado,
      eventosHistoricos,
      entradasFuturas,
      saidasFuturas,
      eventosSemData,
    },
  }
}
