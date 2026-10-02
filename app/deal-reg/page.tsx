import { getCurrentUser } from "@/lib/auth/guard";
import { RODashboard } from "@/components/ro/RODashboard";
import { PublicRO } from "@/components/ro/PublicRO";
import { RoShell } from "@/components/ro/RoShell";
import { getProcessos, getFabricantes, getSalesEngineers } from "@/lib/queries/ro";

export const dynamic = "force-dynamic";

// SITE "SÓ RO" (gestão, 2026-06-29; ajustado 2026-07-01): visual limpo para TODOS, sem o
// painel pesado (Shell/sidebar).
//  • Qualquer usuário LOGADO → frame leve + LISTA de ROs (Administrador vê todos, os demais
//    veem o recorte que já é deles no RODashboard: AM = que emitiu, Intern/SE = os seus).
//  • Anônimo (sem login) → frame leve + só o formulário público.
// As demais páginas continuam existindo e funcionando, apenas fora do caminho.
// Reverter: `git checkout site-com-login-2026-06-29` + re-deploy.
export default async function DealRegPage() {
  const user = await getCurrentUser();
  const ehAdmin = user?.role === "Administrador";

  const fabricantes = await getFabricantes();

  // Anônimo: só registra oportunidade.
  if (!user) return <PublicRO fabricantes={fabricantes} />;

  // Logado (qualquer papel): frame leve com a lista de ROs (Administrador vê todos, inclusive os públicos).
  const [processos, salesEngineers] = await Promise.all([getProcessos(), getSalesEngineers()]);
  return (
    <RoShell mode="admin" title="Registros de oportunidade"
      subtitle={ehAdmin ? "Todos os registros recebidos (inclusive os públicos). Visível somente para você." : "Seus registros de oportunidade."}>
      <RODashboard processos={processos} fabricantes={fabricantes} salesEngineers={salesEngineers} podeCriar meId={user!.id || ""} role={user!.role} />
    </RoShell>
  );
}
