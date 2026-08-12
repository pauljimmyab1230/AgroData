import { Tags } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";

type ClasificacionCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const categoriasOpciones = ["PRIMERA", "SEGUNDA", "INDUSTRIAL", "DESCARTE"];
const destinosOpciones = ["PROCESAMIENTO", "ALMACEN_TEMPORAL", "RECHAZADO"];

const categoriaLabels: Record<string, string> = {
  PRIMERA: "Primera",
  SEGUNDA: "Segunda",
  INDUSTRIAL: "Industrial",
  DESCARTE: "Descarte",
};

const destinoLabels: Record<string, string> = {
  PROCESAMIENTO: "Procesamiento",
  ALMACEN_TEMPORAL: "Almacén Temporal",
  RECHAZADO: "Rechazado",
};

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
        <Field label="Categoría" mode={mode} value={values?.categoria ? (categoriaLabels[values.categoria] ?? values.categoria) : undefined}>
          <Select
            options={categoriasOpciones.map((c) => ({ value: c, label: categoriaLabels[c] ?? c }))}
            placeholder="Seleccione la categoría"
            defaultValue={editable ? values?.categoria : undefined}
          />
        </Field>

        <Field label="Destino" mode={mode} value={values?.destino ? (destinoLabels[values.destino] ?? values.destino) : undefined}>
          <Select
            options={destinosOpciones.map((d) => ({ value: d, label: destinoLabels[d] ?? d }))}
            placeholder="Seleccione el destino"
            defaultValue={editable ? values?.destino : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
