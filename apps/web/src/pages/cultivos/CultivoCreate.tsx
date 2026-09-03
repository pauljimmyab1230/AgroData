import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoForm from "../../components/cultivos/CultivoForm";

interface CultivoCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function CultivoCreate({ inModal, onSave }: CultivoCreateProps) {
  return (
    <div>
      {!inModal && (
        <CultivoHeader
          title="Nuevo Cultivo"
          description="Registra un nuevo cultivo mediante las tarjetas del formulario"
          crumbs={[{ label: "Cultivos", to: "/cultivos" }, { label: "Nuevo Cultivo" }]}
          backTo="/cultivos"
        />
      )}

      <CultivoForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
