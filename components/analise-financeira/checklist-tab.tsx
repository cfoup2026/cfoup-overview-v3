"use client"

// Placeholder para aba Checklist Mensal (não existe no HTML de referência)

export function ChecklistTab() {
  return (
    <section className="op-section">
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
        style={{ background: "linear-gradient(135deg, #071D3B 0%, #0A2647 100%)" }}
      >
        <h2
          className="m-0 text-[22px] font-medium tracking-[-0.005em] text-white"
          style={{ fontFamily: "var(--cfoup-font-serif)" }}
        >
          G <span style={{ color: "#38B8E8" }}>· Checklist Mensal</span>
        </h2>
        <span className="text-[11px] tracking-[0.04em] text-white/70">Em construção</span>
      </div>

      <div className="flex min-h-[300px] flex-col items-center justify-center p-12 text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ background: "#EEF3F9", color: "#38B8E8" }}
        >
          🚧
        </div>
        <h3
          className="mb-2 text-xl font-medium"
          style={{ fontFamily: "var(--cfoup-font-serif)", color: "var(--brand-navy)" }}
        >
          Em construção
        </h3>
        <p className="max-w-md text-sm" style={{ color: "var(--muted-html)" }}>
          O Checklist Mensal será liberado em breve. Ele vai mostrar as tarefas recorrentes
          de controle financeiro que devem ser feitas todo mês.
        </p>
      </div>
    </section>
  )
}
