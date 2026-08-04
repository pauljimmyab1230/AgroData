import { MapPin } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../pages/productores/productorMock";

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

  return (
    <CardShell>
      <CardHeader
        icon={<MapPin size={20} />}
        title="Contacto y Ubicación"
        description="Medios de contacto y ubicación geográfica del productor"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Teléfono" mode={mode} value={values?.telefono}>
          <Input type="tel" placeholder="Ej. 987 654 321" defaultValue={values?.telefono} />
        </Field>

        <Field label="Correo Electrónico" mode={mode} value={values?.correo}>
          <Input type="email" placeholder="Ej. nombre@correo.com" defaultValue={values?.correo} />
        </Field>

        <Field label="Comunidad / Anexo" mode={mode} value={values?.comunidad}>
          <Input type="text" placeholder="Ej. Collpaccasa" defaultValue={values?.comunidad} />
        </Field>

        <Field label="Departamento" mode={mode} value={values?.departamento}>
          <Select
            options={departamentoOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.departamento : undefined}
          />
        </Field>

        <Field label="Provincia" mode={mode} value={values?.provincia}>
          <Select
            options={provinciaOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.provincia : undefined}
          />
        </Field>

        <Field label="Distrito" mode={mode} value={values?.distrito}>
          <Select
            options={distritoOptions}
            placeholder="Seleccione"
            defaultValue={editable ? values?.distrito : undefined}
          />
        </Field>

        <div className="lg:col-span-3">
          <Field label="Dirección" mode={mode} value={values?.direccion}>
            <Textarea
              rows={3}
              placeholder="Ej. Av. Los Andes s/n, anexo Collpaccasa"
              defaultValue={values?.direccion}
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
