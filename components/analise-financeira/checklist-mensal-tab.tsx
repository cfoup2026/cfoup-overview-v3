"use client"

// Checklist Mensal — estado vazio honesto

export function ChecklistMensalTab() {
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: "var(--brand-blue)" }}
      >
        Checklist Mensal
      </p>
      <h2
        className="mb-4 mt-2 text-[28px] font-medium leading-tight"
        style={{ fontFamily: "var(--cfoup-font-serif)", color: "var(--brand-navy)" }}
      >
        Em construção
      </h2>
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Rotina mensal de verificações operacionais — o que confirmar, o que cobrar, o que
        decidir. Disponível na próxima entrega.
      </p>
    </section>
  )
}
