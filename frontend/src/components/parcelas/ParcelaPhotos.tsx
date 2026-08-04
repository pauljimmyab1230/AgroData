import { CalendarDays, Camera, Image as ImageIcon, User, StickyNote } from "lucide-react";
import { ImageUpload, Input, Textarea } from "../ui";
import { Field, type FormMode } from "../shared/formControls";
import { parcelaFotosMock } from "../../pages/parcelas/parcelaMock";

const categoriaLabels: Record<string, string> = {
  general: "General",
  norte: "Norte",
  sur: "Sur",
  este: "Este",
  oeste: "Oeste",
};

interface ParcelaPhotosProps {
  mode: FormMode;
}

export function ParcelaPhotos({ mode }: ParcelaPhotosProps) {
  const readOnly = mode === "view";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {parcelaFotosMock.map((foto) => (
        <div key={foto.id} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
              <Camera size={16} />
            </span>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-[#111827]">{foto.titulo}</h4>
              <p className="truncate text-xs text-gray-500">{foto.descripcion}</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-forest-700 ring-1 ring-gray-200">
              {categoriaLabels[foto.id] ?? foto.id}
            </span>
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
              <Field label="Fecha" mode={mode} value={foto.fecha}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <Input type="date" defaultValue={!readOnly ? foto.fecha : undefined} className="pl-10" />
                </div>
              </Field>

              <Field label="Autor" mode={mode} value={foto.autor}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Ej. Técnico de campo"
                    defaultValue={!readOnly ? foto.autor : undefined}
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>

            <Field label="Observaciones" mode={mode} value={foto.observaciones}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-3 text-gray-400">
                  <StickyNote className="h-4 w-4" />
                </span>
                <Textarea
                  rows={2}
                  placeholder="Ej. Vista panorámica del área total cultivada."
                  defaultValue={!readOnly ? foto.observaciones : undefined}
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
