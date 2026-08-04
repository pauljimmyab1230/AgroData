import type { LucideIcon } from "lucide-react";
import { ClipboardList, Sprout, Sun, Tractor, SearchCheck, Flower2, Wheat } from "lucide-react";
import { Badge, Card } from "../ui";
import { CardHeader, CardShell } from "../shared/formControls";
import type { CultivoHistorialEvento } from "../../pages/cultivos/cultivoMock";

interface CultivoHistorialProps {
  eventos: CultivoHistorialEvento[];
}

const iconos: Record<CultivoHistorialEvento["tipo"], LucideIcon> = {
  registro: ClipboardList,
  siembra: Sprout,
  emergencia: Sun,
  actividad: Tractor,
  inspeccion: SearchCheck,
  floracion: Flower2,
  cosecha: Wheat,
};

export default function CultivoHistorial({ eventos }: CultivoHistorialProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Historial del Cultivo"
        description="Línea de tiempo de los eventos registrados del cultivo"
      />

      <div className="relative">
        <span className="absolute bottom-8 left-5 top-8 w-0.5 bg-gray-200" />

        <ol className="space-y-6">
          {eventos.map((evento) => {
            const Icon = iconos[evento.tipo];

            return (
              <li key={evento.id} className="relative flex gap-4">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    evento.completado
                      ? "bg-white text-forest-700 ring-2 ring-forest-600"
                      : "border-2 border-dashed border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <Card hover={false} className={`p-4 ${evento.completado ? "" : "border-dashed bg-gray-50/50"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          evento.completado ? "text-[#111827]" : "text-gray-500"
                        }`}
                      >
                        {evento.titulo}
                      </p>
                      {!evento.completado && <Badge variant="yellow">Próximo</Badge>}
                    </div>
                    {evento.fecha && (
                      <p className="mt-0.5 text-xs font-medium text-forest-700">{evento.fecha}</p>
                    )}
                    {evento.descripcion && (
                      <p className="mt-1.5 text-sm text-gray-500">{evento.descripcion}</p>
                    )}
                  </Card>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </CardShell>
  );
}
