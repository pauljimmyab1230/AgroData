import { useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Scale, TrendingDown, Package, Timer } from "lucide-react";
import { Breadcrumb, Button } from "../../components/ui";
import ProcesamientoHeader from "../../components/procesamiento/ProcesamientoHeader";
import ProcesamientoKPI from "../../components/procesamiento/ProcesamientoKPI";
import { InformacionGeneralCard } from "../../components/procesamiento/InformacionGeneralCard";
import { MateriaPrimaCard } from "../../components/procesamiento/MateriaPrimaCard";
import { OperacionesCard } from "../../components/procesamiento/OperacionesCard";
import { ControlProcesoCard } from "../../components/procesamiento/ControlProcesoCard";
import { ProductoBaseCard } from "../../components/procesamiento/ProductoBaseCard";
import { ReporteProcesamientoCard } from "../../components/procesamiento/ReporteProcesamientoCard";
import { EvidenciasCard } from "../../components/procesamiento/EvidenciasCard";
import { ObservacionesCard } from "../../components/procesamiento/ObservacionesCard";
import { HistorialCard } from "../../components/procesamiento/HistorialCard";
import { formatKg, formatPct, procesamientoMock } from "./procesamientoMock";

export default function ProcesamientoView() {
  const { id } = useParams();
  const orden = procesamientoMock.find((o) => o.id === Number(id)) ?? procesamientoMock[0];

  const kpis = [
    {
      label: "LP Utilizados",
      value: String(orden.lotesProductor.length),
      icon: Package,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Peso Inicial",
      value: formatKg(orden.resultado?.pesoEntrada),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Final",
      value: formatKg(orden.resultado?.pesoSalida),
      icon: Scale,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Rendimiento",
      value: formatPct(orden.resultado?.rendimiento),
      icon: TrendingDown,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Procesamiento", to: "/procesamiento" }, { label: orden.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/procesamiento" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Procesamiento
        </Button>
      </div>

      <ProcesamientoHeader
        orden={orden}
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/procesamiento/${orden.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <ProcesamientoKPI items={kpis} />

      <div className="grid gap-6">
        <InformacionGeneralCard mode="view" values={orden} />
        <MateriaPrimaCard mode="view" values={orden} />
        <OperacionesCard mode="view" values={orden} />
        <ControlProcesoCard mode="view" values={orden} />
        <ProductoBaseCard mode="view" values={orden} />
        <ReporteProcesamientoCard mode="view" values={orden} />
        <EvidenciasCard mode="view" values={orden} />
        <ObservacionesCard mode="view" values={orden} />
        <HistorialCard eventos={orden.historial} />
      </div>
    </div>
  );
}
