import { User } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../pages/productores/productorMock";
import { PhotoCard } from "./PhotoCard";
import { SignatureCard } from "./SignatureCard";

type DatosPersonalesCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const sexoOptions = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
];

const estadoCivilOptions = [
  { value: "Soltero", label: "Soltero" },
  { value: "Casado", label: "Casado" },
  { value: "Conviviente", label: "Conviviente" },
  { value: "Viudo", label: "Viudo" },
];

export function DatosPersonalesCard({ mode, values }: DatosPersonalesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<User size={20} />}
        title="Datos Personales"
        description="Información de identidad y datos personales del productor"
      />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="ID Productor" mode={mode} value={values?.codigo}>
            <Input placeholder="Se genera automáticamente" disabled defaultValue={values?.codigo} />
          </Field>

          <Field label="DNI" mode={mode} value={values?.dni}>
            <Input type="text" placeholder="Ej. 44789632" maxLength={8} defaultValue={values?.dni} />
          </Field>

          <Field label="Nombres" mode={mode} value={values?.nombres}>
            <Input type="text" placeholder="Ej. Apolinario" defaultValue={values?.nombres} />
          </Field>

          <Field label="Apellido Paterno" mode={mode} value={values?.apellidoPaterno}>
            <Input type="text" placeholder="Ej. Condori" defaultValue={values?.apellidoPaterno} />
          </Field>

          <Field label="Apellido Materno" mode={mode} value={values?.apellidoMaterno}>
            <Input type="text" placeholder="Ej. Quispe" defaultValue={values?.apellidoMaterno} />
          </Field>

          <Field label="Sexo" mode={mode} value={values?.sexo}>
            <Select
              options={sexoOptions}
              placeholder="Seleccione"
              defaultValue={editable ? values?.sexo : undefined}
            />
          </Field>

          <Field label="Fecha de Nacimiento" mode={mode} value={values?.fechaNacimiento}>
            <Input type="date" defaultValue={editable ? values?.fechaNacimiento : undefined} />
          </Field>

          <Field label="Estado Civil" mode={mode} value={values?.estadoCivil}>
            <Select
              options={estadoCivilOptions}
              placeholder="Seleccione"
              defaultValue={editable ? values?.estadoCivil : undefined}
            />
          </Field>
        </div>

        <div className="space-y-6">
          <PhotoCard
            mode={mode}
            initials={
              editable
                ? undefined
                : `${values?.nombres?.charAt(0) ?? ""}${values?.apellidoPaterno?.charAt(0) ?? ""}`
            }
          />
          <SignatureCard
            mode={mode}
            nombre={editable ? undefined : `${values?.nombres} ${values?.apellidoPaterno}`}
          />
        </div>
      </div>
    </CardShell>
  );
}
