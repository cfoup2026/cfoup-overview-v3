import type { ComponentType } from "react"
import { Landmark, Upload, Receipt, Database } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

type SourceCardProps = {
  icon: IconType
  title: string
  description: string
  status: "available" | "soon"
  cta?: string
}

function SourceCard({ icon: Icon, title, description, status, cta }: SourceCardProps) {
  if (status === "soon") {
    return (
      <div className="rounded-xl border border-[#E5EBF2] bg-white p-6 opacity-60">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F9FC] text-[#5B6B82]">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#5B6B82]">Em breve</span>
        </div>
        <h3 className="mb-1 text-[16px] font-semibold text-[#0F1B2D]">{title}</h3>
        <p className="text-[13.5px] leading-relaxed text-[#5B6B82]">{description}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#E5EBF2] bg-white p-6 transition hover:border-[#1567C8]">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F9FC] text-[#1567C8]">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#36BA58]">Disponível</span>
      </div>
      <h3 className="mb-1 text-[16px] font-semibold text-[#0F1B2D]">{title}</h3>
      <p className="mb-4 text-[13.5px] leading-relaxed text-[#5B6B82]">{description}</p>
      <button className="text-[13px] font-semibold text-[#1567C8] hover:underline">{cta} →</button>
    </div>
  )
}

function SourceGrid() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <SourceCard
        icon={Landmark}
        title="Bancos via Open Finance"
        description="Sincronização automática de extratos via Open Finance Brasil. Sem upload manual."
        status="available"
        cta="Conectar banco"
      />
      <SourceCard
        icon={Upload}
        title="Upload de arquivo"
        description="OFX, CSV, XLSX. Envie extratos e relatórios direto do seu banco ou ERP."
        status="available"
        cta="Enviar arquivo"
      />
      <SourceCard
        icon={Receipt}
        title="Notas fiscais eNotas"
        description="Importe NF-e e NFS-e automaticamente para conciliar receita e impostos."
        status="soon"
      />
      <SourceCard
        icon={Database}
        title="Sistema ERP"
        description="Integração nativa com seu ERP para puxar contas a pagar, receber e estoque."
        status="soon"
      />
    </div>
  )
}

type ActiveItemProps = {
  title: string
  meta: string
  statusLabel: string
  statusColor: string
}

function ActiveItem({ title, meta, statusLabel, statusColor }: ActiveItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#E5EBF2] py-4 last:border-0">
      <div className="flex items-center gap-4">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} aria-hidden />
        <div>
          <div className="text-[14px] font-semibold text-[#0F1B2D]">{title}</div>
          <div className="mt-0.5 text-[12px] text-[#5B6B82]">{meta}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-[10.5px] font-semibold uppercase tracking-wider"
          style={{ color: statusColor }}
        >
          {statusLabel}
        </span>
        <button
          type="button"
          aria-label="Mais ações"
          className="text-xl leading-none text-[#5B6B82] hover:text-[#0F1B2D]"
        >
          {"\u22EF"}
        </button>
      </div>
    </div>
  )
}

function StateHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-[#5B6B82]">{eyebrow}</p>
      <h2 className="text-[18px] font-semibold text-[#0F1B2D]">{title}</h2>
    </div>
  )
}

export default function ConexoesPage() {
  return (
    <div className="mx-auto max-w-[1140px]">
      <PageHeader
        title="Conexões"
        description="Conecte as fontes de dados que alimentam o CFOup."
      />

      {/* ===== Estado A — Vazio ===== */}
      <section className="mb-12">
        <StateHeader eyebrow="Estado A" title="Sem conexões ainda" />
        <SourceGrid />

        <div className="mb-2">
          <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wider text-[#5B6B82]">
            Conexões ativas
          </h3>
          <div className="rounded-xl border border-dashed border-[#E5EBF2] bg-white p-12 text-center">
            <p className="text-[13.5px] text-[#5B6B82]">
              Nenhuma fonte conectada ainda. Comece pelo banco principal.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Estado B — Com conexões ===== */}
      <section>
        <StateHeader eyebrow="Estado B" title="Com conexões ativas" />
        <SourceGrid />

        <div>
          <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wider text-[#5B6B82]">
            Conexões ativas
          </h3>
          <div className="rounded-xl border border-[#E5EBF2] bg-white px-6 py-2">
            <ActiveItem
              title="Banco Itaú · CC 12345-6"
              meta="Open Finance · Sincronizado há 12 min · 1.247 transações"
              statusLabel="Sincronizando"
              statusColor="#36BA58"
            />
            <ActiveItem
              title="extrato_marco_2026.ofx"
              meta="Upload manual · Importado há 2 dias · 384 transações"
              statusLabel="Reclassificar 12 lançamentos"
              statusColor="#E08B00"
            />
            <ActiveItem
              title="Banco Bradesco · CC 9876-5"
              meta="Open Finance · Última tentativa há 1 hora"
              statusLabel="Erro de autenticação"
              statusColor="#D14343"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
