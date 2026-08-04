import { useRef, type ChangeEvent } from "react";
import { Camera, Image as ImageIcon, RefreshCw, Trash2, Upload } from "lucide-react";
import { DatePicker, FormField, Input, Select } from "../ui";
import type { FormMode } from "../shared/formControls";
import { responsablesFotoOpciones, type ActividadFoto } from "../../pages/actividades/actividadMock";

type ActividadPhotosProps = {
  fotos: ActividadFoto[];
  mode: FormMode;
  onChange?: (fotos: ActividadFoto[]) => void;
};

const responsableOptions = responsablesFotoOpciones.map((responsable) => ({
  value: responsable,
  label: responsable,
}));

function leerImagen(file: File, callback: (preview: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => callback(String(e.target?.result ?? ""));
  reader.readAsDataURL(file);
}

export function ActividadPhotos({ fotos, mode, onChange }: ActividadPhotosProps) {
  const editable = mode !== "view";
  const inputRef = useRef<HTMLInputElement>(null);
  const fotoActivaRef = useRef<string | null>(null);

  const updateFoto = (fotoId: string, patch: Partial<ActividadFoto>) => {
    onChange?.(fotos.map((f) => (f.id === fotoId ? { ...f, ...patch } : f)));
  };

  const handleSeleccion = (fotoId: string) => {
    fotoActivaRef.current = fotoId;
    inputRef.current?.click();
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fotoId = fotoActivaRef.current;
    e.target.value = "";
    if (!file || !fotoId) return;

    leerImagen(file, (preview) => updateFoto(fotoId, { preview }));
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fotos.map((foto) => (
          <div key={foto.id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                <Camera size={16} />
              </span>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-[#111827]">{foto.titulo}</h4>
                <p className="truncate text-xs text-gray-500">Evidencia de campo</p>
              </div>
            </div>

            {editable ? (
              <div className="mb-4 space-y-3">
                <FormField label="Fecha">
                  <DatePicker
                    selected={foto.fecha ? new Date(foto.fecha + "T00:00:00") : null}
                    onChange={(date) => updateFoto(foto.id, { fecha: date?.toISOString().split("T")[0] ?? "" })}
                  />
                </FormField>
                <FormField label="Responsable">
                  <Select
                    options={responsableOptions}
                    placeholder="Seleccione"
                    value={foto.responsable ?? ""}
                    onChange={(v) => updateFoto(foto.id, { responsable: v })}
                  />
                </FormField>
                <FormField label="Descripción">
                  <Input
                    type="text"
                    placeholder="Descripción de la fotografía..."
                    value={foto.descripcion}
                    onChange={(e) => updateFoto(foto.id, { descripcion: e.target.value })}
                  />
                </FormField>
              </div>
            ) : (
              <div className="mb-4 space-y-1.5 text-xs">
                <p className="text-gray-500">
                  Fecha:{" "}
                  <span className="font-medium text-[#111827]">{foto.fecha ? foto.fecha.split("-").reverse().join("/") : "—"}</span>
                </p>
                <p className="text-gray-500">
                  Responsable:{" "}
                  <span className="font-medium text-[#111827]">{foto.responsable || "—"}</span>
                </p>
                <p className="text-gray-500">
                  Descripción: <span className="font-medium text-[#111827]">{foto.descripcion}</span>
                </p>
              </div>
            )}

            {foto.preview ? (
              <div className="group relative overflow-hidden rounded-xl border border-gray-200">
                <img src={foto.preview} alt={foto.titulo} className="h-40 w-full object-cover" />
                {editable && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0F172A]/0 opacity-0 transition-all duration-200 group-hover:bg-[#0F172A]/50 group-hover:opacity-100">
                    <button
                      type="button"
                      aria-label={`Cambiar imagen de ${foto.titulo}`}
                      onClick={() => handleSeleccion(foto.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111827] shadow-md transition-transform hover:scale-110"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Eliminar imagen de ${foto.titulo}`}
                      onClick={() => updateFoto(foto.id, { preview: undefined })}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition-transform hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : editable ? (
              <button
                type="button"
                onClick={() => handleSeleccion(foto.id)}
                className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-forest-600/50 hover:bg-forest-600/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                  <Upload className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-[#111827]">Subir imagen</span>
                <span className="text-xs text-gray-500">Vista previa al seleccionar</span>
              </button>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-300">
                  <ImageIcon size={22} />
                </span>
                <span className="text-xs text-gray-400">Sin fotografía</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
