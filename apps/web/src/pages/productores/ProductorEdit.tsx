import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Save } from "lucide-react";
import {
  Breadcrumb,
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
import { fetchProductor, updateProductor, type Productor } from "../../services/productores";
import { ProductorFormProvider, useProductorForm } from "../../contexts/ProductorFormContext";
import { toast } from "../../utils/toast";

const totalPasos = 3;

interface ProductorEditProps {
  id: string;
  inModal?: boolean;
  onSave?: () => void;
}

function ProductorEditForm({ id, inModal, onSave }: ProductorEditProps) {
  const { data, validateStep } = useProductorForm();
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
  const [pasoMaximoAlcanzado, setPasoMaximoAlcanzado] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    setPasoActual((paso) => {
      const siguiente = Math.min(totalPasos, paso + 1);
      setPasoMaximoAlcanzado((max) => Math.max(max, siguiente));
      return siguiente;
    });
  };

  const handlePasoChange = (paso: number) => {
    setPasoActual(paso);
    setPasoMaximoAlcanzado((max) => Math.max(max, paso));
  };

  const handleSave = async () => {
    if (!validateStep(1)) {
      setPasoActual(1);
      return;
    }
    setSaving(true);
    try {
      await updateProductor(Number(id), data);
      if (!inModal) {
        navigate(`/productores/${id}`);
      } else {
        onSave?.();
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar. Verifique los datos.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb
            items={[
              { label: "Productores", to: "/productores" },
              { label: id, to: `/productores/${id}` },
              { label: "Editar Productor" },
            ]}
          />

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

        {pasoActual === 2 && <FamiliarTable mode="edit" productorId={Number(id)} />}

        {pasoActual === 3 && <DocumentoUploader mode="edit" productorId={Number(id)} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={() => setPasoActual((paso) => Math.max(1, paso - 1))}
          disabled={pasoActual === 1}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>

        <p className="text-sm text-gray-500">
          Paso <span className="font-semibold text-forest-700">{pasoActual}</span> de{" "}
          <span className="font-semibold text-[#111827]">{totalPasos}</span>
        </p>

        {pasoActual === totalPasos ? (
          <Button
            onClick={handleSave}
            disabled={saving}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/productores/${id}`)}
          className="text-sm text-gray-500 transition-colors hover:text-forest-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

interface ProductorEditDefaultProps {
  inModal?: boolean;
  id?: string;
  onSave?: () => void;
}

export default function ProductorEdit({ inModal, id: propId, onSave }: ProductorEditDefaultProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const [productor, setProductor] = useState<Productor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProductor(Number(id))
      .then(setProductor)
      .catch(() => toast.error("Error al cargar el productor"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!productor) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el productor.</p>
      </div>
    );
  }

  return (
    <ProductorFormProvider initial={productor}>
      <ProductorEditForm id={id!} inModal={inModal} onSave={onSave} />
    </ProductorFormProvider>
  );
}
