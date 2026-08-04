import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";
import { procesamientoMock } from "./procesamientoMock";

export default function ProcesamientoEdit() {
  const { id } = useParams();
  const orden = procesamientoMock.find((o) => o.id === Number(id)) ?? procesamientoMock[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Procesamiento", to: "/procesamiento" },
          { label: orden.codigo, to: `/procesamiento/${orden.id}` },
          { label: "Editar Orden" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/procesamiento/${orden.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Orden de Procesamiento"
          description={`Actualizando la información de la orden ${orden.codigo}`}
        />
      </div>

      <ProcesamientoForm mode="edit" values={orden} />
    </div>
  );
}
