import type { ReactNode } from "react";
import { ClipboardCheck } from "lucide-react";
import { Card } from "../ui";
import { EstadoBadge, ResultadoBadge } from "./badges";
import { formatFecha, type Inspeccion } from "../../services/inspecciones";

interface InspeccionHeaderProps {
  inspeccion: Inspeccion;
  actions?: ReactNode;
}

export default function InspeccionHeader({ inspeccion, actions }: InspeccionHeaderProps) {
  return (
    <Card padding="lg" hover={false} className="mb-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
          <ClipboardCheck className="h-7 w-7" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{inspeccion.codigo}</h1>
            <EstadoBadge estado={inspeccion.estado} />
            <ResultadoBadge resultado={inspeccion.resultado} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fecha: <span className="font-medium text-[#111827]">{formatFecha(inspeccion.fecha)}</span>
            {" · "}Productor: <span className="font-medium text-[#111827]">{inspeccion.productorNombre}</span>
            {" · "}Parcela: <span className="font-medium text-[#111827]">{inspeccion.parcelaNombre}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Inspector: <span className="font-medium text-[#111827]">{inspeccion.inspector}</span>
            {" · "}Campaña: <span className="font-medium text-[#111827]">{inspeccion.campaniaNombre}</span>
            {" · "}Cultivo: <span className="font-medium text-[#111827]">{inspeccion.cultivoNombre}</span>
          </p>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
