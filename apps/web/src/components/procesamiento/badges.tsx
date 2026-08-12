import { Badge } from "../ui";

const estadoLabels: Record<string, string> = {
  REGISTRADA: "Registrada",
  EN_PROCESO: "En Proceso",
  COMPLETADA: "Completada",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

export function EstadoProcesamientoBadge({ estado }: { estado: string }) {
  const label = estadoLabels[estado] ?? estado;
  switch (estado) {
    case "REGISTRADA":
      return <Badge variant="purple">{label}</Badge>;
    case "EN_PROCESO":
      return <Badge variant="yellow">{label}</Badge>;
    case "COMPLETADA":
      return <Badge variant="forest">{label}</Badge>;
    case "PAUSADA":
      return <Badge variant="red">{label}</Badge>;
    case "CANCELADA":
      return <Badge variant="gray">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}

const operacionLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En Curso",
  COMPLETADA: "Completada",
  NO_APLICA: "N/A",
};

export function EstadoOperacionBadge({ estado }: { estado: string }) {
  const label = operacionLabels[estado] ?? estado;
  switch (estado) {
    case "PENDIENTE":
      return <Badge variant="gray">{label}</Badge>;
    case "EN_CURSO":
      return <Badge variant="yellow">{label}</Badge>;
    case "COMPLETADA":
      return <Badge variant="forest">{label}</Badge>;
    case "NO_APLICA":
      return <Badge variant="gray">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}

const calidadLabels: Record<string, string> = {
  PRIMERA: "Primera",
  SEGUNDA: "Segunda",
  TERCERA: "Tercera",
  DESCARTE: "Descarte",
};

export function CalidadBadge({ calidad }: { calidad?: string }) {
  if (!calidad) return <Badge variant="gray">Pendiente</Badge>;
  const label = calidadLabels[calidad] ?? calidad;
  switch (calidad) {
    case "PRIMERA":
      return <Badge variant="forest">{label}</Badge>;
    case "SEGUNDA":
      return <Badge variant="yellow">{label}</Badge>;
    case "TERCERA":
      return <Badge variant="purple">{label}</Badge>;
    case "DESCARTE":
      return <Badge variant="red">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}
