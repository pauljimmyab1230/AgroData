import { useId, type ReactNode, isValidElement, cloneElement } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  description?: string;
  className?: string;
}

export default function FormField({
  label,
  error,
  required,
  children,
  htmlFor,
  description,
  className = "",
}: FormFieldProps) {
  const generatedId = useId();
  const descId = `${htmlFor || generatedId}-desc`;
  const errorId = `${htmlFor || generatedId}-error`;

  const childWithError = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ error?: string; className?: string }>, {
        error: error || undefined,
        className: `${(children.props as { className?: string }).className ?? ""} ${error ? "pr-10" : ""}`.trim(),
      })
    : children;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#111827]">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        {childWithError}
        {error && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="h-4 w-4" />
          </span>
        )}
      </div>
      {description && !error && <p className="text-xs text-gray-400" id={descId}>{description}</p>}
      {error && <p className="text-xs text-red-500" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
