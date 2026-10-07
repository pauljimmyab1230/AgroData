import { useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Scale, Package } from "lucide-react";
import { Button } from "../../components/ui";
import { CardHeader, CardShell, Field } from "../../components/shared/formControls";
import { useRecepcion } from "../../hooks/queries";
import {
  type Recepcion,
  formatearPeso,
} from "../../services/recepciones";

interface RecepcionViewProps {
  inModal?: boolean;
  recepcionId?: string | number;
  onEdit?: (recepcion: Recepcion) => void;
}

const estadoLabels: Record<string, string> = {
  PENDIENTE_PESAJE: "Pendiente de Pesaje",
  EN_CONTROL_CALIDAD: "En Control de Calidad",
  DISPONIBLE: "Disponible",
  RECHAZADA: "Rechazada",
};

export default function RecepcionView({ inModal, recepcionId: propId, onEdit }: RecepcionViewProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const { data: recepcion, isLoading: loading } = useRecepcion(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-600 border-t-transparent" />
      </div>
    );
  }

  if (!recepcion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500">No se encontró la recepción.</p>
        {!inModal && (
          <Button as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Volver
          </Button>
        )}
      </div>
    );
  }

  const pesoNeto = (recepcion.pesoBruto || 0) - (recepcion.tara || 0);

  return (
    <div className="space-y-6">
      {!inModal && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <div className="flex-1" />
            <Button
              variant="secondary"
              onClick={() => onEdit?.(recepcion)}
              iconLeft={<Pencil className="h-4 w-4" />}
            >
              Editar
            </Button>
          </div>
        </>
      )}

      {/* Header */}
      <CardShell>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
            <Scale className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{recepcion.codigo}</h1>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {estadoLabels[recepcion.estado] || recepcion.estado}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {recepcion.fecha} · {recepcion.responsable} · {recepcion.planta}
            </p>
          </div>
        </div>
      </CardShell>

      {/* Datos Generales */}
      <CardShell>
        <CardHeader icon={<span className="text-lg">📋</span>} title="Datos Generales" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Fecha" mode="view" value={recepcion.fecha} />
          <Field label="Responsable" mode="view" value={recepcion.responsable} />
          <Field label="Planta" mode="view" value={recepcion.planta} />
          <Field label="Lote Productor" mode="view" value={recepcion.loteProductor} />
          <Field label="Acopio" mode="view" value={recepcion.acopioCodigo || "Manual"} />
        </div>
      </CardShell>

      {/* Pesaje */}
      <CardShell>
        <CardHeader icon={<Scale size={20} />} title="Pesaje" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Total Sacos</p>
            <p className="text-xl font-bold text-[#111827]">{recepcion.sacos}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Peso Bruto</p>
            <p className="text-xl font-bold text-[#111827]">{recepcion.pesoBruto ? formatearPeso(recepcion.pesoBruto) : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tara</p>
            <p className="text-xl font-bold text-[#111827]">{recepcion.tara ? formatearPeso(recepcion.tara) : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Peso Neto</p>
            <p className="text-xl font-bold text-[#111827]">{pesoNeto > 0 ? formatearPeso(pesoNeto) : "—"}</p>
          </div>
        </div>
      </CardShell>

      {/* Detalle de Sacos */}
      {recepcion.sacosDetalle && recepcion.sacosDetalle.length > 0 && (
        <CardShell>
          <CardHeader icon={<Package size={20} />} title="Detalle de Sacos" />
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="mb-2 flex items-center gap-4 text-sm">
              <span className="font-medium text-gray-600">Total: {recepcion.sacosDetalle.length} sacos</span>
              <span className="font-semibold text-[#111827]">
                {formatearPeso(recepcion.sacosDetalle.reduce((sum, s) => sum + s.peso, 0))}
              </span>
            </div>
            <div className="grid gap-2">
              {recepcion.sacosDetalle.map((saco, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500">{saco.codigo}</span>
                    <span className="font-semibold text-[#111827]">{saco.peso.toFixed(2)} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      )}

      {/* Calidad */}
      <CardShell>
        <CardHeader icon={<span className="text-lg">🔍</span>} title="Control de Calidad" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Humedad" mode="view" value={recepcion.humedad ? `${recepcion.humedad}%` : "—"} />
          <Field label="Impurezas" mode="view" value={recepcion.impurezas ? `${recepcion.impurezas}%` : "—"} />
        </div>
      </CardShell>

      {/* Observaciones */}
      {recepcion.observaciones && (
        <CardShell>
          <CardHeader icon={<span className="text-lg">📝</span>} title="Observaciones" />
          <p className="text-sm text-gray-700">{recepcion.observaciones}</p>
        </CardShell>
      )}
    </div>
  );
}
