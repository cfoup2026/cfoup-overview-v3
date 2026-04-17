"use client"

import Link from "next/link"
import { useState } from "react"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"

type Mode = "entrar" | "criar" | "recuperar"

export default function EntrarPage() {
  const [mode, setMode] = useState<Mode>("entrar")

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
      title: "Recuperar senha",
      subtitle: "Enviaremos um link para o seu e-mail.",
      primary: "Enviar link",
    },
  }[mode]

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-5 py-8">
        {/* Topo — logo */}
        <div className="flex items-center">
          <Link href="/" aria-label="CFOup" className="inline-flex">
            <CfoupLogo size={32} />
          </Link>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col justify-center py-10">
          <header className="mb-6">
            <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </header>

          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            {mode === "criar" && (
              <Field label="Nome">
                <input
                  type="text"
                  required
                  placeholder="Como devemos te chamar?"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>
            )}

            <Field label="E-mail">
              <input
                type="email"
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
                  required
                  placeholder={mode === "criar" ? "Crie uma senha" : "Sua senha"}
                  autoComplete={mode === "criar" ? "new-password" : "current-password"}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand-navy)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue)]"
            >
              {copy.primary}
            </button>
          </form>

          {/* Alternância de modo */}
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

        {/* Rodapé */}
        <footer className="flex items-center justify-between pt-6 text-xs text-muted-foreground">
          <span>CFOup</span>
          <Link href="/" className="hover:text-foreground">
            Voltar ao produto
          </Link>
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
