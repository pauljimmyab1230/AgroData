import { useEffect } from "react";
import { X, ClipboardList } from "lucide-react";
import ActividadCreate from "../../pages/actividades/ActividadCreate";
import ActividadEdit from "../../pages/actividades/ActividadEdit";
import ActividadView from "../../pages/actividades/ActividadView";

interface ActividadModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode: "create" | "edit" | "view";
  actividadId?: string;
}

export default function ActividadModal({ open, onClose, onSave, mode, actividadId }: ActividadModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A4174]/10 text-[#0A4174]">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Nueva Actividad" : mode === "edit" ? "Editar Actividad" : "Detalle de Actividad"}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === "create"
                  ? "Registra una nueva actividad agrícola"
                  : mode === "edit"
                    ? "Modifica la información de la actividad"
                    : "Información completa de la actividad"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 overflow-auto px-6 py-4">
          <div className="min-w-0 max-w-full">
            {mode === "view" ? (
              <ActividadView inModal actividadId={actividadId} />
            ) : mode === "create" ? (
              <ActividadCreate inModal onSave={onSave} />
            ) : (
              <ActividadEdit inModal actividadId={actividadId} onSave={onSave} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
