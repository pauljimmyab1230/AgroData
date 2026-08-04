import { useState } from "react";
import { Plus, Trash2, Wrench } from "lucide-react";
import { Button, EmptyState, FormField, Input, Modal, Select, Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { EstadoAccionCorrectivaBadge } from "./badges";
import {
  estadosAccionCorrectivaOpciones,
  formatFecha,
  responsablesOpciones,
  type AccionCorrectiva,
  type EstadoAccionCorrectiva,
  type Inspeccion,
} from "../../pages/inspecciones/inspeccionMock";

type AccionesCorrectivasCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

type DraftAC = {
  accion: string;
  responsable: string;
  fechaInicio: string;
  fechaLimite: string;
  estado: EstadoAccionCorrectiva;
  observaciones: string;
};

const emptyDraft: DraftAC = {
  accion: "",
  responsable: "",
  fechaInicio: "",
  fechaLimite: "",
  estado: "Pendiente",
  observaciones: "",
};

export function AccionesCorrectivasCard({ mode, values }: AccionesCorrectivasCardProps) {
  const editable = mode !== "view";
  const [acciones, setAcciones] = useState<AccionCorrectiva[]>(values?.accionesCorrectivas ?? []);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<DraftAC>(emptyDraft);

  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

  const openModal = () => {
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const handleAdd = () => {
    const next: AccionCorrectiva = {
      id: acciones.length ? Math.max(...acciones.map((ac) => ac.id)) + 1 : 1,
      accion: draft.accion,
      responsable: draft.responsable,
      fechaInicio: draft.fechaInicio,
      fechaLimite: draft.fechaLimite,
      estado: draft.estado,
      observaciones: draft.observaciones,
    };
    setAcciones((prev) => [...prev, next]);
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAcciones((prev) => prev.filter((ac) => ac.id !== id));
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Wrench size={20} />}
        title="Acciones Correctivas"
        description="Plan de acciones correctivas para el seguimiento técnico de la inspección"
        actions={
          editable && (
            <Button size="sm" onClick={openModal} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Acción Correctiva
            </Button>
          )
        }
      />

      {acciones.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin acciones correctivas"
          description="No se registraron acciones correctivas para esta inspección."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Acción Correctiva
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Responsable
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fecha de Inicio
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fecha Límite
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Observaciones
                  </th>
                  {editable && (
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                      Acción
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {acciones.map((ac) => (
                  <tr key={ac.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-medium text-[#111827]">{ac.accion}</td>
                    <td className="px-5 py-4 text-gray-600">{ac.responsable}</td>
                    <td className="px-5 py-4 text-gray-600">{formatFecha(ac.fechaInicio)}</td>
                    <td className="px-5 py-4 text-gray-600">{formatFecha(ac.fechaLimite)}</td>
                    <td className="px-5 py-4">
                      <EstadoAccionCorrectivaBadge estado={ac.estado} />
                    </td>
                    <td className="px-5 py-4 text-gray-600">{ac.observaciones || "—"}</td>
                    {editable && (
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          aria-label="Eliminar acción correctiva"
                          onClick={() => handleDelete(ac.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Acción Correctiva" maxWidth="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Acción Correctiva" required className="sm:col-span-2">
            <Textarea
              rows={2}
              placeholder="Describe la acción correctiva a implementar..."
              value={draft.accion}
              onChange={(e) => setDraft((prev) => ({ ...prev, accion: e.target.value }))}
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
          <FormField label="Estado" required>
            <Select
              options={toOptions(estadosAccionCorrectivaOpciones)}
              placeholder="Seleccione"
              value={draft.estado}
              onChange={(value) => setDraft((prev) => ({ ...prev, estado: value as EstadoAccionCorrectiva }))}
            />
          </FormField>
          <FormField label="Fecha de Inicio" required>
            <Input
              type="date"
              value={draft.fechaInicio}
              onChange={(e) => setDraft((prev) => ({ ...prev, fechaInicio: e.target.value }))}
            />
          </FormField>
          <FormField label="Fecha Límite" required>
            <Input
              type="date"
              value={draft.fechaLimite}
              onChange={(e) => setDraft((prev) => ({ ...prev, fechaLimite: e.target.value }))}
            />
          </FormField>
          <FormField label="Observaciones" className="sm:col-span-2">
            <Textarea
              rows={2}
              placeholder="Observaciones sobre el avance de la acción..."
              value={draft.observaciones}
              onChange={(e) => setDraft((prev) => ({ ...prev, observaciones: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} iconLeft={<Plus className="h-4 w-4" />}>
            Agregar Acción Correctiva
          </Button>
        </div>
      </Modal>
    </CardShell>
  );
}
