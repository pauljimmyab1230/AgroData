import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Camera, CheckCircle2, ClipboardCheck, Gauge, Pencil, TriangleAlert } from "lucide-react";
import { Breadcrumb, Button } from "../../components/ui";
import InspeccionHeader from "../../components/inspecciones/InspeccionHeader";
import InspeccionKPI from "../../components/inspecciones/InspeccionKPI";
import { InformacionGeneralCard } from "../../components/inspecciones/InformacionGeneralCard";
import { ChecklistCard } from "../../components/inspecciones/ChecklistCard";
import { NoConformidadesCard } from "../../components/inspecciones/NoConformidadesCard";
import { AccionesCorrectivasCard } from "../../components/inspecciones/AccionesCorrectivasCard";
import { EvidenciasCard } from "../../components/inspecciones/EvidenciasCard";
import { MapaCard } from "../../components/inspecciones/MapaCard";
import { ObservacionesCard } from "../../components/inspecciones/ObservacionesCard";
import { RecomendacionesCard } from "../../components/inspecciones/RecomendacionesCard";
import { ResultadoCard } from "../../components/inspecciones/ResultadoCard";
import { HistorialCard } from "../../components/inspecciones/HistorialCard";
import { fetchInspeccion, formatFecha, type Inspeccion } from "../../services/inspecciones";

export default function InspeccionView() {
  const { id } = useParams();
  const [inspeccion, setInspeccion] = useState<Inspeccion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchInspeccion(id)
      .then(setInspeccion)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Cargando inspección...</div>;
  }

  if (!inspeccion) {
    return <div className="py-12 text-center text-gray-500">Inspección no encontrada</div>;
  }

  const kpis = [
    {
      label: "Criterios Evaluados",
      value: String(inspeccion.checklist.length),
      icon: ClipboardCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Criterios Cumplidos",
      value: String(inspeccion.checklist.filter((c) => c.cumplimiento === "CUMPLE").length),
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "No Conformidades",
      value: String(inspeccion.noConformidades.length),
      icon: TriangleAlert,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Evidencias Registradas",
      value: String(inspeccion.evidencias.length),
      icon: Camera,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Nivel de Cumplimiento",
      value: inspeccion.nivelCumplimiento,
      icon: Gauge,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      label: "Próxima Inspección",
      value: formatFecha(inspeccion.fechaProximaInspeccion),
      icon: CalendarClock,
      iconClass: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Inspecciones", to: "/inspecciones" }, { label: inspeccion.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/inspecciones" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Inspecciones
        </Button>
      </div>

      <InspeccionHeader
        inspeccion={inspeccion}
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/inspecciones/${inspeccion.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <InspeccionKPI items={kpis} />

      <div className="grid gap-6">
        <InformacionGeneralCard mode="view" values={inspeccion} />
        <ChecklistCard mode="view" values={inspeccion} />
        <NoConformidadesCard mode="view" values={inspeccion} />
        <AccionesCorrectivasCard mode="view" values={inspeccion} />
        <EvidenciasCard mode="view" values={inspeccion} />
        <MapaCard mode="view" values={inspeccion} />
        <ObservacionesCard mode="view" values={inspeccion} />
        <RecomendacionesCard mode="view" values={inspeccion} />
        <ResultadoCard mode="view" values={inspeccion} />
        <HistorialCard eventos={inspeccion.historial} />
      </div>
    </div>
  );
}
