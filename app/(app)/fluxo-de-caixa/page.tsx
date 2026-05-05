/**
 * CF13 — tela `/fluxo-de-caixa`.
 *
 * Server Component. Carrega `CF13Output` via `getCF13`, monta as 5
 * estruturas de apresentação (`veredito`, `cards`, `grade`,
 * `pendencias`, `semanasRotulos`) e delega o render pra
 * `FluxoDeCaixaScreen`.
 *
 * Sem JSON cru. Sem lógica de cálculo aqui — toda apresentação é
 * derivação direta dos campos do contrato.
 *
 * V0: cliente fixo `'gregorutt'` + baseDate fixa `'2026-04-20'`.
 * URL params + Server Action de recálculo entram em passo posterior.
 */
import { FluxoDeCaixaScreen } from "@/components/FluxoDeCaixaScreen"
import { getCF13 } from "@/lib/cf13/getCF13"
import { montarCardsCF13 } from "@/lib/cf13/montarCardsCF13"
import { montarGradeCF13 } from "@/lib/cf13/montarGradeCF13"
import { montarPainelPendencias } from "@/lib/cf13/montarPainelPendencias"
import { montarSemanasRotulos } from "@/lib/cf13/montarSemanasRotulos"
import { montarVereditoUI } from "@/lib/cf13/montarVereditoUI"

export default async function FluxoDeCaixaRoute() {
  const cf13 = await getCF13("gregorutt", "2026-04-20")

  const veredito = montarVereditoUI(cf13)
  const cards = montarCardsCF13(cf13)
  const grade = montarGradeCF13(cf13)
  const pendencias = montarPainelPendencias(cf13)
  const semanasRotulos = montarSemanasRotulos(cf13)

  return (
    <FluxoDeCaixaScreen
      veredito={veredito}
      cards={cards}
      grade={grade}
      pendencias={pendencias}
      semanasRotulos={semanasRotulos}
    />
  )
}
