import { Crosshair, Globe, Locate, MapPin } from "lucide-react";
import { Button, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import ParcelaMap from "./ParcelaMap";
import { ParcelaCoordinates } from "./ParcelaCoordinates";
import {
  comunidadesOpciones,
  type Parcela,
} from "../../pages/parcelas/parcelaMock";

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
  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

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
            <Input type="text" placeholder="Ej. 050903" defaultValue={values?.ubigeo} />
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

          <Field label="Comunidad" mode={mode} value={values?.comunidad}>
            <Select
              options={toOptions(comunidadesOpciones)}
              placeholder="Seleccione"
              defaultValue={editable ? values?.comunidad : undefined}
            />
          </Field>

          <Field label="Centro Poblado" mode={mode} value={values?.centroPoblado}>
            <Input type="text" placeholder="Ej. Collpaccasa" defaultValue={values?.centroPoblado} />
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
          latitud={values?.latitud}
          longitud={values?.longitud}
          precisionGps={values?.precisionGps}
        />
      </CardShell>

      <CardShell>
        <CardHeader
          icon={<Globe size={20} />}
          title="Mapa de Ubicación"
          description="Vista previa de la ubicación en el mapa"
        />

        <ParcelaMap
          lat={values?.latitud}
          lng={values?.longitud}
          label={values?.comunidad}
          className="h-72"
        />
        {mode !== "view" && (
          <Button variant="secondary" className="mt-4" iconLeft={<Locate className="h-4 w-4" />}>
            Obtener Ubicación
          </Button>
        )}
      </CardShell>
    </div>
  );
}
