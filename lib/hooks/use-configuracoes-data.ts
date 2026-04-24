"use client"

// TODO: substituir por fetch real quando o backend estiver disponível.
// Este hook é o único ponto de entrada de dados da tela /configuracoes.
// Enquanto hasConnections = false, os campos ficam vazios e toggles desabilitados.

export type ConfiguracoesSectionId =
  | "empresa"
  | "metas"
  | "alertas"
  | "relatorios"
  | "seguranca"

export type ConfigField = {
  label: string
  value: string | null
  hint?: string
}

export type ConfigToggle = {
  id: string
  label: string
  description: string
  on: boolean
}

export type ConfiguracoesData = {
  hasConnections: boolean
  header: {
    eyebrow: string
    title: string
    description: string
  }
  banner: {
    title: string
    ctaLabel: string
    ctaHref: string
  }
  emptyValueLabel: string
  sections: {
    empresa: {
      menuLabel: string
      titulo: string
      descricao: string
      fields: ConfigField[]
    }
    metas: {
      menuLabel: string
      titulo: string
      descricao: string
      fields: ConfigField[]
    }
    alertas: {
      menuLabel: string
      titulo: string
      descricao: string
      toggles: ConfigToggle[]
    }
    relatorios: {
      menuLabel: string
      titulo: string
      descricao: string
      toggles: ConfigToggle[]
    }
    seguranca: {
      menuLabel: string
      titulo: string
      descricao: string
      fields: ConfigField[]
    }
  }
}

// ---- MOCK ----
// Quando hasConnections = false: todos os valores "configuráveis" vêm como null
// e todos os toggles vêm on=false. A UI trata esses casos.
const HAS_CONNECTIONS = false

const MOCK_DATA: ConfiguracoesData = {
  hasConnections: HAS_CONNECTIONS,
  header: {
    eyebrow: "Preferências",
    title: "Configurações",
    description:
      "Ajuste como o CFOup trabalha: ciclos de fechamento, metas, tolerâncias e quem recebe os alertas.",
  },
  banner: {
    title: "Configure suas conexões para ativar metas e alertas",
    ctaLabel: "Ir para Conexões",
    ctaHref: "/conexoes",
  },
  emptyValueLabel: "Aguardando conexão",
  sections: {
    empresa: {
      menuLabel: "Empresa",
      titulo: "Perfil da empresa",
      descricao: "Essas informações servem de contexto para o CFOup.",
      fields: [
        {
          label: "Razão social",
          value: HAS_CONNECTIONS ? "Gregorutt Indústria e Comércio LTDA" : null,
        },
        { label: "Apelido no CFOup", value: HAS_CONNECTIONS ? "Gregorutt" : null },
        { label: "Setor de atuação", value: HAS_CONNECTIONS ? "Indústria · Comércio B2B" : null },
        { label: "Moeda padrão", value: HAS_CONNECTIONS ? "BRL · Real brasileiro" : null },
        { label: "Regime tributário", value: HAS_CONNECTIONS ? "Lucro Presumido" : null },
        { label: "Início do exercício fiscal", value: HAS_CONNECTIONS ? "Janeiro" : null },
      ],
    },
    metas: {
      menuLabel: "Metas e tolerâncias",
      titulo: "Metas e tolerâncias",
      descricao:
        "Os limites que definem quando o CFOup levanta um alerta na Visão Geral.",
      fields: [
        {
          label: "Margem líquida alvo",
          value: HAS_CONNECTIONS ? "15,0%" : null,
          hint: "Alerta abaixo de 12%",
        },
        {
          label: "Runway mínimo",
          value: HAS_CONNECTIONS ? "6 meses" : null,
          hint: "Alerta crítico abaixo de 3 meses",
        },
        {
          label: "Concentração máxima por cliente",
          value: HAS_CONNECTIONS ? "30%" : null,
          hint: "Alerta acima desse valor",
        },
        {
          label: "PMR tolerado",
          value: HAS_CONNECTIONS ? "30 dias" : null,
          hint: "Alerta quando ultrapassa",
        },
      ],
    },
    alertas: {
      menuLabel: "Alertas",
      titulo: "Alertas e comunicação",
      descricao: "Como e quando o CFOup deve te avisar.",
      toggles: [
        {
          id: "resumo-diario",
          label: "Resumo diário por e-mail",
          description: "Entregue às 08:00, apenas nos dias úteis.",
          on: HAS_CONNECTIONS,
        },
        {
          id: "alertas-criticos",
          label: "Alertas críticos em tempo real",
          description: "Notificações quando um limite for ultrapassado.",
          on: HAS_CONNECTIONS,
        },
        {
          id: "resumo-semanal",
          label: "Resumo semanal estratégico",
          description: "Principais decisões sugeridas pelo CFOup.",
          on: false,
        },
      ],
    },
    relatorios: {
      menuLabel: "Relatórios",
      titulo: "Relatórios periódicos",
      descricao: "Quais relatórios o CFOup prepara e para quem envia.",
      toggles: [
        {
          id: "relatorio-mensal",
          label: "Relatório mensal consolidado",
          description: "Fechamento em PDF, enviado ao seu contador.",
          on: false,
        },
        {
          id: "relatorio-trimestral",
          label: "Relatório trimestral estratégico",
          description: "Leitura executiva do trimestre para o board.",
          on: false,
        },
        {
          id: "relatorio-anual",
          label: "Fechamento anual",
          description: "Consolidação do exercício fiscal.",
          on: false,
        },
      ],
    },
    seguranca: {
      menuLabel: "Segurança",
      titulo: "Segurança e acesso",
      descricao: "Quem responde pela conta e como ela é protegida.",
      fields: [
        // "Contato responsável" é preenchido dinamicamente pela tela com useCurrentUser().
        { label: "Contato responsável", value: null },
        {
          label: "Autenticação em dois fatores",
          value: HAS_CONNECTIONS ? "Ativa via app autenticador" : null,
          hint: "Recomendado para contas com acesso financeiro.",
        },
        {
          label: "Sessões ativas",
          value: HAS_CONNECTIONS ? "1 dispositivo" : null,
        },
        {
          label: "Último acesso",
          value: HAS_CONNECTIONS ? "Hoje, 08:42" : null,
        },
      ],
    },
  },
}

export function useConfiguracoesData(): ConfiguracoesData {
  // TODO: trocar por fetch real (SWR) quando o backend estiver pronto.
  return MOCK_DATA
}
