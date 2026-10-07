import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Factory, Save } from "lucide-react";
import { Button, Input, LoadingSpinner, Select } from "../../components/ui";
import { CardShell, CardHeader, Field } from "../../components/shared/formControls";
import { useOrden, useUpdateOrden } from "../../hooks/queries";
import type { EtapaProceso, FormatoSalida, CalidadProducto } from "../../services/ordenes";
import { toast } from "../../utils/toast";

const ETAPA_OPTIONS = [
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SECUNDARIA", label: "Secundaria" },
  { value: "EMPAQUE", label: "Empaque" },
];

const FORMATO_OPTIONS = [
  { value: "GRANO", label: "Grano" },
  { value: "HARINA", label: "Harina" },
  { value: "HOJUELA", label: "Hojuelas" },
  { value: "POP", label: "Pop" },
  { value: "GRANEL", label: "Granel" },
  { value: "OTRO", label: "Otro" },
];

const CALIDAD_OPTIONS = [
  { value: "", label: "Sin definir" },
  { value: "PRIMERA", label: "Primera" },
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCERA", label: "Tercera" },
  { value: "DESCARTE", label: "Descarte" },
];

interface OrdenEditProps {
  inModal?: boolean;
  onSave?: () => void;
  onClose?: () => void;
  ordenId?: number;
}

export default function OrdenEdit({ inModal, onSave, onClose, ordenId: propId }: OrdenEditProps) {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const ordenId = propId ?? (paramId ? Number(paramId) : null);

  const { data: orden, isLoading } = useOrden(ordenId);
  const updateMutation = useUpdateOrden();

  const [planta, setPlanta] = useState("");
  const [responsable, setResponsable] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [etapa, setEtapa] = useState<EtapaProceso>("PRIMARIA");
  const [formatoSalida, setFormatoSalida] = useState<FormatoSalida>("GRANO");
  const [productoSalida, setProductoSalida] = useState("");
  const [pesoEntrada, setPesoEntrada] = useState("");
  const [humedadFinal, setHumedadFinal] = useState("");
  const [calidad, setCalidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState("");
  const [iniciado, setIniciado] = useState(false);

  useEffect(() => {
    if (orden && !iniciado) {
      setPlanta(orden.planta);
      setResponsable(orden.responsable);
      setFechaInicio(orden.fecha_inicio.split("T")[0]);
      setFechaFin(orden.fecha_fin ? orden.fecha_fin.split("T")[0] : "");
      setEtapa(orden.etapa);
      setFormatoSalida(orden.formato_salida);
      setProductoSalida(orden.producto_salida);
      setPesoEntrada(String(orden.peso_entrada));
      setHumedadFinal(orden.humedad_final != null ? String(orden.humedad_final) : "");
      setCalidad(orden.calidad ?? "");
      setObservaciones(orden.observaciones ?? "");
      setIniciado(true);
    }
  }, [orden, iniciado]);

  const handleSubmit = async () => {
    if (!planta.trim() || !responsable.trim() || !productoSalida.trim()) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: ordenId!,
        data: {
          planta: planta.trim(),
          responsable: responsable.trim(),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin || null,
          etapa,
          formato_salida: formatoSalida,
          producto_salida: productoSalida.trim(),
          peso_entrada: pesoEntrada ? Number(pesoEntrada) : 0,
          humedad_final: humedadFinal ? Number(humedadFinal) : null,
          calidad: calidad ? (calidad as CalidadProducto) : null,
          observaciones: observaciones.trim() || null,
        },
      });
      toast.success("Orden actualizada exitosamente");
      if (inModal) {
        onSave?.();
      } else {
        navigate(`/procesamiento/${ordenId}`);
      }
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al actualizar la orden");
    }
  };

  if (isLoading || !orden) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        {!inModal && (
          <Button
            variant="ghost"
            onClick={() => navigate(`/procesamiento/${ordenId}`)}
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Volver
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Editar orden {orden.codigo}</h1>
          <p className="text-sm text-gray-500">Modifica los datos de la orden</p>
        </div>
      </div>

      <CardShell>
        <CardHeader icon={<Factory size={20} />} title="Datos de la orden" />
        <div className="space-y-4">
          <Field label="Planta" mode="edit" required>
            <Input value={planta} onChange={(e) => setPlanta(e.target.value)} />
          </Field>

          <Field label="Responsable" mode="edit" required>
            <Input value={responsable} onChange={(e) => setResponsable(e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha inicio" mode="edit" required>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </Field>
            <Field label="Fecha fin" mode="edit">
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Etapa" mode="edit" required>
              <Select options={ETAPA_OPTIONS} value={etapa} onChange={(v) => setEtapa(v as EtapaProceso)} />
            </Field>
            <Field label="Formato de salida" mode="edit">
              <Select options={FORMATO_OPTIONS} value={formatoSalida} onChange={(v) => setFormatoSalida(v as FormatoSalida)} />
            </Field>
          </div>

          <Field label="Producto de salida" mode="edit" required>
            <Input value={productoSalida} onChange={(e) => setProductoSalida(e.target.value)} />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Peso entrada (kg)" mode="edit">
              <Input type="number" min="0" step="0.01" value={pesoEntrada} onChange={(e) => setPesoEntrada(e.target.value)} />
            </Field>
            <Field label="Humedad final (%)" mode="edit">
              <Input type="number" min="0" max="100" step="0.1" value={humedadFinal} onChange={(e) => setHumedadFinal(e.target.value)} />
            </Field>
            <Field label="Calidad" mode="edit">
              <Select options={CALIDAD_OPTIONS} value={calidad} onChange={setCalidad} />
            </Field>
          </div>

          <Field label="Observaciones" mode="edit">
            <Input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </Field>
        </div>
      </CardShell>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={() => (inModal ? onClose?.() : navigate(`/procesamiento/${ordenId}`))}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={updateMutation.isPending} iconLeft={<Save className="h-4 w-4" />}>
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
