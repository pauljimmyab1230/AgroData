import { useEffect } from "react";
import { X, Wheat } from "lucide-react";
import CultivoCreate from "../../pages/cultivos/CultivoCreate";
import CultivoEdit from "../../pages/cultivos/CultivoEdit";
import CultivoView from "../../pages/cultivos/CultivoView";

interface CultivoModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode: "create" | "edit" | "view";
  cultivoId?: string;
}

export default function CultivoModal({ open, onClose, onSave, mode, cultivoId }: CultivoModalProps) {
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
      <div className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A4174]/10 text-[#0A4174]">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Nuevo Cultivo" : mode === "edit" ? "Editar Cultivo" : "Detalle de Cultivo"}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === "create"
                  ? "Registra un nuevo cultivo"
                  : mode === "edit"
                    ? "Modifica la información del cultivo"
                    : "Información completa del cultivo"}
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mode === "view" ? (
            <CultivoView inModal cultivoId={cultivoId} />
          ) : mode === "create" ? (
            <CultivoCreate inModal onSave={onSave} />
          ) : (
            <CultivoEdit inModal cultivoId={cultivoId} onSave={onSave} />
          )}
        </div>
      </div>
    </div>
  );
}
