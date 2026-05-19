import type { createClient } from "@/lib/supabase/server"

/**
 * Resolve a empresa ativa do user. Por ora: primeira empresa de companies_users
 * ordenada por created_at ASC (mesma regra que useActiveCompany do CP#03).
 * Quando company switcher entrar (V2), usar cookie httpOnly.
 */
export async function resolveActiveCompany(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("companies_users")
    .select("company_id, role")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return { companyId: data.company_id, role: data.role }
}
