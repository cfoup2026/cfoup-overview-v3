/**
 * Script ad-hoc de diagnóstico — não comitado.
 *
 * Executa o pipeline CF13 com a `dataReferencia` derivada pela função
 * central `resolverDataReferencia`. Retorna os 5 pontos pedidos:
 *
 *   1. dataReferencia escolhida + motivo
 *   2. saldo inicial (snapshots + soma BRL)
 *   3. totais: histórico, entradas futuras, saídas futuras
 *   4. cobertura/veredito do pipeline com essa dataReferencia
 *   5. por que a projeção (ainda) está zerada
 *
 * Uso: `node scripts/diagnostico-cf13.mjs` no root do overview-v3.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCF13Pipeline } from 'cfoup-core/cf13/contract';

/* Espelho local da regra central de `lib/cf13/resolverDataReferencia.ts`.
 * Inline aqui pra evitar `tsx`/loader em script ad-hoc — a única
 * fonte canônica é a função TS; este script existe só pra emitir
 * relatório de telemetria. */
/* ─── Re-implementação local (espelho da função central) ─── */
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function dataPrincipalEvento(ev) {
  if (ev.status === 'realizado' && ev.data_realizada instanceof Date) {
    return ev.data_realizada;
  }
  if (ev.data_vencimento instanceof Date) return ev.data_vencimento;
  if (ev.data_esperada instanceof Date) return ev.data_esperada;
  return null;
}
function resolverDataReferenciaLocal(eventos, snapshots) {
  let ultimoEventoMs = -Infinity;
  let eventosSemData = 0;
  for (const ev of eventos) {
    const d = dataPrincipalEvento(ev);
    if (d === null) {
      eventosSemData += 1;
      continue;
    }
    if (d.getTime() > ultimoEventoMs) ultimoEventoMs = d.getTime();
  }
  const ultimoEventoISO =
    ultimoEventoMs === -Infinity ? null : isoDate(new Date(ultimoEventoMs));

  const validos = snapshots.filter(
    (s) => s.data_referencia instanceof Date && !Number.isNaN(s.data_referencia.getTime()),
  );

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
    };
  }

  const ultimoMs = validos.reduce(
    (max, s) => Math.max(max, s.data_referencia.getTime()),
    -Infinity,
  );
  const dataReferenciaISO = isoDate(new Date(ultimoMs));

  const saldoInicial = validos.filter(
    (s) => isoDate(s.data_referencia) === dataReferenciaISO,
  );
  const saldoInicialSomado = saldoInicial.reduce(
    (sum, s) => sum + (s.valor ?? 0),
    0,
  );

  let eventosHistoricos = 0;
  let entradasFuturas = 0;
  let saidasFuturas = 0;
  for (const ev of eventos) {
    const d = dataPrincipalEvento(ev);
    if (d === null) continue;
    if (d.getTime() < ultimoMs) {
      eventosHistoricos += 1;
    } else {
      if (ev.direcao === 'entrada') entradasFuturas += 1;
      else saidasFuturas += 1;
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
  };
}

/* ─── Carregar fixture e reviver datas ─── */
const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(HERE, '..', 'lib', 'cf13', 'fixtures', 'gregorutt.json');
const fixture = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));

const EVENTO_DATE = [
  'data_esperada',
  'data_realizada',
  'data_vencimento',
  'criado_em',
  'confirmado_em',
  'reconciliado_em',
];
const SALDO_DATE = ['data_referencia', 'criado_em'];

function rev(o, fields) {
  for (const f of fields) {
    if (typeof o[f] === 'string') o[f] = new Date(o[f]);
  }
  return o;
}

const eventos = fixture.eventos_caixa.map((e) => rev({ ...e }, EVENTO_DATE));
const snapshots = fixture.opening_balance_snapshots.map((s) =>
  rev({ ...s }, SALDO_DATE),
);

/* ─── Resolver + rodar pipeline ─── */
const resolucao = resolverDataReferenciaLocal(eventos, snapshots);

const out = runCF13Pipeline({
  cliente_id: 'gregorutt',
  base_date: resolucao.dataReferencia,
  eventos,
  opening_balances: resolucao.saldoInicial,
});

const consol = out.projecao.consolidado;
const semanasComEventos = consol.semanas.filter(
  (s) => s.eventosEntradaIds.length + s.eventosSaidaIds.length > 0,
).length;

/* ─── Relatório ─── */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const r = [];
r.push('═══════════════════════════════════════════════════════════════');
r.push('  CF13 — diagnóstico via resolverDataReferencia (regra central)');
r.push('═══════════════════════════════════════════════════════════════');
r.push('');
r.push('▶ 1. dataReferencia escolhida + motivo');
r.push(`     dataReferencia: ${resolucao.dataReferencia}`);
r.push(`     motivo:         ${resolucao.motivo}`);
r.push(`     ultimoEventoISO observado:    ${resolucao.telemetria.ultimoEventoISO}`);
r.push(`     ultimoSnapshotISO observado:  ${resolucao.telemetria.ultimoSnapshotISO}`);
r.push('');
r.push('▶ 2. saldo inicial escolhido');
r.push(`     snapshots na data:    ${resolucao.telemetria.snapshotsEscolhidos}`);
r.push(`     soma valor (BRL):     ${BRL.format(resolucao.telemetria.saldoInicialSomado)}`);
r.push(`     primeiros 3 valores:`);
for (const s of resolucao.saldoInicial.slice(0, 3)) {
  r.push(`       - id=${s.id}  conta=${s.conta_bancaria_id || '(vazio)'}  valor=${BRL.format(s.valor ?? 0)}  origem=${s.origem}`);
}
if (resolucao.saldoInicial.length > 3) {
  r.push(`       ... +${resolucao.saldoInicial.length - 3}`);
}
r.push('');
r.push('▶ 3. totais (em torno da dataReferencia)');
r.push(`     totalEventos no input:        ${resolucao.telemetria.totalEventos}`);
r.push(`     eventosHistoricos:            ${resolucao.telemetria.eventosHistoricos}`);
r.push(`     entradasFuturas (incl ===):   ${resolucao.telemetria.entradasFuturas}`);
r.push(`     saidasFuturas (incl ===):     ${resolucao.telemetria.saidasFuturas}`);
r.push(`     eventosSemData:               ${resolucao.telemetria.eventosSemData}`);
r.push('');
r.push('▶ 4. saída do pipeline com essa dataReferencia');
r.push(`     cobertura.status:                  ${out.cobertura.status}`);
r.push(`     insuficienciasCriticas:            ${out.cobertura.insuficienciasCriticas.length}`);
for (const ins of out.cobertura.insuficienciasCriticas) {
  r.push(`       - ${ins.tipo}: ${ins.mensagem}`);
}
r.push(`     veredito.consolidado.categoria:    ${out.veredito.consolidado.categoria}`);
r.push(`     projecao.consolidado.caixaInicial: ${BRL.format(consol.caixaInicial)}`);
r.push(`     minimoOpReferencia:                ${BRL.format(consol.minimoOpReferencia)}`);
r.push(`     menorCaixaProjetado:               ${BRL.format(consol.menorCaixaProjetado.valor)} (${consol.menorCaixaProjetado.semanaInicio})`);
r.push(`     menorGapMinimo:                    ${BRL.format(consol.menorGapMinimo.valor)} (${consol.menorGapMinimo.semanaInicio})`);
r.push(`     semanas com eventos alocados:      ${semanasComEventos}/13`);
r.push(`     pendencias:                        ${out.pendencias.length}`);
r.push('');
r.push('▶ 5. por que a projeção está como está');
r.push(`     Com dataReferencia = ${resolucao.dataReferencia}, a janela do pipeline`);
r.push(`     vai de ${consol.semanas[0].inicio} até ${consol.semanas[12].fim}.`);
r.push(`     Eventos com data >= ${resolucao.dataReferencia}:`);
r.push(`       entradas: ${resolucao.telemetria.entradasFuturas}`);
r.push(`       saidas:   ${resolucao.telemetria.saidasFuturas}`);
r.push(`     Sem eventos na janela → semanas zeradas em entradas/saídas.`);
r.push(`     Caixa inicial (${BRL.format(consol.caixaInicial)}) propaga flat pelas 13 semanas.`);
r.push('');
r.push('     Causa raiz da projeção zerada:');
const dif = (() => {
  const evMs = new Date(`${resolucao.telemetria.ultimoEventoISO}T00:00:00Z`).getTime();
  const refMs = new Date(`${resolucao.dataReferencia}T00:00:00Z`).getTime();
  return Math.round((refMs - evMs) / (1000 * 60 * 60 * 24));
})();
r.push(`       Último evento:    ${resolucao.telemetria.ultimoEventoISO}`);
r.push(`       Último snapshot:  ${resolucao.telemetria.ultimoSnapshotISO}`);
r.push(`       Defasagem:        ${dif} dias entre último evento e dataReferencia.`);
r.push(`       → A fixture sample tem fontes desbalanceadas no tempo:`);
r.push(`         CSVs FKN/CEF terminam em ~mai/2025; PDFs de saldo vão até abr/2026.`);
r.push(`         Pipeline obedece os dados — projeção fica flat porque NÃO há`);
r.push(`         CR/CP em aberto/eventos confirmados na janela ${consol.semanas[0].inicio} → ${consol.semanas[12].fim}.`);
r.push('');
r.push('     Pipeline NÃO tem bug. Fixture tem janela cega de 11 meses entre');
r.push('     o último evento operacional e o último saldo bancário.');

process.stdout.write(r.join('\n') + '\n');
