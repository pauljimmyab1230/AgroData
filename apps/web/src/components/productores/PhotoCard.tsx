import { Camera, User } from "lucide-react";
import { ImageUpload } from "../ui";
import type { FormMode } from "../shared/formControls";

type PhotoCardProps = {
  mode: FormMode;
  initials?: string;
};

export function PhotoCard({ mode, initials }: PhotoCardProps) {
  const readOnly = mode === "view";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
          <Camera size={16} />
        </span>
        <h3 className="text-sm font-semibold text-[#111827]">Fotografía</h3>
      </div>

      <ImageUpload
        readOnly={readOnly}
        accept="image/png,image/jpeg,image/webp"
        placeholder={
          readOnly && initials ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-2xl font-bold text-white shadow-md shadow-forest-600/25">
              {initials}
            </div>
          ) : readOnly ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <User size={22} />
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                <User size={22} />
              </div>
              <p className="text-sm font-medium text-[#111827]">
                Arrastra la fotografía o haz clic para subir
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (máx. 5MB)</p>
            </>
          )
        }
      />
    </div>
  );
}
