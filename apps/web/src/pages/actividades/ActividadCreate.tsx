import { Breadcrumb } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadForm } from "../../components/actividades/ActividadForm";

export default function ActividadCreate() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Actividades Agrícolas", to: "/actividades" }, { label: "Nueva Actividad" }]} />

      <ActividadHeader
        title="Nueva Actividad"
        description="Registra una nueva actividad agrícola completando las secciones."
        backTo="/actividades"
      />

      <ActividadForm mode="create" />
    </div>
  );
}
