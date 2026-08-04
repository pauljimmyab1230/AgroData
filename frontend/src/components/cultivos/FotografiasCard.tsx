import { Camera } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { CultivoPhotos } from "./CultivoPhotos";

type FotografiasCardProps = {
  mode: FormMode;
};

export function FotografiasCard({ mode }: FotografiasCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Fotografías"
        description="Registro fotográfico por etapas del cultivo"
      />
      <CultivoPhotos mode={mode} />
    </CardShell>
  );
}
