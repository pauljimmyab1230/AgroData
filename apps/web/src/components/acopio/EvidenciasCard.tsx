import { useRef, useState } from "react";
import { Camera, Image as ImageIcon, PenLine, Plus, UserRound, X } from "lucide-react";
import { Button, EmptyState, ImageUpload } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { AcopioView } from "../../services/acopios";

type EvidenciasCardProps = {
  mode: FormMode;
  values?: Partial<AcopioView>;
};

function MockFirma({ nombre }: { nombre: string }) {
  return (
    <div className="text-center">
      <svg viewBox="0 0 180 60" className="mx-auto h-14 w-36 text-forest-700">
        <path
          d="M10 45 C 25 20, 40 55, 55 30 S 80 45, 95 28 S 120 42, 135 25 S 160 40, 172 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-1 text-xs font-medium text-[#111827]">{nombre}</p>
    </div>
  );
}

function FirmaTile({
  mode,
  titulo,
  firmada,
  onToggle,
}: {
  mode: FormMode;
  titulo: string;
  firmada: boolean;
  onToggle: () => void;
}) {
  const editable = mode !== "view";

  if (!editable) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
            <PenLine size={16} />
          </span>
          <h4 className="text-sm font-semibold text-[#111827]">{titulo}</h4>
        </div>
        {firmada ? (
          <MockFirma nombre="Firma registrada" />
        ) : (
          <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white">
            <p className="text-xs text-gray-400">Sin firma registrada</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          <PenLine size={16} />
        </span>
        <h4 className="text-sm font-semibold text-[#111827]">{titulo}</h4>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-forest-600/40 bg-white px-6 py-4 text-center transition-all hover:border-forest-600 hover:bg-forest-600/5"
      >
        {firmada ? (
          <>
            <MockFirma nombre="Firma capturada" />
            <span className="text-xs font-medium text-forest-700">Haz clic para limpiar</span>
          </>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <PenLine className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-[#111827]">Haz clic para firmar</span>
            <span className="text-xs text-gray-500">Simulación de firma electrónica</span>
          </>
        )}
      </button>
    </div>
  );
}

type FotoItem = { id: number; nombre: string; descripcion: string; preview?: string };

export function EvidenciasCard({ mode, values }: EvidenciasCardProps) {
  const editable = mode !== "view";
  const [fotos, setFotos] = useState<FotoItem[]>(values?.fotos ?? []);
  const [firmaProductor, setFirmaProductor] = useState(values?.firmaProductor ?? false);
  const [firmaAcopiador, setFirmaAcopiador] = useState(values?.firmaAcopiador ?? false);
  const fotoCounterRef = useRef((values?.fotos?.length ?? 0) + 1);

  const addFoto = () => {
    const n = fotoCounterRef.current++;
    setFotos((prev) => [
      ...prev,
      { id: n, nombre: `Fotografía ${n} - Acopio`, descripcion: "Fotografía registrada durante el acopio" },
    ]);
  };

  const handleFotoChange = (id: number, _file: File | null, preview: string) => {
    setFotos((prev) => (prev.map((foto) => (foto.id === id ? { ...foto, preview: preview || undefined } : foto))));
  };

  const removeFoto = (id: number) => setFotos((prev) => prev.filter((foto) => foto.id !== id));

  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Evidencias"
        description="Fotografías del acopio y firmas del productor y acopiador"
        actions={
          editable ? (
            <Button variant="secondary" size="sm" onClick={addFoto} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Fotografía
            </Button>
          ) : undefined
        }
      />

      {fotos.length === 0 ? (
        <EmptyState
          icon={<Camera className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin fotografías"
          description="No se registraron evidencias fotográficas en este acopio."
        />
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                  <Camera size={16} />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-[#111827]">{foto.nombre}</h4>
                  <p className="truncate text-xs text-gray-500">{foto.descripcion}</p>
                </div>
              </div>

              <ImageUpload
                readOnly={!editable}
                value={foto.preview}
                onChange={(file, preview) => handleFotoChange(foto.id, file, preview)}
                accept="image/png,image/jpeg,image/webp"
                placeholder={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                    <ImageIcon size={22} />
                  </div>
                }
              />

              {editable && (
                <button
                  type="button"
                  aria-label={`Eliminar ${foto.nombre}`}
                  onClick={() => removeFoto(foto.id)}
                  className="absolute right-6 top-6 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FirmaTile
          mode={mode}
          titulo="Firma del Productor"
          firmada={firmaProductor}
          onToggle={() => setFirmaProductor((prev) => !prev)}
        />
        <FirmaTile
          mode={mode}
          titulo="Firma del Acopiador"
          firmada={firmaAcopiador}
          onToggle={() => setFirmaAcopiador((prev) => !prev)}
        />
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
        <UserRound className="h-3.5 w-3.5" />
        La captura de evidencias es una simulación; la integración con almacenamiento se realizará en una etapa posterior.
      </p>
    </CardShell>
  );
}
