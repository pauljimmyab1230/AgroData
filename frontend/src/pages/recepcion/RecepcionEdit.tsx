import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";
import { recepcionesMock } from "./recepcionMock";

export default function RecepcionEdit() {
  const { id } = useParams();
  const recepcion = recepcionesMock.find((r) => r.id === Number(id)) ?? recepcionesMock[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Recepción", to: "/recepcion" },
          { label: recepcion.codigo, to: `/recepcion/${recepcion.id}` },
          { label: "Editar Recepción" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/recepcion/${recepcion.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Recepción"
          description={`Actualizando la información de la recepción ${recepcion.codigo}`}
        />
      </div>

      <RecepcionForm mode="edit" values={recepcion} />
    </div>
  );
}
