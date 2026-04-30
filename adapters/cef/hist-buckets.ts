import type { BankHistBucket } from "../../parsers/types"

/**
 * Mapeia (histCode, direction) → BankHistBucket.
 *
 * CRÍTICO: a família COB... muda de bucket conforme direção.
 *   COB... + C = BANK_COLLECTION_IN  (cobrança recebida)
 *   COB... + D = FEE                 (tarifa de cobrança)
 * Mapear COB... cegamente como BOLETO_OUT inverteria receita em despesa.
 */

const COB_FAMILY = new Set([
  "COB COMPE",
  "COB BX 063",
  "COB BX 064",
  "COB INTERN",
  "COB LOT DH",
  "COB LOTERI",
  "COB ALT055",
  "COB EMI047",
  "COB AGN DH",
  "COB AGENC",
  "COBPROT066",
  "COBPROT067",
  "COBPROT068",
])

export function bucketCefHistory(
  histCode: string,
  direction: "C" | "D",
): BankHistBucket {
  if (COB_FAMILY.has(histCode)) {
    return direction === "C" ? "BANK_COLLECTION_IN" : "FEE"
  }
  if (histCode === "PAG BOLETO") return "BOLETO_OUT"

  if (
    histCode === "CRED PIX" ||
    histCode === "CRE PIX CH" ||
    histCode === "DEVREC PIX"
  ) {
    return "PIX_IN"
  }
  if (
    histCode === "DEB PIX CH" ||
    histCode === "ENVIO PIX" ||
    histCode === "DEB PIX IM"
  ) {
    return "PIX_OUT"
  }

  if (histCode === "CRED TED" || histCode === "CRED TEV") return "TED_IN"
  if (histCode === "ENVIO TEV") return "TED_OUT"

  if (histCode.startsWith("REDE ")) return "CARD_ACQUIRER_IN"

  if (histCode === "CHEQ COMP" || histCode === "CHEQ COMPE") return "CHECK_OUT"
  if (
    histCode === "DEV CH M48" ||
    histCode === "CH DEV M35" ||
    histCode === "CH COMP RE" ||
    histCode === "CH COMP RT" ||
    histCode === "DEP CH AG" ||
    histCode === "BQ DEP CH" ||
    histCode === "DSB CH DEP"
  ) {
    return "CHECK_IN"
  }

  if (histCode === "ES FOL PAG") return "PAYROLL_OUT"

  if (histCode === "SAQUE B24H" || histCode === "SAQUE ATM") return "WITHDRAW"

  if (
    histCode === "DEB TARIFA" ||
    histCode === "TAR BCO24H" ||
    histCode === "DB T CESTA"
  ) {
    return "FEE"
  }

  if (histCode === "COMPRA") return "PURCHASE"
  if (histCode === "EST COMPRA") return direction === "C" ? "OTHER" : "PURCHASE"

  if (
    histCode === "PG ORG GOV" ||
    histCode === "PG PREFEIT" ||
    histCode === "PAG IPVA" ||
    histCode === "PAG MULTAS" ||
    histCode === "LICEN VEIC"
  ) {
    return "GOV_OUT"
  }

  if (
    histCode === "PAG AGUA" ||
    histCode === "PAG FONE" ||
    histCode === "PG LUZ/GAS"
  ) {
    return "UTILITY_OUT"
  }

  if (histCode === "SEGURADORA") return "INSURANCE_OUT"
  if (histCode === "PREST EMP" || histCode === "DB PPG IBC") return "LOAN_OUT"

  if (histCode === "APLIC FUND" || histCode === "RESG AUT") return "INVESTMENT"

  return "OTHER"
}
