import { Save } from "lucide-react";
import { Button } from "../ui";

interface ActionButtonsProps {
  cancelTo?: string;
  onCancel?: () => void;
  onSave?: () => void;
  saveLabel?: string;
  disabled?: boolean;
  inModal?: boolean;
}

export default function ActionButtons({ cancelTo, onCancel, onSave, saveLabel = "Guardar Cultivo", disabled, inModal }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      {inModal ? (
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      ) : (
        <Button variant="ghost" as="link" to={cancelTo || "/cultivos"}>
          Cancelar
        </Button>
      )}
      <Button onClick={onSave} disabled={disabled} iconLeft={<Save className="h-4 w-4" />}>
        {saveLabel}
      </Button>
    </div>
  );
}
