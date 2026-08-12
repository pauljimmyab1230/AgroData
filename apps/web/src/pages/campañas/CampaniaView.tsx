import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Pencil } from "lucide-react";
import { Breadcrumb, Button, Card, LoadingSpinner } from "../../components/ui";
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
import { fetchCampania, type Campania } from "../../services/campanias";

const formatFecha = (fecha: string) => {
  if (!fecha) return "—";
  const [y, m, d] = fecha.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
};

export default function CampaniaView() {
  const { id } = useParams();
  const [campania, setCampania] = useState<Campania | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCampania(id)
      .then(setCampania)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
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
      <Breadcrumb items={[{ label: "Campañas", to: "/campanias" }, { label: campania.codigo }]} />

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
              Inicio: <span>{formatFecha(campania.fechaInicio)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
              <CalendarDays className="h-5 w-5 text-forest-600" />
              Fin: <span>{formatFecha(campania.fechaFin)}</span>
            </div>
          </div>
        </div>
      </Card>

      <CampaniaKPIResumen />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ResumenProductivoCard />
        <CalendarioAgricolaCard />
      </div>

      <div className="mb-6">
        <CampaniaTimeline />
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
