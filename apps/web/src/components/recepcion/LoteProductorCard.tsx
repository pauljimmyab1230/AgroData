import { useEffect, useState } from "react";
import { UserRound, MapPin, Wheat, Hash, Boxes, Scale } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatearPeso } from "../../services/recepciones";
import type { Recepcion } from "../../services/recepciones";
import { fetchAcopios } from "../../services/acopios";

type LoteProductorCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

export function LoteProductorCard({ mode, values }: LoteProductorCardProps) {
  const editable = mode !== "view";
  const [loteSeleccionado, setLoteSeleccionado] = useState<string | undefined>(values?.loteProductor);
  const [lps, setLps] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await fetchAcopios({ limit: 100 });
        if (!cancelled) {
          setLps(
            result.data
              .filter((a) => a.loteProductor)
              .map((a) => ({ value: a.loteProductor, label: `${a.loteProductor} - ${a.codigo}` }))
          );
        }
      } catch {
        setLps([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const items = [
    {
      label: "Código LP",
      value: loteSeleccionado || values?.loteProductor || "—",
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Campaña",
      value: values?.campaniaNombre || "—",
      icon: UserRound,
      iconClass: "bg-forest-600/10 text-forest-600",
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
        icon={<UserRound size={20} />}
        title="Lote del Productor"
        description="Seleccione el LP generado por el Acopio para cargar su información automáticamente"
      />

      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          {editable ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">Lote del Productor (LP)</label>
              <Select
                options={lps}
                placeholder="Seleccione el LP a recepcionar"
                value={loteSeleccionado ?? ""}
                onChange={(val) => setLoteSeleccionado(val || undefined)}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <p className="text-sm font-medium text-gray-500">Lote del Productor (LP)</p>
              <p className="mt-1 text-sm font-medium text-[#111827]">{values?.loteProductor || "—"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-forest-100 bg-forest-50/40 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-forest-700">
          Información del lote seleccionado
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
