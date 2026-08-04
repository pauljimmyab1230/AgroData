import type { ReactNode } from "react";
import { Leaf, Sprout, Flower2, Wheat, Image as ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImageUpload, Input } from "../ui";
import { cultivoFotosMock, type CultivoFoto } from "../../pages/cultivos/cultivoMock";
import type { FormMode } from "../shared/formControls";

interface CultivoPhotosProps {
  mode: FormMode;
}

const iconosEtapa: Record<string, LucideIcon> = {
  siembra: Sprout,
  desarrollo: Leaf,
  floracion: Flower2,
  cosecha: Wheat,
};

export function CultivoPhotos({ mode }: CultivoPhotosProps) {
  const readOnly = mode === "view";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cultivoFotosMock.map((foto) => {
        const Icon = iconosEtapa[foto.id] ?? ImageIcon;
        return <FotoCard key={foto.id} foto={foto} icon={Icon} readOnly={readOnly} />;
      })}
    </div>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
      {children}
    </div>
  );
}

function FotoCard({ foto, icon: Icon, readOnly }: { foto: CultivoFoto; icon: LucideIcon; readOnly: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          <Icon size={16} />
        </span>
        <h4 className="truncate text-sm font-semibold text-[#111827]">{foto.titulo}</h4>
      </div>

      <ImageUpload
        readOnly={readOnly}
        accept="image/png,image/jpeg,image/webp"
        placeholder={
          readOnly ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-300">
              <ImageIcon size={22} />
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                <ImageIcon size={22} />
              </div>
              <p className="text-sm font-medium text-[#111827]">Arrastra o haz clic para subir</p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (máx. 5MB)</p>
            </>
          )
        }
      />

      <div className="mt-4 space-y-3">
        <MetaRow label="Fecha">
          {readOnly ? (
            <p className="text-sm font-medium text-[#111827]">{foto.fecha || "—"}</p>
          ) : (
            <Input type="date" defaultValue={foto.fecha} />
          )}
        </MetaRow>

        <MetaRow label="Responsable">
          {readOnly ? (
            <p className="text-sm font-medium text-[#111827]">{foto.responsable || "—"}</p>
          ) : (
            <Input type="text" placeholder="Nombre del responsable" defaultValue={foto.responsable} />
          )}
        </MetaRow>

        <MetaRow label="Descripción">
          {readOnly ? (
            <p className="text-sm font-medium text-[#111827]">{foto.descripcion || "—"}</p>
          ) : (
            <Input type="text" placeholder="Descripción de la fotografía" defaultValue={foto.descripcion} />
          )}
        </MetaRow>
      </div>
    </div>
  );
}
