import { Badge } from "../ui";
import type { EstadoRecepcion, ResultadoRecepcion } from "../../pages/recepcion/recepcionMock";

export function EstadoRecepcionBadge({ estado }: { estado: EstadoRecepcion }) {
  switch (estado) {
    case "Pendiente de Pesaje":
      return <Badge variant="yellow">Pendiente de Pesaje</Badge>;
    case "En Control de Calidad":
      return <Badge variant="purple">En Control de Calidad</Badge>;
    case "Disponible para Procesamiento":
      return <Badge variant="forest">Disponible para Procesamiento</Badge>;
    case "Rechazada":
      return <Badge variant="red">Rechazada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function ResultadoRecepcionBadge({ resultado }: { resultado?: ResultadoRecepcion }) {
  if (!resultado) return <Badge variant="gray">Pendiente</Badge>;
  switch (resultado) {
    case "Aceptado":
      return <Badge variant="forest">Aceptado</Badge>;
    case "Aceptado con Observaciones":
      return <Badge variant="yellow">Aceptado con Observaciones</Badge>;
    case "Rechazado":
      return <Badge variant="red">Rechazado</Badge>;
    default:
      return <Badge>{resultado}</Badge>;
  }
}
