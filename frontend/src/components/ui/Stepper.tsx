import type { LucideIcon } from "lucide-react";

export type StepperStep = {
  id: number;
  label: string;
  icon?: LucideIcon;
};

interface StepperProps {
  steps: StepperStep[];
  active: number;
  onChange?: (id: number) => void;
  className?: string;
}

export function Stepper({ steps, active, onChange, className }: StepperProps) {
  return (
    <div
      className={`mb-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm ${className ?? ""}`}
    >
      <nav className="flex min-w-max">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === active;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange?.(step.id)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 text-sm font-medium transition-colors ${
                isActive
                  ? "border-forest-600 text-forest-700"
                  : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {step.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
