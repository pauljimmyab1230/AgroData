import { Building2 } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";

type OrganizacionCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const estadoOptions = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
  { value: "SUSPENDIDO", label: "Suspendido" },
];

const cargoOptions = [
  { value: "SOCIO", label: "Socio" },
  { value: "DIRECTIVO", label: "Directivo" },
  { value: "PRESIDENTE", label: "Presidente" },
  { value: "VICEPRESIDENTE", label: "Vicepresidente" },
  { value: "SECRETARIO", label: "Secretario" },
  { value: "TESORERO", label: "Tesorero" },
  { value: "VOCAL", label: "Vocal" },
  { value: "OTRO", label: "Otro" },
];

export function OrganizacionCard({ mode, values }: OrganizacionCardProps) {
  const editable = mode !== "view";
  const { data, updateData } = useProductorForm();

  const display = (field: keyof Productor) => {
    if (mode === "view") return values?.[field] ?? "";
    return data?.[field] ?? "";
  };

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
            value={display("estado") as string}
            onChange={(val) => updateData({ estado: val as Productor["estado"] })}
            disabled={!editable}
          />
        </Field>

        <Field label="Fecha de Ingreso" mode={mode} value={values?.fechaIngreso}>
          <DatePicker
            selected={display("fechaIngreso") ? new Date(display("fechaIngreso") + "T00:00:00") : null}
            onChange={(date) =>
              updateData({ fechaIngreso: date ? date.toISOString().split("T")[0] : "" })
            }
            disabled={!editable}
          />
        </Field>

        <Field label="Organización / Base" mode={mode} value={values?.organizacion}>
          <Input
            type="text"
            placeholder="Ej. Asociación Virgen de Fátima"
            value={display("organizacion") as string}
            onChange={(e) => updateData({ organizacion: e.target.value })}
            disabled={!editable}
          />
        </Field>

        <Field label="Cargo" mode={mode} value={values?.cargo}>
          <Select
            options={cargoOptions}
            placeholder="Seleccione"
            value={display("cargo") as string}
            onChange={(val) => updateData({ cargo: val as Productor["cargo"] })}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}
