import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Boxes, Hash, Pencil, Scale, TrendingUp } from "lucide-react";
import { Breadcrumb, Button } from "../../components/ui";
import AcopioHeader from "../../components/acopio/AcopioHeader";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import { InformacionGeneralCard } from "../../components/acopio/InformacionGeneralCard";
import { ProductorCard } from "../../components/acopio/ProductorCard";
import SacosTable from "../../components/acopio/SacosTable";
import ResumenAcopioCard from "../../components/acopio/ResumenAcopioCard";
import { CalidadCard } from "../../components/acopio/CalidadCard";
import { EvidenciasCard } from "../../components/acopio/EvidenciasCard";
import { ObservacionesCard } from "../../components/acopio/ObservacionesCard";
import { fetchAcopio, toAcopioView, formatKg, type AcopioView } from "../../services/acopios";

export default function AcopioView() {
  const { id } = useParams();
  const [acopio, setAcopio] = useState<AcopioView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAcopio(id)
      .then((data) => setAcopio(toAcopioView(data)))
      .catch(() => setAcopio(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Cargando acopio...</p>
      </div>
    );
  }

  if (!acopio) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Acopio no encontrado.</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Sacos",
      value: String(acopio.totalSacos),
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Peso Total",
      value: formatKg(acopio.pesoTotal),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Promedio",
      value: formatKg(acopio.pesoPromedio),
      icon: TrendingUp,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Lote del Productor",
      value: acopio.loteProductor,
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Acopio", to: "/acopio" }, { label: acopio.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/acopio" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Acopio
        </Button>
      </div>

      <AcopioHeader
        acopio={acopio}
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/acopio/${acopio.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <AcopioKPI items={kpis} />

      <div className="grid gap-6">
        <InformacionGeneralCard mode="view" values={acopio} />
        <ProductorCard mode="view" values={acopio} />
        <SacosTable mode="view" sacos={acopio.sacos} />
        <ResumenAcopioCard mode="view" values={acopio} />
        <CalidadCard mode="view" values={acopio} />
        <EvidenciasCard mode="view" values={acopio} />
        <ObservacionesCard mode="view" values={acopio} />
      </div>
    </div>
  );
}
