import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, MapPin, Package, Pencil, Tag, Truck, User } from "lucide-react";
import { Badge, Breadcrumb, Button, Card, LoadingSpinner } from "../../components/ui";
import {
  fetchTrazabilidad,
  formatearFecha,
  formatearPeso,
  type Trazabilidad,
} from "../../services/trazabilidades";

function estadoBadge(estado: string) {
  const map: Record<string, { variant: "green" | "yellow" | "forest" | "gray" | "default" }> = {
    COMPLETADO: { variant: "green" },
    EN_PROCESO: { variant: "yellow" },
    PENDIENTE_VERIFICACION: { variant: "forest" },
  };
  return <Badge variant={map[estado]?.variant ?? "default"}>{estado.replace(/_/g, " ")}</Badge>;
}

function certBadge(cert: string) {
  if (!cert) return <span className="text-sm text-gray-400">Sin certificacion</span>;
  return (
    <Badge variant={cert === "ORGANICO" ? "green" : cert === "FAIR_TRADE" ? "purple" : "default"}>
      {cert.replace(/_/g, " ")}
    </Badge>
  );
}

function eventoIcon(tipo: string) {
  const map: Record<string, { bg: string; icon: typeof Truck }> = {
    SIEMBRA: { bg: "bg-emerald-100 text-emerald-600", icon: Tag },
    COSECHA: { bg: "bg-amber-100 text-amber-600", icon: Package },
    RECEPCION: { bg: "bg-forest-100 text-forest-600", icon: Truck },
    PROCESAMIENTO: { bg: "bg-purple-100 text-purple-600", icon: Clock },
    EMPAQUE: { bg: "bg-blue-100 text-blue-600", icon: Package },
    ENVIO: { bg: "bg-red-100 text-red-600", icon: Truck },
  };
  const cfg = map[tipo] ?? { bg: "bg-gray-100 text-gray-600", icon: Clock };
  const Icon = cfg.icon;
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.bg}`}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

export default function TrazabilidadView() {
  const { id } = useParams();
  const [data, setData] = useState<Trazabilidad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTrazabilidad(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Cargando trazabilidad..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Registro no encontrado.</p>
      </div>
    );
  }

  const kpis = [
    { label: "Peso Total", value: formatearPeso(data.pesoTotal), icon: Package, iconClass: "bg-forest-600/10 text-forest-600" },
    { label: "Certificacion", value: data.certificacion || "Ninguna", icon: Tag, iconClass: "bg-emerald-50 text-emerald-600" },
    { label: "Calidad", value: data.calidad || "No evaluada", icon: CheckCircle, iconClass: "bg-purple-50 text-purple-600" },
    { label: "Destino", value: data.destino || "No definido", icon: Truck, iconClass: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Trazabilidad", to: "/trazabilidad" }, { label: data.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/trazabilidad" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Trazabilidad
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{data.codigo}</h1>
          <p className="mt-1 text-sm text-gray-500">{data.producto} &middot; {data.cultivo}</p>
        </div>
        <Button
          variant="secondary"
          as="link"
          to={`/trazabilidad/${data.id}/editar`}
          iconLeft={<Pencil className="h-4 w-4" />}
        >
          Editar
        </Button>
      </div>

      <Card padding="md" className="mb-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="text-lg font-bold text-[#111827]">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="md">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-forest-600" />
            <h3 className="font-semibold text-[#111827]">Informacion del Producto</h3>
          </div>
          <dl className="space-y-3">
            {[
              ["Producto", data.producto],
              ["Cultivo", data.cultivo],
              ["Origen", data.origen],
              ["Codigo Lote", data.loteCodigo],
              ["Unidad", data.unidad],
              ["Estado", estadoBadge(data.estado)],
              ["Certificacion", certBadge(data.certificacion)],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{String(label)}</dt>
                <dd className="text-sm font-medium text-[#111827]">{value as React.ReactNode}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card padding="md">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-forest-600" />
            <h3 className="font-semibold text-[#111827]">Datos de Produccion</h3>
          </div>
          <dl className="space-y-3">
            {[
              ["Productor", data.productor],
              ["Parcela", data.parcela || "-"],
              ["Comunidad", data.comunidad || "-"],
              ["Fecha Siembra", data.fechaSiembra ? formatearFecha(data.fechaSiembra) : "-"],
              ["Fecha Cosecha", data.fechaCosecha ? formatearFecha(data.fechaCosecha) : "-"],
              ["Fecha Procesamiento", data.fechaProcesamiento ? formatearFecha(data.fechaProcesamiento) : "-"],
              ["Destino", data.destino || "-"],
              ["Calidad", data.calidad || "-"],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{String(label)}</dt>
                <dd className="text-sm font-medium text-[#111827]">{value as React.ReactNode}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card padding="md" className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-forest-600" />
          <h3 className="font-semibold text-[#111827]">Historial de Eventos</h3>
        </div>

        {data.eventos.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No hay eventos registrados</p>
        ) : (
          <div className="relative space-y-4 pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
            {data.eventos.map((ev, i) => (
              <div key={ev.id ?? i} className="relative flex gap-4">
                <div className="relative z-10 shrink-0">{eventoIcon(ev.tipo)}</div>
                <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#111827]">
                      {ev.tipo.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-400">{formatearFecha(ev.fecha)}</span>
                  </div>
                  {ev.lugar && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" /> {ev.lugar}
                    </p>
                  )}
                  {ev.responsable && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" /> {ev.responsable}
                    </p>
                  )}
                  {ev.descripcion && (
                    <p className="mt-2 text-sm text-gray-600">{ev.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {data.observaciones && (
        <Card padding="md" className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-forest-600" />
            <h3 className="font-semibold text-[#111827]">Observaciones</h3>
          </div>
          <p className="text-sm text-gray-600">{data.observaciones}</p>
        </Card>
      )}
    </div>
  );
}
