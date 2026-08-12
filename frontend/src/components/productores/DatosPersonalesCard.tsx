import { User } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";

type DatosPersonalesCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const sexoOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

const estadoCivilOptions = [
  { value: "SOLTERO", label: "Soltero" },
  { value: "CASADO", label: "Casado" },
  { value: "CONVIVIENTE", label: "Conviviente" },
  { value: "VIUDO", label: "Viudo" },
];

export function DatosPersonalesCard({ mode, values }: DatosPersonalesCardProps) {
  const editable = mode !== "view";
  const { data, updateData, errors, clearFieldError } = useProductorForm();

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Productor) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  return (
    <CardShell>
      <CardHeader
        icon={<User size={20} />}
        title="Datos Personales"
        description="Información de identidad y datos personales del productor"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="ID Productor" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled value={display("codigo")} />
        </Field>

        <Field label="DNI" mode={mode} value={values?.dni} required error={errors?.dni}>
          <Input
            type="text"
            placeholder="Ej. 44789632"
            maxLength={8}
            value={display("dni") as string}
            onChange={(e) => {
              clearFieldError("dni");
              updateData({ dni: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Nombres" mode={mode} value={values?.nombres} required error={errors?.nombres}>
          <Input
            type="text"
            placeholder="Ej. Apolinario"
            value={display("nombres") as string}
            onChange={(e) => {
              clearFieldError("nombres");
              updateData({ nombres: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Apellido Paterno" mode={mode} value={values?.apellidoPaterno} required error={errors?.apellidoPaterno}>
          <Input
            type="text"
            placeholder="Ej. Condori"
            value={display("apellidoPaterno") as string}
            onChange={(e) => {
              clearFieldError("apellidoPaterno");
              updateData({ apellidoPaterno: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Apellido Materno" mode={mode} value={values?.apellidoMaterno} required error={errors?.apellidoMaterno}>
          <Input
            type="text"
            placeholder="Ej. Quispe"
            value={display("apellidoMaterno") as string}
            onChange={(e) => {
              clearFieldError("apellidoMaterno");
              updateData({ apellidoMaterno: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Sexo" mode={mode} value={values?.sexo} required error={errors?.sexo}>
          <Select
            options={sexoOptions}
            placeholder="Seleccione"
            value={display("sexo") as string}
            onChange={(val) => {
              clearFieldError("sexo");
              updateData({ sexo: val as Productor["sexo"] });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Fecha de Nacimiento" mode={mode} value={values?.fechaNacimiento} required error={errors?.fechaNacimiento}>
          <DatePicker
            selected={display("fechaNacimiento") ? new Date(display("fechaNacimiento") + "T00:00:00") : null}
            onChange={(date) => {
              clearFieldError("fechaNacimiento");
              updateData({ fechaNacimiento: date ? date.toISOString().split("T")[0] : "" });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Estado Civil" mode={mode} value={values?.estadoCivil} required error={errors?.estadoCivil}>
          <Select
            options={estadoCivilOptions}
            placeholder="Seleccione"
            value={display("estadoCivil") as string}
            onChange={(val) => {
              clearFieldError("estadoCivil");
              updateData({ estadoCivil: val as Productor["estadoCivil"] });
            }}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}
