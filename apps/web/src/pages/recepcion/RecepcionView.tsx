import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Pencil, Scale, TrendingDown, Warehouse } from "lucide-react";
import { Breadcrumb, Button } from "../../components/ui";
import RecepcionHeader from "../../components/recepcion/RecepcionHeader";
import RecepcionKPI from "../../components/recepcion/RecepcionKPI";
import { InformacionGeneralCard } from "../../components/recepcion/InformacionGeneralCard";
import { LoteProductorCard } from "../../components/recepcion/LoteProductorCard";
import { PesajeCard } from "../../components/recepcion/PesajeCard";
import { CalidadCard } from "../../components/recepcion/CalidadCard";
import { ClasificacionCard } from "../../components/recepcion/ClasificacionCard";
import { ResultadoCard } from "../../components/recepcion/ResultadoCard";
import { EvidenciasCard } from "../../components/recepcion/EvidenciasCard";
import { ObservacionesCard } from "../../components/recepcion/ObservacionesCard";
import { HistorialCard } from "../../components/recepcion/HistorialCard";
import { ResultadoRecepcionBadge } from "../../components/recepcion/badges";
import {
  type Recepcion,
  fetchRecepcion,
  formatearPeso,
} from "../../services/recepciones";

function formatPct(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(valor)}%`;
}

export default function RecepcionView() {
  const { id } = useParams();
  const [recepcion, setRecepcion] = useState<Recepcion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchRecepcion(id)
      .then((r) => {
        if (!cancelled) setRecepcion(r);
      })
      .catch((err) => {
        console.error("Error fetching recepcion:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando recepción...</p>
      </div>
    );
  }

  if (!recepcion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500">No se encontró la recepción.</p>
        <Button as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
      </div>
    );
  }

  const kpis = [
    {
      label: "Peso Campo",
      value: formatearPeso(recepcion.pesoCampo),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Planta",
      value: formatearPeso(recepcion.pesoNeto),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Merma",
      value: formatPct(recepcion.merma),
      icon: TrendingDown,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Resultado",
      value: recepcion.resultado ?? "—",
      icon: BadgeCheck,
      iconClass: "bg-emerald-50 text-emerald-600",
      extra: <ResultadoRecepcionBadge resultado={recepcion.resultado} />,
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Recepción", to: "/recepcion" }, { label: recepcion.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Recepción
        </Button>
      </div>

      <RecepcionHeader
        recepcion={recepcion}
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/recepcion/${recepcion.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <RecepcionKPI items={kpis} />

      <div className="grid gap-6">
        <InformacionGeneralCard mode="view" values={recepcion} />
        <LoteProductorCard mode="view" values={recepcion} />
        <PesajeCard mode="view" values={recepcion} />
        <CalidadCard mode="view" values={recepcion} />
        <ClasificacionCard mode="view" values={recepcion} />
        <ResultadoCard mode="view" values={recepcion} />
        <EvidenciasCard mode="view" values={recepcion} />
        <ObservacionesCard mode="view" values={recepcion} />
        <HistorialCard eventos={recepcion.historial} />
      </div>
    </div>
  );
}
