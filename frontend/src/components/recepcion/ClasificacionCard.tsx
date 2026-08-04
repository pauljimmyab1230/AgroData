import { Tags } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { categoriasOpciones, destinosOpciones, type Recepcion } from "../../pages/recepcion/recepcionMock";

type ClasificacionCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ClasificacionCard({ mode, values }: ClasificacionCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<Tags size={20} />}
        title="Clasificación"
        description="Asignación de categoría y destino de la materia prima recepcionada"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Categoría" mode={mode} value={values?.categoria}>
          <Select
            options={toOptions(categoriasOpciones)}
            placeholder="Seleccione la categoría"
            defaultValue={editable ? values?.categoria : undefined}
          />
        </Field>

        <Field label="Destino" mode={mode} value={values?.destino}>
          <Select
            options={toOptions(destinosOpciones)}
            placeholder="Seleccione el destino"
            defaultValue={editable ? values?.destino : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
