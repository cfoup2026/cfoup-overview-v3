// Layout separado para /onboarding — SEM AppShell (sidebar/nav).
// O usuário aqui ainda não tem empresa; mostrar sidebar quebra UX.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
