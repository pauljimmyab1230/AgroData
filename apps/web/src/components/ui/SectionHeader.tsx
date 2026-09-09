import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeader({ title, description, className = "", actions, as: Tag = "h1" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <Tag className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">{title}</Tag>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
