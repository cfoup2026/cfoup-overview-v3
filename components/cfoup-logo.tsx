import Image from "next/image"
import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"

type CfoupLogoProps = {
  showWordmark?: boolean
  className?: string
  size?: number
  style?: CSSProperties
}

/**
 * Logo oficial do CFOup — PNG com fundo transparente.
 * Arquivo em public/cfoup-logo.png. O PNG já contém símbolo + wordmark;
 * `size` controla a altura em pixels. `style` é aplicado ao wrapper span.
 */
export function CfoupLogo({ showWordmark = true, className, size = 64, style }: CfoupLogoProps) {
  const width = showWordmark ? Math.round(size * 3.2) : size
  const height = size

  return (
    <span className={cn("inline-flex items-center", className)} style={style}>
      <Image
        src="/cfoup-logo.png"
        alt="CFOup"
        width={width}
        height={height}
        priority
        className="object-contain"
        style={{ width: "auto", height }}
      />
    </span>
  )
}
