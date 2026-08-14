import { useMemo, useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Sprout,
  LayoutDashboard,
  Users,
  MapPin,
  CalendarDays,
  Wheat,
  ClipboardList,
  SearchCheck,
  Warehouse,
  PackageCheck,
  Factory,
  Package,
  Layers,
  Route,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  SearchX,
  Settings,
  BookOpen,
  GraduationCap,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };
type Submenu = {
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavItem[];
};

type SidebarEntry = NavItem | Submenu;

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const navItems: SidebarEntry[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },

  {
    id: "socios",
    label: "Socios",
    icon: Users,
    children: [
      { to: "/productores", icon: Users, label: "Productores" },
    ],
  },

  {
    id: "campo",
    label: "Campo",
    icon: MapPin,
    children: [
      { to: "/parcelas", icon: MapPin, label: "Parcelas" },
      { to: "/campanias", icon: CalendarDays, label: "Campañas" },
      { to: "/cultivos", icon: Wheat, label: "Cultivos" },
      { to: "/actividades", icon: ClipboardList, label: "Actividades Agrícolas" },
      { to: "/inspecciones", icon: SearchCheck, label: "Inspecciones" },
      { to: "/capacitaciones", icon: GraduationCap, label: "Capacitaciones" },
    ],
  },

  {
    id: "operaciones",
    label: "Operaciones",
    icon: ClipboardList,
    children: [
      { to: "/acopio", icon: Warehouse, label: "Acopio" },
      { to: "/recepcion", icon: PackageCheck, label: "Recepción" },
      { to: "/procesamiento", icon: Factory, label: "Procesamiento" },
    ],
  },

  {
    id: "trazabilidad",
    label: "Trazabilidad",
    icon: Route,
    children: [
      { to: "/lotes", icon: Layers, label: "Lotes" },
      { to: "/inventario", icon: Package, label: "Inventario" },
      { to: "/trazabilidad", icon: Route, label: "Trazabilidad" },
    ],
  },

  {
    id: "catalogos",
    label: "Catálogos",
    icon: BookOpen,
    children: [
      { to: "/catalogos/departamentos", icon: MapPin, label: "Departamentos" },
      { to: "/catalogos/tipos-cultivo", icon: Wheat, label: "Tipos de Cultivo" },
      { to: "/catalogos/tipos-suelo", icon: MapPin, label: "Tipos de Suelo" },
      { to: "/catalogos/fuentes-agua", icon: MapPin, label: "Fuentes de Agua" },
      { to: "/catalogos/sistemas-riego", icon: MapPin, label: "Sistemas de Riego" },
      { to: "/catalogos/zonas-agroecologicas", icon: MapPin, label: "Zonas Agroecológicas" },
      { to: "/catalogos/tipos-actividad", icon: ClipboardList, label: "Tipos de Actividad" },
      { to: "/catalogos/tipos-documento", icon: Package, label: "Tipos de Documento" },
      { to: "/catalogos/parentescos", icon: Users, label: "Parentescos" },
    ],
  },

  {
    id: "sistema",
    label: "Sistema",
    icon: Settings,
    children: [
      { to: "/usuarios", icon: Settings, label: "Usuarios" },
    ],
  },
];

const isSubmenu = (entry: SidebarEntry): entry is Submenu => "children" in entry;

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function AdminSidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: AdminSidebarProps) {
  const [query, setQuery] = useState("");
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set());
  const location = useLocation();

  const toggleSubmenu = useCallback((id: string) => {
    setExpandedSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Auto-expand submenu that contains the active route
  useMemo(() => {
    for (const entry of navItems) {
      if (isSubmenu(entry)) {
        const isActive = entry.children.some((child) => location.pathname === child.to);
        if (isActive) {
          setExpandedSubmenus((prev) => {
            if (prev.has(entry.id)) return prev;
            const next = new Set(prev);
            next.add(entry.id);
            return next;
          });
        }
      }
    }
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return navItems;

    const hasMatch = (label: string) => normalize(label).includes(q);
    const result: SidebarEntry[] = [];

    for (const entry of navItems) {
      if (isSubmenu(entry)) {
        const matchingChildren = entry.children.filter((child) => hasMatch(child.label));
        if (hasMatch(entry.label) || matchingChildren.length > 0) {
          result.push({
            ...entry,
            children: hasMatch(entry.label) ? entry.children : matchingChildren,
          });
        }
        continue;
      }

      if (hasMatch(entry.label)) {
        result.push(entry);
      }
    }

    return result;
  }, [query]);

  const hasResults = filtered.some((entry) => {
    if ("to" in entry) return true;
    if (isSubmenu(entry)) return entry.children.length > 0;
    return false;
  });

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      collapsed ? "justify-center px-2.5" : ""
    } ${
      isActive
        ? "bg-forest-700 text-white"
        : "text-forest-100/80 hover:bg-white/5 hover:text-white"
    }`;

  const submenuLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all pl-9 ${
      collapsed ? "justify-center px-2.5 pl-2.5" : ""
    } ${
      isActive
        ? "bg-white/10 text-white shadow-sm"
        : "text-forest-100/60 hover:bg-white/5 hover:text-white"
    }`;

  const tooltip = (label: string) =>
    collapsed ? (
      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    ) : null;

  const submenuColors: Record<string, { icon: string; hover: string; activeBg: string }> = {
    socios: { icon: "text-emerald-400", hover: "hover:bg-emerald-500/10", activeBg: "bg-emerald-500/15" },
    campo: { icon: "text-lime-400", hover: "hover:bg-lime-500/10", activeBg: "bg-lime-500/15" },
    operaciones: { icon: "text-amber-400", hover: "hover:bg-amber-500/10", activeBg: "bg-amber-500/15" },
    control: { icon: "text-sky-400", hover: "hover:bg-sky-500/10", activeBg: "bg-sky-500/15" },
    trazabilidad: { icon: "text-violet-400", hover: "hover:bg-violet-500/10", activeBg: "bg-violet-500/15" },
    catalogos: { icon: "text-rose-400", hover: "hover:bg-rose-500/10", activeBg: "bg-rose-500/15" },
    sistema: { icon: "text-slate-400", hover: "hover:bg-slate-500/10", activeBg: "bg-slate-500/15" },
  };

  const renderEntry = (entry: SidebarEntry, index: number) => {
    if (isSubmenu(entry)) {
      const isExpanded = expandedSubmenus.has(entry.id);
      const Icon = entry.icon;
      const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
      const colors = submenuColors[entry.id] || { icon: "text-forest-300/70", hover: "hover:bg-white/5", activeBg: "" };
      const hasActiveChild = entry.children.some((child) => location.pathname === child.to);

      return (
        <li key={`submenu-${entry.id}`}>
          <button
            type="button"
            onClick={() => toggleSubmenu(entry.id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              collapsed ? "justify-center px-2.5" : ""
            } ${colors.hover} ${
              hasActiveChild && !isExpanded ? colors.activeBg : ""
            } text-forest-100/90 hover:text-white`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${colors.icon} ${
              hasActiveChild ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"
            }`}>
              <Icon className="h-4 w-4" />
            </span>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left">{entry.label}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-md transition-all ${
                  isExpanded ? "bg-white/10" : "bg-transparent"
                }`}>
                  <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${colors.icon}`} />
                </span>
              </>
            )}
            {tooltip(entry.label)}
          </button>

          {!collapsed && (
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                {entry.children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      end={child.end}
                      onClick={() => {
                        setQuery("");
                        onMobileClose();
                      }}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? `${colors.activeBg} text-white`
                            : "text-forest-100/50 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <child.icon className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive ? colors.icon : "text-forest-300/40 group-hover:text-forest-200"
                          }`} />
                          <span className="truncate">{child.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    }

    return (
      <li key={entry.to}>
        <NavLink
          to={entry.to}
          end={entry.end}
          onClick={() => {
            setQuery("");
            onMobileClose();
          }}
          className={({ isActive }) => linkClass({ isActive })}
        >
          {({ isActive }) => (
            <>
              <entry.icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-forest-300/70 group-hover:text-white"
                }`}
              />
              {!collapsed && <span className="truncate">{entry.label}</span>}
              {tooltip(entry.label)}
            </>
          )}
        </NavLink>
      </li>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-forest-900">
      {/* ── Marca ─────────────────────────────────────────── */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
          collapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        {collapsed ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-600 text-white">
            <Sprout size={20} />
          </span>
        ) : (
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-600 text-white">
              <Sprout size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold leading-tight text-white">
                AgroData
              </span>
              <span className="block truncate text-[11px] font-medium leading-tight text-forest-300/70">
                Gestión cooperativa
              </span>
            </span>
          </span>
        )}

        <button
          type="button"
          onClick={onToggle}
          className="hidden items-center justify-center rounded-lg p-2 text-forest-300/70 transition-colors hover:bg-white/5 hover:text-white lg:flex"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Búsqueda ──────────────────────────────────────── */}
      {!collapsed && (
        <div className="shrink-0 px-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-300/60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar módulo..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-forest-300/50 focus:border-forest-500/60 focus:bg-white/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-forest-300/60 transition-colors hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Navegación ────────────────────────────────────── */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {!hasResults ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <SearchX className="h-8 w-8 text-forest-300/40" />
            <p className="text-sm font-medium text-forest-100">Sin resultados</p>
            <p className="text-xs text-forest-300/60">No se encontraron módulos con "{query}".</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((entry, index) => renderEntry(entry, index))}
          </ul>
        )}
      </nav>
    </div>
  );

  return (
    <>
      <aside className={`hidden transition-all duration-300 lg:block ${collapsed ? "w-[76px]" : "w-64"}`}>
        <div
          className="fixed inset-y-0 left-0 z-30 border-r border-white/10 shadow-xl shadow-black/10"
          style={{ width: collapsed ? 76 : 256 }}
        >
          {sidebarContent}
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
