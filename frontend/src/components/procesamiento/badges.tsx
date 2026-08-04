import { Badge } from "../ui";
import type { EstadoProcesamiento, CalidadProducto } from "../../pages/procesamiento/procesamientoMock";

export function EstadoProcesamientoBadge({ estado }: { estado: EstadoProcesamiento }) {
  switch (estado) {
    case "Registrada":
      return <Badge variant="purple">Registrada</Badge>;
    case "En Proceso":
      return <Badge variant="yellow">En Proceso</Badge>;
    case "Completada":
      return <Badge variant="forest">Completada</Badge>;
    case "Pausada":
      return <Badge variant="red">Pausada</Badge>;
    case "Cancelada":
      return <Badge variant="gray">Cancelada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function EstadoOperacionBadge({ estado }: { estado: string }) {
  switch (estado) {
    case "Pendiente":
      return <Badge variant="gray">Pendiente</Badge>;
    case "En Curso":
      return <Badge variant="yellow">En Curso</Badge>;
    case "Completada":
      return <Badge variant="forest">Completada</Badge>;
    case "No Aplica":
      return <Badge variant="gray">N/A</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function CalidadBadge({ calidad }: { calidad?: CalidadProducto }) {
  if (!calidad) return <Badge variant="gray">Pendiente</Badge>;
  switch (calidad) {
    case "Primera":
      return <Badge variant="forest">Primera</Badge>;
    case "Segunda":
      return <Badge variant="yellow">Segunda</Badge>;
    case "Tercera":
      return <Badge variant="purple">Tercera</Badge>;
    case "Descarte":
      return <Badge variant="red">Descarte</Badge>;
    default:
      return <Badge>{calidad}</Badge>;
  }
}
