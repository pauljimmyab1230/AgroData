import { Breadcrumb } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadForm } from "../../components/actividades/ActividadForm";

interface ActividadCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function ActividadCreate({ inModal, onSave }: ActividadCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Actividades Agrícolas", to: "/actividades" }, { label: "Nueva Actividad" }]} />
          <ActividadHeader
            title="Nueva Actividad"
            description="Registra una nueva actividad agrícola completando las secciones."
            backTo="/actividades"
          />
        </>
      )}

      <ActividadForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
