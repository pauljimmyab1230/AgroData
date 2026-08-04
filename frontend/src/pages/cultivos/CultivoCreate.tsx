import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoForm from "../../components/cultivos/CultivoForm";

export default function CultivoCreate() {
  return (
    <div>
      <CultivoHeader
        title="Nuevo Cultivo"
        description="Registra un nuevo cultivo mediante las tarjetas del formulario"
        crumbs={[{ label: "Cultivos", to: "/cultivos" }, { label: "Nuevo Cultivo" }]}
        backTo="/cultivos"
      />

      <CultivoForm mode="create" />
    </div>
  );
}
