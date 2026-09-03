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
    <div className={`py-4 px-2 ${className ?? ""}`}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const state: StepState =
            step.id < active ? "done" : step.id === active ? "active" : "todo";
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          const canClick = onChange && (maxReached === undefined || step.id <= maxReached);

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center">
                {/* Icon circle */}
                <button
                  type="button"
                  onClick={() => canClick && onChange?.(step.id)}
                  disabled={!canClick}
                  aria-current={state === "active" ? "step" : undefined}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    canClick ? "cursor-pointer" : "cursor-default"
                  } ${
                    state === "done"
                      ? "bg-[#0A4174] text-white shadow-lg shadow-[#0A4174]/30"
                      : state === "active"
                        ? "bg-[#4E8EA2] text-white shadow-lg shadow-[#4E8EA2]/30 ring-4 ring-[#4E8EA2]/20"
                        : canClick
                          ? "border-2 border-gray-300 bg-white text-gray-400 hover:border-[#4E8EA2]/50"
                          : "border-2 border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {state === "done" ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>

                {/* Label */}
                <span className="mt-3 text-center">
                  <span
                    className={`block text-xs font-medium ${
                      state === "active"
                        ? "text-[#0A4174]"
                        : state === "done"
                          ? "text-[#0A4174]"
                          : canClick
                            ? "text-gray-500"
                            : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-2 flex-1 sm:mx-4">
                  <div
                    className={`h-0.5 w-full rounded-full ${
                      state === "done" ? "bg-[#0A4174]" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
