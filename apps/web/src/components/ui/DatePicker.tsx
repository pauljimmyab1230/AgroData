import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  dropdownMode?: "scroll" | "select";
}

const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(
  (
    {
      selected = null,
      onChange,
      placeholder = "Seleccionar fecha",
      disabled = false,
      error,
      className = "",
      dateFormat = "dd/MM/yyyy",
      minDate,
      maxDate,
      showMonthDropdown = true,
      showYearDropdown = true,
      dropdownMode = "select",
    },
    ref
  ) => {
    const CustomInput = forwardRef<HTMLInputElement, { onClick?: () => void; value?: string }>(
      ({ onClick, value: dpValue }, inputRef) => (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            readOnly
            onClick={onClick}
            placeholder={placeholder}
            disabled={disabled}
            value={dpValue ?? ""}
            className={`w-full rounded-xl border bg-gray-50/50 py-2.5 pl-4 pr-10 text-sm text-[#111827] outline-none transition-all ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
            } placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          />
          <Calendar className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      )
    );
    CustomInput.displayName = "CustomDateInput";

    return (
      <ReactDatePicker
        ref={ref}
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput />}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
        dropdownMode={dropdownMode}
        calendarClassName="agrodata-calendar"
        popperClassName="agrodata-datepicker-popper"
      />
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
