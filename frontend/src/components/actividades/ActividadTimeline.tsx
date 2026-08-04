import { Link } from "react-router-dom";
import {
  Bug,
  ClipboardList,
  Droplets,
  FlaskConical,
  History,
  Leaf,
  Mountain,
  Scissors,
  SearchCheck,
  ShieldCheck,
  Shovel,
  Sprout,
  Tractor,
  Warehouse,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";
import { ActividadEstadoBadge, ActividadPrioridadBadge } from "./ActividadBadges";
import { formatearFecha, type Actividad } from "../../pages/actividades/actividadMock";

type ActividadTimelineProps = {
  actividades: Actividad[];
  current: Actividad;
};

type FaseMeta = {
  icono: LucideIcon;
  color: string;
  fondo: string;
};

const fasesCiclo: Record<string, FaseMeta> = {
  "Preparación del Terreno": { icono: Tractor, color: "text-gray-600", fondo: "bg-gray-100" },
  Siembra: { icono: Sprout, color: "text-forest-600", fondo: "bg-forest-600/10" },
  Resiembra: { icono: Sprout, color: "text-forest-600", fondo: "bg-forest-600/10" },
  Fertilización: { icono: Leaf, color: "text-sun-600", fondo: "bg-sun-50" },
  Compostaje: { icono: Leaf, color: "text-sun-600", fondo: "bg-sun-50" },
  "Aplicación de Bioles": { icono: FlaskConical, color: "text-emerald-600", fondo: "bg-emerald-50" },
  "Control Biológico": { icono: Bug, color: "text-sky-600", fondo: "bg-sky-50" },
  "Manejo de Plagas": { icono: Bug, color: "text-sky-600", fondo: "bg-sky-50" },
  "Manejo de Enfermedades": { icono: ShieldCheck, color: "text-rose-600", fondo: "bg-rose-50" },
  Inspección: { icono: SearchCheck, color: "text-teal-600", fondo: "bg-teal-50" },
  Deshierbo: { icono: Shovel, color: "text-amber-600", fondo: "bg-amber-50" },
  Riego: { icono: Droplets, color: "text-blue-600", fondo: "bg-blue-50" },
  Poda: { icono: Scissors, color: "text-violet-600", fondo: "bg-violet-50" },
  Aporque: { icono: Mountain, color: "text-stone-600", fondo: "bg-stone-100" },
  Cosecha: { icono: Wheat, color: "text-yellow-600", fondo: "bg-yellow-50" },
  Acopio: { icono: Warehouse, color: "text-indigo-600", fondo: "bg-indigo-50" },
  Otra: { icono: ClipboardList, color: "text-gray-500", fondo: "bg-gray-100" },
};

const ordenCiclo: Record<string, number> = {
  "Preparación del Terreno": 1,
  Siembra: 2,
  Resiembra: 3,
  Fertilización: 4,
  Compostaje: 5,
  "Aplicación de Bioles": 6,
  "Control Biológico": 7,
  "Manejo de Plagas": 8,
  "Manejo de Enfermedades": 9,
  Inspección: 10,
  Deshierbo: 11,
  Riego: 12,
  Poda: 13,
  Aporque: 14,
  Cosecha: 15,
  Acopio: 16,
  Otra: 17,
};

const etapasCiclo = [
  "Siembra",
  "Fertilización",
  "Deshierbo",
  "Riego",
  "Control Biológico",
  "Inspección",
  "Acopio",
];

export function ActividadTimeline({ actividades, current }: ActividadTimelineProps) {
  const historial = actividades
    .filter((a) => a.parcela === current.parcela)
    .sort((a, b) => {
      const orden = (ordenCiclo[a.tipoActividad] ?? 99) - (ordenCiclo[b.tipoActividad] ?? 99);
      return orden !== 0 ? orden : a.fecha.localeCompare(b.fecha);
    });

  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Parcela"
        description={`${current.parcela} · Ciclo del cultivo: ${current.cultivo}`}
      />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {etapasCiclo.map((etapa, index) => {
          const icono = fasesCiclo[etapa]?.icono ?? ClipboardList;
          const color = fasesCiclo[etapa]?.color ?? "text-gray-500";
          const fondo = fasesCiclo[etapa]?.fondo ?? "bg-gray-100";
          const Icono = icono;

          return (
            <div key={etapa} className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full ${fondo} px-3 py-1.5 text-xs font-semibold ${color}`}
              >
                <Icono className="h-3.5 w-3.5" />
                {etapa}
              </span>
              {index < etapasCiclo.length - 1 && (
                <span className="h-px w-4 bg-gray-200" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {historial.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">Sin actividades previas registradas.</p>
      ) : (
        <ol>
          {historial.map((actividad, index) => {
            const esActual = actividad.id === current.id;
            const esUltimo = index === historial.length - 1;
            const meta = fasesCiclo[actividad.tipoActividad] ?? fasesCiclo.Otra;
            const Icono = meta.icono;

            return (
              <li key={actividad.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.fondo} ${meta.color} ${
                      esActual ? "ring-4 ring-forest-600/15" : ""
                    }`}
                  >
                    <Icono className="h-5 w-5" />
                  </span>
                  {!esUltimo && <span className="mt-1 w-px flex-1 bg-gray-200" />}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/actividades/${actividad.id}`}
                      className={`text-sm font-semibold transition-colors ${
                        esActual ? "text-forest-700" : "text-[#111827] hover:text-forest-700"
                      }`}
                    >
                      {actividad.codigo}
                    </Link>
                    {esActual && (
                      <span className="inline-flex items-center rounded-full bg-forest-100 px-2.5 py-0.5 text-[11px] font-semibold text-forest-700">
                        Actual
                      </span>
                    )}
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-[#111827]">{actividad.tipoActividad}</span>
                    <ActividadEstadoBadge estado={actividad.estado} />
                    <ActividadPrioridadBadge prioridad={actividad.prioridad} />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatearFecha(actividad.fecha)} · {actividad.productor} · {actividad.responsableTecnico}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </CardShell>
  );
}
