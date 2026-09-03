import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { LoteProductorCard } from "./LoteProductorCard";
import { PesajeCard } from "./PesajeCard";
import ResumenRecepcionCard from "./ResumenRecepcionCard";
import { CalidadCard } from "./CalidadCard";
import { ClasificacionCard } from "./ClasificacionCard";
import { ResultadoCard } from "./ResultadoCard";
import { EvidenciasCard } from "./EvidenciasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";
import { createRecepcion, updateRecepcion } from "../../services/recepciones";

interface RecepcionFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Recepcion;
  inModal?: boolean;
  onSave?: () => void;
}

export default function RecepcionForm({ mode, values, inModal, onSave }: RecepcionFormProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Recepcion>>({
    codigo: values?.codigo ?? "",
    campaniaId: values?.campaniaId ?? "",
    acopioId: values?.acopioId ?? "",
    loteProductor: values?.loteProductor ?? "",
    fecha: values?.fecha ?? new Date().toISOString().split("T")[0],
    responsable: values?.responsable ?? "",
    planta: values?.planta ?? "",
    sacos: values?.sacos ?? 0,
    pesoCampo: values?.pesoCampo ?? 0,
    pesoBruto: values?.pesoBruto ?? 0,
    tara: values?.tara ?? 0,
    pesoNeto: values?.pesoNeto ?? 0,
    diferencia: values?.diferencia ?? 0,
    merma: values?.merma ?? 0,
    humedad: values?.humedad ?? 0,
    impurezas: values?.impurezas ?? 0,
    materiaExtrana: values?.materiaExtrana ?? 0,
    color: values?.color ?? "",
    olor: values?.olor ?? "",
    presenciaInsectos: values?.presenciaInsectos ?? "",
    estadoProducto: values?.estadoProducto ?? "",
    categoria: values?.categoria ?? "",
    destino: values?.destino ?? "",
    resultado: values?.resultado ?? "",
    motivo: values?.motivo ?? "",
    estado: values?.estado ?? "PENDIENTE_PESAJE",
    observaciones: values?.observaciones ?? "",
    documentoFirmado: values?.documentoFirmado ?? false,
    firmaResponsableUrl: values?.firmaResponsableUrl ?? "",
    activo: values?.activo ?? true,
    evidencias: values?.evidencias ?? [],
  });

  const updateField = <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (mode === "create") {
        await createRecepcion(form);
        if (!inModal) {
          navigate("/recepcion");
        } else {
          onSave?.();
        }
      } else {
        await updateRecepcion(values!.id, form);
        if (!inModal) {
          navigate(`/recepcion/${values!.id}`);
        } else {
          onSave?.();
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar la recepción";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const detailTo = `/recepcion/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <InformacionGeneralCard mode={mode} values={form} onChange={updateField} />
      <LoteProductorCard mode={mode} values={form} onChange={updateField} />
      <PesajeCard mode={mode} values={form} onChange={updateField} />
      <ResumenRecepcionCard mode={mode} values={form} />
      <CalidadCard mode={mode} values={form} onChange={updateField} />
      <ClasificacionCard mode={mode} values={form} onChange={updateField} />
      <ResultadoCard mode={mode} values={form} onChange={updateField} />
      <EvidenciasCard mode={mode} values={form} onChange={updateField} />
      <ObservacionesCard mode={mode} values={form} onChange={updateField} />

      <ActionButtons
        cancelTo={mode === "create" ? "/recepcion" : detailTo}
        submitLabel={saving ? "Guardando..." : mode === "create" ? "Guardar Recepción" : "Guardar Cambios"}
        onSubmit={handleSave}
        disabled={saving}
      />
    </div>
  );
}
