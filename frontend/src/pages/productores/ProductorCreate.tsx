import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Save } from "lucide-react";
import {
  Breadcrumb,
  Button,
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
import { ProductorFormProvider, useProductorForm } from "../../contexts/ProductorFormContext";
import { createProductor, createFamiliar, createParcela } from "../../services/productores";

const totalPasos = 4;

function ProductorCreateForm() {
  const { data, familiares, parcelas, validateStep } = useProductorForm();
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
      const result = await createProductor(data);
      for (const familiar of familiares) {
        await createFamiliar(result.id, familiar);
      }
      for (const parcela of parcelas) {
        await createParcela(result.id, parcela);
      }
      navigate(`/productores/${result.id}`);
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Verifique los datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Productores", to: "/productores" }, { label: "Nuevo Productor" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/productores" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nuevo Productor"
          description="Registra un nuevo socio productor mediante el asistente de cuatro pasos"
        />
      </div>

      <div className="mb-6">
        <ProductorStepper pasoActual={pasoActual} onPasoChange={setPasoActual} />
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

        {pasoActual === 3 && <ParcelaTable mode="create" />}

        {pasoActual === 4 && <DocumentoUploader mode="create" />}
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
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : "Guardar Productor"}
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
        <Link to="/productores" className="text-sm text-gray-500 transition-colors hover:text-forest-700">
          Cancelar
        </Link>
      </div>
    </div>
  );
}

export default function ProductorCreate() {
  return (
    <ProductorFormProvider>
      <ProductorCreateForm />
    </ProductorFormProvider>
  );
}
