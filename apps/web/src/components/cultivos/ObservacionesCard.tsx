import { FileText } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";

type ObservacionesCardProps = {
  mode: FormMode;
  value?: string;
  onChange?: (value: string) => void;
};

export function ObservacionesCard({ mode, value, onChange }: ObservacionesCardProps) {
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
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={mode === "view"}
          className="min-h-32"
        />
      </Field>
    </CardShell>
  );
}
