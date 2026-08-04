import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import AcopioForm from "../../components/acopio/AcopioForm";
import { acopiosMock } from "./acopioMock";

export default function AcopioEdit() {
  const { id } = useParams();
  const acopio = acopiosMock.find((a) => a.id === Number(id)) ?? acopiosMock[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Acopio", to: "/acopio" },
          { label: acopio.codigo, to: `/acopio/${acopio.id}` },
          { label: "Editar Acopio" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/acopio/${acopio.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Acopio"
          description={`Actualizando la información del acopio ${acopio.codigo}`}
        />
      </div>

      <AcopioForm mode="edit" values={acopio} />
    </div>
  );
}
