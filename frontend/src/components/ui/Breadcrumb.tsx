import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-forest-600">
            <Home className="h-3.5 w-3.5" />
            Inicio
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            {item.to ? (
              <Link to={item.to} className="transition-colors hover:text-forest-600">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#111827]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
