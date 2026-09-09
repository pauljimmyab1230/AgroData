import { History } from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";

type HistorialCardProps = {
  eventos: Array<{ fecha: string; titulo: string; descripcion: string }>;
};

export function HistorialCard({ eventos }: HistorialCardProps) {
  if (eventos.length === 0) return null;

  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Inspección"
        description="Línea de tiempo de los eventos registrados en el expediente"
      />

      <div className="relative">
        <div className="absolute bottom-2 left-5 top-2 w-px bg-gray-200" aria-hidden />
        <ol className="space-y-6">
          {eventos.map((evento, index) => (
            <li key={index} className="relative flex gap-4">
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-600 ring-4 ring-white">
                <History className="h-4 w-4" size={18} />
              </span>
              <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[#111827]">{evento.titulo}</h4>
                </div>
                <p className="mt-1 text-sm text-gray-600">{evento.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </CardShell>
  );
}
