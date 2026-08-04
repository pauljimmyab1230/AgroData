import type { ReactNode } from "react";
import { MessageSquare, MessagesSquare } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../pages/inspecciones/inspeccionMock";

type ObservacionesCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

function BloqueTexto({
  label,
  icon,
  texto,
  editable,
}: {
  label: string;
  icon: ReactNode;
  texto?: string;
  editable: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-[#111827]">{label}</h4>
      </div>
      {editable ? (
        <Textarea rows={5} placeholder={`Escribe aquí ${label.toLowerCase()}...`} defaultValue={texto} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
            {texto || "Sin registros."}
          </p>
        </div>
      )}
    </div>
  );
}

export function ObservacionesCard({ mode, values }: ObservacionesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<MessageSquare size={20} />}
        title="Observaciones"
        description="Comentarios registrados por el inspector y el productor durante la inspección"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <BloqueTexto
          label="Observaciones del Inspector"
          icon={<MessageSquare size={14} />}
          texto={values?.observaciones}
          editable={editable}
        />
        <BloqueTexto
          label="Comentarios del Productor"
          icon={<MessagesSquare size={14} />}
          texto={values?.comentariosProductor}
          editable={editable}
        />
      </div>
    </CardShell>
  );
}
