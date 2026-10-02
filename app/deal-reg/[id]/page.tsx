import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guard";
import { Empty } from "@/components/ui/primitives";
import { ROProcessoView } from "@/components/ro/ROProcessoView";
import { RoShell } from "@/components/ro/RoShell";
import { getProcesso } from "@/lib/queries/ro";

export const dynamic = "force-dynamic";

// Ficha de um RO — restrita ao Administrador (frame leve, sem Shell pesado).
// Quem não for admin é mandado de volta ao formulário público.
export default async function ROProcessoPage({ params, searchParams }: { params: { id: string }; searchParams: Record<string, string> }) {
  const user = await getCurrentUser();
  if (user?.role !== "Administrador") redirect("/deal-reg");
  const data = await getProcesso(params.id);
  if (!data) return <RoShell mode="admin"><Empty>Processo de RO não encontrado.</Empty></RoShell>;
  return (
    <RoShell mode="admin">
      <ROProcessoView
        proc={data.proc}
        registros={data.registros}
        eventos={data.eventos}
        podeExecutar
        novo={searchParams?.novo === "1"}
        meId={user!.id || ""}
        role={user!.role}
      />
    </RoShell>
  );
}
