"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"

type Mode = "entrar" | "criar" | "recuperar"

function deriveName(email: string): string {
  const local = email.split("@")[0] || ""
  const first = local.split(/[._-]/)[0] || local
  if (!first) return "Usuário"
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export default function EntrarPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("entrar")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [sent, setSent] = useState(false)

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === "recuperar") {
      setSent(true)
      return
    }
    // Grava identidade do usuário logado (MVP — até plugar Supabase Auth).
    try {
      const finalName = (mode === "criar" ? name.trim() : "") || deriveName(email)
      window.localStorage.setItem(
        "cfoup.currentUser",
        JSON.stringify({ email: email.trim(), name: finalName, role: "Admin" }),
      )
    } catch {
      // segue mesmo se localStorage falhar
    }
    router.push("/visao-geral")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-5 py-8">
        <div className="flex items-center">
          <Link href="/entrar" aria-label="CFOup" className="inline-flex">
            <CfoupLogo size={32} />
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <header className="mb-6">
            <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </header>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {mode === "criar" && (
              <Field label="Nome">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
                />
              </Field>
            )}

            <Field label="E-mail">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                      onClick={() => {
                        setSent(false)
                        setMode("recuperar")
                      }}
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

            {mode === "recuperar" && sent && (
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

        <footer className="pt-6 text-xs text-muted-foreground">
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
