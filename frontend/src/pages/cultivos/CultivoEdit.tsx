import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoForm from "../../components/cultivos/CultivoForm";
import { mockCultivo } from "./cultivoMock";

export default function CultivoEdit() {
  return (
    <div>
      <CultivoHeader
        title="Editar Cultivo"
        description={`Actualizando la información del cultivo ${mockCultivo.codigo} (${mockCultivo.cultivo} - ${mockCultivo.variedad})`}
        crumbs={[
          { label: "Cultivos", to: "/cultivos" },
          { label: mockCultivo.codigo, to: `/cultivos/${mockCultivo.id}` },
          { label: "Editar Cultivo" },
        ]}
        backTo={`/cultivos/${mockCultivo.id}`}
      />

      <CultivoForm mode="edit" values={mockCultivo} />
    </div>
  );
}
