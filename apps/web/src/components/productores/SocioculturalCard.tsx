import { GraduationCap } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";

type SocioculturalCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const nivelEducativoOptions = [
  { value: "SIN_ESTUDIOS", label: "Sin Estudios" },
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SECUNDARIA", label: "Secundaria" },
  { value: "TECNICO", label: "Técnico" },
  { value: "UNIVERSITARIO", label: "Universitario" },
];

const idiomaOptions = [
  { value: "QUECHUA", label: "Quechua" },
  { value: "ESPANOL", label: "Español" },
  { value: "OTRO", label: "Otro" },
];

const idiomaSecundarioOptions = [
  { value: "NINGUNO", label: "Ninguno" },
  { value: "QUECHUA", label: "Quechua" },
  { value: "ESPANOL", label: "Español" },
  { value: "OTRO", label: "Otro" },
];

export function SocioculturalCard({ mode, values }: SocioculturalCardProps) {
  const editable = mode !== "view";
  const { data, updateData, errors, clearFieldError } = useProductorForm();

  const display = (field: keyof Productor) => {
    if (mode === "view") return values?.[field] ?? "";
    return data?.[field] ?? "";
  };

  return (
    <CardShell>
      <CardHeader
        icon={<GraduationCap size={20} />}
        title="Información Sociocultural"
        description="Nivel educativo e idiomas predominantes del productor"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nivel Educativo" mode={mode} value={values?.nivelEducativo} required error={errors?.nivelEducativo}>
          <Select
            options={nivelEducativoOptions}
            placeholder="Seleccione"
            value={display("nivelEducativo") as string}
            onChange={(val) => {
              clearFieldError("nivelEducativo");
              updateData({ nivelEducativo: val as Productor["nivelEducativo"] });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Idioma Principal" mode={mode} value={values?.idiomaPrincipal} required error={errors?.idiomaPrincipal}>
          <Select
            options={idiomaOptions}
            placeholder="Seleccione"
            value={display("idiomaPrincipal") as string}
            onChange={(val) => {
              clearFieldError("idiomaPrincipal");
              updateData({ idiomaPrincipal: val as Productor["idiomaPrincipal"] });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Idioma Secundario" mode={mode} value={values?.idiomaSecundario}>
          <Select
            options={idiomaSecundarioOptions}
            placeholder="Seleccione"
            value={display("idiomaSecundario") as string}
            onChange={(val) => updateData({ idiomaSecundario: val as Productor["idiomaSecundario"] })}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}
