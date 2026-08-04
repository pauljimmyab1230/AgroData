import { useState } from "react";
import { FileWarning, Plus, Trash2 } from "lucide-react";
import { Button, DatePicker, EmptyState, FormField, Modal, Select, Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { EstadoNoConformidadBadge, SeveridadBadge } from "./badges";
import {
  categoriasNoConformidadOpciones,
  estadosNoConformidadOpciones,
  responsablesOpciones,
  severidadesOpciones,
  tiposNoConformidadOpciones,
  type EstadoNoConformidad,
  type Inspeccion,
  type NoConformidad,
  type Severidad,
} from "../../pages/inspecciones/inspeccionMock";

type NoConformidadesCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

type DraftNC = {
  tipo: string;
  categoria: string;
  descripcion: string;
  severidad: Severidad;
  responsable: string;
  fechaCompromiso: string;
  estado: EstadoNoConformidad;
  accionCorrectiva: string;
};

const emptyDraft: DraftNC = {
  tipo: "",
  categoria: "",
  descripcion: "",
  severidad: "Leve",
  responsable: "",
  fechaCompromiso: "",
  estado: "Pendiente",
  accionCorrectiva: "",
};

export function NoConformidadesCard({ mode, values }: NoConformidadesCardProps) {
  const editable = mode !== "view";
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>(values?.noConformidades ?? []);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<DraftNC>(emptyDraft);

  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

  const openModal = () => {
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const handleAdd = () => {
    const siguienteCodigo = noConformidades.length
      ? `NC-${String(Math.max(...noConformidades.map((nc) => nc.id)) + 1).padStart(3, "0")}`
      : "NC-001";
    const next: NoConformidad = {
      id: noConformidades.length ? Math.max(...noConformidades.map((nc) => nc.id)) + 1 : 1,
      codigo: siguienteCodigo,
      tipo: draft.tipo || "Otro",
      categoria: draft.categoria || "Otro",
      descripcion: draft.descripcion,
      severidad: draft.severidad,
      responsable: draft.responsable,
      fechaCompromiso: draft.fechaCompromiso,
      estado: draft.estado,
      accionCorrectiva: draft.accionCorrectiva,
    };
    setNoConformidades((prev) => [...prev, next]);
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setNoConformidades((prev) => prev.filter((nc) => nc.id !== id));
  };

  return (
    <CardShell>
      <CardHeader
        icon={<FileWarning size={20} />}
        title="No Conformidades"
        description="Hallazgos que no cumplen con la normativa de certificación orgánica"
        actions={
          editable && (
            <Button size="sm" onClick={openModal} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar No Conformidad
            </Button>
          )
        }
      />

      {noConformidades.length === 0 ? (
        <EmptyState
          icon={<FileWarning className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin no conformidades"
          description="No se registraron hallazgos durante esta inspección."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Código
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Categoría
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Descripción
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Severidad
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Responsable
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fecha Compromiso
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Acción Correctiva
                  </th>
                  {editable && (
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                      Acción
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {noConformidades.map((nc) => (
                  <tr key={nc.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-medium text-forest-700">{nc.codigo}</td>
                    <td className="px-5 py-4 font-medium text-[#111827]">{nc.tipo}</td>
                    <td className="px-5 py-4 text-gray-600">{nc.categoria}</td>
                    <td className="px-5 py-4 text-gray-600">{nc.descripcion}</td>
                    <td className="px-5 py-4">
                      <SeveridadBadge severidad={nc.severidad} />
                    </td>
                    <td className="px-5 py-4 text-gray-600">{nc.responsable}</td>
                    <td className="px-5 py-4 text-gray-600">{nc.fechaCompromiso || "—"}</td>
                    <td className="px-5 py-4">
                      <EstadoNoConformidadBadge estado={nc.estado} />
                    </td>
                    <td className="px-5 py-4 text-gray-600">{nc.accionCorrectiva}</td>
                    {editable && (
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          aria-label="Eliminar no conformidad"
                          onClick={() => handleDelete(nc.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva No Conformidad" maxWidth="xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tipo" required>
            <Select
              options={toOptions(tiposNoConformidadOpciones)}
              placeholder="Seleccione el tipo"
              value={draft.tipo}
              onChange={(value) => setDraft((prev) => ({ ...prev, tipo: value }))}
            />
          </FormField>
          <FormField label="Categoría" required>
            <Select
              options={toOptions(categoriasNoConformidadOpciones)}
              placeholder="Seleccione la categoría"
              value={draft.categoria}
              onChange={(value) => setDraft((prev) => ({ ...prev, categoria: value }))}
            />
          </FormField>
          <FormField label="Severidad" required>
            <Select
              options={toOptions(severidadesOpciones)}
              placeholder="Seleccione"
              value={draft.severidad}
              onChange={(value) => setDraft((prev) => ({ ...prev, severidad: value as Severidad }))}
            />
          </FormField>
          <FormField label="Responsable" required>
            <Select
              options={toOptions(responsablesOpciones)}
              placeholder="Seleccione el responsable"
              value={draft.responsable}
              onChange={(value) => setDraft((prev) => ({ ...prev, responsable: value }))}
            />
          </FormField>
          <FormField label="Fecha Compromiso" required>
            <DatePicker
              selected={draft.fechaCompromiso ? new Date(draft.fechaCompromiso + "T00:00:00") : null}
              onChange={(date) =>
                setDraft((prev) => ({ ...prev, fechaCompromiso: date ? date.toISOString().split("T")[0] : "" }))
              }
            />
          </FormField>
          <FormField label="Estado" required>
            <Select
              options={toOptions(estadosNoConformidadOpciones)}
              placeholder="Seleccione"
              value={draft.estado}
              onChange={(value) => setDraft((prev) => ({ ...prev, estado: value as EstadoNoConformidad }))}
            />
          </FormField>
          <FormField label="Descripción" required className="sm:col-span-2">
            <Textarea
              rows={3}
              placeholder="Describe la no conformidad encontrada..."
              value={draft.descripcion}
              onChange={(e) => setDraft((prev) => ({ ...prev, descripcion: e.target.value }))}
            />
          </FormField>
          <FormField label="Acción Correctiva" className="sm:col-span-2">
            <Textarea
              rows={3}
              placeholder="Acción correctiva propuesta..."
              value={draft.accionCorrectiva}
              onChange={(e) => setDraft((prev) => ({ ...prev, accionCorrectiva: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} iconLeft={<Plus className="h-4 w-4" />}>
            Agregar No Conformidad
          </Button>
        </div>
      </Modal>
    </CardShell>
  );
}
