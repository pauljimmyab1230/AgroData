import { Save, X } from "lucide-react";
import { Button } from "../ui";

interface ActionButtonsProps {
  cancelTo: string;
  submitLabel: string;
  onSubmit?: () => void;
  disabled?: boolean;
}

export default function ActionButtons({ cancelTo, submitLabel, onSubmit, disabled }: ActionButtonsProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-card">
      <Button variant="ghost" as="link" to={cancelTo} iconLeft={<X className="h-4 w-4" />}>
        Cancelar
      </Button>
      <Button onClick={onSubmit} iconLeft={<Save className="h-4 w-4" />} disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
