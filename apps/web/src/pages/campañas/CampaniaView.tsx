import { useParams } from "react-router-dom";
import { CalendarDays, Pencil } from "lucide-react";
import { Button, Card, LoadingSpinner } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaEstadoBadge } from "../../components/campanias/CampaniaEstadoBadge";
import { CampaniaKPIResumen } from "../../components/campanias/CampaniaKPIResumen";
import { ResumenProductivoCard } from "../../components/campanias/ResumenProductivoCard";
import { CalendarioAgricolaCard } from "../../components/campanias/CalendarioAgricolaCard";
import { CampaniaTimeline } from "../../components/campanias/CampaniaTimeline";
import { DatosGeneralesCard } from "../../components/campanias/DatosGeneralesCard";
import { CampaniaStatusCard } from "../../components/campanias/CampaniaStatusCard";
import { ConfiguracionCard } from "../../components/campanias/ConfiguracionCard";
import { ObservacionesCard } from "../../components/campanias/ObservacionesCard";
import { useCampania, useCampaniaStats } from "../../hooks/queries";
import { formatFechaCorta } from "../../utils/formatters";

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

  return (
    <div>
      {!inModal && (
        <>
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
        </>
      )}

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md shadow-forest-600/30">
            <CalendarDays className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{campania.nombre}</h1>
              <CampaniaEstadoBadge estado={campania.estado} />
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

      <div className="grid gap-6">
        <DatosGeneralesCard mode="view" value={campania} />
        <CampaniaStatusCard mode="view" value={campania} />
        <ConfiguracionCard mode="view" value={campania} />
        <ObservacionesCard mode="view" value={campania} />
      </div>
    </div>
  );
}
