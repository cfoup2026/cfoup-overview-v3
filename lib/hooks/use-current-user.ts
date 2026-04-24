"use client"

// TODO: substituir por fetch/sessão real quando o backend de auth estiver disponível.
// Hoje retorna MOCK com o mesmo nome usado em /visao-geral.

export type CurrentUser = {
  name: string
  firstName: string
  email: string
  role: string
}

const MOCK_USER: CurrentUser = {
  name: "Roger Gregorutt",
  firstName: "Roger",
  email: "roger@gregorutt.com.br",
  role: "CEO",
}

export function useCurrentUser(): CurrentUser {
  // TODO: trocar por sessão real (ex.: SWR em /api/me) quando disponível.
  return MOCK_USER
}
