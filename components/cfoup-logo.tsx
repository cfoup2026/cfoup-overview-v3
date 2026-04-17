import { cn } from "@/lib/utils"

type CfoupLogoProps = {
  showWordmark?: boolean
  className?: string
  size?: number
}

/**
 * Logo oficial do CFOup — replicado fielmente do site cfoup.ai.
 * Globo em ciano + seta verde para cima no canto superior direito.
 * Não reinterpretar nem redesenhar.
 */
export function CfoupLogo({ showWordmark = true, className, size = 38 }: CfoupLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="17" cy="20" r="13" stroke="#38B8E8" strokeWidth="1.8" fill="rgba(56,184,232,0.06)" />
        <ellipse cx="17" cy="20" rx="5" ry="13" stroke="#38B8E8" strokeWidth="1.4" fill="none" />
        <path d="M4 20 Q17 17 30 20" stroke="#38B8E8" strokeWidth="1.3" fill="none" />
        <path d="M6 14 Q17 10.5 28 14" stroke="#38B8E8" strokeWidth="1.1" fill="none" />
        <path d="M6 26 Q17 29.5 28 26" stroke="#38B8E8" strokeWidth="1.1" fill="none" />
        <line x1="24" y1="14" x2="35" y2="3" stroke="#36BA58" strokeWidth="2.5" strokeLinecap="round" />
        <polyline
          points="27,2 36,2 36,11"
          stroke="#36BA58"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="font-sans text-[1.35rem] font-extrabold tracking-tight leading-none">
          <span style={{ color: "var(--brand-navy)" }}>CFO</span>
          <span style={{ color: "var(--brand-green)" }}>up</span>
        </span>
      )}
      <span className="sr-only">CFOup</span>
    </span>
  )
}
