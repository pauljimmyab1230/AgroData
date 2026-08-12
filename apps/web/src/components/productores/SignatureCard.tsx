import { FileSignature, PenLine } from "lucide-react";
import { ImageUpload } from "../ui";
import type { FormMode } from "../shared/formControls";

type SignatureCardProps = {
  mode: FormMode;
  nombre?: string;
};

export function SignatureCard({ mode, nombre }: SignatureCardProps) {
  const readOnly = mode === "view";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
          <FileSignature size={16} />
        </span>
        <h3 className="text-sm font-semibold text-[#111827]">Firma digitalizada</h3>
      </div>

      <ImageUpload
        readOnly={readOnly}
        accept="image/png"
        placeholder={
          readOnly && nombre ? (
            <p className="font-serif text-2xl italic text-forest-800">{nombre}</p>
          ) : readOnly ? null : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                <PenLine size={18} />
              </div>
              <p className="text-sm font-medium text-[#111827]">Captura o sube la firma del productor</p>
              <p className="text-xs text-gray-500">Imagen PNG con fondo transparente</p>
            </>
          )
        }
      />
    </div>
  );
}
