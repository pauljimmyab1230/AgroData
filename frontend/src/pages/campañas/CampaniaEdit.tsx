import { Breadcrumb } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaForm } from "../../components/campanias/CampaniaForm";
import { mockCampania } from "./campaniaMock";

export default function CampaniaEdit() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Campañas", to: "/campanias" },
          { label: mockCampania.codigo, to: `/campanias/${mockCampania.id}` },
          { label: "Editar Campaña" },
        ]}
      />

      <CampaniaHeader
        title="Editar Campaña"
        description={`Actualizando la información de ${mockCampania.nombre} (${mockCampania.codigo})`}
        backTo={`/campanias/${mockCampania.id}`}
      />

      <CampaniaForm mode="edit" values={mockCampania} />
    </div>
  );
}
