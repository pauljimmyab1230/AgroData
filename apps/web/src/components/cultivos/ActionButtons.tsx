import { Save } from "lucide-react";
import { Button } from "../ui";

interface ActionButtonsProps {
  cancelTo: string;
  onSave?: () => void;
  saveLabel?: string;
  disabled?: boolean;
}

export default function ActionButtons({ cancelTo, onSave, saveLabel = "Guardar Cultivo", disabled }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <Button variant="ghost" as="link" to={cancelTo}>
        Cancelar
      </Button>
      <Button onClick={onSave} disabled={disabled} iconLeft={<Save className="h-4 w-4" />}>
        {saveLabel}
      </Button>
    </div>
  );
}
