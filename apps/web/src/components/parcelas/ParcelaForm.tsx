import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Save } from "lucide-react";
import { Button } from "../ui";
import ParcelaTabs from "./ParcelaTabs";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionAgroecologicaCard } from "./InformacionAgroecologicaCard";
import { UbicacionCard } from "./UbicacionCard";
import { PoligonoCard } from "./PoligonoCard";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import { createParcela, updateParcela } from "../../services/parcelas";
import { toast } from "../../utils/toast";
import type { FormMode } from "../shared/formControls";

const totalTabs = 3;

interface ParcelaFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  parcelaId?: string;
  inModal?: boolean;
  onSave?: () => void;
}

export default function ParcelaForm({ mode, parcelaId, inModal, onSave }: ParcelaFormProps) {
  const { id: urlId } = useParams();
  const id = parcelaId || urlId;
  const { data, validate } = useParcelaForm();
  const [tab, setTab] = useState(1);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!validate()) {
      setTab(1);
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await createParcela(data);
        if (!inModal) {
          navigate("/parcelas");
        } else {
          onSave?.();
        }
      } else {
        if (!id) throw new Error("ID de parcela no encontrado");
        await updateParcela(id, data);
        if (!inModal) {
          navigate(`/parcelas/${id}`);
        } else {
          onSave?.();
        }
      }
    } catch (err: unknown) {
      console.error("Error al guardar parcela:", err);

      let message = "Error al guardar. Verifique los datos.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string; errors?: string[] } } };
        const status = axiosErr.response?.status;
        const respData = axiosErr.response?.data;

        if (status === 400 && respData?.errors?.length) {
          message = `Error de validación:\n• ${respData.errors.join("\n• ")}`;
        } else if (status === 400 && respData?.message) {
          message = respData.message;
        } else if (status === 404) {
          message = "La parcela no fue encontrada.";
        } else if (status === 409) {
          message = respData?.message || "Conflicto: el código ya está en uso.";
        } else if (status && status >= 500) {
          message = "Error del servidor. Intente nuevamente.";
        } else if (respData?.message) {
          message = respData.message;
        }
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <ParcelaTabs active={tab} onChange={setTab} />

      <div className="space-y-6">
        {tab === 1 && (
          <>
            <DatosGeneralesCard mode={mode} />
            <InformacionAgroecologicaCard mode={mode} />
          </>
        )}
        {tab === 2 && <UbicacionCard mode={mode} />}
        {tab === 3 && <PoligonoCard mode={mode} />}
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
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : "Guardar Parcela"}
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
