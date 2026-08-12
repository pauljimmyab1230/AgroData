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
import { ParcelaTable } from "../../components/productores/ParcelaTable";
import { DocumentoUploader } from "../../components/productores/DocumentoUploader";
import { fetchProductor, updateProductor, type Productor } from "../../services/productores";
import { ProductorFormProvider, useProductorForm } from "../../contexts/ProductorFormContext";

const totalPasos = 4;

function ProductorEditForm({ id }: { id: string }) {
  const { data, validateStep } = useProductorForm();
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (!validateStep(pasoActual)) return;
    setPasoActual((paso) => Math.min(totalPasos, paso + 1));
  };

  const handleSave = async () => {
    if (!validateStep(1)) {
      setPasoActual(1);
      return;
    }
    setSaving(true);
    try {
      await updateProductor(id, data);
      navigate(`/productores/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Verifique los datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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

      <div className="mb-6">
        <ProductorStepper pasoActual={pasoActual} onPasoChange={setPasoActual} />
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

        {pasoActual === 2 && <FamiliarTable mode="edit" productorId={id} />}

        {pasoActual === 3 && <ParcelaTable mode="edit" productorId={id} />}

        {pasoActual === 4 && <DocumentoUploader mode="edit" />}
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

export default function ProductorEdit() {
  const { id } = useParams();
  const [productor, setProductor] = useState<Productor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProductor(id)
      .then(setProductor)
      .catch(console.error)
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
      <ProductorEditForm id={id!} />
    </ProductorFormProvider>
  );
}
