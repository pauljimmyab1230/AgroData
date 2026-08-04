import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Save } from "lucide-react";
import { Button } from "../ui";
import ParcelaTabs from "./ParcelaTabs";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionAgroecologicaCard } from "./InformacionAgroecologicaCard";
import { UbicacionCard } from "./UbicacionCard";
import { PoligonoCard } from "./PoligonoCard";
import { FotografiaCard } from "./FotografiaCard";
import { DocumentoCard } from "./DocumentoCard";
import type { Parcela } from "../../pages/parcelas/parcelaMock";
import type { FormMode } from "../shared/formControls";

const totalTabs = 5;

interface ParcelaFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Partial<Parcela>;
}

export default function ParcelaForm({ mode, values }: ParcelaFormProps) {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  const handleSave = () => {
    navigate(mode === "create" ? "/parcelas" : `/parcelas/${values?.id ?? 1}`);
  };

  return (
    <div>
      <ParcelaTabs active={tab} onChange={setTab} />

      <div className="space-y-6">
        {tab === 1 && (
          <>
            <DatosGeneralesCard mode={mode} values={values} />
            <InformacionAgroecologicaCard mode={mode} values={values} />
          </>
        )}
        {tab === 2 && <UbicacionCard mode={mode} values={values} />}
        {tab === 3 && <PoligonoCard mode={mode} values={values} />}
        {tab === 4 && <FotografiaCard mode={mode} />}
        {tab === 5 && <DocumentoCard mode={mode} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={() => setTab((current) => Math.max(1, current - 1))}
          disabled={tab === 1}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>

        <p className="text-sm text-gray-500">
          Pestaña <span className="font-semibold text-forest-700">{tab}</span> de{" "}
          <span className="font-semibold text-[#111827]">{totalTabs}</span>
        </p>

        {tab === totalTabs ? (
          <Button onClick={handleSave} iconLeft={<Save className="h-4 w-4" />}>
            Guardar Parcela
          </Button>
        ) : (
          <Button
            onClick={() => setTab((current) => Math.min(totalTabs, current + 1))}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
