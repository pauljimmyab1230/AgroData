import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  History,
  Package,
  Scale,
  Tags,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";
import type { HistorialRecepcion } from "../../services/recepciones";

type HistorialCardProps = {
  eventos: HistorialRecepcion[];
};

const tipoConfig: Record<string, { icon: LucideIcon; circle: string }> = {
  LP: { icon: Package, circle: "bg-purple-100 text-purple-700" },
  RECEPCION: { icon: ClipboardCheck, circle: "bg-sky-100 text-sky-700" },
  PESAJE: { icon: Scale, circle: "bg-sun-100 text-sun-700" },
  CALIDAD: { icon: BadgeCheck, circle: "bg-forest-600/10 text-forest-600" },
  CLASIFICACION: { icon: Tags, circle: "bg-amber-100 text-amber-700" },
  DISPONIBLE: { icon: CheckCircle2, circle: "bg-emerald-100 text-emerald-700" },
  RECHAZO: { icon: XCircle, circle: "bg-red-100 text-red-700" },
};

const defaultConfig = { icon: History, circle: "bg-gray-100 text-gray-700" };

function formatearFecha(fecha: string): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function HistorialCard({ eventos }: HistorialCardProps) {
  if (eventos.length === 0) return null;

  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Recepción"
        description="Línea de tiempo del recorrido de la materia prima desde el Acopio hasta la planta"
      />

      <div className="relative">
        <div className="absolute bottom-2 left-5 top-2 w-px bg-gray-200" aria-hidden />
        <ol className="space-y-6">
          {eventos.map((evento) => {
            const conf = tipoConfig[evento.tipo] ?? defaultConfig;
            const Icon = conf.icon;
            return (
              <li key={evento.id} className="relative flex gap-4">
                <span
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${conf.circle} ring-4 ring-white`}
                >
                  <Icon className="h-4 w-4" size={18} />
                </span>
                <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#111827]">{evento.titulo}</h4>
                    <span className="text-xs font-medium text-gray-500">{formatearFecha(evento.fecha)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{evento.descripcion}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </CardShell>
  );
}
