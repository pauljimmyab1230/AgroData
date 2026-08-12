import { Crosshair, Globe, MapPin } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import ParcelaMap from "./ParcelaMap";
import { ParcelaCoordinates } from "./ParcelaCoordinates";
import { comunidadesOpciones, toOptions } from "../../constants/parcelaOpciones";
import type { Parcela } from "../../services/parcelas";

type UbicacionCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
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
  { value: "Cangallo", label: "Cangallo" },
];

export function UbicacionCard({ mode, values }: UbicacionCardProps) {
  const editable = mode !== "view";
  const { data, updateData } = useParcelaForm();

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Parcela) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  return (
    <div className="space-y-6">
      <CardShell>
        <CardHeader
          icon={<MapPin size={20} />}
          title="Ubicación Administrativa"
          description="División política y administrativa de la parcela"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Ubigeo" mode={mode} value={values?.ubigeo}>
            <Input
              type="text"
              placeholder="Ej. 050903"
              value={display("ubigeo")}
              onChange={(e) => updateData({ ubigeo: e.target.value })}
              disabled={!editable}
            />
          </Field>

          <Field label="Departamento" mode={mode} value={values?.departamento}>
            <Select
              options={departamentoOptions}
              placeholder="Seleccione"
              value={display("departamento")}
              onChange={(val) => updateData({ departamento: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Provincia" mode={mode} value={values?.provincia}>
            <Select
              options={provinciaOptions}
              placeholder="Seleccione"
              value={display("provincia")}
              onChange={(val) => updateData({ provincia: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Distrito" mode={mode} value={values?.distrito}>
            <Select
              options={distritoOptions}
              placeholder="Seleccione"
              value={display("distrito")}
              onChange={(val) => updateData({ distrito: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Comunidad" mode={mode} value={values?.comunidad}>
            <Select
              options={toOptions(comunidadesOpciones)}
              placeholder="Seleccione"
              value={display("comunidad")}
              onChange={(val) => updateData({ comunidad: val })}
              disabled={!editable}
            />
          </Field>

          <Field label="Centro Poblado" mode={mode} value={values?.centroPoblado}>
            <Input
              type="text"
              placeholder="Ej. Collpaccasa"
              value={display("centroPoblado")}
              onChange={(e) => updateData({ centroPoblado: e.target.value })}
              disabled={!editable}
            />
          </Field>
        </div>
      </CardShell>

      <CardShell>
        <CardHeader
          icon={<Crosshair size={20} />}
          title="Coordenadas GPS"
          description="Coordenadas geográficas del punto central de la parcela"
        />
        <ParcelaCoordinates
          mode={mode}
          latitud={display("latitud")}
          longitud={display("longitud")}
          precisionGps={display("precisionGps")}
          onChange={(field, value) => updateData({ [field]: value })}
        />
      </CardShell>

      <CardShell>
        <CardHeader
          icon={<Globe size={20} />}
          title="Mapa de Ubicación"
          description="Vista previa de la ubicación en el mapa"
        />

        <ParcelaMap
          lat={display("latitud")}
          lng={display("longitud")}
          label={display("comunidad")}
          className="h-72"
          onLocate={
            editable
              ? (lat, lng) => {
                  updateData({
                    latitud: lat.toFixed(6),
                    longitud: lng.toFixed(6),
                    precisionGps: "± 5 m",
                  });
                }
              : undefined
          }
        />
      </CardShell>
    </div>
  );
}
