import type { ReactNode } from "react";
import { Factory } from "lucide-react";
import { Card } from "../ui";
import { EstadoProcesamientoBadge } from "./badges";
import { formatFecha, type OrdenProcesamiento } from "../../services/procesamientos";

interface ProcesamientoHeaderProps {
  orden: OrdenProcesamiento;
  actions?: ReactNode;
}

export default function ProcesamientoHeader({ orden, actions }: ProcesamientoHeaderProps) {
  return (
    <Card padding="lg" hover={false} className="mb-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
          <Factory className="h-7 w-7" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{orden.codigo}</h1>
            <EstadoProcesamientoBadge estado={orden.estado} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Producto: <span className="font-medium text-[#111827]">{orden.producto}</span>
            {" · "}Campaña: <span className="font-medium text-[#111827]">{orden.campania}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Fecha: <span className="font-medium text-[#111827]">{formatFecha(orden.fecha)}</span>
            {" · "}Planta: <span className="font-medium text-[#111827]">{orden.planta}</span>
            {" · "}Responsable: <span className="font-medium text-[#111827]">{orden.responsable}</span>
          </p>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
