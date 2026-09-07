import { useEffect, useState } from "react";
import { Tractor } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import {
  cultivosOpciones,
  estadosOpciones,
  toOptions,
  type ParcelaSelectOption,
} from "../../constants/parcelaOpciones";
import { fetchProductoresOpciones } from "../../services/parcelas";
import type { Parcela } from "../../services/parcelas";

type DatosGeneralesCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function DatosGeneralesCard({ mode, values }: DatosGeneralesCardProps) {
  const editable = mode !== "view";
  const { data, updateData, errors, clearFieldError } = useParcelaForm();
  const [productores, setProductores] = useState<ParcelaSelectOption[]>([]);

  useEffect(() => {
    if (!editable) return;
    fetchProductoresOpciones()
      .then(setProductores)
      .catch(console.error);
  }, [editable]);

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Parcela) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Datos de la Parcela"
        description="Información general y características productivas de la parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled value={display("codigo")} />
        </Field>

        <Field label="Nombre de Parcela" mode={mode} value={values?.nombre} required error={errors?.nombre}>
          <Input
            type="text"
            placeholder="Ej. Parcela A - Ñawpa Rumi"
            value={display("nombre")}
            onChange={(e) => {
              clearFieldError("nombre");
              updateData({ nombre: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productorNombre} required error={errors?.productorId}>
          <Select
            options={productores}
            placeholder="Seleccione"
            value={display("productorId")}
            onChange={(val) => {
              clearFieldError("productorId");
              updateData({ productorId: val });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Área Total (ha)" mode={mode} value={values?.area} required error={errors?.area}>
          <Input
            type="text"
            placeholder="Ej. 2.40"
            value={display("area")}
            onChange={(e) => {
              clearFieldError("area");
              updateData({ area: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Área Certificada (ha)" mode={mode} value={values?.areaCertificada}>
          <Input
            type="text"
            placeholder="Ej. 2.40"
            value={display("areaCertificada")}
            onChange={(e) => updateData({ areaCertificada: e.target.value })}
            disabled={!editable}
          />
        </Field>

        <Field label="Acreditación del Predio" mode={mode} value={values?.acreditacion}>
          <Select
            options={[
              { value: "TITULO_PROPIEDAD", label: "Título de Propiedad" },
              { value: "CERTIFICADO_POSECION", label: "Certificado de Posesión" },
              { value: "CONTRATO_ALQUILER", label: "Contrato de Alquiler" },
              { value: "CONSTANCIA_OCUPACION", label: "Constancia de Ocupación" },
              { value: "SIN_DOCUMENTO", label: "Sin Documento" },
            ]}
            placeholder="Seleccione"
            value={display("acreditacion")}
            onChange={(val) => updateData({ acreditacion: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Cultivo Principal" mode={mode} value={values?.cultivo} required error={errors?.cultivo}>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione"
            value={display("cultivo")}
            onChange={(val) => {
              clearFieldError("cultivo");
              updateData({ cultivo: val });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Estado" mode={mode} value={values?.estado}>
          <Select
            options={estadosOpciones}
            placeholder="Seleccione"
            value={display("estado") || "ACTIVA"}
            onChange={(val) => updateData({ estado: val })}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}
