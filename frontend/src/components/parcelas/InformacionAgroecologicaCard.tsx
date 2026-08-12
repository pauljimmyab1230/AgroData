import { Leaf } from "lucide-react";
import { Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import {
  disponibilidadAguaOpciones,
  fuenteAguaOpciones,
  pendienteOpciones,
  sistemaRiegoOpciones,
  texturaOpciones,
  tipoSueloOpciones,
  zonaAgroecologicaOpciones,
  toOptions,
} from "../../constants/parcelaOpciones";
import type { Parcela } from "../../services/parcelas";

type InformacionAgroecologicaCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function InformacionAgroecologicaCard({ mode, values }: InformacionAgroecologicaCardProps) {
  const editable = mode !== "view";
  const { data, updateData } = useParcelaForm();

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Parcela) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Leaf size={20} />}
        title="Información Agroecológica"
        description="Condiciones del suelo, agua y zona agroecológica de la parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Tipo de Suelo" mode={mode} value={values?.tipoSuelo}>
          <Select
            options={toOptions(tipoSueloOpciones)}
            placeholder="Seleccione"
            value={display("tipoSuelo")}
            onChange={(val) => updateData({ tipoSuelo: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Textura" mode={mode} value={values?.textura}>
          <Select
            options={toOptions(texturaOpciones)}
            placeholder="Seleccione"
            value={display("textura")}
            onChange={(val) => updateData({ textura: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Pendiente" mode={mode} value={values?.pendiente}>
          <Select
            options={toOptions(pendienteOpciones)}
            placeholder="Seleccione"
            value={display("pendiente")}
            onChange={(val) => updateData({ pendiente: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Fuente de Agua" mode={mode} value={values?.fuenteAgua}>
          <Select
            options={toOptions(fuenteAguaOpciones)}
            placeholder="Seleccione"
            value={display("fuenteAgua")}
            onChange={(val) => updateData({ fuenteAgua: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Sistema de Riego" mode={mode} value={values?.sistemaRiego}>
          <Select
            options={toOptions(sistemaRiegoOpciones)}
            placeholder="Seleccione"
            value={display("sistemaRiego")}
            onChange={(val) => updateData({ sistemaRiego: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Zona Agroecológica" mode={mode} value={values?.zonaAgroecologica}>
          <Select
            options={toOptions(zonaAgroecologicaOpciones)}
            placeholder="Seleccione"
            value={display("zonaAgroecologica")}
            onChange={(val) => updateData({ zonaAgroecologica: val })}
            disabled={!editable}
          />
        </Field>

        <Field label="Disponibilidad de Agua" mode={mode} value={values?.disponibilidadAgua}>
          <Select
            options={toOptions(disponibilidadAguaOpciones)}
            placeholder="Seleccione"
            value={display("disponibilidadAgua")}
            onChange={(val) => updateData({ disponibilidadAgua: val })}
            disabled={!editable}
          />
        </Field>

        <div className="lg:col-span-3">
          <Field label="Observaciones" mode={mode} value={values?.observaciones}>
            <Textarea
              rows={3}
              placeholder="Ej. Suelo con buena capacidad de drenaje, apto para quinua orgánica."
              value={display("observaciones")}
              onChange={(e) => updateData({ observaciones: e.target.value })}
              disabled={!editable}
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
