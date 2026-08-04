import { GraduationCap } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../pages/productores/productorMock";

type SocioculturalCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const nivelEducativoOptions = [
  { value: "Sin Estudios", label: "Sin Estudios" },
  { value: "Primaria", label: "Primaria" },
  { value: "Secundaria", label: "Secundaria" },
  { value: "Técnico", label: "Técnico" },
  { value: "Universitario", label: "Universitario" },
];

const idiomaOptions = [
  { value: "Quechua", label: "Quechua" },
  { value: "Español", label: "Español" },
  { value: "Otro", label: "Otro" },
];

const idiomaSecundarioOptions = [
  { value: "Ninguno", label: "Ninguno" },
  { value: "Quechua", label: "Quechua" },
  { value: "Español", label: "Español" },
  { value: "Otro", label: "Otro" },
];

export function SocioculturalCard({ mode, values }: SocioculturalCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<GraduationCap size={20} />}
        title="Información Sociocultural"
        description="Nivel educativo e idiomas predominantes del productor"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nivel Educativo" mode={mode} value={values?.nivelEducativo}>
          <Select
            options={nivelEducativoOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.nivelEducativo : undefined}
          />
        </Field>

        <Field label="Idioma Principal" mode={mode} value={values?.idiomaPrincipal}>
          <Select
            options={idiomaOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.idiomaPrincipal : undefined}
          />
        </Field>

        <Field label="Idioma Secundario" mode={mode} value={values?.idiomaSecundario}>
          <Select
            options={idiomaSecundarioOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.idiomaSecundario : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
