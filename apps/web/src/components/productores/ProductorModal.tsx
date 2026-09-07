import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import ProductorCreate from "../../pages/productores/ProductorCreate";
import ProductorEdit from "../../pages/productores/ProductorEdit";

interface ProductorModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode: "create" | "edit";
  productorId?: string;
}

export default function ProductorModal({ open, onClose, onSave, mode, productorId }: ProductorModalProps) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Nuevo Productor" : "Editar Productor"}
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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "create" ? "Nuevo Productor" : "Editar Productor"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "create"
                ? "Registra un nuevo socio productor"
                : "Modifica la información del productor"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {open && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {mode === "create" ? (
              <ProductorCreate inModal onSave={onSave} />
            ) : (
              productorId && <ProductorEdit inModal id={productorId} onSave={onSave} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
