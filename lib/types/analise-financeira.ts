export type Status = "positivo" | "atencao" | "info"

export type KPISintese = {
  label: string
  valor: string
  delta?: string
  status?: Status
}

export type HeadlineSintese = {
  titulo: string
  texto: string
  status: Status
  link?: { label: string; href: string }
}

export type DadosSintese = {
  periodoDescricao: string
  fontes: string[]
  kpis: KPISintese[]
  headlines: HeadlineSintese[]
  leituraExecutiva: string
}
