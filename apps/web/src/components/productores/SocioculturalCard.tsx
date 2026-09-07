import { GraduationCap, Home } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";
import { displayField } from "../../utils/formatters";

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

const materialViviendaOptions = [
  { value: "ADOBE", label: "Adobe" },
  { value: "TAPIAL", label: "Tapial" },
  { value: "LADRILLO", label: "Ladrillo" },
  { value: "BLOQUE", label: "Bloque" },
  { value: "MADERA", label: "Madera" },
  { value: "ZINC", label: "Zinc" },
  { value: "OTRO", label: "Otro" },
];

const siNoOptions = [
  { value: "SI", label: "Sí" },
  { value: "NO", label: "No" },
];

const seguroSaludOptions = [
  { value: "ESSALUD", label: "EsSalud" },
  { value: "PRIVADO", label: "Privado" },
  { value: "SIN_SEGURO", label: "Sin Seguro" },
  { value: "OTRO", label: "Otro" },
];

const servicioSanitarioOptions = [
  { value: "INODRO", label: "Inodro" },
  { value: "LETRINA", label: "Letrina" },
  { value: "BANO_QUIMICO", label: "Baño Químico" },
  { value: "NINGUNO", label: "Ninguno" },
];

export function SocioculturalCard({ mode, values }: SocioculturalCardProps) {
  const editable = mode !== "view";
  const { data, updateData, errors, clearFieldError } = useProductorForm();

  const display = (field: keyof Productor) => displayField(mode, field, values, data);

  return (
    <>
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

      <CardShell>
        <CardHeader
          icon={<Home size={20} />}
          title="Condiciones de Vivienda y Servicios"
          description="Infraestructura, servicios básicos y acceso a beneficios"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Material de la Vivienda" mode={mode} value={values?.materialVivienda}>
            <Select
              options={materialViviendaOptions}
              placeholder="Seleccione"
              value={display("materialVivienda") as string}
              onChange={(val) => updateData({ materialVivienda: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Acceso a Agua Potable" mode={mode} value={values?.accesoAgua}>
            <Select
              options={siNoOptions}
              placeholder="Seleccione"
              value={display("accesoAgua") as string}
              onChange={(val) => updateData({ accesoAgua: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Acceso a Energía Eléctrica" mode={mode} value={values?.accesoEnergia}>
            <Select
              options={siNoOptions}
              placeholder="Seleccione"
              value={display("accesoEnergia") as string}
              onChange={(val) => updateData({ accesoEnergia: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Acceso a Internet" mode={mode} value={values?.accesoInternet}>
            <Select
              options={siNoOptions}
              placeholder="Seleccione"
              value={display("accesoInternet") as string}
              onChange={(val) => updateData({ accesoInternet: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Tipo de Seguro de Salud" mode={mode} value={values?.seguroSalud}>
            <Select
              options={seguroSaludOptions}
              placeholder="Seleccione"
              value={display("seguroSalud") as string}
              onChange={(val) => updateData({ seguroSalud: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Acceso a Crédito Financiero" mode={mode} value={values?.accesoCredito}>
            <Select
              options={siNoOptions}
              placeholder="Seleccione"
              value={display("accesoCredito") as string}
              onChange={(val) => updateData({ accesoCredito: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Tipo de Servicio Sanitario" mode={mode} value={values?.servicioSanitario}>
            <Select
              options={servicioSanitarioOptions}
              placeholder="Seleccione"
              value={display("servicioSanitario") as string}
              onChange={(val) => updateData({ servicioSanitario: val })}
              disabled={!editable}
            />
          </Field>
        </div>
      </CardShell>
    </>
  );
}
