import { useState } from "react";
import { Camera, Image as ImageIcon, User, StickyNote, Trash2 } from "lucide-react";
import { DatePicker, ImageUpload, Input, Textarea } from "../ui";
import { Field, type FormMode } from "../shared/formControls";
import type { ParcelaFoto } from "../../services/parcelas";

const parseDate = (s?: string) => (s ? new Date(String(s).slice(0, 10) + "T00:00:00") : null);

interface ParcelaPhotosProps {
  mode: FormMode;
  fotos?: ParcelaFoto[];
  onDelete?: (fotoId: string) => void;
}

export function ParcelaPhotos({ mode, fotos = [], onDelete }: ParcelaPhotosProps) {
  const readOnly = mode === "view";

  if (fotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-center">
        <ImageIcon size={28} className="text-gray-300" />
        <p className="text-sm text-gray-400">Sin fotografías registradas</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {fotos.map((foto) => (
        <div key={foto.id} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
              <Camera size={16} />
            </span>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-[#111827]">{foto.titulo}</h4>
              <p className="truncate text-xs text-gray-500">{foto.descripcion}</p>
            </div>
            {!readOnly && onDelete && (
              <button
                type="button"
                aria-label={`Eliminar ${foto.titulo}`}
                onClick={() => onDelete(foto.id)}
                className="ml-auto shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <ImageUpload
            readOnly={readOnly}
            accept="image/png,image/jpeg,image/webp"
            placeholder={
              readOnly ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-300">
                  <ImageIcon size={22} />
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                    <ImageIcon size={22} />
                  </div>
                  <p className="text-sm font-medium text-[#111827]">Arrastra o haz clic para subir</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (máx. 5MB)</p>
                </>
              )
            }
          />

          <div className="mt-3 grid gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Fecha" mode={mode} value={foto.fecha || "—"}>
                {readOnly ? (
                  <p className="text-sm font-medium text-[#111827]">{foto.fecha || "—"}</p>
                ) : (
                  <FotoFechaInput fecha={foto.fecha} />
                )}
              </Field>

              <Field label="Autor" mode={mode} value={foto.autor || "—"}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Ej. Técnico de campo"
                    defaultValue={!readOnly ? foto.autor || "" : undefined}
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>

            <Field label="Observaciones" mode={mode} value={foto.observaciones || "—"}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-3 text-gray-400">
                  <StickyNote className="h-4 w-4" />
                </span>
                <Textarea
                  rows={2}
                  placeholder="Ej. Vista panorámica del área total cultivada."
                  defaultValue={!readOnly ? foto.observaciones || "" : undefined}
                  className="pl-10"
                />
              </div>
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function FotoFechaInput({ fecha }: { fecha?: string }) {
  const [dateValue, setDateValue] = useState<Date | null>(parseDate(fecha));
  return <DatePicker selected={dateValue} onChange={(d) => setDateValue(d)} />;
}
