import { MapPin } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";

type ContactoUbicacionCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

const departamentoOptions = [{ value: "Ayacucho", label: "Ayacucho" }];

const provinciaOptions = [
  { value: "Huamanga", label: "Huamanga" },
  { value: "Cangallo", label: "Cangallo" },
  { value: "Fajardo", label: "Fajardo" },
  { value: "Vilcas Huamán", label: "Vilcas Huamán" },
];

const distritoOptions = [
  { value: "Chiara", label: "Chiara" },
  { value: "Vinchos", label: "Vinchos" },
  { value: "Vilcas Huamán", label: "Vilcas Huamán" },
  { value: "Huancapi", label: "Huancapi" },
];

export function ContactoUbicacionCard({ mode, values }: ContactoUbicacionCardProps) {
  const editable = mode !== "view";
  const { data, updateData } = useProductorForm();

  const display = (field: keyof Productor) => {
    if (mode === "view") return values?.[field] ?? "";
    return data?.[field] ?? "";
  };

  return (
    <CardShell>
      <CardHeader
        icon={<MapPin size={20} />}
        title="Contacto y Ubicación"
        description="Medios de contacto y ubicación geográfica del productor"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Teléfono" mode={mode} value={values?.telefono}>
          <Input
            type="tel"
            placeholder="Ej. 987 654 321"
            value={display("telefono") as string}
            onChange={(e) => updateData({ telefono: e.target.value })}
            disabled={!editable}
          />
        </Field>

        <Field label="Correo Electrónico" mode={mode} value={values?.correo}>
          <Input
            type="email"
            placeholder="Ej. nombre@correo.com"
            value={display("correo") as string}
            onChange={(e) => updateData({ correo: e.target.value })}
            disabled={!editable}
          />
        </Field>

        <Field label="Comunidad / Anexo" mode={mode} value={values?.comunidad}>
          <Input
            type="text"
            placeholder="Ej. Collpaccasa"
            value={display("comunidad") as string}
            onChange={(e) => updateData({ comunidad: e.target.value })}
            disabled={!editable}
          />
        </Field>

        <Field label="Departamento" mode={mode} value={values?.departamento}>
          <Select
            options={departamentoOptions}
            placeholder="Seleccione"
            value={display("departamento") as string}
            onChange={(val) => updateData({ departamento: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Provincia" mode={mode} value={values?.provincia}>
          <Select
            options={provinciaOptions}
            placeholder="Seleccione"
            value={display("provincia") as string}
            onChange={(val) => updateData({ provincia: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Distrito" mode={mode} value={values?.distrito}>
          <Select
            options={distritoOptions}
            placeholder="Seleccione"
            value={display("distrito") as string}
            onChange={(val) => updateData({ distrito: val })}
            disabled={!editable}
          />
        </Field>

        <div className="lg:col-span-3">
          <Field label="Dirección" mode={mode} value={values?.direccion}>
            <Textarea
              rows={3}
              placeholder="Ej. Av. Los Andes s/n, anexo Collpaccasa"
              value={display("direccion") as string}
              onChange={(e) => updateData({ direccion: e.target.value })}
              disabled={!editable}
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
