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
  // pdfjs-dist NÃO entra em serverExternalPackages: pdfjs é ESM-only e
  // Turbopack não consegue tratá-lo como external via require (gera warning
  // "package can't be external"). Em vez disso, o parser CNPJ resolve o
  // worker via path.join(process.cwd(), ...) — string literal não
  // interceptada pelo bundler.
}

export default nextConfig
