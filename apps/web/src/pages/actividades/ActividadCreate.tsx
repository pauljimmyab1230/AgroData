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
