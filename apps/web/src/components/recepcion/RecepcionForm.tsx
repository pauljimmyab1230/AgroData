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
}

export default function RecepcionForm({ mode, values }: RecepcionFormProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collectFormData = (): Partial<Recepcion> => {
    const getVal = (selector: string) => {
      const el = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null;
      return el?.value ?? "";
    };
    const getNum = (selector: string) => {
      const v = getVal(selector);
      return v === "" ? 0 : Number(v);
    };

    return {
      codigo: values?.codigo ?? "",
      campaniaId: values?.campaniaId ?? "",
      acopioId: values?.acopioId ?? "",
      loteProductor: getVal('[name="loteProductor"]') || (values?.loteProductor ?? ""),
      fecha: values?.fecha ?? "",
      responsable: getVal('[name="responsable"]') || (values?.responsable ?? ""),
      planta: getVal('[name="planta"]') || (values?.planta ?? ""),
      sacos: values?.sacos ?? 0,
      pesoCampo: values?.pesoCampo ?? 0,
      pesoBruto: values?.pesoBruto ?? 0,
      tara: values?.tara ?? 0,
      pesoNeto: values?.pesoNeto ?? 0,
      diferencia: values?.diferencia ?? 0,
      merma: values?.merma ?? 0,
      humedad: getNum('[name="humedad"]') || (values?.humedad ?? 0),
      impurezas: getNum('[name="impurezas"]') || (values?.impurezas ?? 0),
      materiaExtrana: getNum('[name="materiaExtrana"]') || (values?.materiaExtrana ?? 0),
      color: getVal('[name="color"]') || (values?.color ?? ""),
      olor: getVal('[name="olor"]') || (values?.olor ?? ""),
      presenciaInsectos: getVal('[name="presenciaInsectos"]') || (values?.presenciaInsectos ?? ""),
      estadoProducto: getVal('[name="estadoProducto"]') || (values?.estadoProducto ?? ""),
      categoria: getVal('[name="categoria"]') || (values?.categoria ?? ""),
      destino: getVal('[name="destino"]') || (values?.destino ?? ""),
      resultado: getVal('[name="resultado"]') || (values?.resultado ?? ""),
      motivo: getVal('[name="motivo"]') || (values?.motivo ?? ""),
      estado: values?.estado ?? "PENDIENTE_PESAJE",
      observaciones: getVal('[name="observaciones"]') || (values?.observaciones ?? ""),
      documentoFirmado: values?.documentoFirmado ?? false,
      firmaResponsableUrl: values?.firmaResponsableUrl ?? "",
      activo: values?.activo ?? true,
      evidencias: values?.evidencias ?? [],
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = collectFormData();
      if (mode === "create") {
        const created = await createRecepcion(data);
        navigate(`/recepcion/${created.id}`);
      } else {
        await updateRecepcion(values!.id, data);
        navigate(`/recepcion/${values!.id}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar la recepción";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const detailTo = `/recepcion/${values?.id ?? "1"}`;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <InformacionGeneralCard mode={mode} values={values} />
      <LoteProductorCard mode={mode} values={values} />
      <PesajeCard mode={mode} values={values} />
      <ResumenRecepcionCard mode={mode} values={values} />
      <CalidadCard mode={mode} values={values} />
      <ClasificacionCard mode={mode} values={values} />
      <ResultadoCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/recepcion" : detailTo}
        submitLabel={saving ? "Guardando..." : mode === "create" ? "Guardar Recepción" : "Guardar Cambios"}
        onSubmit={handleSave}
        disabled={saving}
      />
    </div>
  );
}
