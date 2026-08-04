import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { mockProductor } from "./productorMock";

const totalPasos = 4;

export default function ProductorEdit() {
  const [pasoActual, setPasoActual] = useState(1);
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Productores", to: "/productores" },
          { label: mockProductor.codigo, to: `/productores/${mockProductor.id}` },
          { label: "Editar Productor" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/productores/${mockProductor.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Productor"
          description={`Actualizando la información de ${mockProductor.nombres} ${mockProductor.apellidoPaterno} ${mockProductor.apellidoMaterno} (${mockProductor.codigo})`}
        />
      </div>

      <div className="mb-6">
        <ProductorStepper pasoActual={pasoActual} onPasoChange={setPasoActual} />
      </div>

      <div className="space-y-6">
        {pasoActual === 1 && (
          <>
            <DatosPersonalesCard mode="edit" values={mockProductor} />
            <ContactoUbicacionCard mode="edit" values={mockProductor} />
            <SocioculturalCard mode="edit" values={mockProductor} />
            <OrganizacionCard mode="edit" values={mockProductor} />
          </>
        )}

        {pasoActual === 2 && <FamiliarTable mode="edit" />}

        {pasoActual === 3 && <ParcelaTable mode="edit" />}

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
            onClick={() => navigate(`/productores/${mockProductor.id}`)}
            iconLeft={<Save className="h-4 w-4" />}
          >
            Guardar Cambios
          </Button>
        ) : (
          <Button
            onClick={() => setPasoActual((paso) => Math.min(totalPasos, paso + 1))}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/productores/${mockProductor.id}`)}
          className="text-sm text-gray-500 transition-colors hover:text-forest-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
