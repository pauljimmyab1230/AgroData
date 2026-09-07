import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "../ui";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { MateriaPrimaCard } from "./MateriaPrimaCard";
import { OperacionesCard } from "./OperacionesCard";
import { ControlProcesoCard } from "./ControlProcesoCard";
import { ProductoBaseCard } from "./ProductoBaseCard";
import { ObservacionesCard } from "./ObservacionesCard";
import type { FormMode } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../services/procesamientos";
import api from "../../services/api";
import { toast } from "../../utils/toast";

interface ProcesamientoFormProps {
  mode: FormMode;
  values?: OrdenProcesamiento;
  inModal?: boolean;
  onSave?: () => void;
}

export default function ProcesamientoForm({ mode, values, inModal, onSave }: ProcesamientoFormProps) {
  const navigate = useNavigate();
  const editable = mode !== "view";

  const [fechaInicio, setFechaInicio] = useState(values?.fechaInicio || new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState(values?.fechaFin || "");
  const [producto, setProducto] = useState(values?.producto || "");
  const [responsable, setResponsable] = useState(values?.responsable || "");
  const [planta, setPlanta] = useState(values?.planta || "");
  const [lineaProcesamiento, setLineaProcesamiento] = useState(values?.lineaProcesamiento || "GRANOS");
  const [estado, setEstado] = useState(values?.estado || "REGISTRADA");
  const [observaciones, setObservaciones] = useState(values?.observaciones || "");
  const [pesoEntrada, setPesoEntrada] = useState(values?.pesoEntrada?.toString() || "");
  const [pesoSalida, setPesoSalida] = useState(values?.pesoSalida?.toString() || "");
  const [merma, setMerma] = useState(values?.merma?.toString() || "");
  const [rendimiento, setRendimiento] = useState(values?.rendimiento?.toString() || "");
  const [productoBase, setProductoBase] = useState(values?.productoBase || "");
  const [calidadProducto, setCalidadProducto] = useState(values?.calidadProducto || "");
  const [pesoFinal, setPesoFinal] = useState(values?.pesoFinal?.toString() || "");
  const [humedadFinal, setHumedadFinal] = useState(values?.humedadFinal?.toString() || "");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fechaInicio) newErrors.fechaInicio = "La fecha de inicio es obligatoria";
    if (!producto.trim()) newErrors.producto = "El producto es obligatorio";
    if (!responsable.trim()) newErrors.responsable = "El responsable es obligatorio";
    if (!planta.trim()) newErrors.planta = "La planta es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin || null,
        producto,
        responsable,
        planta,
        linea_procesamiento: lineaProcesamiento,
        estado,
        observaciones: observaciones || null,
        peso_entrada: pesoEntrada ? Number(pesoEntrada) : null,
        peso_salida: pesoSalida ? Number(pesoSalida) : null,
        merma: merma ? Number(merma) : null,
        rendimiento: rendimiento ? Number(rendimiento) : null,
        producto_base: productoBase || null,
        calidad_producto: calidadProducto || null,
        peso_final: pesoFinal ? Number(pesoFinal) : null,
        humedad_final: humedadFinal ? Number(humedadFinal) : null,
      };

      if (mode === "create") {
        await api.post("/procesamientos", data);
        toast.success("Procesamiento creado exitosamente");
      } else if (values?.id) {
        await api.put(`/procesamientos/${values.id}`, data);
        toast.success("Procesamiento actualizado exitosamente");
      }

      if (!inModal) {
        navigate("/procesamiento");
      } else {
        onSave?.();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancelTo = mode === "create" ? "/procesamiento" : `/procesamiento/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      <InformacionGeneralCard
        mode={mode}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        producto={producto}
        responsable={responsable}
        planta={planta}
        lineaProcesamiento={lineaProcesamiento}
        estado={estado}
        errors={errors}
        onChange={{
          fechaInicio: setFechaInicio,
          fechaFin: setFechaFin,
          producto: setProducto,
          responsable: setResponsable,
          planta: setPlanta,
          lineaProcesamiento: setLineaProcesamiento,
          estado: setEstado,
        }}
      />
      <MateriaPrimaCard mode={mode} values={values} />
      <OperacionesCard mode={mode} values={values} />
      <ControlProcesoCard
        mode={mode}
        pesoEntrada={pesoEntrada}
        pesoSalida={pesoSalida}
        merma={merma}
        rendimiento={rendimiento}
        onChange={{
          pesoEntrada: setPesoEntrada,
          pesoSalida: setPesoSalida,
          merma: setMerma,
          rendimiento: setRendimiento,
        }}
      />
      <ProductoBaseCard
        mode={mode}
        productoBase={productoBase}
        calidadProducto={calidadProducto}
        pesoFinal={pesoFinal}
        humedadFinal={humedadFinal}
        onChange={{
          productoBase: setProductoBase,
          calidadProducto: setCalidadProducto,
          pesoFinal: setPesoFinal,
          humedadFinal: setHumedadFinal,
        }}
      />
      <ObservacionesCard mode={mode} observaciones={observaciones} onChange={setObservaciones} />

      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Button
            variant="secondary"
            onClick={() => inModal ? onSave?.() : navigate(cancelTo)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : mode === "create" ? "Crear Procesamiento" : "Guardar Cambios"}
          </Button>
        </div>
      )}
    </div>
  );
}