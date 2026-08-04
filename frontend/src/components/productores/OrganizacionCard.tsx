import { Building2 } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../pages/productores/productorMock";

type OrganizacionCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const estadoOptions = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
  { value: "Suspendido", label: "Suspendido" },
];

const cargoOptions = [
  { value: "Socio", label: "Socio" },
  { value: "Directivo", label: "Directivo" },
  { value: "Presidente", label: "Presidente" },
  { value: "Vicepresidente", label: "Vicepresidente" },
  { value: "Secretario", label: "Secretario" },
  { value: "Tesorero", label: "Tesorero" },
  { value: "Vocal", label: "Vocal" },
  { value: "Otro", label: "Otro" },
];

export function OrganizacionCard({ mode, values }: OrganizacionCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<Building2 size={20} />}
        title="Información Organizacional"
        description="Estado, fecha de ingreso y cargo dentro de la organización"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Estado" mode={mode} value={values?.estado}>
          <Select
            options={estadoOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.estado : undefined}
          />
        </Field>

        <Field label="Fecha de Ingreso" mode={mode} value={values?.fechaIngreso}>
          <Input type="date" defaultValue={editable ? values?.fechaIngreso : undefined} />
        </Field>

        <Field label="Organización / Base" mode={mode} value={values?.organizacion}>
          <Input type="text" placeholder="Ej. Asociación Virgen de Fátima" defaultValue={values?.organizacion} />
        </Field>

        <Field label="Cargo" mode={mode} value={values?.cargo}>
          <Select
            options={cargoOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.cargo : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
