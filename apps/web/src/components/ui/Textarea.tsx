import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from "react";

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> {
  error?: string;
  label?: ReactNode;
  value?: string | number | readonly string[] | null;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = "", error, label, id: externalId, value, ...props }, ref) => {
  const generatedId = useId();
  const areaId = externalId || generatedId;
  const errorId = `${areaId}-error`;

  const control = (
    <textarea
      ref={ref}
      id={areaId}
      value={value ?? undefined}
      aria-invalid={!!error || undefined}
      aria-describedby={error ? errorId : undefined}
      className={`w-full rounded-xl border bg-gray-50/50 px-4 py-2.5 text-sm text-[#111827] outline-none transition-all ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          : "border-gray-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
      } placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <div className="w-full">
      <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-[#111827]">
        {label}
      </label>
      {control}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
