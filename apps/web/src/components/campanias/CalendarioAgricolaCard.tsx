import { Fragment } from "react";
import { CalendarDays, Check, Factory, Leaf, SearchCheck, Sprout, Tractor, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";

type Fase = { id: number; nombre: string; periodo: string; estado: "Completada" | "Actual" | "Pendiente" };

const iconos: Record<string, LucideIcon> = {
  "Preparación del terreno": Tractor,
  Siembra: Sprout,
  "Manejo del cultivo": Leaf,
  Inspecciones: SearchCheck,
  Acopio: Warehouse,
  Procesamiento: Factory,
};

const dotClase: Record<Fase["estado"], string> = {
  Completada: "bg-forest-600 text-white shadow-md shadow-forest-600/30",
  Actual: "bg-sun-500 text-white ring-4 ring-sun-100 animate-pulse",
  Pendiente: "border-2 border-gray-200 bg-white text-gray-400",
};

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatPeriodo(fecha: Date): string {
  return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

function getFases(fechaInicio: string, fechaFin: string): Fase[] {
  const inicio = new Date(fechaInicio + "T00:00:00");
  const fin = new Date(fechaFin + "T00:00:00");
  const now = new Date();
  const totalDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);

  if (totalDias <= 0) {
    return [
      { id: 1, nombre: "Preparación del terreno", periodo: formatPeriodo(inicio), estado: "Pendiente" },
      { id: 2, nombre: "Siembra", periodo: formatPeriodo(inicio), estado: "Pendiente" },
      { id: 3, nombre: "Manejo del cultivo", periodo: formatPeriodo(inicio), estado: "Pendiente" },
      { id: 4, nombre: "Inspecciones", periodo: formatPeriodo(inicio), estado: "Pendiente" },
      { id: 5, nombre: "Acopio", periodo: formatPeriodo(inicio), estado: "Pendiente" },
      { id: 6, nombre: "Procesamiento", periodo: formatPeriodo(inicio), estado: "Pendiente" },
    ];
  }

  const diasTranscurridos = Math.max(0, (now.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  const progreso = Math.min(1, Math.max(0, diasTranscurridos / totalDias));

  const fasesDef = [
    { nombre: "Preparación del terreno", inicio: 0, fin: 0.1 },
    { nombre: "Siembra", inicio: 0.1, fin: 0.2 },
    { nombre: "Manejo del cultivo", inicio: 0.2, fin: 0.55 },
    { nombre: "Inspecciones", inicio: 0.3, fin: 0.7 },
    { nombre: "Acopio", inicio: 0.7, fin: 0.85 },
    { nombre: "Procesamiento", inicio: 0.85, fin: 1 },
  ];

  return fasesDef.map((f, i) => {
    const fechaFaseInicio = new Date(inicio.getTime() + (fin.getTime() - inicio.getTime()) * f.inicio);
    const fechaFaseFin = new Date(inicio.getTime() + (fin.getTime() - inicio.getTime()) * f.fin);
    const periodo = `${formatPeriodo(fechaFaseInicio)} - ${formatPeriodo(fechaFaseFin)}`;

    let estado: Fase["estado"] = "Pendiente";
    if (progreso >= f.fin) {
      estado = "Completada";
    } else if (progreso >= f.inicio && progreso < f.fin) {
      estado = "Actual";
    }

    return { id: i + 1, nombre: f.nombre, periodo, estado };
  });
}

interface CalendarioAgricolaCardProps {
  fechaInicio?: string;
  fechaFin?: string;
}

export function CalendarioAgricolaCard({ fechaInicio, fechaFin }: CalendarioAgricolaCardProps) {
  const fases = fechaInicio && fechaFin
    ? getFases(fechaInicio, fechaFin)
    : [
        { id: 1, nombre: "Preparación del terreno", periodo: "Sep - Oct", estado: "Pendiente" as const },
        { id: 2, nombre: "Siembra", periodo: "Oct - Nov", estado: "Pendiente" as const },
        { id: 3, nombre: "Manejo del cultivo", periodo: "Nov - Mar", estado: "Pendiente" as const },
        { id: 4, nombre: "Inspecciones", periodo: "Dic - Mar", estado: "Pendiente" as const },
        { id: 5, nombre: "Acopio", periodo: "Mar - Abr", estado: "Pendiente" as const },
        { id: 6, nombre: "Procesamiento", periodo: "Abr - May", estado: "Pendiente" as const },
      ];

  return (
    <CardShell>
      <CardHeader
        icon={<CalendarDays size={20} />}
        title="Calendario Agrícola"
        description="Fases del ciclo agrícola de la campaña"
      />

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-start">
          {fases.map((fase, i) => {
            const Icon = iconos[fase.nombre] ?? Check;
            const completada = fase.estado === "Completada";
            const esUltima = i === fases.length - 1;
            const siguienteCompletada =
              !esUltima && fases[i + 1].estado === "Completada";

            return (
              <Fragment key={fase.id}>
                <div className="flex w-32 shrink-0 flex-col items-center gap-3 text-center">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${dotClase[fase.estado]}`}
                  >
                    {completada ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">{fase.nombre}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{fase.periodo}</p>
                  </div>
                </div>

                {!esUltima && (
                  <div
                    className={`mt-5 h-1 w-10 shrink-0 rounded-full ${
                      siguienteCompletada || fase.estado === "Actual" ? "bg-forest-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}
