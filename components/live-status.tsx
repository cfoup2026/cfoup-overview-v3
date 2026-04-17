"use client"

import { useEffect, useState } from "react"

/**
 * Indicador de status ao vivo.
 * - Ponto verde pulsante ("batimento" do sistema).
 * - Timestamp relativo que re-renderiza a cada minuto.
 */
export function LiveStatus() {
  // Momento do último sync — fica estável entre re-renders do mesmo mount.
  const [syncedAt] = useState<number>(() => Date.now() - 12 * 60 * 1000)
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const minutes = Math.max(0, Math.floor((now - syncedAt) / 60_000))
  const label =
    minutes < 1
      ? "agora mesmo"
      : minutes === 1
        ? "há 1 minuto"
        : minutes < 60
          ? `há ${minutes} minutos`
          : `há ${Math.floor(minutes / 60)} h`

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
    >
      <span aria-hidden className="relative inline-flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ backgroundColor: "var(--brand-green)" }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--brand-green)" }}
        />
      </span>
      <span className="font-medium text-[var(--slate-700)]">Sincronizado</span>
      <span aria-hidden className="text-border">·</span>
      <span className="tabular-nums">{label}</span>
    </div>
  )
}
