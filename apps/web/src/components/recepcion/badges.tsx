import { Badge } from "../ui";

const estadoLabels: Record<string, string> = {
  PENDIENTE_PESAJE: "Pendiente de Pesaje",
  EN_CONTROL_CALIDAD: "En Control de Calidad",
  DISPONIBLE: "Disponible",
  RECHAZADA: "Rechazada",
};

export function EstadoRecepcionBadge({ estado }: { estado: string }) {
  const label = estadoLabels[estado] ?? estado;
  switch (estado) {
    case "PENDIENTE_PESAJE":
      return <Badge variant="yellow">{label}</Badge>;
    case "EN_CONTROL_CALIDAD":
      return <Badge variant="purple">{label}</Badge>;
    case "DISPONIBLE":
      return <Badge variant="green">{label}</Badge>;
    case "RECHAZADA":
      return <Badge variant="red">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}

const resultadoLabels: Record<string, string> = {
  ACEPTADO: "Aceptado",
  ACEPTADO_CON_OBSERVACIONES: "Aceptado con Observaciones",
  RECHAZADO: "Rechazado",
};

export function ResultadoRecepcionBadge({ resultado }: { resultado?: string }) {
  if (!resultado) return <Badge variant="gray">Pendiente</Badge>;
  const label = resultadoLabels[resultado] ?? resultado;
  switch (resultado) {
    case "ACEPTADO":
      return <Badge variant="forest">{label}</Badge>;
    case "ACEPTADO_CON_OBSERVACIONES":
      return <Badge variant="yellow">{label}</Badge>;
    case "RECHAZADO":
      return <Badge variant="red">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}

const categoriaLabels: Record<string, string> = {
  PRIMERA: "Primera",
  SEGUNDA: "Segunda",
  INDUSTRIAL: "Industrial",
  DESCARTE: "Descarte",
};

export function CategoriaRecepcionBadge({ categoria }: { categoria?: string }) {
  if (!categoria) return <Badge variant="gray">Sin categoría</Badge>;
  const label = categoriaLabels[categoria] ?? categoria;
  switch (categoria) {
    case "PRIMERA":
      return <Badge variant="forest">{label}</Badge>;
    case "SEGUNDA":
      return <Badge variant="green">{label}</Badge>;
    case "INDUSTRIAL":
      return <Badge variant="yellow">{label}</Badge>;
    case "DESCARTE":
      return <Badge variant="red">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}

const destinoLabels: Record<string, string> = {
  PROCESAMIENTO: "Procesamiento",
  ALMACEN_TEMPORAL: "Almacén Temporal",
  RECHAZADO: "Rechazado",
};

export function DestinoRecepcionBadge({ destino }: { destino?: string }) {
  if (!destino) return <Badge variant="gray">Sin destino</Badge>;
  const label = destinoLabels[destino] ?? destino;
  switch (destino) {
    case "PROCESAMIENTO":
      return <Badge variant="green">{label}</Badge>;
    case "ALMACEN_TEMPORAL":
      return <Badge variant="purple">{label}</Badge>;
    case "RECHAZADO":
      return <Badge variant="red">{label}</Badge>;
    default:
      return <Badge>{label}</Badge>;
  }
}
