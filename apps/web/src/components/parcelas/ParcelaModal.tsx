import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import ParcelaForm from "./ParcelaForm";
import ParcelaView from "../../pages/parcelas/ParcelaView";
import { ParcelaFormProvider } from "../../contexts/ParcelaFormContext";
import { LoadingSpinner } from "../ui";
import { fetchParcela, type Parcela } from "../../services/parcelas";

interface ParcelaModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode: "create" | "edit" | "view";
  parcelaId?: string;
}

export default function ParcelaModal({ open, onClose, onSave, mode, parcelaId }: ParcelaModalProps) {
  const [parcela, setParcela] = useState<Parcela | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!open || mode !== "edit" || !parcelaId) {
      setParcela(null);
      return;
    }
    setLoading(true);
    fetchParcela(parcelaId)
      .then(setParcela)
      .catch(() => setParcela(null))
      .finally(() => setLoading(false));
  }, [open, mode, parcelaId]);

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
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Nueva Parcela" : mode === "edit" ? "Editar Parcela" : "Detalle de Parcela"}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === "create"
                  ? "Registra una nueva parcela"
                  : mode === "edit"
                    ? "Modifica la información de la parcela"
                    : "Información completa de la parcela"}
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
            <ParcelaView inModal parcelaId={parcelaId} />
          ) : mode === "edit" && loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : mode === "edit" && !parcela ? (
            <div className="py-20 text-center text-gray-500">
              <p>No se encontró la parcela.</p>
            </div>
          ) : (
            <ParcelaFormProvider initial={mode === "edit" && parcela ? parcela : {}}>
              <ParcelaForm mode={mode} parcelaId={parcela?.id} inModal onSave={onSave} />
            </ParcelaFormProvider>
          )}
        </div>
      </div>
    </div>
  );
}
