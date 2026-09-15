import { useParams } from "react-router-dom";
import { CalendarDays, Pencil, User, Target, FileText } from "lucide-react";
import { Badge, Button, Card, LoadingSpinner } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaKPIResumen } from "../../components/campanias/CampaniaKPIResumen";
import { ResumenProductivoCard } from "../../components/campanias/ResumenProductivoCard";
import { CalendarioAgricolaCard } from "../../components/campanias/CalendarioAgricolaCard";
import { CampaniaTimeline } from "../../components/campanias/CampaniaTimeline";
import { useCampania, useCampaniaStats } from "../../hooks/queries";
import { formatFechaCorta } from "../../utils/formatters";

const estadoBadge = (estado: string) => {
  const variants: Record<string, "forest" | "yellow" | "gray" | "red"> = {
    PLANIFICADA: "yellow",
    ACTIVA: "forest",
    FINALIZADA: "gray",
    CANCELADA: "red",
  };
  return <Badge variant={variants[estado] ?? "gray"}>{estado}</Badge>;
};

interface CampaniaViewProps {
  inModal?: boolean;
  campaniaId?: number;
}

export default function CampaniaView({ inModal, campaniaId: propId }: CampaniaViewProps) {
  const { id: paramId } = useParams();
  const numId = paramId ? Number(paramId) : null;
  const id = propId ?? (numId && !Number.isNaN(numId) ? numId : null);

  const { data: campania, isLoading: loadingCampania } = useCampania(id);
  const { data: stats } = useCampaniaStats(id);

  if (loadingCampania) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!campania) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la campaña.</p>
      </div>
    );
  }

  // Modal: vista simplificada
  if (inModal) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827]">{campania.nombre}</h2>
              {estadoBadge(campania.estado)}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {campania.codigo} · {campania.anioAgricola}
            </p>
          </div>
        </div>

        {/* Fechas */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm">
            <CalendarDays className="h-4 w-4 text-forest-600" />
            Inicio: <span className="font-medium">{formatFechaCorta(campania.fechaInicio)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm">
            <CalendarDays className="h-4 w-4 text-forest-600" />
            Fin: <span className="font-medium">{formatFechaCorta(campania.fechaFin)}</span>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <User size={14} className="text-forest-600" />
              <span className="text-xs font-medium text-gray-500">Responsables</span>
            </div>
            <p className="text-sm font-medium text-[#111827]">{campania.responsable || "—"}</p>
            <p className="text-xs text-gray-500">Téc. {campania.tecnicoCoordinador || "—"}</p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target size={14} className="text-forest-600" />
              <span className="text-xs font-medium text-gray-500">Objetivo</span>
            </div>
            <p className="text-sm text-[#111827] line-clamp-3">{campania.objetivo || "—"}</p>
          </div>
        </div>

        {campania.descripcion && (
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Descripción</p>
            <p className="text-sm text-[#111827]">{campania.descripcion}</p>
          </div>
        )}

        {campania.observaciones && (
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-1 flex items-center gap-2">
              <FileText size={14} className="text-forest-600" />
              <span className="text-xs font-medium text-gray-500">Observaciones</span>
            </div>
            <p className="text-sm text-[#111827]">{campania.observaciones}</p>
          </div>
        )}
      </div>
    );
  }

  // Vista completa (página dedicada)
  return (
    <div>
      <CampaniaHeader
        title={campania.nombre}
        backTo="/campanias"
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/campanias/${campania.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md shadow-forest-600/30">
            <CalendarDays className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{campania.nombre}</h1>
              {estadoBadge(campania.estado)}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Código: <span className="font-medium text-[#111827]">{campania.codigo}</span>
              {" · "}Año Agrícola: <span className="font-medium text-[#111827]">{campania.anioAgricola}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
              <CalendarDays className="h-5 w-5 text-forest-600" />
              Inicio: <span>{formatFechaCorta(campania.fechaInicio)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
              <CalendarDays className="h-5 w-5 text-forest-600" />
              Fin: <span>{formatFechaCorta(campania.fechaFin)}</span>
            </div>
          </div>
        </div>
      </Card>

      <CampaniaKPIResumen campaniaId={campania.id} />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ResumenProductivoCard stats={stats ?? null} />
        <CalendarioAgricolaCard fechaInicio={campania.fechaInicio} fechaFin={campania.fechaFin} />
      </div>

      <div className="mb-6">
        <CampaniaTimeline campaniaId={campania.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" hover={false} className="shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
              <User size={16} />
            </span>
            <h3 className="text-sm font-semibold text-gray-900">Responsables</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Responsable</p>
              <p className="text-sm font-medium text-[#111827]">{campania.responsable || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Técnico Coordinador</p>
              <p className="text-sm font-medium text-[#111827]">{campania.tecnicoCoordinador || "—"}</p>
            </div>
          </div>
        </Card>

        <Card padding="lg" hover={false} className="shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
              <Target size={16} />
            </span>
            <h3 className="text-sm font-semibold text-gray-900">Descripción y Objetivo</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Descripción</p>
              <p className="text-sm text-[#111827]">{campania.descripcion || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Objetivo</p>
              <p className="text-sm text-[#111827]">{campania.objetivo || "—"}</p>
            </div>
          </div>
        </Card>

        {campania.observaciones && (
          <Card padding="lg" hover={false} className="shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                <FileText size={16} />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Observaciones</h3>
            </div>
            <p className="text-sm text-[#111827]">{campania.observaciones}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
