import type { ReactNode, KeyboardEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = true,
  onClick,
}: CardProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`w-full text-left rounded-2xl border border-gray-200 bg-white transition-shadow ${
          hover ? "hover:shadow-lg hover:shadow-gray-200/60" : ""
        } cursor-pointer ${className}`}
      >
        <div className={paddingStyles[padding]}>{children}</div>
      </button>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white transition-shadow ${
        hover ? "hover:shadow-lg hover:shadow-gray-200/60" : ""
      } ${className}`}
    >
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
}
