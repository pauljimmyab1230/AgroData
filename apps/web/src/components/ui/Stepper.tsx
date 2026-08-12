import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

export type StepperStep = {
  id: number;
  label: string;
  icon?: LucideIcon;
};

interface StepperProps {
  steps: StepperStep[];
  active: number;
  onChange?: (id: number) => void;
  maxReached?: number;
  className?: string;
}

type StepState = "done" | "active" | "todo";

export function Stepper({ steps, active, onChange, maxReached, className }: StepperProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className ?? ""}`}
    >
      <div className="overflow-x-auto px-4 py-5 sm:px-6">
        <ol className="flex min-w-max items-center gap-3 sm:gap-4">
          {steps.map((step, index) => {
            const state: StepState =
              step.id < active ? "done" : step.id === active ? "active" : "todo";
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            const canClick = onChange && (maxReached === undefined || step.id <= maxReached);

            return (
              <li key={step.id} className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => canClick && onChange?.(step.id)}
                  disabled={!canClick}
                  aria-current={state === "active" ? "step" : undefined}
                  className={`group flex items-center gap-3 text-left ${
                    canClick ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      state === "active" || state === "done"
                        ? "bg-forest-600 text-white"
                        : canClick
                          ? "border border-gray-300 bg-white text-gray-400 group-hover:border-gray-400"
                          : "border border-gray-200 bg-gray-50 text-gray-300"
                    }`}
                  >
                    {state === "done" ? (
                      <Check className="h-4 w-4" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>

                  <span className="min-h-[2.5rem] max-w-[150px]">
                    <span
                      className={`block truncate text-sm ${
                        state === "active"
                          ? "font-semibold text-forest-700"
                          : state === "done"
                            ? "font-medium text-gray-700"
                            : canClick
                              ? "font-medium text-gray-400"
                              : "font-medium text-gray-300"
                      }`}
                    >
                      {step.label}
                    </span>
                    {state === "active" && (
                      <span className="block text-[11px] font-medium text-forest-600/70">
                        Paso {index + 1} de {steps.length}
                      </span>
                    )}
                  </span>
                </button>

                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`h-0.5 w-8 shrink-0 rounded-full sm:w-14 ${
                      state === "done" ? "bg-forest-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
