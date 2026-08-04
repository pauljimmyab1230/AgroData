import type { ReactNode } from "react";
import { PackageCheck } from "lucide-react";
import { Card } from "../ui";
import { EstadoRecepcionBadge } from "./badges";
import { formatFecha, type Recepcion } from "../../pages/recepcion/recepcionMock";

interface RecepcionHeaderProps {
  recepcion: Recepcion;
  actions?: ReactNode;
}

export default function RecepcionHeader({ recepcion, actions }: RecepcionHeaderProps) {
  return (
    <Card padding="lg" hover={false} className="mb-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
          <PackageCheck className="h-7 w-7" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{recepcion.codigo}</h1>
            <EstadoRecepcionBadge estado={recepcion.estado} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            LP: <span className="font-medium text-[#111827]">{recepcion.loteProductor}</span>
            {" · "}Productor: <span className="font-medium text-[#111827]">{recepcion.productor}</span>
            {" · "}Cultivo: <span className="font-medium text-[#111827]">{recepcion.cultivo}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Fecha: <span className="font-medium text-[#111827]">{formatFecha(recepcion.fecha)}</span>
            {" · "}Planta: <span className="font-medium text-[#111827]">{recepcion.planta}</span>
            {" · "}Responsable: <span className="font-medium text-[#111827]">{recepcion.responsable}</span>
          </p>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
