import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  searchable?: boolean;
}

export default function Select({
  options,
  value,
  defaultValue = "",
  placeholder = "Seleccione una opción",
  onChange,
  onBlur,
  disabled = false,
  error,
  className = "",
  name,
  required,
  searchable = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const currentValue = value !== undefined ? value : internalValue;

  const selectedOption = options.find((o) => o.value === currentValue);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, search]);

  const highlightedRef = useRef(highlightedIndex);
  useEffect(() => {
    highlightedRef.current = highlightedIndex;
  });

  const scrollToHighlighted = useCallback(() => {
    if (highlightedRef.current < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-option]");
    items[highlightedRef.current]?.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    scrollToHighlighted();
  }, [highlightedIndex, scrollToHighlighted]);

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inContainer && !inDropdown) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const openDropdown = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - (rect.bottom);
    const dropHeight = Math.min(filteredOptions.length * 40 + (searchable ? 50 : 0), 240);

    setPosition({
      top: spaceBelow < dropHeight ? rect.top + scrollY - dropHeight - 6 : rect.bottom + scrollY + 6,
      left: rect.left + scrollX,
      width: rect.width,
    });
    setIsOpen(true);
  }, [filteredOptions.length, searchable]);

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const dropHeight = Math.min(filteredOptions.length * 40 + (searchable ? 50 : 0), 240);
        setPosition({
          top: spaceBelow < dropHeight ? rect.top + scrollY - dropHeight - 6 : rect.bottom + scrollY + 6,
          left: rect.left + scrollX,
          width: rect.width,
        });
      };
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isOpen, filteredOptions.length, searchable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange?.(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        } else {
          if (!isOpen) openDropdown();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === undefined) setInternalValue("");
    onChange?.("");
  };

  const listboxId = `select-listbox-${name || "listbox"}`;

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={(el) => {
            (dropdownRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (listRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          id={listboxId}
          role="listbox"
          aria-label={placeholder}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}
          className="mt-1.5 rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-200 ease-out"
        >
          {searchable && (
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-forest-500 focus:bg-white focus:ring-1 focus:ring-forest-500/20"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto overscroll-contain py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-gray-400">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === currentValue;
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-option
                    id={`${listboxId}-option-${index}`}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isHighlighted
                        ? "bg-forest-50 text-forest-900"
                        : isSelected
                          ? "bg-forest-50/50 text-forest-700"
                          : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 flex-shrink-0 text-forest-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        name={name}
        disabled={disabled}
        aria-required={required}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
        onClick={() => { if (!disabled) { isOpen ? setIsOpen(false) : openDropdown(); } }}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left text-sm outline-none transition-all ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : isOpen
              ? "border-forest-500 ring-2 ring-forest-500/20"
              : "border-gray-200 hover:border-gray-300 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
        } ${disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "cursor-pointer"}`}
      >
        <span
          className={`block truncate ${
            selectedOption ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {dropdown}
    </div>
  );
}
