import { FolderOpen } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ParcelaDocuments } from "./ParcelaDocuments";
import type { ParcelaDocumento } from "../../services/parcelas";

type DocumentoCardProps = {
  mode: FormMode;
  documentos?: ParcelaDocumento[];
  onDelete?: (documentoId: string) => void;
};

export function DocumentoCard({ mode, documentos, onDelete }: DocumentoCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<FolderOpen size={20} />}
        title="Documentos"
        description="Documentación de la parcela para el proceso de certificación orgánica"
      />
      <ParcelaDocuments mode={mode} documentos={documentos} onDelete={onDelete} />
    </CardShell>
  );
}
