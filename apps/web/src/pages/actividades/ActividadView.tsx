import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClipboardList, CalendarDays, Wrench } from "lucide-react";
import { Badge, Breadcrumb, Button, Card, LoadingSpinner } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { InformacionGeneralCard } from "../../components/actividades/InformacionGeneralCard";
import { ActividadCard } from "../../components/actividades/ActividadCard";
import { ActividadDetalleKPI } from "../../components/actividades/ActividadDetalleKPI";
import { ActividadEstadoBadge, ActividadPrioridadBadge, ActividadTipoBadge } from "../../components/actividades/ActividadBadges";
import { InsumosCard } from "../../components/actividades/InsumosCard";
import { ManoObraCard } from "../../components/actividades/ManoObraCard";
import { MaquinariaCard } from "../../components/actividades/MaquinariaCard";
import { FotografiasCard } from "../../components/actividades/FotografiasCard";
import { MapaCard } from "../../components/actividades/MapaCard";
import { ObservacionesCard } from "../../components/actividades/ObservacionesCard";
import { ResultadosCard } from "../../components/actividades/ResultadosCard";
import { ActividadTimeline } from "../../components/actividades/ActividadTimeline";
import {
  fetchActividades,
  fetchActividad,
  actividadToFormData,
  formatearFecha,
  tipoActividadLabels,
  type Actividad,
} from "../../services/actividades";

export default function ActividadView() {
  const { id } = useParams();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetchActividad(id),
      fetchActividades({ limit: 50 }),
    ])
      .then(([act, list]) => {
        setActividad(act);
        setActividades(list.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !actividad) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const formData = actividadToFormData(actividad);
  const tipoLabel = tipoActividadLabels[actividad.tipoActividad] ?? actividad.tipoActividad;

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Actividades Agrícolas", to: "/actividades" }, { label: actividad.codigo }]}
      />

      <ActividadHeader
        title={`${tipoLabel} · ${actividad.cultivoNombre}`}
        backTo="/actividades"
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/actividades/${actividad.id}/editar`}
            iconLeft={<Wrench className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
            <ClipboardList className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{actividad.codigo}</h1>
              <ActividadTipoBadge tipo={actividad.tipoActividad} />
              <Badge variant="yellow">{actividad.cultivoNombre}</Badge>
              <ActividadEstadoBadge estado={actividad.estado} />
              <ActividadPrioridadBadge prioridad={actividad.prioridad} />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Ficha Técnica de Actividad Agrícola
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Productor: <span className="font-medium text-[#111827]">{actividad.productorNombre}</span>
              {" · "}Parcela: <span className="font-medium text-[#111827]">{actividad.parcelaNombre}</span>
              {" · "}Campaña: <span className="font-medium text-[#111827]">{actividad.campaniaNombre}</span>
              {" · "}Responsable:{" "}
              <span className="font-medium text-[#111827]">{actividad.responsableTecnico}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <CalendarDays className="h-5 w-5 text-forest-600" />
            {formatearFecha(actividad.fecha)}
          </div>
        </div>
      </Card>

      <ActividadDetalleKPI actividad={actividad} />

      <div className="mt-6 grid gap-6">
        <InformacionGeneralCard mode="view" value={formData} />
        <ActividadCard mode="view" value={formData} />
        <InsumosCard mode="view" value={formData} />
        <ManoObraCard mode="view" value={formData} />
        <MaquinariaCard mode="view" value={formData} />
        <FotografiasCard mode="view" value={formData} />
        <MapaCard mode="view" value={formData} />
        <ObservacionesCard mode="view" value={formData} />
        <ResultadosCard mode="view" value={formData} />
        <ActividadTimeline actividades={actividades} current={actividad} />
      </div>
    </div>
  );
}
