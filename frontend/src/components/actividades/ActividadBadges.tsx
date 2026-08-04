import { Badge } from "../ui";
import type { EstadoActividad, Prioridad, TipoActividad } from "../../pages/actividades/actividadMock";

const tipoColores: Record<TipoActividad, string> = {
  "Preparación del Terreno": "bg-amber-100 text-amber-800",
  Siembra: "bg-emerald-100 text-emerald-800",
  Resiembra: "bg-emerald-100 text-emerald-800",
  Fertilización: "bg-teal-100 text-teal-800",
  Compostaje: "bg-lime-100 text-lime-800",
  "Aplicación de Bioles": "bg-green-100 text-green-800",
  "Control Biológico": "bg-sky-100 text-sky-800",
  "Manejo de Plagas": "bg-orange-100 text-orange-800",
  "Manejo de Enfermedades": "bg-rose-100 text-rose-800",
  Deshierbo: "bg-violet-100 text-violet-800",
  Riego: "bg-cyan-100 text-cyan-800",
  Poda: "bg-fuchsia-100 text-fuchsia-800",
  Aporque: "bg-indigo-100 text-indigo-800",
  Cosecha: "bg-yellow-100 text-yellow-800",
  Otra: "bg-gray-100 text-gray-700",
};

export function ActividadTipoBadge({ tipo }: { tipo: TipoActividad }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tipoColores[tipo] ?? tipoColores.Otra}`}
    >
      {tipo}
    </span>
  );
}

const estadoVariantes: Record<EstadoActividad, "yellow" | "purple" | "green"> = {
  Programada: "yellow",
  "En Proceso": "purple",
  Completada: "green",
};

export function ActividadEstadoBadge({ estado }: { estado: EstadoActividad }) {
  return <Badge variant={estadoVariantes[estado]}>{estado}</Badge>;
}

const prioridadVariantes: Record<Prioridad, "red" | "yellow" | "gray"> = {
  Alta: "red",
  Media: "yellow",
  Baja: "gray",
};

export function ActividadPrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  return <Badge variant={prioridadVariantes[prioridad]}>{prioridad}</Badge>;
}
