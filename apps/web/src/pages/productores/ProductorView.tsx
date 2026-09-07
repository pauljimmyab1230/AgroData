import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Sprout,
  Ruler,
  Layers,
  FileText,
} from "lucide-react";
import { Badge, Button, Card, LoadingSpinner } from "../../components/ui";
import { ProductorStepper } from "../../components/productores/ProductorStepper";
import { DatosPersonalesCard } from "../../components/productores/DatosPersonalesCard";
import { ContactoUbicacionCard } from "../../components/productores/ContactoUbicacionCard";
import { SocioculturalCard } from "../../components/productores/SocioculturalCard";
import { OrganizacionCard } from "../../components/productores/OrganizacionCard";
import { FamiliarTable } from "../../components/productores/FamiliarTable";
import { ParcelaTable } from "../../components/productores/ParcelaTable";
import { DocumentoUploader } from "../../components/productores/DocumentoUploader";
import { useProductor, useParcelasByProductor, useDocumentos } from "../../hooks/queries";
import { ProductorFormProvider } from "../../contexts/ProductorFormContext";
import { formatFecha, getEstadoProductorBadgeVariant, getEstadoProductorLabel } from "../../utils/formatters";

export default function ProductorView() {
  const { id } = useParams();
  const numId = Number(id);
  const isValidId = !isNaN(numId) && numId > 0;
  const { data: productor, isLoading, error } = useProductor(isValidId ? numId : null);
  const { data: parcelas = [] } = useParcelasByProductor(isValidId ? numId : null);
  const { data: documentos = [] } = useDocumentos(isValidId ? numId : null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !productor) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el productor.</p>
      </div>
    );
  }

  const estadoBadge = (
    <Badge variant={getEstadoProductorBadgeVariant(productor.estado)}>{getEstadoProductorLabel(productor.estado)}</Badge>
  );

  const totalParcelas = parcelas.length;
  const areaTotal = parcelas.reduce((sum, p) => sum + (Number(p.area) || 0), 0).toFixed(2);
  const cultivosActivos = new Set(
    parcelas.filter((p) => p.estado === "ACTIVA").map((p) => p.cultivo),
  ).size;
  const documentosRegistrados = documentos.length;

  const kpis = [
    {
      label: "Total de Parcelas",
      value: String(totalParcelas),
      icon: Layers,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Área Total (ha)",
      value: areaTotal,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Cultivos Activos",
      value: String(cultivosActivos),
      icon: Sprout,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Documentos Registrados",
      value: String(documentosRegistrados),
      icon: FileText,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/productores" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Productores
        </Button>
      </div>

      <Card padding="none" hover={false} className="mb-6 overflow-hidden">
        <div className="bg-forest-900 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-forest-600 text-3xl font-bold text-white ring-4 ring-white/10">
                {productor.nombres.charAt(0)}
                {productor.apellidoPaterno.charAt(0)}
              </div>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-forest-900 bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {productor.nombres} {productor.apellidoPaterno} {productor.apellidoMaterno}
                </h1>
                {estadoBadge}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-forest-100">
                  Código: <span className="font-semibold text-white">{productor.codigo}</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-forest-100">
                  DNI: <span className="font-semibold text-white">{productor.dni}</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-forest-100">
                  Ingreso: <span className="font-semibold text-white">{formatFecha(productor.fechaIngreso)}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg bg-white/10 px-4 py-2.5 sm:shrink-0">
              <Sprout className="h-5 w-5 text-forest-300" />
              <span className="text-sm font-medium text-white">{productor.organizacion}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500">
                  {kpi.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <ProductorStepper pasoActual={3} isViewMode />
      </div>

      <div className="grid gap-6">
        <ProductorFormProvider initial={productor}>
          <DatosPersonalesCard mode="view" values={productor} />
          <ContactoUbicacionCard mode="view" values={productor} />
          <SocioculturalCard mode="view" values={productor} />
          <OrganizacionCard mode="view" values={productor} />
          <FamiliarTable mode="view" productorId={productor.id} />
          <ParcelaTable mode="view" productorId={productor.id} />
        </ProductorFormProvider>
        <DocumentoUploader mode="view" productorId={productor.id} />
      </div>
    </div>
  );
}
