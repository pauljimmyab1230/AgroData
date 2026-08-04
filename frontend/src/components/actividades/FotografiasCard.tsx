import { Camera } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ActividadPhotos } from "./ActividadPhotos";
import type { ActividadFormData } from "../../pages/actividades/actividadMock";

type FotografiasCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

export function FotografiasCard({ mode, value, onChange }: FotografiasCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Evidencias"
        description="Fotografías de la actividad con fecha, responsable, descripción y gestión de imagen"
      />
      <ActividadPhotos
        fotos={value.fotos}
        mode={mode}
        onChange={(fotos) => onChange?.({ fotos })}
      />
    </CardShell>
  );
}
