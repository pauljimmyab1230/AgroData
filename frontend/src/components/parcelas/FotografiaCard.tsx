import { Camera } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ParcelaPhotos } from "./ParcelaPhotos";
import type { ParcelaFoto } from "../../services/parcelas";

type FotografiaCardProps = {
  mode: FormMode;
  fotos?: ParcelaFoto[];
  onDelete?: (fotoId: string) => void;
};

export function FotografiaCard({ mode, fotos, onDelete }: FotografiaCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Fotografías"
        description="Registro fotográfico de la parcela"
      />
      <ParcelaPhotos mode={mode} fotos={fotos} onDelete={onDelete} />
    </CardShell>
  );
}
