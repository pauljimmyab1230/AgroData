import { useEffect, useCallback } from "react";
import { X, Sprout } from "lucide-react";
import { Badge, LoadingSpinner } from "../ui";
import { DatosPersonalesCard } from "./DatosPersonalesCard";
import { ContactoUbicacionCard } from "./ContactoUbicacionCard";
import { SocioculturalCard } from "./SocioculturalCard";
import { OrganizacionCard } from "./OrganizacionCard";
import { FamiliarTable } from "./FamiliarTable";
import { ParcelaTable } from "./ParcelaTable";
import { DocumentoUploader } from "./DocumentoUploader";
import { useProductor } from "../../hooks/queries";
import { ProductorFormProvider } from "../../contexts/ProductorFormContext";
import { getEstadoProductorBadgeVariant, getEstadoProductorLabel } from "../../utils/formatters";

interface ProductorViewModalProps {
  open: boolean;
  onClose: () => void;
  productorId?: string;
}

export default function ProductorViewModal({ open, onClose, productorId }: ProductorViewModalProps) {
  const numId = productorId ? Number(productorId) : null;
  const { data: productor, isLoading: loadingProductor } = useProductor(
    open && numId ? numId : null
  );

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

  const estadoBadge = (estado: string) => (
    <Badge variant={getEstadoProductorBadgeVariant(estado)}>{getEstadoProductorLabel(estado)}</Badge>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del productor"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {productor ? `${productor.nombres} ${productor.apellidoPaterno} ${productor.apellidoMaterno}` : "Productor"}
              </h2>
              <p className="text-sm text-gray-500">
                {productor?.codigo} · {productor?.dni}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {productor && estadoBadge(productor.estado)}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loadingProductor ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : productor ? (
            <ProductorFormProvider initial={productor}>
              <div className="space-y-6">
                <DatosPersonalesCard mode="view" values={productor} />
                <ContactoUbicacionCard mode="view" values={productor} />
                <SocioculturalCard mode="view" values={productor} />
                <OrganizacionCard mode="view" values={productor} />
                {numId && <FamiliarTable mode="view" productorId={numId} />}
                {numId && <ParcelaTable mode="view" productorId={numId} />}
                {numId && <DocumentoUploader mode="view" productorId={numId} />}
              </div>
            </ProductorFormProvider>
          ) : (
            <div className="py-20 text-center text-gray-500">
              <p>No se encontró el productor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
