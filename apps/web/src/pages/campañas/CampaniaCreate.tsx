import { Breadcrumb } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaForm } from "../../components/campanias/CampaniaForm";

interface CampaniaCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function CampaniaCreate({ inModal, onSave }: CampaniaCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Campañas", to: "/campanias" }, { label: "Nueva Campaña" }]} />
          <CampaniaHeader
            title="Nueva Campaña"
            description="Registra una nueva campaña a través de los siguientes pasos."
            backTo="/campanias"
          />
        </>
      )}

      <CampaniaForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
