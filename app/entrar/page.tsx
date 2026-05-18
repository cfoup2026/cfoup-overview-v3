"use client"

import Link from "next/link"
import { Suspense, useActionState, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"
import {
  signInAction,
  signUpAction,
  resetPasswordAction,
  type AuthState,
} from "@/lib/auth/actions"

type Mode = "entrar" | "criar" | "recuperar"

// Next 16 exige que useSearchParams esteja dentro de Suspense em pages
// estaticamente prerrenderáveis. Isolamos o uso num subcomponente e
// envolvemos no Suspense aqui.
export default function EntrarPage() {
  return (
    <Suspense fallback={<EntrarFallback />}>
      <EntrarForm />
    </Suspense>
  )
}

function EntrarFallback() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col items-center justify-center px-5 py-8">
        <CfoupLogo size={144} />
      </div>
    </main>
  )
}

function EntrarForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/visao-geral"
  const [mode, setMode] = useState<Mode>("entrar")

  const [signInState, signInDispatch, signInPending] = useActionState<
    AuthState | undefined,
    FormData
  >(signInAction, undefined)
  const [signUpState, signUpDispatch, signUpPending] = useActionState<
    AuthState | undefined,
    FormData
  >(signUpAction, undefined)
  const [resetState, resetDispatch, resetPending] = useActionState<
    AuthState | undefined,
    FormData
  >(resetPasswordAction, undefined)

  const copy = {
    entrar: {
      title: "Entrar na sua conta",
      subtitle: "Acesse sua mesa de decisão financeira.",
      primary: "Entrar",
    },
    criar: {
      title: "Criar conta",
      subtitle: "Leva menos de um minuto.",
      primary: "Criar conta",
    },
    recuperar: {
      title: "Esqueci minha senha",
      subtitle: "Enviaremos um link para o seu e-mail.",
      primary: "Enviar link",
    },
  }[mode]

  const currentState =
    mode === "entrar" ? signInState : mode === "criar" ? signUpState : resetState
  const currentPending =
    mode === "entrar" ? signInPending : mode === "criar" ? signUpPending : resetPending
  const currentAction =
    mode === "entrar" ? signInDispatch : mode === "criar" ? signUpDispatch : resetDispatch

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-5 py-8">
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          <Link href="/entrar" aria-label="CFOup" className="mb-8 inline-flex">
            <CfoupLogo size={144} />
          </Link>

          <div className="w-full">
            <header className="mb-6 text-center">
              <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight text-foreground">
                {copy.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
            </header>

            <form className="flex flex-col gap-3" action={currentAction}>
              {/* next param do middleware */}
              {mode === "entrar" && <input type="hidden" name="next" value={next} />}

              {mode === "criar" && (
                <Field label="Nome">
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Como devemos te chamar?"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                  />
                </Field>
              )}

              <Field label="E-mail">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>

              {mode !== "recuperar" && (
                <Field
                  label="Senha"
                  action={
                    mode === "entrar" ? (
                      <button
                        type="button"
                        onClick={() => setMode("recuperar")}
                        className="text-xs font-medium text-[var(--brand-blue)] hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                    ) : null
                  }
                >
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={mode === "criar" ? 8 : undefined}
                    placeholder={mode === "criar" ? "Crie uma senha (mín. 8 caracteres)" : "Sua senha"}
                    autoComplete={mode === "criar" ? "new-password" : "current-password"}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                  />
                </Field>
              )}

              <button
                type="submit"
                disabled={currentPending}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand-navy)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue)] disabled:opacity-60"
              >
                {currentPending ? "Aguarde..." : copy.primary}
              </button>

              {currentState && !currentState.ok && currentState.error && (
                <p
                  role="alert"
                  className="rounded-lg border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/5 px-3 py-2 text-xs text-[var(--brand-red)]"
                >
                  {currentState.error}
                </p>
              )}

              {mode === "recuperar" && resetState?.ok && (
                <p
                  role="status"
                  className="rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
                >
                  Se existir uma conta com esse e-mail, você receberá o link em instantes.
                </p>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "entrar" && (
                <>
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("criar")}
                    className="font-medium text-[var(--brand-blue)] hover:underline"
                  >
                    Criar conta
                  </button>
                </>
              )}
              {mode === "criar" && (
                <>
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("entrar")}
                    className="font-medium text-[var(--brand-blue)] hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
              {mode === "recuperar" && (
                <>
                  Lembrou a senha?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("entrar")}
                    className="font-medium text-[var(--brand-blue)] hover:underline"
                  >
                    Voltar para entrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          <span>CFOup</span>
        </footer>
      </div>
    </main>
  )
}

function Field({
  label,
  action,
  children,
}: {
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className={cn("flex flex-col gap-1.5")}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        {action}
      </div>
      {children}
    </label>
  )
}
