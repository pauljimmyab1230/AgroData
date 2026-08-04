import { Leaf } from "lucide-react";
import { Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  disponibilidadAguaOpciones,
  fuenteAguaOpciones,
  pendienteOpciones,
  sistemaRiegoOpciones,
  texturaOpciones,
  tipoSueloOpciones,
  zonaAgroecologicaOpciones,
  type Parcela,
} from "../../pages/parcelas/parcelaMock";

type InformacionAgroecologicaCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function InformacionAgroecologicaCard({ mode, values }: InformacionAgroecologicaCardProps) {
  const editable = mode !== "view";
  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

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
            defaultValue={editable ? values?.tipoSuelo : undefined}
          />
        </Field>

        <Field label="Textura" mode={mode} value={values?.textura}>
          <Select
            options={toOptions(texturaOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.textura : undefined}
          />
        </Field>

        <Field label="Pendiente" mode={mode} value={values?.pendiente}>
          <Select
            options={toOptions(pendienteOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.pendiente : undefined}
          />
        </Field>

        <Field label="Fuente de Agua" mode={mode} value={values?.fuenteAgua}>
          <Select
            options={toOptions(fuenteAguaOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.fuenteAgua : undefined}
          />
        </Field>

        <Field label="Sistema de Riego" mode={mode} value={values?.sistemaRiego}>
          <Select
            options={toOptions(sistemaRiegoOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.sistemaRiego : undefined}
          />
        </Field>

        <Field label="Zona Agroecológica" mode={mode} value={values?.zonaAgroecologica}>
          <Select
            options={toOptions(zonaAgroecologicaOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.zonaAgroecologica : undefined}
          />
        </Field>

        <Field label="Disponibilidad de Agua" mode={mode} value={values?.disponibilidadAgua}>
          <Select
            options={toOptions(disponibilidadAguaOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.disponibilidadAgua : undefined}
          />
        </Field>

        <div className="lg:col-span-3">
          <Field label="Observaciones" mode={mode} value={values?.observaciones}>
            <Textarea
              rows={3}
              placeholder="Ej. Suelo con buena capacidad de drenaje, apto para quinua orgánica."
              defaultValue={values?.observaciones}
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
