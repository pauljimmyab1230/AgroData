import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import InspeccionForm from "../../components/inspecciones/InspeccionForm";
import { inspeccionesMock } from "./inspeccionMock";

export default function InspeccionEdit() {
  const { id } = useParams();
  const inspeccion = inspeccionesMock.find((i) => i.id === Number(id)) ?? inspeccionesMock[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Inspecciones", to: "/inspecciones" },
          { label: inspeccion.codigo, to: `/inspecciones/${inspeccion.id}` },
          { label: "Editar Inspección" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/inspecciones/${inspeccion.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Inspección"
          description={`Actualizando la información de la inspección ${inspeccion.codigo}`}
        />
      </div>

      <InspeccionForm mode="edit" values={inspeccion} />
    </div>
  );
}
