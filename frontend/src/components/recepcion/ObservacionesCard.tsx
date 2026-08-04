import { MessageSquare } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../pages/recepcion/recepcionMock";

type ObservacionesCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

export function ObservacionesCard({ mode, values }: ObservacionesCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<MessageSquare size={20} />}
        title="Observaciones"
        description="Notas generales de la recepción de materia prima"
      />

      {mode === "view" ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
            {values?.observaciones || "Sin observaciones registradas."}
          </p>
        </div>
      ) : (
        <Textarea
          rows={8}
          placeholder="Escribe aquí las observaciones generales de la recepción..."
          defaultValue={values?.observaciones}
        />
      )}
    </CardShell>
  );
}
