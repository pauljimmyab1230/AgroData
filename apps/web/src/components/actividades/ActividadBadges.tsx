import { Badge } from "../ui";
import { tipoActividadLabels, estadoLabels, prioridadLabels } from "../../services/actividades";

const tipoColores: Record<string, string> = {
  PREPARACION_TERRENO: "bg-amber-100 text-amber-800",
  SIEMBRA: "bg-emerald-100 text-emerald-800",
  RESIEMBRA: "bg-emerald-100 text-emerald-800",
  FERTILIZACION: "bg-teal-100 text-teal-800",
  COMPOSTAJE: "bg-lime-100 text-lime-800",
  APLICACION_BIOLES: "bg-green-100 text-green-800",
  CONTROL_BIOLOGICO: "bg-sky-100 text-sky-800",
  MANEJO_PLAGAS: "bg-orange-100 text-orange-800",
  MANEJO_ENFERMEDADES: "bg-rose-100 text-rose-800",
  DESHIERBIE: "bg-violet-100 text-violet-800",
  RIEGO: "bg-cyan-100 text-cyan-800",
  PODA: "bg-fuchsia-100 text-fuchsia-800",
  APORQUE: "bg-indigo-100 text-indigo-800",
  COSECHA: "bg-yellow-100 text-yellow-800",
  OTRA: "bg-gray-100 text-gray-700",
};

export function ActividadTipoBadge({ tipo }: { tipo: string }) {
  const label = tipoActividadLabels[tipo] ?? tipo;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tipoColores[tipo] ?? tipoColores.OTRA}`}
    >
      {label}
    </span>
  );
}

const estadoVariantes: Record<string, "yellow" | "purple" | "green"> = {
  PROGRAMADA: "yellow",
  EN_PROCESO: "purple",
  COMPLETADA: "green",
};

export function ActividadEstadoBadge({ estado }: { estado: string }) {
  const label = estadoLabels[estado] ?? estado;
  return <Badge variant={estadoVariantes[estado]}>{label}</Badge>;
}

const prioridadVariantes: Record<string, "red" | "yellow" | "gray"> = {
  ALTA: "red",
  MEDIA: "yellow",
  BAJA: "gray",
};

export function ActividadPrioridadBadge({ prioridad }: { prioridad: string }) {
  const label = prioridadLabels[prioridad] ?? prioridad;
  return <Badge variant={prioridadVariantes[prioridad]}>{label}</Badge>;
}
