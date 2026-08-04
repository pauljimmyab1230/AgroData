import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Fingerprint,
  BadgeCheck,
  FileText,
  UploadCloud,
  Eye,
  Download,
  Trash2,
  Camera,
  PenLine,
  ScrollText,
  Paperclip,
  FolderOpen,
  User,
} from "lucide-react";
import { Badge, Button, Modal } from "../ui";
import { documentosMock, type Documento } from "../../pages/productores/productorMock";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";

type DocTipo = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type Categoria = {
  id: Documento["categoria"];
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  tipos: DocTipo[];
};

const categorias: Categoria[] = [
  {
    id: "Personal",
    titulo: "Documentos Personales",
    descripcion: "Identidad, fotografía y firma del productor",
    icon: User,
    tipos: [
      { id: "DNI", label: "DNI", icon: Fingerprint },
      { id: "Fotografía", label: "Fotografía", icon: Camera },
      { id: "Firma", label: "Firma", icon: PenLine },
    ],
  },
  {
    id: "Institucional",
    titulo: "Documentos Institucionales",
    descripcion: "Solicitudes, contratos y actas de la cooperativa",
    icon: ScrollText,
    tipos: [
      { id: "Solicitud de ingreso", label: "Solicitud de ingreso", icon: FileText },
      { id: "Contrato", label: "Contrato", icon: FileText },
      { id: "Acta", label: "Acta", icon: ScrollText },
    ],
  },
  {
    id: "Otros",
    titulo: "Otros Documentos",
    descripcion: "Certificados y anexos complementarios",
    icon: FolderOpen,
    tipos: [
      { id: "Certificados", label: "Certificados", icon: BadgeCheck },
      { id: "Anexos", label: "Anexos", icon: Paperclip },
    ],
  },
];

type DocumentoUploaderProps = {
  mode: FormMode;
};

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function DocumentoUploader({ mode }: DocumentoUploaderProps) {
  const readOnly = mode === "view";
  const [documentos, setDocumentos] = useState<Documento[]>(mode === "create" ? [] : documentosMock);
  const [verDoc, setVerDoc] = useState<Documento | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<{ categoria: Documento["categoria"]; tipo: string } | null>(null);

  const handleUploadClick = (categoria: Documento["categoria"], tipo: string) => {
    uploadTargetRef.current = { categoria, tipo };
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTargetRef.current;
    if (file && target) {
      setDocumentos((prev) => [
        ...prev.filter((d) => !(d.categoria === target.categoria && d.tipo === target.tipo)),
        {
          id: Date.now(),
          tipo: target.tipo,
          categoria: target.categoria,
          nombre: file.name,
          tamano: formatSize(file.size),
          fecha: new Date().toISOString().slice(0, 10),
          estado: "Pendiente",
        },
      ]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = (doc: Documento) => {
    setDocumentos((prev) => prev.filter((d) => !(d.categoria === doc.categoria && d.tipo === doc.tipo)));
  };

  return (
    <div className="space-y-6">
      {categorias.map((categoria) => (
        <CardShell key={categoria.id}>
          <CardHeader
            icon={<categoria.icon size={20} />}
            title={categoria.titulo}
            description={categoria.descripcion}
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoria.tipos.map((tipo) => {
              const doc = documentos.find((d) => d.categoria === categoria.id && d.tipo === tipo.id);
              const Icon = tipo.icon;

              return (
                <div
                  key={tipo.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                      <Icon size={15} />
                    </span>
                    <h4 className="text-sm font-semibold text-[#111827]">{tipo.label}</h4>
                  </div>

                  {doc ? (
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#111827]">{doc.nombre}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {doc.tamano} · {doc.fecha}
                          </p>
                        </div>
                        <Badge
                          variant={doc.estado === "Verificado" ? "green" : "yellow"}
                          className="shrink-0"
                        >
                          {doc.estado}
                        </Badge>
                      </div>
                      <div className="mt-auto flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          iconLeft={<Eye className="h-3.5 w-3.5" />}
                          onClick={() => setVerDoc(doc)}
                        >
                          Ver
                        </Button>
                        <Button variant="secondary" size="sm" iconLeft={<Download className="h-3.5 w-3.5" />}>
                          Descargar
                        </Button>
                        {!readOnly && (
                          <button
                            type="button"
                            aria-label={`Eliminar ${doc.nombre}`}
                            onClick={() => handleDelete(doc)}
                            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-xl px-4 py-6 text-center ${
                        readOnly ? "border border-gray-200 bg-gray-50/50" : "border-2 border-dashed border-gray-300 bg-white"
                      }`}
                    >
                      <UploadCloud size={22} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Documento no registrado</p>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleUploadClick(categoria.id, tipo.id)}
                          className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-forest-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-forest-600/25 transition-all hover:bg-forest-700 active:scale-[0.98]"
                        >
                          <UploadCloud size={14} />
                          Subir archivo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardShell>
      ))}

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      <Modal open={verDoc !== null} onClose={() => setVerDoc(null)} title="Detalle del documento">
        {verDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                <FileText size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#111827]">{verDoc.nombre}</p>
                <p className="text-xs text-gray-500">{verDoc.tipo}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50/50 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-gray-500">Categoría</dt>
                <dd className="mt-0.5 font-medium text-[#111827]">{verDoc.categoria}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Fecha</dt>
                <dd className="mt-0.5 font-medium text-[#111827]">{verDoc.fecha}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Tamaño</dt>
                <dd className="mt-0.5 font-medium text-[#111827]">{verDoc.tamano}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Estado</dt>
                <dd className="mt-0.5">
                  <Badge variant={verDoc.estado === "Verificado" ? "green" : "yellow"}>
                    {verDoc.estado}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
