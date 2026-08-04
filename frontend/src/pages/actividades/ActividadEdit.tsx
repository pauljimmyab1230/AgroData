import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadForm } from "../../components/actividades/ActividadForm";
import { actividadesMock } from "./actividadMock";

export default function ActividadEdit() {
  const { id } = useParams();
  const actividad = actividadesMock.find((a) => a.id === Number(id)) ?? actividadesMock[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Actividades Agrícolas", to: "/actividades" },
          { label: actividad.codigo, to: `/actividades/${actividad.id}` },
          { label: "Editar Actividad" },
        ]}
      />

      <ActividadHeader
        title="Editar Actividad"
        description={`Actualizando la información de ${actividad.codigo} (${actividad.tipoActividad})`}
        backTo={`/actividades/${actividad.id}`}
      />

      <ActividadForm mode="edit" values={actividad} />
    </div>
  );
}
