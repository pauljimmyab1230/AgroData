import { MapPin, Wheat, Hash, Boxes, Scale } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatearPeso } from "../../services/recepciones";
import type { Recepcion } from "../../services/recepciones";

type LoteProductorCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
  onChange?: <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => void;
};

export function LoteProductorCard({ mode, values }: LoteProductorCardProps) {
  const items = [
    {
      label: "Código LP",
      value: values?.loteProductor || "—",
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Acopio",
      value: values?.acopioCodigo || "—",
      icon: MapPin,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Cantidad de Sacos",
      value: values?.sacos ? String(values.sacos) : "—",
      icon: Boxes,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Peso registrado en Campo",
      value: values?.pesoCampo ? formatearPeso(values.pesoCampo) : "—",
      icon: Scale,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Wheat size={20} />}
        title="Lote del Productor"
        description="Información del lote de materia prima recibido"
      />

      <div className="rounded-xl border border-forest-100 bg-forest-50/40 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3.5">
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
              </div>
              <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}
