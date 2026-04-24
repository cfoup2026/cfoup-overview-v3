"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"
import { CfoupLogo } from "@/components/cfoup-logo"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside
        aria-label="Barra lateral"
        className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-sidebar-border bg-sidebar lg:block"
      >
        <SidebarNav />
      </aside>

      {/* Topbar — mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <CfoupLogo size={30} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir navegação"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-[var(--brand-navy)] hover:bg-muted"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </header>

      {/* Drawer — mobile */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-[var(--brand-navy)]/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        aria-label="Navegação móvel"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform border-r border-sidebar-border bg-sidebar transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar navegação"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </aside>

      {/* Conteúdo */}
      <main className="lg:pl-[280px]">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-3 md:px-6 lg:px-8 lg:py-4">{children}</div>
      </main>
    </div>
  )
}
