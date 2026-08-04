import { Badge } from "../ui";
import type { EstadoAcopio } from "../../pages/acopio/acopioMock";

export function EstadoAcopioBadge({ estado }: { estado: EstadoAcopio }) {
  switch (estado) {
    case "Completado":
      return <Badge variant="forest">Completado</Badge>;
    case "En Proceso":
      return <Badge variant="yellow">En Proceso</Badge>;
    case "En Planta":
      return <Badge variant="purple">En Planta</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}
