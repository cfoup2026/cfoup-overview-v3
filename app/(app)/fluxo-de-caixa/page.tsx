/**
 * CF13 — wire-up v0 (Passo 5 do CF13 UI Contract).
 *
 * Server Component que chama `getCF13` e renderiza `CF13Output` cru
 * estruturado em 5 blocos. Sem layout. Sem componentes visuais
 * elaborados — só validação fim-a-fim de que o pipeline atravessa
 * `cfoup-core` → adapter de contrato → fixture → tela.
 *
 * Layout v0 (Passo 7) substitui o JSON cru por componentes que
 * consomem `montarVereditoUI`/`montarGradeCF13`/`montarCardsCF13`/
 * `montarPainelPendencias` (atualmente stubs com `throw`).
 *
 * V0: cliente fixo `'gregorutt'` + baseDate fixa `'2026-04-20'`.
 * Suficiente pro smoke fim-a-fim. Server Action de recálculo manual
 * + URL params entram no Passo 7.
 */
import { getCF13 } from "@/lib/cf13/getCF13"

export default async function FluxoDeCaixaRoute() {
  const cf13 = await getCF13("gregorutt", "2026-04-20")

  return (
    <main style={{ padding: 24, fontFamily: "monospace", fontSize: 12 }}>
      <h1
        style={{ fontFamily: "sans-serif", fontSize: 18, marginBottom: 16 }}
      >
        CF13 — JSON cru (v0 wire-up)
      </h1>

      <section style={{ marginBottom: 16 }}>
        <strong>meta:</strong>
        <pre>{JSON.stringify(cf13.meta, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: 16 }}>
        <strong>veredito (consolidado):</strong>
        <pre>{JSON.stringify(cf13.veredito.consolidado, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: 16 }}>
        <strong>cobertura:</strong>
        <pre>{JSON.stringify(cf13.cobertura, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: 16 }}>
        <strong>projecao.consolidado.semanas (13):</strong>
        <pre>
          {JSON.stringify(cf13.projecao.consolidado.semanas, null, 2)}
        </pre>
      </section>

      <section style={{ marginBottom: 16 }}>
        <strong>pendencias ({cf13.pendencias.length}):</strong>
        <pre>{JSON.stringify(cf13.pendencias, null, 2)}</pre>
      </section>
    </main>
  )
}
