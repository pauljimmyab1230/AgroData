import { Fragment } from "react";
import { CalendarDays, Check, Factory, Leaf, SearchCheck, Sprout, Tractor, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";
import { campaniaCalendarioMock, type CampaniaFase } from "../../pages/campañas/campaniaMock";

type EstadoFase = CampaniaFase["estado"];

const iconos: Record<string, LucideIcon> = {
  "Preparación del terreno": Tractor,
  Siembra: Sprout,
  "Manejo del cultivo": Leaf,
  Inspecciones: SearchCheck,
  Acopio: Warehouse,
  Procesamiento: Factory,
};

const dotClase: Record<EstadoFase, string> = {
  Completada: "bg-forest-600 text-white shadow-md shadow-forest-600/30",
  Actual: "bg-sun-500 text-white ring-4 ring-sun-100 animate-pulse",
  Pendiente: "border-2 border-gray-200 bg-white text-gray-400",
};

export function CalendarioAgricolaCard() {
  return (
    <CardShell>
      <CardHeader
        icon={<CalendarDays size={20} />}
        title="Calendario Agrícola"
        description="Fases del ciclo agrícola de la campaña"
      />

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-start">
          {campaniaCalendarioMock.map((fase, i) => {
            const Icon = iconos[fase.nombre] ?? Check;
            const completada = fase.estado === "Completada";
            const actual = fase.estado === "Actual";
            const esUltima = i === campaniaCalendarioMock.length - 1;
            const siguienteCompletada =
              !esUltima && campaniaCalendarioMock[i + 1].estado === "Completada";

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
                      siguienteCompletada || actual ? "bg-forest-500" : "bg-gray-200"
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
