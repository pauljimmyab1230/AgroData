import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Save } from "lucide-react";
import {
  Button,
  SectionHeader,
} from "../../components/ui";
import { ProductorStepper } from "../../components/productores/ProductorStepper";
import { DatosPersonalesCard } from "../../components/productores/DatosPersonalesCard";
import { ContactoUbicacionCard } from "../../components/productores/ContactoUbicacionCard";
import { SocioculturalCard } from "../../components/productores/SocioculturalCard";
import { OrganizacionCard } from "../../components/productores/OrganizacionCard";
import { FamiliarTable } from "../../components/productores/FamiliarTable";
import { DocumentoUploader } from "../../components/productores/DocumentoUploader";
import { ProductorFormProvider, useProductorForm } from "../../contexts/ProductorFormContext";
import { createProductor, updateProductor, createFamiliar, deleteFamiliar, getApiErrorMessage } from "../../services/productores";
import type { ProductorId, FamiliarId } from "../../services/productores";
import { toast } from "../../utils/toast";
import { useProductorStepper } from "../../hooks/useProductorStepper";

interface ProductorCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

function ProductorCreateForm({ inModal, onSave }: ProductorCreateProps) {
  const { data, familiares, validateStep } = useProductorForm();
  const navigate = useNavigate();
  const { pasoActual, pasoMaximoAlcanzado, totalPasos, isFirstStep, isLastStep, handleNext, handleBack, handlePasoChange } = useProductorStepper();
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<ProductorId | null>(null);
  const [savedFamiliarIds, setSavedFamiliarIds] = useState<Map<number, FamiliarId>>(new Map());

  const syncFamiliares = async (productorId: ProductorId) => {
    const existingIds = new Set(savedFamiliarIds.values());
    const currentTempIds = new Set(familiares.map(f => f.id).filter(id => id < 0));

    for (const tempId of currentTempIds) {
      if (!savedFamiliarIds.has(tempId)) {
        const familiar = familiares.find(f => f.id === tempId);
        if (familiar) {
          const created = await createFamiliar(productorId, familiar);
          setSavedFamiliarIds(prev => new Map(prev).set(tempId, created.id));
        }
      }
    }

    for (const [tempId, realId] of savedFamiliarIds) {
      if (!currentTempIds.has(tempId)) {
        await deleteFamiliar(productorId, realId);
        setSavedFamiliarIds(prev => {
          const next = new Map(prev);
          next.delete(tempId);
          return next;
        });
      }
    }
  };

  const handleNextStep = async () => {
    if (pasoActual === 1) {
      if (!validateStep(1)) return;
      if (createdId) {
        setSaving(true);
        try {
          await updateProductor(createdId, data);
          await syncFamiliares(createdId);
          handleNext();
        } catch (err: unknown) {
          toast.error(getApiErrorMessage(err));
        } finally {
          setSaving(false);
        }
      } else {
        handleNext();
      }
    } else if (pasoActual === 2 && !createdId) {
      setSaving(true);
      try {
        const result = await createProductor(data);
        setCreatedId(result.id);
        await syncFamiliares(result.id);
        handleNext();
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setSaving(false);
      }
    } else {
      handleNext();
    }
  };

  const handleSave = async () => {
    if (!createdId) return;
    if (!inModal) {
      navigate(`/productores/${createdId}`);
    } else {
      onSave?.();
    }
  };

  const handlePasoChangeWithValidation = (paso: number) => {
    if (paso > pasoActual && pasoActual === 1 && !validateStep(1)) return;
    handlePasoChange(paso);
  };

  return (
    <div>
      {!inModal && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/productores" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <SectionHeader
              title="Nuevo Productor"
              description="Registra un nuevo socio productor mediante el asistente de tres pasos"
            />
          </div>
        </>
      )}

      <div className="mb-6">
        <ProductorStepper pasoActual={pasoActual} pasoMaximoAlcanzado={pasoMaximoAlcanzado} onPasoChange={handlePasoChangeWithValidation} />
      </div>

      <div className="space-y-6">
        {pasoActual === 1 && (
          <>
            <DatosPersonalesCard mode="create" />
            <ContactoUbicacionCard mode="create" />
            <SocioculturalCard mode="create" />
            <OrganizacionCard mode="create" />
          </>
        )}

        {pasoActual === 2 && <FamiliarTable mode="create" />}

        {pasoActual === 3 && <DocumentoUploader mode="create" productorId={createdId} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={isFirstStep}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>

        <p className="text-sm text-gray-500">
          Paso <span className="font-semibold text-forest-700">{pasoActual}</span> de{" "}
          <span className="font-semibold text-[#111827]">{totalPasos}</span>
        </p>

        {isLastStep ? (
          <Button onClick={handleSave} disabled={saving || !createdId} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : "Guardar Productor"}
          </Button>
        ) : (
          <Button
            onClick={() => handleNextStep()}
            disabled={saving}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            {saving ? "Guardando..." : "Siguiente"}
          </Button>
        )}
      </div>


    </div>
  );
}

const defaultInitialValues = {
  estado: "ACTIVO" as const,
  idiomaSecundario: "NINGUNO" as const,
};

export default function ProductorCreate({ inModal, onSave }: ProductorCreateProps) {
  return (
    <ProductorFormProvider initial={defaultInitialValues}>
      <ProductorCreateForm inModal={inModal} onSave={onSave} />
    </ProductorFormProvider>
  );
}
