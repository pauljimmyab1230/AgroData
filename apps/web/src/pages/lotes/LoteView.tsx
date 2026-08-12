import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Pencil, Tag, Weight } from "lucide-react";
import { Breadcrumb, Button, Card, Badge, LoadingSpinner } from "../../components/ui";
import { fetchLote, formatearFecha, formatearPeso, type Lote } from "../../services/lotes";

const estadoBadgeVariant: Record<string, "green" | "yellow" | "forest" | "red" | "gray"> = {
  REGISTRADO: "gray",
  EN_PROCESIMIENTO: "yellow",
  DISPONIBLE: "green",
  CONSUMIDO: "forest",
  VENCIDO: "red",
};

export default function LoteView() {
  const { id } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchLote(id)
      .then(setLote)
      .catch(() => setLote(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Cargando lote..." />
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Lote no encontrado.</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Peso Inicial",
      value: formatearPeso(lote.pesoInicial),
      icon: Weight,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Peso Disponible",
      value: formatearPeso(lote.pesoDisponible),
      icon: Weight,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Estado",
      value: lote.estado,
      icon: Tag,
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Certificación",
      value: lote.certificacion || "Sin certificación",
      icon: Tag,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Lotes", to: "/lotes" }, { label: lote.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/lotes" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Lotes
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{lote.nombre}</h1>
          <p className="text-sm text-gray-500">{lote.codigo}</p>
        </div>
        <Button
          variant="secondary"
          as="link"
          to={`/lotes/${lote.id}/editar`}
          iconLeft={<Pencil className="h-4 w-4" />}
        >
          Editar
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                <p className="text-sm font-bold text-[#111827]">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Información General</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Código</span>
              <span className="text-sm font-medium text-[#111827]">{lote.codigo}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Nombre</span>
              <span className="text-sm font-medium text-[#111827]">{lote.nombre}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Campaña</span>
              <span className="text-sm font-medium text-[#111827]">{lote.campaniaNombre}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Cultivo</span>
              <span className="text-sm font-medium text-[#111827]">{lote.cultivoNombre}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Origen</span>
              <span className="text-sm font-medium text-[#111827]">{lote.origen}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Calidad</span>
              <span className="text-sm font-medium text-[#111827]">{lote.calidad || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Ubicación</span>
              <span className="text-sm font-medium text-[#111827]">{lote.ubicacion || "-"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Fecha Producción</span>
              <span className="text-sm font-medium text-[#111827]">
                {lote.fechaProduccion ? formatearFecha(lote.fechaProduccion) : "-"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Fecha Vencimiento</span>
              <span className="text-sm font-medium text-[#111827]">
                {lote.fechaVencimiento ? formatearFecha(lote.fechaVencimiento) : "-"}
              </span>
            </div>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Pesos</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Peso Inicial</span>
              <span className="text-sm font-medium text-[#111827]">{formatearPeso(lote.pesoInicial)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Peso Disponible</span>
              <span className="text-sm font-medium text-[#111827]">{formatearPeso(lote.pesoDisponible)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Unidad</span>
              <span className="text-sm font-medium text-[#111827]">{lote.unidad}</span>
            </div>
          </div>
        </Card>
      </div>

      {lote.movimientos && lote.movimientos.length > 0 && (
        <Card padding="md" hover={false} className="mt-6">
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Movimientos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Cantidad</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Descripción</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Referencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lote.movimientos.map((mov) => (
                  <tr key={mov.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-[#111827]">{formatearFecha(mov.fecha)}</td>
                    <td className="px-4 py-3 text-sm text-[#111827]">{mov.tipo}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111827]">{mov.cantidad.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{mov.descripcion || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{mov.referencia || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {lote.observaciones && (
        <Card padding="md" hover={false} className="mt-6">
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Observaciones</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{lote.observaciones}</p>
        </Card>
      )}
    </div>
  );
}
