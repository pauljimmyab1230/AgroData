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
};

export function Field({ label, mode, value, children, className, required }: FieldProps) {
  if (mode === "view") {
    return (
      <div className={className}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#111827]">{value || "—"}</p>
      </div>
    );
  }

  return (
    <FormField label={label} required={required} className={className}>
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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
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
    <Card padding="lg" hover={false} className="shadow-sm">
      {children}
    </Card>
  );
}
