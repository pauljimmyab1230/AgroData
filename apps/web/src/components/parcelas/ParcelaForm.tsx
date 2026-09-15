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
import { useCreateParcela, useUpdateParcela } from "../../hooks/queries";
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
  const navigate = useNavigate();
  const createMutation = useCreateParcela();
  const updateMutation = useUpdateParcela();
  const saving = createMutation.isPending || updateMutation.isPending;

  const handleSave = async () => {
    const validation = validate();
    if (!validation.valid) {
      const errorFields = Object.keys(validation.errors);
      const errorMessages = errorFields.map(f => validation.errors[f as keyof typeof validation.errors]);
      toast.error(`Complete los campos obligatorios:\n• ${errorMessages.join("\n• ")}`);
      const hasUbicacionError = errorFields.some(f => ['departamento', 'provincia', 'distrito'].includes(f));
      if (hasUbicacionError && tab !== 2) {
        setTab(2);
      } else if (!hasUbicacionError && tab === 1) {
        setTab(1);
      }
      return;
    }
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Parcela registrada exitosamente");
        if (!inModal) {
          navigate("/parcelas");
        } else {
          onSave?.();
        }
      } else {
        if (!id) throw new Error("ID de parcela no encontrado");
        await updateMutation.mutateAsync({ id, data });
        toast.success("Parcela actualizada exitosamente");
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
        const axiosErr = err as { response?: { status?: number; data?: { title?: string; detail?: string; message?: string; errors?: Array<{ field: string; message: string }> | string[] } } };
        const status = axiosErr.response?.status;
        const respData = axiosErr.response?.data;

        if ((status === 400 || status === 422) && respData?.errors?.length) {
          const fieldErrors = respData.errors;
          if (typeof fieldErrors[0] === "object" && "message" in fieldErrors[0]) {
            message = `Error de validación:\n• ${(fieldErrors as Array<{ field: string; message: string }>).map(e => `${e.field}: ${e.message}`).join("\n• ")}`;
          } else {
            message = `Error de validación:\n• ${(fieldErrors as string[]).join("\n• ")}`;
          }
        } else if (status === 400 || status === 422) {
          message = respData?.detail || respData?.message || "Error de validación. Verifique los campos obligatorios.";
        } else if (status === 404) {
          message = "La parcela no fue encontrada.";
        } else if (status === 409) {
          message = respData?.message || "Conflicto: el código ya está en uso.";
        } else if (status && status >= 500) {
          message = respData?.detail || respData?.title || "Error del servidor. Intente nuevamente.";
        } else if (respData?.message) {
          message = respData.message;
        }
      }

      toast.error(message);
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

        <div className="flex items-center gap-2">
          {tab === totalTabs ? (
            <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
              {saving ? "Guardando..." : "Guardar Cambios"}
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
    </div>
  );
}
