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

import { clienteAtual } from "@/lib/clientes/cliente-atual"

export type ConfiguracoesSectionId =
  | "empresa"
  | "metas"
  | "alertas"
  | "relatorios"
  | "seguranca"

export type ConfiguracoesUserProfile = "admin" | "financeiro" | "contador" | "leitura"

export type ConfiguracoesUser = {
  id: string
  nome: string
  email: string
  perfil: ConfiguracoesUserProfile
}

export type ConfiguracoesField = {
  label: string
  value: string | null
  hint?: string
  placeholder?: string
  source?: "auto" | "manual"
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
      cnpj: ConfiguracoesField
      razaoSocial: ConfiguracoesField
      setor: ConfiguracoesField
      regime: ConfiguracoesField
      apelido: ConfiguracoesField
      moeda: ConfiguracoesField
      inicioFiscal: ConfiguracoesField
      contatoResponsavel: ConfiguracoesField
      emailResponsavel: ConfiguracoesField
      telefone: ConfiguracoesField
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

  equipe: {
    title: string
    description: string
    users: Array<ConfiguracoesUser>
    addLabel: string
    profileLabels: Record<ConfiguracoesUserProfile, string>
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
      eyebrow: "Implantação",
      title: "Configurações",
      description:
        "Ajuste como o CFOup deve operar para sua empresa: cadastro, metas, alertas, relatórios e permissões.",
    },

    banner: {
      title: "Comece preenchendo os dados da empresa",
      description:
        "Preencha ou importe os dados básicos da empresa para iniciar o CFOup.",
      ctaLabel: "Importar cartão CNPJ",
      ctaHref: "#",
    },

    emptyFieldLabel: "Aguardando conexão",

    sections: [
      { id: "empresa", label: "Cadastro da empresa" },
      { id: "metas", label: "Metas e tolerâncias" },
      { id: "alertas", label: "Alertas e notificações" },
      { id: "relatorios", label: "Relatórios automáticos" },
      { id: "seguranca", label: "Segurança e acesso" },
    ],

    empresa: {
      title: "Perfil da empresa",
      description: "",
      fields: {
        cnpj: { label: "CNPJ", value: null, placeholder: "Digite o CNPJ ou importe o cartão", source: "manual" },
        razaoSocial: { label: "Razão social", value: null, placeholder: "Será buscado via CNPJ", source: "auto" },
        setor: { label: "Setor de atuação", value: null, placeholder: "Será detectado via CNPJ ou ajuste manual", source: "auto" },
        regime: { label: "Regime tributário", value: null, placeholder: "Será detectado via CNPJ ou ajuste manual", source: "auto" },
        apelido: { label: "Apelido no CFOup", value: null, placeholder: "Como sua empresa é chamada no dia a dia", source: "manual" },
        moeda: { label: "Moeda padrão", value: "Real (BRL)", source: "manual" },
        inicioFiscal: { label: "Início do exercício fiscal", value: `Janeiro ${new Date().getFullYear()}`, source: "manual" },
        contatoResponsavel: {
          label: "Contato responsável",
          value: contatoNome,
          hint: "Usuário logado no CFOup",
          placeholder: "Não identificado",
          source: "manual",
        },
        emailResponsavel: {
          label: "E-mail do responsável",
          value: contatoEmail,
          placeholder: "Não identificado",
          source: "manual",
        },
        telefone: { label: "Telefone de contato", value: null, placeholder: "Adicionar telefone", source: "manual" },
      },
    },

    metas: {
      title: "Metas e tolerâncias",
      description:
        "Defina os limites que acionam alertas na Visão Geral. O CFOup compara seus dados com essas metas diariamente.",
      fields: {
        margemLiquida: {
          label: "Margem líquida alvo",
          value: null,
          hint: "Alerta quando ficar abaixo da meta",
          placeholder: "Definir meta",
        },
        runway: {
          label: "Runway mínimo",
          value: null,
          hint: "Alerta crítico abaixo do piso definido",
          placeholder: "Definir piso",
        },
        concentracao: {
          label: "Concentração máxima por cliente",
          value: null,
          hint: "Alerta acima desse valor",
          placeholder: "Definir limite",
        },
        pmr: {
          label: "PMR tolerado",
          value: null,
          hint: "Alerta quando ultrapassa o prazo",
          placeholder: "Definir prazo tolerado",
        },
      },
    },

    alertas: {
      title: "Alertas e comunicação",
      description: `Escolha como e quando o CFOup deve notificar a ${clienteAtual.empresa.nomeCurto}. Você pode ajustar a qualquer momento.`,
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
        "Configure quem recebe os relatórios, com que frequência e em qual formato. Pode ser ajustado depois.",
      fields: {
        destinatarios: {
          label: "Destinatários",
          value: null,
          hint: "Ex.: diretoria, contador, sócios",
          placeholder: "Adicionar destinatários",
        },
        frequencia: {
          label: "Frequência de envio",
          value: null,
          placeholder: "Mensal é o padrão — alterar se necessário",
        },
        formato: {
          label: "Formato padrão",
          value: null,
          hint: "PDF executivo ou planilha detalhada",
          placeholder: "PDF executivo é o padrão",
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
        "Controles de autenticação e auditoria para proteger os dados da empresa. Recomendamos ativar 2FA.",
      fields: {
        autenticacao: {
          label: "Autenticação em dois fatores",
          value: null,
          hint: "Recomendado para todos os administradores",
          placeholder: "Configurar 2FA",
        },
        sessao: {
          label: "Expiração de sessão",
          value: null,
          placeholder: "8 horas é o padrão — alterar se necessário",
        },
        ultimoAcesso: {
          label: "Último acesso registrado",
          value: null,
          placeholder: "Registrado a cada acesso",
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

    equipe: {
      title: "Equipe com acesso ao CFOup",
      description: "Cadastre quem vai usar o sistema na empresa. Você pode adicionar mais pessoas a qualquer momento.",
      users: [
        { id: "owner", nome: contatoNome ?? "—", email: contatoEmail ?? "—", perfil: "admin" },
      ],
      addLabel: "Adicionar usuário",
      profileLabels: {
        admin: "Admin",
        financeiro: "Financeiro",
        contador: "Contador",
        leitura: "Leitura",
      },
    },
  }
}
