import { useRef, useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Fingerprint,
  FileText,
  UploadCloud,
  Eye,
  Download,
  Trash2,
  Camera,
  PenLine,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge, Button, Modal, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { useDocumentos, useCreateDocumento, useDeleteDocumento, useUpdateDocumentoEstado } from "../../hooks/queries";
import { uploadArchivo, type Documento, type ProductorId, type EstadoDocumento, getApiErrorMessage } from "../../services/productores";
import { toast } from "../../utils/toast";

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
    id: "PERSONAL",
    titulo: "Documentos del Productor",
    descripcion: "DNI, firma y fotografía del productor",
    icon: User,
    tipos: [
      { id: "DNI", label: "DNI", icon: Fingerprint },
      { id: "Firma", label: "Firma", icon: PenLine },
      { id: "Fotografía", label: "Fotografía", icon: Camera },
    ],
  },
];

type DocumentoUploaderProps = {
  mode: FormMode;
  productorId?: ProductorId | null;
};

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const mimeTypesPermitidos = ["image/jpeg", "image/png", "application/pdf", "image/webp"];

const isUrlSegura = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const estadoOptions = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "VERIFICADO", label: "Verificado" },
  { value: "RECHAZADO", label: "Rechazado" },
];

const estadoIcon = (estado: EstadoDocumento) => {
  switch (estado) {
    case "VERIFICADO":
      return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
    case "RECHAZADO":
      return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    default:
      return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
  }
};

export function DocumentoUploader({ mode, productorId }: DocumentoUploaderProps) {
  const readOnly = mode === "view";
  const validProductorId = productorId && productorId > 0 ? productorId : null;
  const { data: documentos = [] } = useDocumentos(
    validProductorId && mode !== "create" ? validProductorId : null
  );
  const createDocumentoMutation = useCreateDocumento(validProductorId ?? 0 as ProductorId);
  const deleteDocumentoMutation = useDeleteDocumento(validProductorId ?? 0 as ProductorId);
  const updateEstadoMutation = useUpdateDocumentoEstado(validProductorId ?? 0 as ProductorId);
  const [verDoc, setVerDoc] = useState<Documento | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<{ categoria: string; tipo: string } | null>(null);

  const handleUploadClick = useCallback((categoria: string, tipo: string) => {
    uploadTargetRef.current = { categoria, tipo };
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTargetRef.current;
    if (file && target && productorId) {
      if (!mimeTypesPermitidos.includes(file.type)) {
        toast.error("Tipo de archivo no permitido. Use JPEG, PNG, PDF o WebP.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      try {
        const tipo = target.tipo.toLowerCase();
        const folder = tipo === 'firma' ? 'firmas' : tipo === 'fotografía' || tipo === 'fotografia' ? 'fotos' : 'documentos';
        const uploaded = await uploadArchivo(folder, file);
        await createDocumentoMutation.mutateAsync({
          tipo: target.tipo,
          categoria: target.categoria,
          nombre_archivo: uploaded.nombre_archivo,
          ruta_archivo: uploaded.ruta_archivo,
          tamano_bytes: uploaded.tamano_bytes,
          mime_type: uploaded.mime_type,
        });
        toast.success("Documento subido correctamente");
      } catch (error) {
        console.error("Error al subir documento:", error);
        toast.error(getApiErrorMessage(error, "Error al subir el documento"));
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }, [productorId, createDocumentoMutation]);

  const handleDelete = useCallback(async (doc: Documento) => {
    if (!validProductorId) return;
    try {
      await deleteDocumentoMutation.mutateAsync(doc.id);
      toast.success("Documento eliminado");
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast.error(getApiErrorMessage(error, "Error al eliminar el documento"));
    }
  }, [validProductorId, deleteDocumentoMutation]);

  const handleDownload = useCallback((doc: Documento) => {
    if (doc.rutaArchivo && isUrlSegura(doc.rutaArchivo)) {
      const link = document.createElement("a");
      link.href = doc.rutaArchivo;
      link.download = doc.nombreArchivo;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleEstadoChange = useCallback(async (doc: Documento, nuevoEstado: string) => {
    if (!validProductorId) return;
    if (nuevoEstado !== "PENDIENTE" && nuevoEstado !== "VERIFICADO" && nuevoEstado !== "RECHAZADO") return;
    try {
      await updateEstadoMutation.mutateAsync({ documentoId: doc.id, estado: nuevoEstado });
      toast.success(`Documento ${nuevoEstado.toLowerCase()}`);
    } catch {
      toast.error("Error al cambiar el estado del documento");
    }
  }, [validProductorId, updateEstadoMutation]);

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
                          <p className="truncate text-sm font-medium text-[#111827]">{doc.nombreArchivo}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {formatSize(doc.tamanoBytes)} · {new Date(doc.createdAt).toLocaleDateString("es-PE")}
                          </p>
                        </div>
                        <Badge
                          variant={doc.estado === "VERIFICADO" ? "green" : doc.estado === "RECHAZADO" ? "red" : "yellow"}
                          className="shrink-0"
                        >
                          {doc.estado}
                        </Badge>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center gap-2">
                          {estadoIcon(doc.estado)}
                          <Select
                            options={estadoOptions}
                            value={doc.estado}
                            onChange={(val) => handleEstadoChange(doc, val)}
                            placeholder="Estado"
                          />
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          iconLeft={<Eye className="h-3.5 w-3.5" />}
                          onClick={() => setVerDoc(doc)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          iconLeft={<Download className="h-3.5 w-3.5" />}
                          onClick={() => handleDownload(doc)}
                        >
                          Descargar
                        </Button>
                        {!readOnly && (
                          <button
                            type="button"
                            aria-label={`Eliminar ${doc.nombreArchivo}`}
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
                <p className="truncate font-semibold text-[#111827]">{verDoc.nombreArchivo}</p>
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
                <dd className="mt-0.5 font-medium text-[#111827]">{new Date(verDoc.createdAt).toLocaleDateString("es-PE")}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Tamaño</dt>
                <dd className="mt-0.5 font-medium text-[#111827]">{formatSize(verDoc.tamanoBytes)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Estado</dt>
                <dd className="mt-0.5">
                  <Badge variant={verDoc.estado === "VERIFICADO" ? "green" : verDoc.estado === "RECHAZADO" ? "red" : "yellow"}>
                    {verDoc.estado}
                  </Badge>
                </dd>
              </div>
            </dl>
            {verDoc.rutaArchivo && (
              <Button
                variant="secondary"
                iconLeft={<Download className="h-4 w-4" />}
                onClick={() => handleDownload(verDoc)}
              >
                Descargar archivo
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
