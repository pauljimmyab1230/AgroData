import { useEffect, useCallback } from "react";
import { X, Factory } from "lucide-react";
import ProcesamientoCreate from "../../pages/procesamiento/ProcesamientoCreate";
import ProcesamientoEdit from "../../pages/procesamiento/ProcesamientoEdit";
import ProcesamientoView from "../../pages/procesamiento/ProcesamientoView";

interface ProcesamientoModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode: "create" | "edit" | "view";
  procesamientoId?: string;
}

export default function ProcesamientoModal({ open, onClose, onSave, mode, procesamientoId }: ProcesamientoModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  const titleId = "procesamiento-modal-title";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
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
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Nuevo Procesamiento" : mode === "edit" ? "Editar Procesamiento" : "Detalle de Procesamiento"}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === "create"
                  ? "Registra una nueva orden de procesamiento"
                  : mode === "edit"
                    ? "Modifica la información del procesamiento"
                    : "Información completa del procesamiento"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mode === "view" ? (
            <ProcesamientoView inModal procesamientoId={procesamientoId} />
          ) : mode === "create" ? (
            <ProcesamientoCreate inModal onSave={onSave} />
          ) : (
            <ProcesamientoEdit inModal procesamientoId={procesamientoId} onSave={onSave} />
          )}
        </div>
      </div>
    </div>
  );
}
