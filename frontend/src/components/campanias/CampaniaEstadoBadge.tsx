import { Badge } from "../ui";
import type { CampaniaEstado } from "../../pages/campañas/campaniaMock";

type BadgeVariant = "forest" | "yellow" | "gray" | "red";

const variantes: Record<CampaniaEstado, BadgeVariant> = {
  Activa: "forest",
  Planificada: "yellow",
  Finalizada: "gray",
  Cancelada: "red",
};

export function CampaniaEstadoBadge({ estado }: { estado: CampaniaEstado }) {
  return <Badge variant={variantes[estado]}>{estado}</Badge>;
}
