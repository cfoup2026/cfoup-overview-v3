import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppShell } from "@/components/app-shell"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CFOup — Sua mesa de decisão financeira",
  description:
    "Produto CFOup: visão executiva da saúde financeira, caixa, margens e conselho do CFO para donos de empresa.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#071D3B",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased text-foreground">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
