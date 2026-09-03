import { useEffect, useState } from "react";
import { History, Sprout, ClipboardCheck, SearchCheck, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";
import api from "../../services/api";

type EventoTimeline = {
  id: string;
  tipo: "cultivo" | "actividad" | "inspeccion" | "acopio";
  titulo: string;
  descripcion: string;
  fecha: string;
};

const iconosTipo: Record<EventoTimeline["tipo"], LucideIcon> = {
  cultivo: Sprout,
  actividad: ClipboardCheck,
  inspeccion: SearchCheck,
  acopio: Warehouse,
};

const coloresTipo: Record<EventoTimeline["tipo"], string> = {
  cultivo: "bg-forest-100 text-forest-700",
  actividad: "bg-sun-100 text-sun-700",
  inspeccion: "bg-blue-100 text-blue-700",
  acopio: "bg-purple-100 text-purple-700",
};

const formatFecha = (fecha: string) => {
  if (!fecha) return "—";
  const d = new Date(fecha);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
};

interface CampaniaTimelineProps {
  campaniaId: string;
}

export function CampaniaTimeline({ campaniaId }: CampaniaTimelineProps) {
  const [eventos, setEventos] = useState<EventoTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaniaId) return;

    const fetchEventos = async () => {
      try {
        const [cultivosRes, actividadesRes, inspeccionesRes, acopiosRes] = await Promise.all([
          api.get("/cultivos", { params: { campania_id: campaniaId, limit: 50 } }).catch(() => ({ data: { data: [] } })),
          api.get("/actividades", { params: { campania_id: campaniaId, limit: 50 } }).catch(() => ({ data: { data: [] } })),
          api.get("/inspecciones", { params: { campania_id: campaniaId, limit: 50 } }).catch(() => ({ data: { data: [] } })),
          api.get("/acopio", { params: { campania_id: campaniaId, limit: 50 } }).catch(() => ({ data: { data: [] } })),
        ]);

        const items: EventoTimeline[] = [];

        for (const c of cultivosRes.data.data ?? []) {
          items.push({
            id: `cultivo-${c.id}`,
            tipo: "cultivo",
            titulo: `Cultivo registrado: ${c.cultivo}`,
            descripcion: `${c.productor?.nombres ?? ""} ${c.productor?.apellido_paterno ?? ""} - ${c.parcela?.nombre ?? ""}`,
            fecha: c.created_at ?? c.fecha_siembra ?? "",
          });
        }

        for (const a of actividadesRes.data.data ?? []) {
          items.push({
            id: `actividad-${a.id}`,
            tipo: "actividad",
            titulo: `Actividad: ${a.tipo_actividad ?? a.descripcion ?? "Sin descripción"}`,
            descripcion: `${a.responsable_tecnico ?? ""} - ${a.estado ?? ""}`,
            fecha: a.created_at ?? a.fecha ?? "",
          });
        }

        for (const i of inspeccionesRes.data.data ?? []) {
          items.push({
            id: `inspeccion-${i.id}`,
            tipo: "inspeccion",
            titulo: `Inspección: ${i.codigo}`,
            descripcion: `${i.inspector ?? ""} - ${i.estado ?? ""}`,
            fecha: i.created_at ?? i.fecha ?? "",
          });
        }

        for (const a of acopiosRes.data.data ?? []) {
          items.push({
            id: `acopio-${a.id}`,
            tipo: "acopio",
            titulo: `Acopio: ${a.codigo}`,
            descripcion: `${a.acopiador ?? ""} - ${a.peso_total ?? 0} kg`,
            fecha: a.created_at ?? a.fecha ?? "",
          });
        }

        items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setEventos(items.slice(0, 10));
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [campaniaId]);

  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Campaña"
        description="Eventos y hitos registrados de la campaña"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm text-gray-400">Cargando eventos...</p>
        </div>
      ) : eventos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <History size={28} className="text-gray-300" />
          <p className="text-sm text-gray-400">Sin eventos registrados</p>
          <p className="text-xs text-gray-400">Los eventos aparecerán aquí cuando se registren actividades en la campaña.</p>
        </div>
      ) : (
        <ol className="relative space-y-4">
          <span className="absolute bottom-4 left-[19px] top-4 w-px bg-gray-200" aria-hidden="true" />
          {eventos.map((evento) => {
            const Icon = iconosTipo[evento.tipo];
            return (
              <li key={evento.id} className="relative flex gap-4">
                <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${coloresTipo[evento.tipo]}`}>
                  <Icon size={18} />
                </span>
                <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111827]">{evento.titulo}</p>
                    <span className="text-xs font-medium text-gray-400">{formatFecha(evento.fecha)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{evento.descripcion}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </CardShell>
  );
}
