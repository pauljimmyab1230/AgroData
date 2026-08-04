import type { LucideIcon } from "lucide-react";
import {
  Map,
  DraftingCompass,
  FileBadge,
  FileSignature,
  FolderOpen,
  FileText,
  Eye,
  Download,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Badge, Button } from "../ui";
import { parcelaDocumentosMock } from "../../pages/parcelas/parcelaMock";
import type { FormMode } from "../shared/formControls";

type DocType = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

const tiposDocumento: DocType[] = [
  { id: "Croquis", label: "Croquis", icon: Map, description: "Croquis de ubicación de la parcela" },
  { id: "Plano", label: "Plano", icon: DraftingCompass, description: "Plano georreferenciado de la parcela" },
  { id: "Título", label: "Título", icon: FileBadge, description: "Título de propiedad de la parcela" },
  { id: "Contrato", label: "Contrato", icon: FileSignature, description: "Contrato de compromiso y uso" },
  { id: "Otros", label: "Otros Documentos", icon: FolderOpen, description: "Documentación adicional de la parcela" },
];

interface ParcelaDocumentsProps {
  mode: FormMode;
}

export function ParcelaDocuments({ mode }: ParcelaDocumentsProps) {
  const readOnly = mode === "view";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tiposDocumento.map((tipo) => {
        const documento = parcelaDocumentosMock.find((doc) => doc.tipo === tipo.id);
        const Icon = tipo.icon;

        return (
          <div key={tipo.id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-forest-700 shadow-sm ring-1 ring-gray-200">
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-[#111827]">{tipo.label}</h4>
                <p className="truncate text-xs text-gray-500">{tipo.description}</p>
              </div>
            </div>

            {documento ? (
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#111827]">{documento.nombre}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {documento.tamano} · {documento.fecha}
                    </p>
                  </div>
                  <Badge
                    variant={documento.estado === "Verificado" ? "green" : "yellow"}
                    className="shrink-0"
                  >
                    {documento.estado}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" iconLeft={<Eye className="h-3.5 w-3.5" />}>
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" iconLeft={<Download className="h-3.5 w-3.5" />}>
                    Descargar
                  </Button>
                  {!readOnly && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center ${
                  readOnly ? "border-gray-200 bg-white" : "border-gray-300 bg-white"
                }`}
              >
                <UploadCloud size={22} className="text-gray-300" />
                {readOnly ? (
                  <p className="text-xs text-gray-400">Sin documento adjunto</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-400">{tipo.description}</p>
                    <button
                      type="button"
                      className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-forest-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-forest-600/25 transition-all hover:bg-forest-700 active:scale-[0.98]"
                    >
                      <UploadCloud size={14} />
                      Subir documento
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
