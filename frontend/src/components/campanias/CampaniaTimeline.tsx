import { History, Flag, FolderPlus, PlayCircle, Sprout, ClipboardList, SearchCheck, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "../ui";
import { CardHeader, CardShell } from "../shared/formControls";
import { campaniaHistorialMock, type CampaniaEvento, type CampaniaEventoTipo } from "../../pages/campañas/campaniaMock";

type EstadoEvento = CampaniaEvento["estado"];

const iconos: Record<CampaniaEventoTipo, LucideIcon> = {
  creacion: FolderPlus,
  registros: ClipboardList,
  cultivos: Sprout,
  actividad: PlayCircle,
  inspeccion: SearchCheck,
  acopio: Warehouse,
  cierre: Flag,
};

const dotClase: Record<EstadoEvento, string> = {
  Completado: "bg-forest-600 text-white",
  "En curso": "bg-sun-500 text-white animate-pulse",
  Pendiente: "bg-gray-200 text-gray-500",
};

const badgeVariant: Record<EstadoEvento, "forest" | "yellow" | "gray"> = {
  Completado: "forest",
  "En curso": "yellow",
  Pendiente: "gray",
};

export function CampaniaTimeline() {
  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Campaña"
        description="Eventos relevantes del ciclo agrícola de la campaña"
      />

      <ol>
        {campaniaHistorialMock.map((evento, i) => {
          const Icon = iconos[evento.tipo];
          const esUltimo = i === campaniaHistorialMock.length - 1;

          return (
            <li key={evento.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${dotClase[evento.estado]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {!esUltimo && <span className="w-px flex-1 bg-gray-200" />}
              </div>

              <div className={`flex-1 ${esUltimo ? "pb-0" : "pb-8"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{evento.titulo}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{evento.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{evento.fecha}</span>
                    <Badge variant={badgeVariant[evento.estado]}>{evento.estado}</Badge>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </CardShell>
  );
}
