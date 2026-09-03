
import { MapPin } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field } from "../shared/formControls";
import type { FormMode } from "../shared/formControls";
import type { Productor } from "../../services/productores";
import { useProductorForm } from "../../contexts/ProductorFormContext";
import { useUbigeo } from "../../hooks/useUbigeo";

type ContactoUbicacionCardProps = {
  mode: FormMode;
  values?: Partial<Productor>;
};

export function ContactoUbicacionCard({ mode, values }: ContactoUbicacionCardProps) {
  const editable = mode !== "view";
  const { data, updateData, errors, clearFieldError } = useProductorForm();

  const ubigeo = useUbigeo({
    initialDepartamento: values?.departamento ?? data?.departamento,
    initialProvincia: values?.provincia ?? data?.provincia,
    initialDistrito: values?.distrito ?? data?.distrito,
  });

  const display = (field: keyof Productor) => {
    if (mode === "view") return values?.[field] ?? "";
    return data?.[field] ?? "";
  };

  const handleDepartamentoChange = (val: string) => {
    clearFieldError("departamento");
    ubigeo.onDepartamentoChange(val);
    updateData({ departamento: val, provincia: "", distrito: "" });
  };

  const handleProvinciaChange = (val: string) => {
    clearFieldError("provincia");
    ubigeo.onProvinciaChange(val);
    updateData({ provincia: val, distrito: "" });
  };

  const handleDistritoChange = (val: string) => {
    clearFieldError("distrito");
    ubigeo.onDistritoChange(val);
    updateData({ distrito: val });
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

        <Field label="Comunidad / Anexo" mode={mode} value={values?.comunidad} required error={errors?.comunidad}>
          <Input
            type="text"
            placeholder="Ej. Collpaccasa"
            value={display("comunidad") as string}
            onChange={(e) => {
              clearFieldError("comunidad");
              updateData({ comunidad: e.target.value });
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Departamento" mode={mode} value={values?.departamento} required error={errors?.departamento}>
          <Select
            options={ubigeo.departamentoOptions}
            placeholder="Seleccione departamento"
            value={mode === "view" ? display("departamento") as string : ubigeo.departamento}
            onChange={editable ? handleDepartamentoChange : undefined}
            disabled={!editable}
          />
        </Field>

        <Field label="Provincia" mode={mode} value={values?.provincia} required error={errors?.provincia}>
          <Select
            options={ubigeo.provinciaOptions}
            placeholder={ubigeo.departamento ? "Seleccione provincia" : "Primero seleccione departamento"}
            value={mode === "view" ? display("provincia") as string : ubigeo.provincia}
            onChange={editable ? handleProvinciaChange : undefined}
            disabled={!editable || !ubigeo.departamento}
          />
        </Field>

        <Field label="Distrito" mode={mode} value={values?.distrito} required error={errors?.distrito}>
          <Select
            options={ubigeo.distritoOptions}
            placeholder={ubigeo.provincia ? "Seleccione distrito" : "Primero seleccione provincia"}
            value={mode === "view" ? display("distrito") as string : ubigeo.distrito}
            onChange={editable ? handleDistritoChange : undefined}
            disabled={!editable || !ubigeo.provincia}
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
