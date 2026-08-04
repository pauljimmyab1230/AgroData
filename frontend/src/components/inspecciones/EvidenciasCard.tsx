import { useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { EmptyState, FormField, ImageUpload, Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import {
  formatFecha,
  responsablesOpciones,
  tiposEvidenciaOpciones,
  type Evidencia,
  type Inspeccion,
} from "../../pages/inspecciones/inspeccionMock";

type EvidenciasCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function EvidenciasCard({ mode, values }: EvidenciasCardProps) {
  const editable = mode !== "view";
  const [evidencias, setEvidencias] = useState<Evidencia[]>(values?.evidencias ?? []);

  const handleChange = (id: number, _file: File | null, preview: string) => {
    setEvidencias((prev) => prev.map((ev) => (ev.id === id ? { ...ev, preview: preview || undefined } : ev)));
  };

  const setCampo = (id: number, campo: "nombre" | "descripcion" | "fecha" | "responsable" | "tipo", valor: string) => {
    setEvidencias((prev) => prev.map((ev) => (ev.id === id ? ({ ...ev, [campo]: valor } as Evidencia) : ev)));
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Camera size={20} />}
        title="Evidencias"
        description="Registro fotográfico y documental de la inspección de campo"
      />

      {evidencias.length === 0 ? (
        <EmptyState
          icon={<Camera className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin evidencias"
          description="No se registraron evidencias fotográficas en esta inspección."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {evidencias.map((evidencia) => (
            <div key={evidencia.id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                  <Camera size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  {editable ? (
                    <Input
                      className="py-1.5"
                      value={evidencia.nombre}
                      onChange={(e) => setCampo(evidencia.id, "nombre", e.target.value)}
                    />
                  ) : (
                    <>
                      <h4 className="truncate text-sm font-semibold text-[#111827]">{evidencia.nombre}</h4>
                      <p className="truncate text-xs text-gray-500">{evidencia.tipo}</p>
                    </>
                  )}
                </div>
              </div>

              {editable ? (
                <div className="mb-3 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Fecha">
                      <Input
                        type="date"
                        value={evidencia.fecha}
                        onChange={(e) => setCampo(evidencia.id, "fecha", e.target.value)}
                      />
                    </FormField>
                    <FormField label="Responsable">
                      <Select
                        options={toOptions(responsablesOpciones)}
                        placeholder="Seleccione"
                        value={evidencia.responsable}
                        onChange={(value) => setCampo(evidencia.id, "responsable", value)}
                      />
                    </FormField>
                    <FormField label="Tipo de evidencia" className="sm:col-span-2">
                      <Select
                        options={toOptions(tiposEvidenciaOpciones)}
                        placeholder="Seleccione"
                        value={evidencia.tipo}
                        onChange={(value) => setCampo(evidencia.id, "tipo", value)}
                      />
                    </FormField>
                  </div>
                  <FormField label="Descripción">
                    <Textarea
                      rows={2}
                      value={evidencia.descripcion}
                      onChange={(e) => setCampo(evidencia.id, "descripcion", e.target.value)}
                    />
                  </FormField>
                </div>
              ) : (
                <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Fecha</p>
                    <p className="text-sm text-[#111827]">{formatFecha(evidencia.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Responsable</p>
                    <p className="text-sm text-[#111827]">{evidencia.responsable || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500">Descripción</p>
                    <p className="text-sm text-[#111827]">{evidencia.descripcion || "—"}</p>
                  </div>
                </div>
              )}

              <ImageUpload
                readOnly={!editable}
                value={evidencia.preview}
                onChange={(file, preview) => handleChange(evidencia.id, file, preview)}
                accept="image/png,image/jpeg,image/webp"
                placeholder={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                    <ImageIcon size={22} />
                  </div>
                }
              />
            </div>
          ))}
        </div>
      )}
    </CardShell>
  );
}
