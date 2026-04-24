/**
 * useConfiguracoesData — fonte única de dados da página Configurações.
 *
 * ARQUITETURA
 * -----------
 * Mesmo padrão da /visao-geral. Esta página é genérica: serve para qualquer
 * empresa cliente do CFOup. Os valores de perfil, metas e preferências vêm
 * da camada de dados (após o dono conectar banco/NF-e/ERP em /conexoes e
 * preencher o onboarding da empresa).
 *
 * HOJE: `hasConnections: false` → todos os campos retornam vazios e os
 * toggles vêm desligados. A UI mostra "Aguardando conexão" em cada campo,
 * desabilita os toggles e exibe um banner no topo convidando o usuário a
 * ir para /conexoes.
 *
 * AMANHÃ: depois que o dono conectar os dados e completar o onboarding:
 * - hasConnections vira true
 * - o hook busca /api/configuracoes?companyId=...
 * - a mesma UI renderiza os valores salvos
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type ConfiguracoesSectionId =
  | "empresa"
  | "metas"
  | "alertas"
  | "relatorios"
  | "seguranca"

export type ConfiguracoesField = {
  label: string
  value: string | null
  hint?: string
}

export type ConfiguracoesToggle = {
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
    description: string
    ctaLabel: string
    ctaHref: string
  }

  emptyFieldLabel: string

  sections: Array<{
    id: ConfiguracoesSectionId
    label: string
  }>

  empresa: {
    title: string
    description: string
    fields: {
      razaoSocial: ConfiguracoesField
      apelido: ConfiguracoesField
      setor: ConfiguracoesField
      moeda: ConfiguracoesField
      regime: ConfiguracoesField
      inicioFiscal: ConfiguracoesField
      contatoResponsavel: ConfiguracoesField
      emailResponsavel: ConfiguracoesField
    }
  }

  metas: {
    title: string
    description: string
    fields: {
      margemLiquida: ConfiguracoesField
      runway: ConfiguracoesField
      concentracao: ConfiguracoesField
      pmr: ConfiguracoesField
    }
  }

  alertas: {
    title: string
    description: string
    toggles: Array<ConfiguracoesToggle>
  }

  relatorios: {
    title: string
    description: string
    fields: {
      destinatarios: ConfiguracoesField
      frequencia: ConfiguracoesField
      formato: ConfiguracoesField
    }
    toggles: Array<ConfiguracoesToggle>
  }

  seguranca: {
    title: string
    description: string
    fields: {
      autenticacao: ConfiguracoesField
      sessao: ConfiguracoesField
      ultimoAcesso: ConfiguracoesField
    }
    toggles: Array<ConfiguracoesToggle>
  }
}

type UserHint = {
  name?: string
  email?: string
}

// TODO: substituir pelo fetch real a /api/configuracoes?companyId=...
export function useConfiguracoesData(user?: UserHint): ConfiguracoesData {
  const contatoNome = user?.name && user.name !== "Convidado" ? user.name : null
  const contatoEmail = user?.email && user.email.length > 0 ? user.email : null

  return {
    hasConnections: false,

    header: {
      eyebrow: "Preferências",
      title: "Configurações",
      description:
        "Ajuste como o CFOup trabalha pra sua empresa: ciclos de fechamento, metas, tolerâncias e quem recebe os alertas.",
    },

    banner: {
      title: "Configure suas conexões para ativar metas e alertas",
      description:
        "Sem dados conectados o CFOup não consegue acompanhar metas nem disparar alertas. Conecte banco, NF-e e ERP pra liberar as preferências.",
      ctaLabel: "Ir para Conexões",
      ctaHref: "/conexoes",
    },

    emptyFieldLabel: "Aguardando conexão",

    sections: [
      { id: "empresa", label: "Empresa" },
      { id: "metas", label: "Metas e tolerâncias" },
      { id: "alertas", label: "Alertas" },
      { id: "relatorios", label: "Relatórios" },
      { id: "seguranca", label: "Segurança" },
    ],

    empresa: {
      title: "Perfil da empresa",
      description: "Essas informações servem de contexto para o CFOup.",
      fields: {
        razaoSocial: { label: "Razão social", value: null },
        apelido: { label: "Apelido no CFOup", value: null },
        setor: { label: "Setor de atuação", value: null },
        moeda: { label: "Moeda padrão", value: null },
        regime: { label: "Regime tributário", value: null },
        inicioFiscal: { label: "Início do exercício fiscal", value: null },
        contatoResponsavel: {
          label: "Contato responsável",
          value: contatoNome,
          hint: "Usuário logado no CFOup",
        },
        emailResponsavel: {
          label: "E-mail do responsável",
          value: contatoEmail,
        },
      },
    },

    metas: {
      title: "Metas e tolerâncias",
      description:
        "Os limites que definem quando o CFOup levanta um alerta na Visão Geral.",
      fields: {
        margemLiquida: {
          label: "Margem líquida alvo",
          value: null,
          hint: "Alerta quando ficar abaixo da meta",
        },
        runway: {
          label: "Runway mínimo",
          value: null,
          hint: "Alerta crítico abaixo do piso definido",
        },
        concentracao: {
          label: "Concentração máxima por cliente",
          value: null,
          hint: "Alerta acima desse valor",
        },
        pmr: {
          label: "PMR tolerado",
          value: null,
          hint: "Alerta quando ultrapassa o prazo",
        },
      },
    },

    alertas: {
      title: "Alertas e comunicação",
      description:
        "Escolha como o CFOup avisa a Gregorutt quando algo sair do combinado.",
      toggles: [
        {
          id: "resumo-diario",
          label: "Resumo diário por e-mail",
          description: "Entregue às 08:00, apenas nos dias úteis.",
          on: false,
        },
        {
          id: "alertas-criticos",
          label: "Alertas críticos em tempo real",
          description: "Notificações quando um limite for ultrapassado.",
          on: false,
        },
        {
          id: "relatorio-mensal",
          label: "Relatório mensal consolidado",
          description: "Fechamento em PDF, enviado ao seu contador.",
          on: false,
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
      title: "Relatórios e envios",
      description:
        "Quem recebe, com que frequência e em qual formato. Definido após as conexões ativas.",
      fields: {
        destinatarios: {
          label: "Destinatários",
          value: null,
          hint: "Ex.: diretoria, contador, sócios",
        },
        frequencia: {
          label: "Frequência de envio",
          value: null,
        },
        formato: {
          label: "Formato padrão",
          value: null,
          hint: "PDF executivo ou planilha detalhada",
        },
      },
      toggles: [
        {
          id: "anexar-planilha",
          label: "Anexar planilha detalhada",
          description: "Inclui movimentações linha a linha no envio mensal.",
          on: false,
        },
        {
          id: "copiar-contador",
          label: "Enviar cópia ao contador",
          description: "Contador recebe o fechamento junto da diretoria.",
          on: false,
        },
      ],
    },

    seguranca: {
      title: "Segurança e acesso",
      description:
        "Controles de autenticação e auditoria. Ativados depois que os dados da empresa entrarem.",
      fields: {
        autenticacao: {
          label: "Autenticação em dois fatores",
          value: null,
          hint: "Recomendado para todos os administradores",
        },
        sessao: {
          label: "Expiração de sessão",
          value: null,
        },
        ultimoAcesso: {
          label: "Último acesso registrado",
          value: null,
        },
      },
      toggles: [
        {
          id: "exigir-2fa",
          label: "Exigir 2FA para admins",
          description: "Todo administrador precisa confirmar login no celular.",
          on: false,
        },
        {
          id: "log-auditoria",
          label: "Log de auditoria detalhado",
          description: "Registra quem abriu cada tela e quando.",
          on: false,
        },
      ],
    },
  }
}
