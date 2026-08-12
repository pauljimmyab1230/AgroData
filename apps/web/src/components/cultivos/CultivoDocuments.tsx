import type { LucideIcon } from "lucide-react";
import { FileText, Eye, Download, Trash2, UploadCloud, ClipboardList, FlaskConical, FolderOpen } from "lucide-react";
import { Badge, Button } from "../ui";
import {
  type CultivoDocumento,
} from "../../services/cultivos";
import type { FormMode } from "../shared/formControls";

type Categoria = "Técnicos" | "Análisis" | "Otros";

const cultivoDocumentosMock: CultivoDocumento[] = [
  { id: 1, tipo: "Acta", nombre: "acta_siembra_cultivo_001.pdf", tamano: "680 KB", fecha: "2025-10-15", estado: "Adjunto", categoria: "Técnicos" },
  { id: 2, tipo: "Informe Técnico", nombre: "informe_tecnico_quinua.pdf", tamano: "1.2 MB", fecha: "2025-12-20", estado: "Adjunto", categoria: "Técnicos" },
  { id: 3, tipo: "Certificado de Semilla", nombre: "certificado_semilla_negra_collana.pdf", tamano: "940 KB", fecha: "2025-09-30", estado: "Adjunto", categoria: "Técnicos" },
  { id: 4, tipo: "Análisis de suelo", nombre: "analisis_suelo_parcela_a.pdf", tamano: "820 KB", fecha: "2025-08-22", estado: "Adjunto", categoria: "Análisis" },
  { id: 5, tipo: "Análisis foliar", nombre: "analisis_foliar_quinua.pdf", tamano: "760 KB", fecha: "2026-01-05", estado: "Pendiente", categoria: "Análisis" },
];

const categorias: { id: Categoria; label: string; icon: LucideIcon; description: string }[] = [
  {
    id: "Técnicos",
    label: "Documentos Técnicos",
    icon: ClipboardList,
    description: "Actas, informes técnicos y certificados de semilla",
  },
  {
    id: "Análisis",
    label: "Análisis de Laboratorio",
    icon: FlaskConical,
    description: "Análisis de suelo, foliar y de calidad",
  },
  {
    id: "Otros",
    label: "Otros Documentos",
    icon: FolderOpen,
    description: "Documentación adicional del cultivo",
  },
];

interface CultivoDocumentsProps {
  mode: FormMode;
}

export function CultivoDocuments({ mode }: CultivoDocumentsProps) {
  const readOnly = mode === "view";

  return (
    <div className="space-y-6">
      {categorias.map((categoria) => {
        const documentos = cultivoDocumentosMock.filter((doc) => doc.categoria === categoria.id);
        const Icon = categoria.icon;

        return (
          <div key={categoria.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                <Icon size={15} />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-[#111827]">{categoria.label}</h4>
                <p className="text-xs text-gray-500">{categoria.description}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {documentos.length > 0 ? (
                documentos.map((documento) => (
                  <DocumentoCard key={documento.id} documento={documento} readOnly={readOnly} />
                ))
              ) : (
                <div
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center sm:col-span-2 xl:col-span-3 ${
                    readOnly ? "border-gray-200 bg-white" : "border-gray-300 bg-white"
                  }`}
                >
                  <UploadCloud size={22} className="text-gray-300" />
                  {readOnly ? (
                    <p className="text-xs text-gray-400">Sin documentos en esta categoría</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-400">{categoria.description}</p>
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
          </div>
        );
      })}
    </div>
  );
}

function DocumentoCard({ documento, readOnly }: { documento: CultivoDocumento; readOnly: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          <FileText size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium text-[#111827]">{documento.nombre}</p>
            <Badge variant={documento.estado === "Adjunto" ? "green" : "yellow"} className="shrink-0">
              {documento.estado}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {documento.tipo} · {documento.tamano} · {documento.fecha}
          </p>
        </div>
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
  );
}
