"use client"

import { useActionState } from "react"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"
import {
  createCompanyAction,
  type OnboardingState,
} from "@/lib/auth/onboarding-action"

// Onboarding é GATE TÉCNICO MÍNIMO pós-signup.
// - Cria company + companies_users com primeiro user = admin (RLS).
// - Pede apenas o estritamente necessário: nome + CNPJ.
// - Redireciona para /configuracoes, que é a tela oficial de cadastro completo.
// - Não duplicar regime, perfil completo, importar CNPJ ou dados operacionais aqui.

export default function OnboardingPage() {
  const [state, dispatch, pending] = useActionState<OnboardingState | undefined, FormData>(
    createCompanyAction,
    undefined,
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-5 py-8">
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          <div className="mb-8 inline-flex">
            <CfoupLogo size={120} />
          </div>

          <div className="w-full">
            <header className="mb-6 text-center">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
                Primeiro acesso
              </p>
              <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight text-foreground">
                Crie a empresa para acessar o CFOup
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Só o mínimo agora. O cadastro completo — regime, setor, contato,
                cartão CNPJ — fica em <span className="font-medium text-foreground">Configurações</span> assim que você entrar.
              </p>
            </header>

            <form className="flex flex-col gap-3" action={dispatch}>
              <Field label="Nome da empresa">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Razão social ou nome fantasia"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>

              <Field label="CNPJ">
                <input
                  type="text"
                  name="cnpj"
                  required
                  inputMode="numeric"
                  placeholder="00.000.000/0001-00"
                  pattern="[0-9./\\-]+"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>

              <button
                type="submit"
                disabled={pending}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand-navy)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:opacity-60"
              >
                {pending ? "Criando..." : "Criar empresa e continuar"}
              </button>

              {state && !state.ok && state.error && (
                <p
                  role="alert"
                  className="rounded-lg border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/5 px-3 py-2 text-xs text-[var(--brand-red)]"
                >
                  {state.error}
                </p>
              )}
            </form>
          </div>
        </div>

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          <span>CFOup · Onboarding</span>
        </footer>
      </div>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className={cn("flex flex-col gap-1.5")}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
