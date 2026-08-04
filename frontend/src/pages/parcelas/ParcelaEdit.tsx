import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ParcelaForm from "../../components/parcelas/ParcelaForm";
import { mockParcela } from "./parcelaMock";

export default function ParcelaEdit() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Parcelas", to: "/parcelas" },
          { label: mockParcela.codigo, to: `/parcelas/${mockParcela.id}` },
          { label: "Editar Parcela" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/parcelas/${mockParcela.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Parcela"
          description={`Actualizando la información de ${mockParcela.nombre} (${mockParcela.codigo})`}
        />
      </div>

      <ParcelaForm mode="edit" values={mockParcela} />
    </div>
  );
}
