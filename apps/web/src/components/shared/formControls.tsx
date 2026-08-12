import type { ReactNode } from "react";
import { Card, FormField } from "../ui";

export type FormMode = "create" | "edit" | "view";

type FieldProps = {
  label: string;
  mode: FormMode;
  value?: string;
  children?: ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
};

export function Field({ label, mode, value, children, className, required, error }: FieldProps) {
  if (mode === "view") {
    return (
      <div className={className}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#111827]">{value || "—"}</p>
      </div>
    );
  }

  return (
    <FormField label={label} required={required} error={error} className={className}>
      {children}
    </FormField>
  );
}

export function CardHeader({
  icon,
  title,
  description,
  actions,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function CardShell({ children }: { children: ReactNode }) {
  return (
    <Card padding="lg" hover={false} className="relative shadow-sm">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-forest-600" />
      {children}
    </Card>
  );
}
