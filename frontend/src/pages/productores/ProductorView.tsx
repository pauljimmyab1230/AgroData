import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Sprout,
  MapPin,
  Ruler,
  Layers,
  FileText,
  UserPlus,
  ClipboardCheck,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Breadcrumb, Button, Card } from "../../components/ui";
import { ProductorStepper } from "../../components/productores/ProductorStepper";
import { DatosPersonalesCard } from "../../components/productores/DatosPersonalesCard";
import { ContactoUbicacionCard } from "../../components/productores/ContactoUbicacionCard";
import { SocioculturalCard } from "../../components/productores/SocioculturalCard";
import { OrganizacionCard } from "../../components/productores/OrganizacionCard";
import { FamiliarTable } from "../../components/productores/FamiliarTable";
import { ParcelaTable } from "../../components/productores/ParcelaTable";
import { DocumentoUploader } from "../../components/productores/DocumentoUploader";
import {
  productoresMock,
  parcelasMock,
  documentosMock,
  historialMock,
  type HistorialItem,
} from "./productorMock";

const formatFecha = (fecha: string) => {
  const [y, m, d] = fecha.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
};

const historialIcons: Record<HistorialItem["tipo"], LucideIcon> = {
  ingreso: UserPlus,
  parcela: MapPin,
  campania: Sprout,
  inspeccion: ClipboardCheck,
};

export default function ProductorView() {
  const { id } = useParams();
  const productor = productoresMock.find((p) => p.id === Number(id)) ?? productoresMock[0];

  const estadoBadge =
    productor.estado === "Activo" ? (
      <Badge variant="green">Activo</Badge>
    ) : productor.estado === "Suspendido" ? (
      <Badge variant="yellow">Suspendido</Badge>
    ) : (
      <Badge variant="gray">Inactivo</Badge>
    );

  const totalParcelas = parcelasMock.length;
  const areaTotal = parcelasMock.reduce((sum, p) => sum + parseFloat(p.area), 0).toFixed(2);
  const cultivosActivos = new Set(
    parcelasMock.filter((p) => p.estado === "Activa").map((p) => p.cultivo),
  ).size;
  const documentosRegistrados = documentosMock.length;

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
      <Breadcrumb
        items={[{ label: "Productores", to: "/productores" }, { label: productor.codigo }]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/productores" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Productores
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          as="link"
          to={`/productores/${productor.id}/editar`}
          iconLeft={<Pencil className="h-4 w-4" />}
        >
          Editar
        </Button>
      </div>

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-3xl font-bold text-white shadow-lg shadow-forest-600/30">
              {productor.nombres.charAt(0)}
              {productor.apellidoPaterno.charAt(0)}
            </div>
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">
                {productor.nombres} {productor.apellidoPaterno} {productor.apellidoMaterno}
              </h1>
              {estadoBadge}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
              <span>
                Código: <span className="font-medium text-[#111827]">{productor.codigo}</span>
              </span>
              <span>
                DNI: <span className="font-medium text-[#111827]">{productor.dni}</span>
              </span>
              <span>
                Ingreso: <span className="font-medium text-[#111827]">{formatFecha(productor.fechaIngreso)}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <Sprout className="h-5 w-5 text-forest-600" />
            {productor.organizacion}
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
        <ProductorStepper pasoActual={4} />
      </div>

      <div className="grid gap-6">
        <DatosPersonalesCard mode="view" values={productor} />
        <ContactoUbicacionCard mode="view" values={productor} />
        <SocioculturalCard mode="view" values={productor} />
        <OrganizacionCard mode="view" values={productor} />
        <FamiliarTable mode="view" />
        <ParcelaTable mode="view" />
        <DocumentoUploader mode="view" />
      </div>

      <div className="mt-6">
        <Card padding="lg" hover={false} className="shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <History size={20} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#111827]">Historial del Productor</h3>
              <p className="text-xs text-gray-500">Hitos y eventos registrados del productor</p>
            </div>
          </div>

          <ol className="relative space-y-6">
            <span className="absolute bottom-4 left-[19px] top-4 w-px bg-gray-200" aria-hidden="true" />
            {historialMock.map((item) => {
              const Icon = historialIcons[item.tipo];
              return (
                <li key={item.id} className="relative flex gap-4">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#111827]">{item.titulo}</p>
                      <span className="text-xs font-medium text-gray-400">{formatFecha(item.fecha)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.descripcion}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}
