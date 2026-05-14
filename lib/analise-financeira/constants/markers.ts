// Cores de markers para evidence blocks (grid-4-paineis)
// fato, leitura, hipotese, trajetoria

export type MarkerType = "fato" | "leitura" | "hipotese" | "trajetoria"

export const MARKER_COLORS: Record<MarkerType, string> = {
  fato: "var(--brand-ink-muted)",
  leitura: "var(--brand-blue)",
  hipotese: "var(--brand-warning)",
  trajetoria: "var(--brand-navy)",
}
