// =============================================================
// CFOup · Parser do Cartão CNPJ (RFB)
// =============================================================
// Cartão CNPJ é o "COMPROVANTE DE INSCRIÇÃO E DE SITUAÇÃO CADASTRAL"
// emitido pela Receita Federal — formato PDF padrão definido pela
// Instrução Normativa RFB nº 1.863. Layout em TABELA: labels em caixa
// alta no topo de cada célula, valores logo abaixo no mesmo X.
//
// Em tabelas multi-coluna (ex: LOGRADOURO | NÚMERO | COMPLEMENTO),
// os 3 labels compartilham a mesma linha Y, e cada um tem seu valor
// no X correspondente. Por isso o parser usa matching espacial
// (mesmo X, Y logo abaixo), não agrupamento por linha.
//
// Este parser é genérico para o formato RFB. PDF Gregorutt é
// apenas fixture real de validação.
//
// Decisões CP#03.5:
//   - regime tributário NÃO vem do cartão; parser não retorna esse campo
//   - endereço retorna como string única concatenada (sem geocoding)
//   - atividades secundárias, natureza jurídica, matriz/filial,
//     situação especial: NÃO extraídos por ora
// =============================================================

// Legacy build do pdfjs (compatível com Node.js).
// Mesma versão que cfoup-core usa em utils/pdf.ts.
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
import * as path from "node:path"
import { pathToFileURL } from "node:url"

// =============================================================
// Worker setup para runtime Node/Next server.
// =============================================================
// pdfjs em ambiente Node tenta criar um "fake worker" que importa
// pdf.worker.mjs. Sem workerSrc explícito, o resolver interno do
// pdfjs tenta paths bundleados pelo Next/Turbopack que não existem
// no filesystem real, e o pdfjs falha com "Setting up fake worker".
//
// Não usamos `createRequire(import.meta.url).resolve()` porque o
// Turbopack INTERCEPTA isso e retorna um path virtual `[project]/...`
// que não é um caminho de filesystem real.
//
// Solução: montar o path absoluto via path.join(process.cwd(), ...)
// — string literal, não interceptada pelo bundler — e converter para
// file:// URL via pathToFileURL. No Windows, o loader ESM do Node
// rejeita paths absolutos sem scheme ("c:\..." vira protocol 'c:');
// pathToFileURL emite "file:///C:/dev/.../pdf.worker.mjs" que é o
// formato aceito tanto em Windows quanto em POSIX.
//
// Setado uma vez no module load — GlobalWorkerOptions é singleton.
try {
  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs",
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(pdfjs as any).GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href
} catch {
  // Se falhar (ambiente sem process.cwd, edge, etc.), deixa default.
}

/** Campos extraídos do Cartão CNPJ. Todos opcionais. */
export type CnpjCardFields = {
  /** Razão social (NOME EMPRESARIAL) */
  nomeEmpresarial?: string
  /** Nome fantasia (TÍTULO DO ESTABELECIMENTO) */
  nomeFantasia?: string
  /** CNPJ normalizado no formato 00.000.000/0001-00 */
  cnpj?: string
  /** Data de abertura em ISO (YYYY-MM-DD) */
  dataAbertura?: string
  /** Porte cadastral RFB: ME, EPP, DEMAIS */
  porte?: string
  /** Código CNAE principal (ex: "20.62-2-00") */
  cnaePrincipalCodigo?: string
  /** Descrição do CNAE principal */
  cnaePrincipalDescricao?: string
  /** Endereço concatenado (logradouro, número, bairro, município/UF, CEP) */
  enderecoCompleto?: string
  /** E-mail (ENDEREÇO ELETRÔNICO) */
  email?: string
  /** Telefone */
  telefone?: string
  /** Situação cadastral (ATIVA, BAIXADA, SUSPENSA, INAPTA, NULA) */
  situacaoCadastral?: string
  /** Data da situação cadastral em ISO (YYYY-MM-DD) */
  dataSituacaoCadastral?: string
}

type TextItem = {
  x: number
  y: number
  str: string
}

const EMPTY_VALUE_REGEX = /^\*+$/

/** Item de texto cru retornado pelo pdfjs com posição absoluta. */
type PdfTextItem = {
  str: string
  transform: number[]
}

/**
 * Extrai todos os items textuais individuais (str, x, y) de um PDF
 * nativo (com texto selecionável). Items vazios após trim são descartados.
 *
 * Preserva coordenadas para permitir matching espacial — fundamental
 * para o formato do Cartão CNPJ (tabelas multi-coluna).
 */
async function extractItems(pdfBytes: Uint8Array): Promise<TextItem[]> {
  const loadingTask = pdfjs.getDocument({
    data: pdfBytes,
    useSystemFonts: false,
  })
  const pdf = await loadingTask.promise
  const out: TextItem[] = []
  try {
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p)
      try {
        const tc = await page.getTextContent()
        for (const raw of tc.items as unknown as PdfTextItem[]) {
          if (typeof raw.str !== "string") continue
          const trimmed = raw.str.trim()
          if (!trimmed) continue
          out.push({
            x: raw.transform[4],
            y: raw.transform[5],
            str: trimmed,
          })
        }
      } finally {
        page.cleanup()
      }
    }
  } finally {
    await pdf.cleanup()
  }
  return out
}

/** Normaliza string para comparação (caixa baixa, espaços únicos, trim). */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim()
}

/**
 * Encontra o item de texto cujo conteúdo é EXATAMENTE o label
 * procurado (normalizado). Retorna undefined se não encontrar.
 *
 * Match exato evita confusão entre, por exemplo, "NÚMERO DE INSCRIÇÃO"
 * (campo do CNPJ) e "NÚMERO" (parte do endereço) — strings diferentes.
 */
function findLabel(items: TextItem[], labelText: string): TextItem | undefined {
  const target = norm(labelText)
  return items.find((it) => norm(it.str) === target)
}

/**
 * Encontra o valor logo abaixo de um label, com mesma coordenada X
 * (tolerância de poucos pixels). Cartão CNPJ tem cada par label/valor
 * alinhado verticalmente; valores compartilham X com seu label.
 *
 * Retorna undefined se:
 *   - não houver item abaixo do label dentro da janela Y
 *   - o item encontrado for placeholder de vazio ("********")
 *
 * Y no pdfjs cresce para CIMA (origem no canto inferior). Logo,
 * "abaixo" do label = item.y < label.y.
 */
function findValueBelow(
  items: TextItem[],
  label: TextItem,
  xTolerance = 5,
  yMaxDistance = 18,
): string | undefined {
  const candidates = items
    .filter(
      (it) =>
        it !== label &&
        it.y < label.y &&
        label.y - it.y <= yMaxDistance &&
        Math.abs(it.x - label.x) <= xTolerance,
    )
    .sort((a, b) => b.y - a.y) // mais próximo do label primeiro

  for (const c of candidates) {
    if (EMPTY_VALUE_REGEX.test(c.str)) return undefined
    return c.str
  }
  return undefined
}

/** Atalho: localiza o label pelo texto e retorna o valor abaixo. */
function valueFor(items: TextItem[], labelText: string): string | undefined {
  const label = findLabel(items, labelText)
  if (!label) return undefined
  return findValueBelow(items, label)
}

/** "01/08/2002" → "2002-08-01". undefined se inválido. */
function parseDateBR(s: string | undefined): string | undefined {
  if (!s) return undefined
  const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return undefined
  const [, dd, mm, yyyy] = m
  return `${yyyy}-${mm}-${dd}`
}

/** Normaliza CNPJ para XX.XXX.XXX/XXXX-XX. undefined se inválido. */
function normalizeCnpj(s: string | undefined): string | undefined {
  if (!s) return undefined
  const digits = s.replace(/\D/g, "")
  if (digits.length !== 14) return undefined
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}

/**
 * Splita "20.62-2-00 - Fabricação de produtos de limpeza" em
 * { codigo, descricao }. Aceita variações de separador.
 */
function parseCnaeCombinado(s: string | undefined): {
  codigo?: string
  descricao?: string
} {
  if (!s) return {}
  const m = s.match(/^(\d{2}[.,]\d{2}-\d-\d{2})\s*-\s*(.+)$/)
  if (m) return { codigo: m[1], descricao: m[2].trim() }
  const sep = s.indexOf(" - ")
  if (sep > 0) return { codigo: s.slice(0, sep).trim(), descricao: s.slice(sep + 3).trim() }
  return { codigo: s.trim() }
}

/**
 * Concatena os 7 componentes de endereço do cartão em uma string única.
 * Formato: "{logradouro}, {numero} - {complemento}, {bairro}, {municipio}/{uf}, CEP {cep}"
 * Omite partes ausentes/placeholder.
 */
function montarEnderecoCompleto(parts: {
  logradouro?: string
  numero?: string
  complemento?: string
  cep?: string
  bairro?: string
  municipio?: string
  uf?: string
}): string | undefined {
  const segs: string[] = []
  const linha1: string[] = []
  if (parts.logradouro) linha1.push(parts.logradouro)
  if (parts.numero) linha1.push(parts.numero)
  if (linha1.length) {
    let s = linha1.join(", ")
    if (parts.complemento) s += ` - ${parts.complemento}`
    segs.push(s)
  }
  if (parts.bairro) segs.push(parts.bairro)
  if (parts.municipio || parts.uf) {
    if (parts.municipio && parts.uf) segs.push(`${parts.municipio}/${parts.uf}`)
    else if (parts.municipio) segs.push(parts.municipio)
    else if (parts.uf) segs.push(parts.uf)
  }
  if (parts.cep) segs.push(`CEP ${parts.cep}`)
  return segs.length ? segs.join(", ") : undefined
}

/**
 * Parser principal. Recebe bytes do PDF do Cartão CNPJ e retorna os
 * campos canônicos. Não lança em PDF mal-formado — retorna shape vazio.
 *
 * Cada campo é independente; falha em um não impede os outros.
 */
export async function extractCnpjCardFields(
  pdfBytes: Uint8Array,
): Promise<CnpjCardFields> {
  let items: TextItem[]
  try {
    items = await extractItems(pdfBytes)
  } catch {
    return {}
  }

  const result: CnpjCardFields = {}

  // CNPJ
  const cnpjNorm = normalizeCnpj(valueFor(items, "NÚMERO DE INSCRIÇÃO"))
  if (cnpjNorm) result.cnpj = cnpjNorm

  // Data de abertura
  const dataAb = parseDateBR(valueFor(items, "DATA DE ABERTURA"))
  if (dataAb) result.dataAbertura = dataAb

  // Razão social
  const nomeEmp = valueFor(items, "NOME EMPRESARIAL")
  if (nomeEmp) result.nomeEmpresarial = nomeEmp

  // Nome fantasia
  const fantasia = valueFor(items, "TÍTULO DO ESTABELECIMENTO (NOME DE FANTASIA)")
  if (fantasia) result.nomeFantasia = fantasia

  // Porte (ME/EPP/DEMAIS)
  const porte = valueFor(items, "PORTE")
  if (porte) result.porte = porte.toUpperCase()

  // CNAE principal (código + descrição combinados em uma string)
  const cnae = parseCnaeCombinado(
    valueFor(items, "CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL"),
  )
  if (cnae.codigo) result.cnaePrincipalCodigo = cnae.codigo
  if (cnae.descricao) result.cnaePrincipalDescricao = cnae.descricao

  // Endereço (7 componentes em 2 linhas de tabela)
  const endereco = montarEnderecoCompleto({
    logradouro: valueFor(items, "LOGRADOURO"),
    numero: valueFor(items, "NÚMERO"),
    complemento: valueFor(items, "COMPLEMENTO"),
    cep: valueFor(items, "CEP"),
    bairro: valueFor(items, "BAIRRO/DISTRITO"),
    municipio: valueFor(items, "MUNICÍPIO"),
    uf: valueFor(items, "UF"),
  })
  if (endereco) result.enderecoCompleto = endereco

  // E-mail
  const email = valueFor(items, "ENDEREÇO ELETRÔNICO")
  if (email) result.email = email.toLowerCase()

  // Telefone
  const tel = valueFor(items, "TELEFONE")
  if (tel) result.telefone = tel

  // Situação cadastral
  const situacao = valueFor(items, "SITUAÇÃO CADASTRAL")
  if (situacao) result.situacaoCadastral = situacao.toUpperCase()

  // Data da situação cadastral
  const dataSit = parseDateBR(valueFor(items, "DATA DA SITUAÇÃO CADASTRAL"))
  if (dataSit) result.dataSituacaoCadastral = dataSit

  return result
}
