import { Badge } from "../ui";
import type {
  Cumplimiento,
  EstadoAccionCorrectiva,
  EstadoInspeccion,
  EstadoNoConformidad,
  ResultadoInspeccion,
  Riesgo,
  Severidad,
} from "../../pages/inspecciones/inspeccionMock";

export function EstadoBadge({ estado }: { estado: EstadoInspeccion }) {
  switch (estado) {
    case "Aprobada":
      return <Badge variant="forest">Aprobada</Badge>;
    case "Pendiente":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "No Conforme":
      return <Badge variant="red">No Conforme</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function ResultadoBadge({ resultado }: { resultado: ResultadoInspeccion }) {
  switch (resultado) {
    case "Conforme":
      return <Badge variant="green">Conforme</Badge>;
    case "Conforme con Observaciones":
      return <Badge variant="yellow">Conforme con Observaciones</Badge>;
    case "No Conforme":
      return <Badge variant="red">No Conforme</Badge>;
    default:
      return <Badge>{resultado}</Badge>;
  }
}

export function CumplimientoBadge({ cumplimiento }: { cumplimiento: Cumplimiento | null }) {
  switch (cumplimiento) {
    case "Cumple":
      return <Badge variant="green">Cumple</Badge>;
    case "No Cumple":
      return <Badge variant="red">No Cumple</Badge>;
    case "No Aplica":
      return <Badge variant="gray">No Aplica</Badge>;
    default:
      return <Badge variant="default">Sin evaluar</Badge>;
  }
}

export function SeveridadBadge({ severidad }: { severidad: Severidad }) {
  switch (severidad) {
    case "Crítica":
      return <Badge variant="red">Crítica</Badge>;
    case "Moderada":
      return <Badge variant="yellow">Moderada</Badge>;
    case "Leve":
      return <Badge variant="gray">Leve</Badge>;
    default:
      return <Badge>{severidad}</Badge>;
  }
}

export function RiesgoBadge({ riesgo }: { riesgo: Riesgo | null }) {
  switch (riesgo) {
    case "Alto":
      return <Badge variant="red">Alto</Badge>;
    case "Medio":
      return <Badge variant="yellow">Medio</Badge>;
    case "Bajo":
      return <Badge variant="green">Bajo</Badge>;
    default:
      return <Badge variant="gray">—</Badge>;
  }
}

export function EstadoNoConformidadBadge({ estado }: { estado: EstadoNoConformidad }) {
  switch (estado) {
    case "Pendiente":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "En Proceso":
      return <Badge variant="purple">En Proceso</Badge>;
    case "Corregida":
      return <Badge variant="forest">Corregida</Badge>;
    case "Verificada":
      return <Badge variant="green">Verificada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function EstadoAccionCorrectivaBadge({ estado }: { estado: EstadoAccionCorrectiva }) {
  switch (estado) {
    case "Pendiente":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "En Proceso":
      return <Badge variant="purple">En Proceso</Badge>;
    case "Completada":
      return <Badge variant="green">Completada</Badge>;
    case "Verificada":
      return <Badge variant="forest">Verificada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}
