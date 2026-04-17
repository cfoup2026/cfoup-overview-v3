import { redirect } from "next/navigation"

// Entry point: send unauthenticated visitors to the access screen.
// Replace with real auth check once a session provider is wired up.
export default function RootPage() {
  redirect("/entrar")
}
