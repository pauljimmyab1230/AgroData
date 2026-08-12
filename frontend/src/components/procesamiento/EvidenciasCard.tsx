import { useRef, useState } from "react";
import { Camera, FileText, FileCheck, Image as ImageIcon, X } from "lucide-react";
import { Button, EmptyState, ImageUpload } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { EvidenciaProcesamiento, OrdenProcesamiento } from "../../pages/procesamiento/procesamientoMock";

type EvidenciasCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const tipoIcon: Record<string, typeof Camera> = {
  fotografia: Camera,
  documento: FileText,
  reporte: FileCheck,
};

const tipoLabel: Record<string, string> = {
  fotografia: "Fotografía",
  documento: "Documento del Proceso",
  reporte: "Reporte Técnico",
};

export function EvidenciasCard({ mode, values }: EvidenciasCardProps) {
  const editable = mode !== "view";
  const [evidencias, setEvidencias] = useState<EvidenciaProcesamiento[]>(values?.evidencias ?? []);
  const counterRef = useRef((values?.evidencias?.length ?? 0) + 1);

  const addEvidencia = (tipo: EvidenciaProcesamiento["tipo"]) => {
    const n = counterRef.current++;
    setEvidencias((prev) => [
      ...prev,
      {
        id: n,
        nombre: `${tipoLabel[tipo]} ${n}`,
        descripcion: `${tipoLabel[tipo]} registrada durante el procesamiento`,
        tipo,
      },
    ]);
  };

  const handleFotoChange = (id: number, _file: File | null, preview: string) => {
    setEvidencias((prev) =>
      prev.map((e) => (e.id === id ? { ...e, preview: preview || undefined } : e))
    );
  };

  const removeEvidencia = (id: number) => setEvidencias((prev) => prev.filter((e) => e.id !== id));

  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Evidencias"
        description="Fotografías, documento del proceso y reporte técnico"
        actions={
          editable ? (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => addEvidencia("fotografia")} iconLeft={<Camera className="h-4 w-4" />}>
                Foto
              </Button>
              <Button variant="secondary" size="sm" onClick={() => addEvidencia("documento")} iconLeft={<FileText className="h-4 w-4" />}>
                Documento
              </Button>
              <Button variant="secondary" size="sm" onClick={() => addEvidencia("reporte")} iconLeft={<FileCheck className="h-4 w-4" />}>
                Reporte
              </Button>
            </div>
          ) : undefined
        }
      />

      {evidencias.length === 0 ? (
        <EmptyState
          icon={<Camera className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin evidencias"
          description="No se registraron evidencias en este procesamiento."
        />
      ) : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {evidencias.map((ev) => {
            const Icon = tipoIcon[ev.tipo] ?? Camera;
            return (
              <div key={ev.id} className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-[#111827]">{ev.nombre}</h4>
                    <p className="truncate text-xs text-gray-500">{ev.descripcion}</p>
                  </div>
                </div>

                {ev.tipo === "fotografia" ? (
                  <ImageUpload
                    readOnly={!editable}
                    value={ev.preview}
                    onChange={(file, preview) => handleFotoChange(ev.id, file, preview)}
                    accept="image/png,image/jpeg,image/webp"
                    placeholder={
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                        <ImageIcon size={22} />
                      </div>
                    }
                  />
                ) : (
                  <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-forest-200 bg-forest-50/50 text-center">
                    <Icon className="mb-1.5 h-6 w-6 text-forest-600" />
                    <p className="text-xs font-medium text-forest-700">{tipoLabel[ev.tipo]} registrado</p>
                  </div>
                )}

                {editable && (
                  <button
                    type="button"
                    aria-label={`Eliminar ${ev.nombre}`}
                    onClick={() => removeEvidencia(ev.id)}
                    className="absolute right-6 top-6 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
        <Camera className="h-3.5 w-3.5" />
        La carga de evidencias es una simulación; la integración con almacenamiento se realizará en una etapa posterior.
      </p>
    </CardShell>
  );
}
