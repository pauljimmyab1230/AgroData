import { MessageSquare } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../services/procesamientos";

type ObservacionesCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function ObservacionesCard({ mode, values }: ObservacionesCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<MessageSquare size={20} />}
        title="Observaciones"
        description="Notas generales de la orden de procesamiento"
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
          placeholder="Escribe aquí las observaciones generales del procesamiento..."
          defaultValue={values?.observaciones}
        />
      )}
    </CardShell>
  );
}
