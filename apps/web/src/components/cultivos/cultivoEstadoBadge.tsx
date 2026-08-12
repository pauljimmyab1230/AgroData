import { Badge } from "../ui";

const labels: Record<string, string> = {
  ACTIVO: "Activo",
  EN_DESARROLLO: "En Desarrollo",
  COSECHADO: "Cosechado",
  FINALIZADO: "Finalizado",
};

const variants: Record<string, "forest" | "yellow" | "green" | "gray"> = {
  ACTIVO: "forest",
  EN_DESARROLLO: "yellow",
  COSECHADO: "green",
  FINALIZADO: "gray",
};

export const cultivoEstadoBadge = (estado: string) => {
  return <Badge variant={variants[estado] ?? "gray"}>{labels[estado] ?? estado}</Badge>;
};
