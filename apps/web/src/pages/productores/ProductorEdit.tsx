import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Save } from "lucide-react";
import {
  Button,
  LoadingSpinner,
  SectionHeader,
} from "../../components/ui";
import { ProductorStepper } from "../../components/productores/ProductorStepper";
import { DatosPersonalesCard } from "../../components/productores/DatosPersonalesCard";
import { ContactoUbicacionCard } from "../../components/productores/ContactoUbicacionCard";
import { SocioculturalCard } from "../../components/productores/SocioculturalCard";
import { OrganizacionCard } from "../../components/productores/OrganizacionCard";
import { FamiliarTable } from "../../components/productores/FamiliarTable";
import { DocumentoUploader } from "../../components/productores/DocumentoUploader";
import { useProductor, useUpdateProductor } from "../../hooks/queries";
import { ProductorFormProvider, useProductorForm } from "../../contexts/ProductorFormContext";
import { getApiErrorMessage, toProductorId } from "../../services/productores";
import { toast } from "../../utils/toast";
import { useProductorStepper } from "../../hooks/useProductorStepper";

interface ProductorEditProps {
  id: string | number;
  inModal?: boolean;
  onSave?: () => void;
}

function ProductorEditForm({ id, inModal, onSave }: ProductorEditProps) {
  const { data, validateStep } = useProductorForm();
  const navigate = useNavigate();
  const { pasoActual, pasoMaximoAlcanzado, totalPasos, isFirstStep, isLastStep, handleNext, handleBack, handlePasoChange } = useProductorStepper();
  const updateMutation = useUpdateProductor();
  const productorId = toProductorId(Number(id));

  const handleSave = async () => {
    if (!validateStep(1)) {
      handlePasoChange(1);
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: productorId, data });
      if (!inModal) {
        navigate(`/productores/${id}`);
      } else {
        onSave?.();
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      {!inModal && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              as="link"
              to={`/productores/${id}`}
              iconLeft={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
            <SectionHeader
              title="Editar Productor"
              description="Actualizando la información del productor"
            />
          </div>
        </>
      )}

      <div className="mb-6">
        <ProductorStepper pasoActual={pasoActual} pasoMaximoAlcanzado={pasoMaximoAlcanzado} onPasoChange={handlePasoChange} />
      </div>

      <div className="space-y-6">
        {pasoActual === 1 && (
          <>
            <DatosPersonalesCard mode="edit" />
            <ContactoUbicacionCard mode="edit" />
            <SocioculturalCard mode="edit" />
            <OrganizacionCard mode="edit" />
          </>
        )}

        {pasoActual === 2 && <FamiliarTable mode="edit" productorId={productorId} />}

        {pasoActual === 3 && <DocumentoUploader mode="edit" productorId={productorId} />}
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
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        ) : (
          <Button
            onClick={() => handleNext(() => validateStep(pasoActual))}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}

interface ProductorEditDefaultProps {
  inModal?: boolean;
  id?: string | number;
  onSave?: () => void;
}

export default function ProductorEdit({ inModal, id: propId, onSave }: ProductorEditDefaultProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const numId = Number(id);
  const productorId = !isNaN(numId) && numId > 0 ? toProductorId(numId) : null;
  const { data: productor, isLoading, error } = useProductor(productorId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !productor || !id) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el productor.</p>
      </div>
    );
  }

  return (
    <ProductorFormProvider initial={productor}>
      <ProductorEditForm id={id} inModal={inModal} onSave={onSave} />
    </ProductorFormProvider>
  );
}
