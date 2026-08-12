import { useEffect, useRef, useState, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "options" | "value" | "defaultValue"> {
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function Select({
  className = "",
  error,
  options,
  placeholder,
  onChange,
  onBlur,
  disabled,
  value: valueProp,
  defaultValue,
  name,
  required,
}: SelectProps) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(String(defaultValue ?? ""));
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const currentValue = isControlled ? String(valueProp ?? "") : internalValue;
  const selectedOption = options.find((o) => String(o.value) === currentValue);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside =
        (containerRef.current && containerRef.current.contains(target)) ||
        (panelRef.current && panelRef.current.contains(target));
      if (!inside) setOpen(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [open]);

  const openPanel = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPanelPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(0, Math.min(rect.width, window.innerWidth - rect.left - 16)),
    });
    setOpen(true);
  };

  const selectValue = (val: string) => {
    setOpen(false);
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    onBlur?.({} as React.FocusEvent<HTMLSelectElement>);
  };

  const triggerStyles = `flex w-full items-center justify-between gap-2 rounded-xl border bg-gray-50/50 px-4 py-2.5 text-left text-sm outline-none transition-all ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
  } ${open ? "border-forest-600 ring-2 ring-forest-600/20" : ""} disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerStyles}
      >
        <span className={`truncate ${selectedOption ? "text-[#111827]" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.label : placeholder || "Seleccionar"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <select
        name={name}
        disabled={disabled}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        value={currentValue}
        onChange={() => undefined}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0"
      >
        {placeholder && <option value="" />}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {open &&
        panelPos &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width, animation: "dropdownIn 0.12s ease-out" }}
            className="fixed z-[120] rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl shadow-gray-200/60"
          >
            <ul role="listbox" className="max-h-60 overflow-auto">
              {options.length === 0 && <li className="px-4 py-2.5 text-sm text-gray-400">Sin opciones</li>}
              {options.map((opt) => {
                const selected = String(opt.value) === currentValue;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectValue(String(opt.value))}
                    className={`flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2 text-sm transition-colors ${
                      selected
                        ? "bg-forest-600/10 font-medium text-forest-700"
                        : "text-[#111827] hover:bg-gray-100"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {selected && <Check className="h-4 w-4 shrink-0" />}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
