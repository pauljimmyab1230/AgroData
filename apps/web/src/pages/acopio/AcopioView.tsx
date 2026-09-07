import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Boxes, Scale, Users } from "lucide-react";
import { Breadcrumb, Button, Card, LoadingSpinner } from "../../components/ui";
import { CardShell, CardHeader } from "../../components/shared/formControls";
import { fetchAcopio, formatFecha, formatKg, type Acopio } from "../../services/acopios";

interface AcopioViewProps {
  inModal?: boolean;
  acopioId?: string;
}

const estadoLabels: Record<string, string> = {
  EN_PROCESO: "En Proceso",
  COMPLETADO: "Completado",
  EN_PLANTA: "En Planta",
};

export default function AcopioView({ inModal, acopioId: propId }: AcopioViewProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const [acopio, setAcopio] = useState<Acopio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAcopio(id)
      .then(setAcopio)
      .catch(() => setAcopio(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
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

  const totalSacos = acopio.detalles.reduce((sum, d) => sum + d.sacos.length, 0);
  const pesoTotal = acopio.detalles.reduce((sum, d) => sum + d.sacos.reduce((s, saco) => s + saco.peso, 0), 0);

  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Acopio", to: "/acopio" }, { label: acopio.codigo }]} />
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/acopio" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Acopio
            </Button>
            <div className="flex-1" />
            <Button variant="secondary" as="link" to={`/acopio/${acopio.id}/editar`} iconLeft={<Pencil className="h-4 w-4" />}>
              Editar
            </Button>
          </div>
        </>
      )}

      {/* Header Card */}
      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{acopio.codigo}</h1>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {estadoLabels[acopio.estado] || acopio.estado}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {formatFecha(acopio.fecha)} · {acopio.acopiador}
            </p>
          </div>
          {acopio.vehiculo && (
            <div className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#111827]">
              🚛 {acopio.vehiculo}
            </div>
          )}
        </div>
      </Card>

      {/* KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Productores</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{acopio.detalles.length}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Sacos</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{totalSacos}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sun-100 text-sun-700">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Peso Total</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{formatKg(pesoTotal)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Scale className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detalles por Productor */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">👨‍🌾</span>}
          title="Detalle por Productor"
          description="Productores que entregaron en este acopio"
        />

        {acopio.detalles.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p>No hay detalles registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {acopio.detalles.map((detalle) => {
              const pesoDetalle = detalle.sacos.reduce((s, saco) => s + saco.peso, 0);
              return (
                <div key={`${detalle.productorId}-${detalle.cultivoId}`} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[#111827]">{detalle.productorNombre}</h4>
                      <p className="text-xs text-gray-500">Cultivo: {detalle.cultivoNombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#111827]">{detalle.sacos.length} sacos</p>
                      <p className="text-xs text-gray-500">{formatKg(pesoDetalle)}</p>
                    </div>
                  </div>

                  {detalle.sacos.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                            <th className="pb-2">Código</th>
                            <th className="pb-2">Peso (kg)</th>
                            <th className="pb-2">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalle.sacos.map((saco) => (
                            <tr key={saco.id || saco.codigo} className="border-b border-gray-100">
                              <td className="py-2 font-medium text-[#111827]">{saco.codigo}</td>
                              <td className="py-2">{saco.peso.toFixed(2)}</td>
                              <td className="py-2 text-gray-500">{saco.observaciones || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardShell>

      {/* Observaciones */}
      {acopio.observaciones && (
        <CardShell className="mt-6">
          <CardHeader
            icon={<span className="text-lg">📝</span>}
            title="Observaciones"
          />
          <p className="text-sm text-gray-700">{acopio.observaciones}</p>
        </CardShell>
      )}
    </div>
  );
}
