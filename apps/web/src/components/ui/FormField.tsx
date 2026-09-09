import { useId, type ReactNode } from "react";

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

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#111827]">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {description && !error && <p className="text-xs text-gray-400" id={descId}>{description}</p>}
      {error && <p className="text-xs text-red-500" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
