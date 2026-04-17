"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquareText,
  GitBranch,
  AlertCircle,
  Plug,
  Settings,
  Waves,
  PieChart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CfoupLogo } from "@/components/cfoup-logo"

export const navItems = [
  { href: "/", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/chat", label: "Chat CFOup", icon: MessageSquareText },
  { href: "/cenarios", label: "Cenários", icon: GitBranch },
  { href: "/pendencias", label: "Pendências", icon: AlertCircle },
  { href: "/fluxo-de-caixa", label: "Fluxo de Caixa", icon: Waves },
  { href: "/margens", label: "Margens e Rentabilidade", icon: PieChart },
  { href: "/conexoes", label: "Conexões", icon: Plug },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const

type SidebarNavProps = {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground"
    >
      <div className="flex items-center px-6 pt-7 pb-8">
        <Link href="/" aria-label="CFOup — ir para Visão Geral" className="inline-flex items-center">
          <CfoupLogo size={34} />
        </Link>
      </div>

      <div className="px-4">
        <div className="rounded-xl border border-sidebar-border bg-muted/60 px-3.5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Empresa
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-navy)]">Sua empresa</p>
          <p className="text-xs text-muted-foreground">Dados do mês corrente</p>
        </div>
      </div>

      <div className="mt-6 px-3 pb-6">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Mesa de decisão
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                      active
                        ? "bg-white text-[var(--brand-blue)] shadow-sm ring-1 ring-sidebar-border"
                        : "text-muted-foreground group-hover:text-[var(--brand-blue)]",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="ml-auto h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--brand-green)" }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-auto px-4 pb-6">
        <div className="rounded-xl border border-sidebar-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white"
            >
              SU
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--brand-navy)]">Usuário</p>
              <p className="truncate text-xs text-muted-foreground">Empresa Piloto</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            CFOup observa suas conexões e traduz os números em decisões.
          </p>
          <Link
            href="/entrar"
            onClick={onNavigate}
            className="mt-3 inline-flex text-[11px] font-medium text-muted-foreground hover:text-[var(--brand-navy)]"
          >
            Sair
          </Link>
        </div>
      </div>
    </nav>
  )
}
