import type { ReactNode } from "react";
import { Warehouse } from "lucide-react";
import { Card } from "../ui";
import { EstadoAcopioBadge } from "./badges";
import { formatFecha, type AcopioView } from "../../services/acopios";

interface AcopioHeaderProps {
  acopio: AcopioView;
  actions?: ReactNode;
}

export default function AcopioHeader({ acopio, actions }: AcopioHeaderProps) {
  return (
    <Card padding="lg" hover={false} className="mb-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
          <Warehouse className="h-7 w-7" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{acopio.codigo}</h1>
            <EstadoAcopioBadge estado={acopio.estado} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fecha: <span className="font-medium text-[#111827]">{formatFecha(acopio.fecha)}</span>
            {" · "}Productor: <span className="font-medium text-[#111827]">{acopio.productor}</span>
            {" · "}Comunidad: <span className="font-medium text-[#111827]">{acopio.comunidad}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Acopiador: <span className="font-medium text-[#111827]">{acopio.acopiador}</span>
            {" · "}Ruta: <span className="font-medium text-[#111827]">{acopio.ruta}</span>
            {" · "}Campaña: <span className="font-medium text-[#111827]">{acopio.campania}</span>
          </p>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
