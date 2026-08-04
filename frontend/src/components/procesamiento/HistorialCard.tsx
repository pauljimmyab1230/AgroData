import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  History,
  Package,
  Scale,
  Tags,
  Zap,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";
import { formatFecha, type EventoHistorial, type TipoEventoHistorial } from "../../pages/procesamiento/procesamientoMock";

type HistorialCardProps = {
  eventos: EventoHistorial[];
};

const config: Record<TipoEventoHistorial, { icon: LucideIcon; circle: string }> = {
  recepcion: { icon: Package, circle: "bg-purple-100 text-purple-700" },
  inicio: { icon: Zap, circle: "bg-sky-100 text-sky-700" },
  operacion: { icon: Scale, circle: "bg-sun-100 text-sun-700" },
  control: { icon: BadgeCheck, circle: "bg-forest-600/10 text-forest-600" },
  producto_base: { icon: Tags, circle: "bg-amber-100 text-amber-700" },
  completada: { icon: CheckCircle2, circle: "bg-emerald-100 text-emerald-700" },
  disponible: { icon: ClipboardCheck, circle: "bg-emerald-100 text-emerald-700" },
};

export function HistorialCard({ eventos }: HistorialCardProps) {
  if (eventos.length === 0) return null;

  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial del Procesamiento"
        description="Línea de tiempo del recorrido desde la recepción hasta el producto base"
      />

      <div className="relative">
        <div className="absolute bottom-2 left-5 top-2 w-px bg-gray-200" aria-hidden />
        <ol className="space-y-6">
          {eventos.map((evento) => {
            const conf = config[evento.tipo];
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
                    <span className="text-xs font-medium text-gray-500">{formatFecha(evento.fecha)}</span>
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
