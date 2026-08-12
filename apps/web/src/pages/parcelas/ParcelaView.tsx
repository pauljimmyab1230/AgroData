import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Pencil,
  Ruler,
  Sprout,
  BadgeCheck,
  Layers,
  History,
  FileText,
  Camera,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Breadcrumb, Button, Card, LoadingSpinner } from "../../components/ui";
import { DatosGeneralesCard } from "../../components/parcelas/DatosGeneralesCard";
import { InformacionAgroecologicaCard } from "../../components/parcelas/InformacionAgroecologicaCard";
import { UbicacionCard } from "../../components/parcelas/UbicacionCard";
import { PoligonoCard } from "../../components/parcelas/PoligonoCard";
import { FotografiaCard } from "../../components/parcelas/FotografiaCard";
import { DocumentoCard } from "../../components/parcelas/DocumentoCard";
import { fetchParcela, type Parcela } from "../../services/parcelas";
import { ParcelaFormProvider } from "../../contexts/ParcelaFormContext";

const formatFecha = (fecha: string) => {
  if (!fecha) return "—";
  const [y, m, d] = fecha.slice(0, 10).split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
};

type HistorialItem = {
  id: string;
  tipo: "registro" | "documento";
  titulo: string;
  descripcion: string;
  fecha: string;
};

const historialIcons: Record<HistorialItem["tipo"], LucideIcon> = {
  registro: Layers,
  documento: FileText,
};

export default function ParcelaView() {
  const { id } = useParams();
  const [parcela, setParcela] = useState<Parcela | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchParcela(id)
      .then(setParcela)
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

  if (!parcela) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la parcela.</p>
      </div>
    );
  }

  const documentos = parcela.documentos ?? [];
  const fotos = parcela.fotos ?? [];

  const estadoBadge =
    parcela.estado === "ACTIVA" ? <Badge variant="forest">Activa</Badge> : <Badge variant="gray">Inactiva</Badge>;

  const certificacionBadge =
    parcela.certificacion === "ORGANICA" ? (
      <Badge variant="green">Orgánica</Badge>
    ) : parcela.certificacion === "EN_TRANSICION" ? (
      <Badge variant="yellow">En Transición</Badge>
    ) : (
      <Badge variant="gray">Convencional</Badge>
    );

  const areaTotal = `${parcela.area || "0"} ${parcela.areaUnidad || "ha"}`;
  const areaCertificada = parcela.areaCertificada ? `${parcela.areaCertificada} ${parcela.areaUnidad || "ha"}` : "—";

  const kpis = [
    {
      label: "Área Total",
      value: areaTotal,
      icon: Ruler,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Área Certificada",
      value: areaCertificada,
      icon: BadgeCheck,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Documentos",
      value: String(documentos.length),
      icon: FileText,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Fotografías",
      value: String(fotos.length),
      icon: Camera,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Cultivo Principal",
      value: parcela.cultivo || "—",
      icon: Sprout,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ];

  const historial: HistorialItem[] = [
    {
      id: "registro",
      tipo: "registro",
      titulo: "Registro de la parcela",
      descripcion: `Alta de ${parcela.nombre} (${parcela.codigo}) en el sistema de la cooperativa.`,
      fecha: parcela.createdAt,
    },
    {
      id: "actualizacion",
      tipo: "documento",
      titulo: "Última actualización",
      descripcion: `La información de la parcela fue modificada por última vez.`,
      fecha: parcela.updatedAt,
    },
  ];

  return (
    <ParcelaFormProvider initial={parcela}>
      <div>
      <Breadcrumb items={[{ label: "Parcelas", to: "/parcelas" }, { label: parcela.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/parcelas" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Parcelas
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          as="link"
          to={`/parcelas/${parcela.id}/editar`}
          iconLeft={<Pencil className="h-4 w-4" />}
        >
          Editar
        </Button>
      </div>

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
            <MapPin className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{parcela.nombre}</h1>
              {estadoBadge}
              {certificacionBadge}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Código: <span className="font-medium text-[#111827]">{parcela.codigo}</span>
              {" · "}Productor: <span className="font-medium text-[#111827]">{parcela.productorNombre}</span>
              {" · "}Comunidad: <span className="font-medium text-[#111827]">{parcela.comunidad || "—"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <Ruler className="h-5 w-5 text-forest-600" />
            {areaTotal}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <Sprout className="h-5 w-5 text-forest-600" />
            {parcela.cultivo || "—"}
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500">
                  {kpi.label}
                </p>
                <p className="mt-1.5 truncate text-2xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <DatosGeneralesCard mode="view" values={parcela} />
        <InformacionAgroecologicaCard mode="view" values={parcela} />
        <UbicacionCard mode="view" values={parcela} />
        <PoligonoCard mode="view" values={parcela} />
        <FotografiaCard mode="view" fotos={fotos} />
        <DocumentoCard mode="view" documentos={documentos} />
      </div>

      <div className="mt-6">
        <Card padding="lg" hover={false} className="shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <History size={20} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#111827]">Historial de la Parcela</h3>
              <p className="text-xs text-gray-500">Hitos y eventos registrados de la parcela</p>
            </div>
          </div>

          <ol className="relative space-y-6">
            <span className="absolute bottom-4 left-[19px] top-4 w-px bg-gray-200" aria-hidden="true" />
            {historial.map((item) => {
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
    </ParcelaFormProvider>
  );
}
