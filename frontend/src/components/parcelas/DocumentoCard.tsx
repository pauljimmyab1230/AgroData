import { FolderOpen } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ParcelaDocuments } from "./ParcelaDocuments";

type DocumentoCardProps = {
  mode: FormMode;
};

export function DocumentoCard({ mode }: DocumentoCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<FolderOpen size={20} />}
        title="Documentos"
        description="Documentación de la parcela para el proceso de certificación orgánica"
      />
      <ParcelaDocuments mode={mode} />
    </CardShell>
  );
}
