"use client";
import { ROCreate } from "./ROCreate";
import { RoShell } from "./RoShell";

// Página PÚBLICA de Registro de Oportunidade (site aberto, gestão 2026-06-29).
// Qualquer pessoa registra SEM login. Lista/fichas seguem restritas ao Administrador.
export function PublicRO({ fabricantes }: { fabricantes: any[] }) {
  return (
    <RoShell mode="publico" title="Registrar oportunidade"
      subtitle="Preencha os dados abaixo para registrar uma oportunidade. A equipe da ENTERPRISECORE recebe e dá andamento — você não precisa de login.">
      <ROCreate fabricantes={fabricantes} publico />
    </RoShell>
  );
}
