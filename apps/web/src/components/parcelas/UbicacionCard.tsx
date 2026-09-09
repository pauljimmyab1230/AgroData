import { Crosshair, Globe, MapPin } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useOptionalParcelaForm } from "../../contexts/ParcelaFormContext";
import ParcelaMap, { latLngToUtm } from "./ParcelaMap";
import { ParcelaCoordinates } from "./ParcelaCoordinates";
import { useUbigeo } from "../../hooks/useUbigeo";
import type { Parcela } from "../../services/parcelas";

type UbicacionCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function UbicacionCard({ mode, values }: UbicacionCardProps) {
  const editable = mode !== "view";
  const formCtx = useOptionalParcelaForm();
  const data = formCtx?.data;
  const updateData = formCtx?.updateData;

  const ubigeo = useUbigeo({
    initialDepartamento: values?.departamento ?? data?.departamento,
    initialProvincia: values?.provincia ?? data?.provincia,
    initialDistrito: values?.distrito ?? data?.distrito,
    initialUbigeo: values?.ubigeo ?? data?.ubigeo,
  });

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Parcela) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  const handleDepartamentoChange = (val: string) => {
    ubigeo.onDepartamentoChange(val);
    updateData({ departamento: val, provincia: "", distrito: "", ubigeo: "" });
  };

  const handleProvinciaChange = (val: string) => {
    ubigeo.onProvinciaChange(val);
    updateData({ provincia: val, distrito: "", ubigeo: "" });
  };

  const handleDistritoChange = (val: string) => {
    ubigeo.onDistritoChange(val);
    const ubigeoCode = ubigeo.ubigeoSeleccionado || "";
    updateData({ distrito: val, ubigeo: ubigeoCode });
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
          <Field label="Departamento" mode={mode} value={values?.departamento}>
            <Select
              options={ubigeo.departamentoOptions}
              placeholder="Seleccione departamento"
              value={mode === "view" ? display("departamento") : ubigeo.departamento}
              onChange={editable ? handleDepartamentoChange : undefined}
              disabled={!editable}
            />
          </Field>

          <Field label="Provincia" mode={mode} value={values?.provincia}>
            <Select
              options={ubigeo.provinciaOptions}
              placeholder={ubigeo.departamento ? "Seleccione provincia" : "Primero seleccione departamento"}
              value={mode === "view" ? display("provincia") : ubigeo.provincia}
              onChange={editable ? handleProvinciaChange : undefined}
              disabled={!editable || !ubigeo.departamento}
            />
          </Field>

          <Field label="Distrito" mode={mode} value={values?.distrito}>
            <Select
              options={ubigeo.distritoOptions}
              placeholder={ubigeo.provincia ? "Seleccione distrito" : "Primero seleccione provincia"}
              value={mode === "view" ? display("distrito") : ubigeo.distrito}
              onChange={editable ? handleDistritoChange : undefined}
              disabled={!editable || !ubigeo.provincia}
            />
          </Field>

          <Field label="Ubigeo" mode={mode} value={values?.ubigeo}>
            <Input
              type="text"
              placeholder="Se asigna automáticamente"
              value={mode === "view" ? display("ubigeo") : ubigeo.ubigeoSeleccionado}
              onChange={(e) => updateData({ ubigeo: e.target.value })}
              disabled={!editable}
              readOnly
            />
          </Field>

          <Field label="Comunidad" mode={mode} value={values?.comunidad}>
            <Input
              type="text"
              placeholder="Ej. Collpaccasa"
              value={display("comunidad")}
              onChange={(e) => updateData({ comunidad: e.target.value })}
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
          icon={<Globe size={20} />}
          title="Mapa de Ubicación"
          description="Selecciona la ubicación de la parcela en el mapa"
        />

        <ParcelaMap
          lat={display("latitud")}
          lng={display("longitud")}
          label={display("comunidad")}
          editable={editable}
          className="h-80"
          onLocate={
            editable
              ? (lat, lng, altitud) => {
                  const utm = latLngToUtm(lat, lng);
                  updateData({
                    latitud: lat.toFixed(6),
                    longitud: lng.toFixed(6),
                    precisionGps: "± 5 m",
                    altitud: altitud ? `${Math.round(altitud)} m.s.n.m.` : "",
                    utmEste: utm.este,
                    utmNorte: utm.norte,
                    utmZona: utm.zona,
                  });
                }
              : undefined
          }
        />
      </CardShell>

      <CardShell>
        <CardHeader
          icon={<Crosshair size={20} />}
          title="Coordenadas GPS y UTM"
          description="Coordenadas geográficas y georreferenciación de la parcela"
        />
        <ParcelaCoordinates
          mode={mode}
          latitud={display("latitud")}
          longitud={display("longitud")}
          precisionGps={display("precisionGps")}
          altitud={display("altitud")}
          utmEste={display("utmEste")}
          utmNorte={display("utmNorte")}
          utmZona={display("utmZona")}
          onChange={(field, value) => updateData({ [field]: value })}
        />
      </CardShell>
    </div>
  );
}
