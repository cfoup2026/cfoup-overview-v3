// =============================================================
// CFOup · Tipos gerados do schema Supabase
// =============================================================
// Origem: gerado por supabase MCP em 18/mai/2026 após CP#03.5
// Projeto: jqlxgniopqgzcumyktnx (AI CFO for Small Businesses)
// Migrations aplicadas:
//   - cp02_initial_product_schema
//   - cp02_harden_security_definer_functions
//   - cp03_grant_execute_rls_helpers
//   - cp03_companies_select_creator_policy
//   - cp03_5_companies_profile_extension  ← novo (CP#03.5)
//
// NÃO EDITAR À MÃO. Regenerar via Supabase MCP quando o schema mudar.
//
// Tabelas do produto (7 — todas com RLS):
//   - users, companies (20 colunas após CP#03.5), companies_users
//   - bank_accounts, transactions, eventos_caixa, import_runs
//
// Tabelas dormindo (6 — portal Gregorutt, isoladas):
//   - priorities, posts, deliveries, decisions, links, folders
// =============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_number: string
          account_type: string
          agency: string | null
          bank: string
          company_id: string
          created_at: string
          holder: string
          id: string
          opening_balance_amount: number | null
          opening_balance_date: string | null
          updated_at: string
        }
        Insert: {
          account_number: string
          account_type: string
          agency?: string | null
          bank: string
          company_id: string
          created_at?: string
          holder: string
          id?: string
          opening_balance_amount?: number | null
          opening_balance_date?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string
          account_type?: string
          agency?: string | null
          bank?: string
          company_id?: string
          created_at?: string
          holder?: string
          id?: string
          opening_balance_amount?: number | null
          opening_balance_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cartao_cnpj_file_name: string | null
          cartao_cnpj_imported_at: string | null
          cnae_principal_codigo: string | null
          cnae_principal_descricao: string | null
          cnpj: string
          contato_responsavel: string | null
          created_at: string
          created_by: string | null
          data_abertura: string | null
          data_situacao_cadastral: string | null
          email: string | null
          endereco_completo: string | null
          id: string
          name: string
          porte: string | null
          regime: string | null
          short_name: string | null
          situacao_cadastral: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cartao_cnpj_file_name?: string | null
          cartao_cnpj_imported_at?: string | null
          cnae_principal_codigo?: string | null
          cnae_principal_descricao?: string | null
          cnpj: string
          contato_responsavel?: string | null
          created_at?: string
          created_by?: string | null
          data_abertura?: string | null
          data_situacao_cadastral?: string | null
          email?: string | null
          endereco_completo?: string | null
          id?: string
          name: string
          porte?: string | null
          regime?: string | null
          short_name?: string | null
          situacao_cadastral?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cartao_cnpj_file_name?: string | null
          cartao_cnpj_imported_at?: string | null
          cnae_principal_codigo?: string | null
          cnae_principal_descricao?: string | null
          cnpj?: string
          contato_responsavel?: string | null
          created_at?: string
          created_by?: string | null
          data_abertura?: string | null
          data_situacao_cadastral?: string | null
          email?: string | null
          endereco_completo?: string | null
          id?: string
          name?: string
          porte?: string | null
          regime?: string | null
          short_name?: string | null
          situacao_cadastral?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies_users: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          created_at: string | null
          id: string
          position: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position?: number | null
          text: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          created_at: string | null
          done: boolean | null
          id: string
          position: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          done?: boolean | null
          id?: string
          position?: number | null
          text: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          done?: boolean | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      eventos_caixa: {
        Row: {
          bucket_id: string
          bucket_nome: string
          cenario_id: string | null
          company_id: string
          competencia: string | null
          confianca: string
          confianca_origem: string
          confirmado_em: string | null
          confirmado_por: string | null
          conta_origem_nome: string | null
          contraparte_id: string | null
          contraparte_nome_origem: string | null
          contraparte_tipo: string | null
          criado_em: string
          criado_por: string | null
          criticidade: string
          data_esperada: string
          data_realizada: string | null
          data_vencimento: string | null
          descricao_origem: string | null
          direcao: string
          documento_ref: string | null
          id: string
          is_transferencia: boolean
          legal_entity_id: string | null
          observacao: string | null
          origem: string
          origem_ref: string | null
          reconciliado_com: string | null
          reconciliado_em: string | null
          source_company_code: string | null
          status: string
          transferencia_par_id: string | null
          valor: number
        }
        Insert: {
          bucket_id: string
          bucket_nome: string
          cenario_id?: string | null
          company_id: string
          competencia?: string | null
          confianca: string
          confianca_origem: string
          confirmado_em?: string | null
          confirmado_por?: string | null
          conta_origem_nome?: string | null
          contraparte_id?: string | null
          contraparte_nome_origem?: string | null
          contraparte_tipo?: string | null
          criado_em?: string
          criado_por?: string | null
          criticidade: string
          data_esperada: string
          data_realizada?: string | null
          data_vencimento?: string | null
          descricao_origem?: string | null
          direcao: string
          documento_ref?: string | null
          id?: string
          is_transferencia?: boolean
          legal_entity_id?: string | null
          observacao?: string | null
          origem: string
          origem_ref?: string | null
          reconciliado_com?: string | null
          reconciliado_em?: string | null
          source_company_code?: string | null
          status: string
          transferencia_par_id?: string | null
          valor: number
        }
        Update: {
          bucket_id?: string
          bucket_nome?: string
          cenario_id?: string | null
          company_id?: string
          competencia?: string | null
          confianca?: string
          confianca_origem?: string
          confirmado_em?: string | null
          confirmado_por?: string | null
          conta_origem_nome?: string | null
          contraparte_id?: string | null
          contraparte_nome_origem?: string | null
          contraparte_tipo?: string | null
          criado_em?: string
          criado_por?: string | null
          criticidade?: string
          data_esperada?: string
          data_realizada?: string | null
          data_vencimento?: string | null
          descricao_origem?: string | null
          direcao?: string
          documento_ref?: string | null
          id?: string
          is_transferencia?: boolean
          legal_entity_id?: string | null
          observacao?: string | null
          origem?: string
          origem_ref?: string | null
          reconciliado_com?: string | null
          reconciliado_em?: string | null
          source_company_code?: string | null
          status?: string
          transferencia_par_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "eventos_caixa_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_caixa_confirmado_por_fkey"
            columns: ["confirmado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_caixa_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_caixa_reconciliado_com_fkey"
            columns: ["reconciliado_com"]
            isOneToOne: false
            referencedRelation: "eventos_caixa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_caixa_transferencia_par_id_fkey"
            columns: ["transferencia_par_id"]
            isOneToOne: false
            referencedRelation: "eventos_caixa"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          position: number | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          user_id?: string
        }
        Relationships: []
      }
      import_runs: {
        Row: {
          company_id: string
          created_by: string | null
          error: string | null
          file_hash: string
          file_name: string
          file_size: number | null
          finished_at: string | null
          id: string
          rows_imported: number
          rows_skipped: number
          source: string
          started_at: string
          status: string
        }
        Insert: {
          company_id: string
          created_by?: string | null
          error?: string | null
          file_hash: string
          file_name: string
          file_size?: number | null
          finished_at?: string | null
          id?: string
          rows_imported?: number
          rows_skipped?: number
          source: string
          started_at?: string
          status?: string
        }
        Update: {
          company_id?: string
          created_by?: string | null
          error?: string | null
          file_hash?: string
          file_name?: string
          file_size?: number | null
          finished_at?: string | null
          id?: string
          rows_imported?: number
          rows_skipped?: number
          source?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_runs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_runs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          created_at: string | null
          id: string
          label: string
          position: number | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          position?: number | null
          url: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          position?: number | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          created_at: string | null
          day: string
          id: string
          position: number | null
          status: string
          title: string
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day: string
          id?: string
          position?: number | null
          status?: string
          title: string
          topic?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          day?: string
          id?: string
          position?: number | null
          status?: string
          title?: string
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      priorities: {
        Row: {
          created_at: string | null
          id: string
          position: number | null
          priority: string
          status: string
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position?: number | null
          priority?: string
          status?: string
          text: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number | null
          priority?: string
          status?: string
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bank_account_id: string
          company_id: string
          created_at: string
          direction: string
          doc_number: string | null
          history: string
          id: string
          import_run_id: string | null
          reconciled: boolean
          reconciled_to: string | null
          running_balance: number | null
          source: string
          source_ref: string | null
          tx_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          bank_account_id: string
          company_id: string
          created_at?: string
          direction: string
          doc_number?: string | null
          history: string
          id?: string
          import_run_id?: string | null
          reconciled?: boolean
          reconciled_to?: string | null
          running_balance?: number | null
          source: string
          source_ref?: string | null
          tx_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          company_id?: string
          created_at?: string
          direction?: string
          doc_number?: string | null
          history?: string
          id?: string
          import_run_id?: string | null
          reconciled?: boolean
          reconciled_to?: string | null
          running_balance?: number | null
          source?: string
          source_ref?: string | null
          tx_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_reconciled_to_fkey"
            columns: ["reconciled_to"]
            isOneToOne: false
            referencedRelation: "eventos_caixa"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      company_role: { Args: { _company_id: string }; Returns: string }
      is_company_member: { Args: { _company_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
