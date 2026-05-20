// =============================================================
// CFOup · Modal de importação de arquivo (/conexoes · CP#04)
// =============================================================
// Modal aberto pelo card "Importar arquivo". Single-file. Hoje aceita
// só extratos CEF (.txt/.pdf) — o server detecta o formato pelo
// conteúdo do arquivo e devolve uma mensagem semântica se não casar.
// Outros formatos virão.
//
// Componente puro de modal: recebe `onClose`; o card pai controla a
// montagem via `{openModal === "upload" && <FileImportModal …/>}`.
// =============================================================
"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  XCircle,
} from "lucide-react"

import { importCefAction } from "@/lib/cef/import-action"
import type {
  CefAccountResult,
  CefFileResult,
  ImportCefState,
} from "@/lib/cef/import-core"
import { useActiveCompany } from "@/lib/hooks/use-active-company"
import { createClient } from "@/lib/supabase/client"

type ContaOption = { id: string; accountNumber: string }

function fmtBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function FileImportModal({ onClose }: { onClose: () => void }) {
  const company = useActiveCompany()
  const [contas, setContas] = useState<ContaOption[]>([])
  const [accountId, setAccountId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  // Incrementado a cada reset — força a remontagem do <input type="file">,
  // que não é um campo controlado e mantém o valor anterior.
  const [resetKey, setResetKey] = useState(0)

  const [state, dispatch, pending] = useActionState<
    ImportCefState | undefined,
    FormData
  >(importCefAction, undefined)

  // Carrega as contas CEF da empresa no mount — alimenta o dropdown e
  // reflete contas criadas por uma importação anterior. O componente
  // só monta quando o modal é aberto.
  useEffect(() => {
    if (company.empty || company.id === "") return
    let cancelled = false
    createClient()
      .from("bank_accounts")
      .select("id, account_number")
      .eq("company_id", company.id)
      .eq("bank", "CEF")
      .then(({ data }) => {
        if (cancelled) return
        setContas(
          (data ?? []).map((r) => ({
            id: r.id,
            accountNumber: r.account_number,
          })),
        )
      })
    return () => {
      cancelled = true
    }
  }, [company.id, company.empty])

  function submit() {
    if (file === null) return
    const fd = new FormData()
    fd.append("files", file)
    if (accountId !== "") fd.append("bankAccountId", accountId)
    setSubmitted(true)
    // dispatch de useActionState precisa rodar dentro de startTransition.
    startTransition(() => dispatch(fd))
  }

  function importarOutro() {
    setSubmitted(false)
    setFile(null)
    setResetKey((k) => k + 1)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-lg md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: "var(--brand-navy)" }}
            >
              Importar arquivo
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Por enquanto, extrato bancário da Caixa Econômica Federal
              (.txt ou .pdf). Outros formatos virão.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-5">
          {!submitted && (
            <>
              {contas.length > 0 && (
                <div className="mb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Conta bancária
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30"
                  >
                    <option value="">Detectar automaticamente</option>
                    {contas.map((c) => (
                      <option key={c.id} value={c.id}>
                        CEF · {c.accountNumber}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    O extrato .txt identifica a conta sozinho. O .pdf não
                    traz o número da conta — informe aqui se a empresa
                    tiver mais de uma.
                  </p>
                </div>
              )}

              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Arquivo
              </label>
              <input
                key={resetKey}
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-[var(--brand-navy)]"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-navy)] transition hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={file === null}
                  className="rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Importar
                </button>
              </div>
            </>
          )}

          {submitted && pending && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: "var(--brand-blue)" }}
              />
              <p
                className="mt-3 text-sm font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                Processando arquivo…
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Lendo o conteúdo e gravando movimentações e eventos.
              </p>
            </div>
          )}

          {submitted && !pending && state !== undefined && (
            <ResultView
              state={state}
              onImportarOutro={importarOutro}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ----- relatório de resultado ---------------------------------

function ResultView({
  state,
  onImportarOutro,
  onClose,
}: {
  state: ImportCefState
  onImportarOutro: () => void
  onClose: () => void
}) {
  const arquivos = state.arquivos ?? []
  const contas = state.contas ?? []

  return (
    <div>
      {!state.ok && (
        <div
          className="flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-[13px]"
          style={{
            background: "rgba(200,30,30,0.10)",
            color: "var(--brand-red-dark)",
          }}
        >
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span>{state.error ?? "Não foi possível importar o arquivo."}</span>
        </div>
      )}

      {arquivos.length > 0 && (
        <div className="mt-3 space-y-2">
          {arquivos.map((a, i) => (
            <FileResultRow key={i} arquivo={a} />
          ))}
        </div>
      )}

      {contas.length > 0 && (
        <div className="mt-3 space-y-2">
          {contas.map((c, i) => (
            <AccountResultRow key={i} conta={c} />
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onImportarOutro}
          className="rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-navy)] transition hover:bg-muted"
        >
          Importar outro
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--brand-blue)]"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

function FileResultRow({ arquivo }: { arquivo: CefFileResult }) {
  const formato = arquivo.source === "cef-pdf" ? "PDF" : "TXT"
  const failed = arquivo.status === "failed"

  return (
    <div className="rounded-lg border border-border bg-background px-3.5 py-2.5">
      <div className="flex items-start gap-2">
        {failed ? (
          <XCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--brand-red-dark)" }}
            strokeWidth={1.8}
          />
        ) : (
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--brand-green-dark)" }}
            strokeWidth={1.8}
          />
        )}
        <div className="min-w-0">
          <p
            className="text-[13px] font-bold leading-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            {arquivo.fileName}
            <span className="font-medium text-muted-foreground"> · {formato}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {arquivo.status === "imported" &&
              `${arquivo.rowsImported} movimentações importadas` +
                (arquivo.rowsSkipped > 0
                  ? ` · ${arquivo.rowsSkipped} já existiam`
                  : "")}
            {arquivo.status === "skipped" &&
              `Já importado anteriormente · ${arquivo.rowsSkipped} movimentações`}
            {arquivo.status === "failed" && (arquivo.error ?? "Falha na importação")}
          </p>
        </div>
      </div>

      {(arquivo.warnings ?? []).map((w, i) => (
        <div
          key={i}
          className="mt-2 flex items-start gap-1.5 rounded-md px-2.5 py-1.5 text-[11px]"
          style={{
            background: "rgba(224,139,0,0.12)",
            color: "var(--brand-warning)",
          }}
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          <span>{w}</span>
        </div>
      ))}
    </div>
  )
}

function AccountResultRow({ conta }: { conta: CefAccountResult }) {
  const completa = conta.coberturaSaldo === "completa"

  return (
    <div className="rounded-lg border border-border bg-background px-3.5 py-2.5">
      <p
        className="text-[13px] font-bold"
        style={{ color: "var(--brand-navy)" }}
      >
        Conta {conta.accountNumber}
        <span className="font-medium text-muted-foreground">
          {" "}
          · {conta.movimentacoes} movimentações
        </span>
      </p>
      {completa ? (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Saldo inicial {fmtBRL(conta.openingBalance ?? 0)} · final{" "}
          {fmtBRL(conta.closingBalance ?? 0)} ·{" "}
          {conta.driftOk === true
            ? "saldo confere"
            : conta.driftOk === false
              ? "divergência no saldo — revisar"
              : "drift não calculado"}
        </p>
      ) : (
        <p className="mt-0.5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            style={{ color: "var(--brand-warning)" }}
            strokeWidth={1.8}
          />
          <span>
            Cobertura de saldo insuficiente — importe o extrato .pdf do
            período para fechar o caixa.
          </span>
        </p>
      )}
    </div>
  )
}
