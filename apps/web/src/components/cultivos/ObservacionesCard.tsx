import { FileText } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";

type ObservacionesCardProps = {
  mode: FormMode;
  value?: string;
};

export function ObservacionesCard({ mode, value }: ObservacionesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<FileText size={20} />}
        title="Observaciones"
        description="Notas y observaciones adicionales del cultivo"
      />

      <Field label="Observaciones" mode={mode} value={value}>
        <Textarea
          rows={5}
          placeholder="Escribe aquí las observaciones del cultivo..."
          defaultValue={value}
          disabled={!editable}
          className="min-h-32"
        />
      </Field>
    </CardShell>
  );
}
