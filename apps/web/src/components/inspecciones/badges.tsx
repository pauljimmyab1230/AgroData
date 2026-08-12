import { Badge } from "../ui";
import type {
  Cumplimiento,
  EstadoAccionCorrectiva,
  EstadoInspeccion,
  EstadoNoConformidad,
  ResultadoInspeccion,
  Riesgo,
  Severidad,
} from "../../services/inspecciones";

export function EstadoBadge({ estado }: { estado: EstadoInspeccion }) {
  switch (estado) {
    case "APROBADA":
      return <Badge variant="forest">Aprobada</Badge>;
    case "PENDIENTE":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "NO_CONFORME":
      return <Badge variant="red">No Conforme</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function ResultadoBadge({ resultado }: { resultado: ResultadoInspeccion | null }) {
  if (!resultado) return <Badge>—</Badge>;
  switch (resultado) {
    case "CONFORME":
      return <Badge variant="green">Conforme</Badge>;
    case "CONFORME_CON_OBSERVACIONES":
      return <Badge variant="yellow">Conforme con Observaciones</Badge>;
    case "NO_CONFORME":
      return <Badge variant="red">No Conforme</Badge>;
    default:
      return <Badge>{resultado}</Badge>;
  }
}

export function CumplimientoBadge({ cumplimiento }: { cumplimiento: Cumplimiento | null }) {
  switch (cumplimiento) {
    case "CUMPLE":
      return <Badge variant="green">Cumple</Badge>;
    case "NO_CUMPLE":
      return <Badge variant="red">No Cumple</Badge>;
    case "NO_APLICA":
      return <Badge variant="gray">No Aplica</Badge>;
    default:
      return <Badge variant="default">Sin evaluar</Badge>;
  }
}

export function SeveridadBadge({ severidad }: { severidad: Severidad }) {
  switch (severidad) {
    case "CRITICA":
      return <Badge variant="red">Crítica</Badge>;
    case "MODERADA":
      return <Badge variant="yellow">Moderada</Badge>;
    case "LEVE":
      return <Badge variant="gray">Leve</Badge>;
    default:
      return <Badge>{severidad}</Badge>;
  }
}

export function RiesgoBadge({ riesgo }: { riesgo: Riesgo | null }) {
  switch (riesgo) {
    case "ALTO":
      return <Badge variant="red">Alto</Badge>;
    case "MEDIO":
      return <Badge variant="yellow">Medio</Badge>;
    case "BAJO":
      return <Badge variant="green">Bajo</Badge>;
    default:
      return <Badge variant="gray">—</Badge>;
  }
}

export function EstadoNoConformidadBadge({ estado }: { estado: EstadoNoConformidad }) {
  switch (estado) {
    case "PENDIENTE":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "EN_PROCESO":
      return <Badge variant="purple">En Proceso</Badge>;
    case "CORREGIDA":
      return <Badge variant="forest">Corregida</Badge>;
    case "VERIFICADA":
      return <Badge variant="green">Verificada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}

export function EstadoAccionCorrectivaBadge({ estado }: { estado: EstadoAccionCorrectiva }) {
  switch (estado) {
    case "PENDIENTE":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "EN_PROCESO":
      return <Badge variant="purple">En Proceso</Badge>;
    case "COMPLETADA":
      return <Badge variant="green">Completada</Badge>;
    case "VERIFICADA":
      return <Badge variant="forest">Verificada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}
