import { Badge } from "../ui";

const labels: Record<string, string> = {
  EN_CRECIMIENTO: "En Crecimiento",
  COSECHADO: "Cosechado",
  PERDIDO: "Perdido",
};

const variants: Record<string, "forest" | "yellow" | "red"> = {
  EN_CRECIMIENTO: "forest",
  COSECHADO: "yellow",
  PERDIDO: "red",
};

export const cultivoEstadoBadge = (estado: string) => {
  return <Badge variant={variants[estado] ?? "forest"}>{labels[estado] ?? estado}</Badge>;
};
