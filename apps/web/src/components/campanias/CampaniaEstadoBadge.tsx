import { Badge } from "../ui";

type BadgeVariant = "forest" | "yellow" | "gray" | "red";

const variantes: Record<string, BadgeVariant> = {
  ACTIVA: "forest",
  PLANIFICADA: "yellow",
  FINALIZADA: "gray",
  CANCELADA: "red",
};

const labels: Record<string, string> = {
  ACTIVA: "Activa",
  PLANIFICADA: "Planificada",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

export function CampaniaEstadoBadge({ estado }: { estado: string }) {
  return <Badge variant={variantes[estado] ?? "gray"}>{labels[estado] ?? estado}</Badge>;
}
