import { Camera } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ParcelaPhotos } from "./ParcelaPhotos";

type FotografiaCardProps = {
  mode: FormMode;
};

export function FotografiaCard({ mode }: FotografiaCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Fotografías"
        description="Registro fotográfico por categorías (general y lados de la parcela)"
      />
      <ParcelaPhotos mode={mode} />
    </CardShell>
  );
}
