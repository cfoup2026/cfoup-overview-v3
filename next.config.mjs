/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Off intencionalmente — CP#01 §7 (18/mai/2026) tirou o `true` que mascarava
    // 7 erros TS reais. Manter false para que build do Vercel falhe cedo em
    // regressões de tipo (auth, schema, RLS dos próximos passos do caminho crítico).
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
