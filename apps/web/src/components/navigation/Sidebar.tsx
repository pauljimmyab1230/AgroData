import { useState, useCallback, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  BookOpen,
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
      { to: "/actividades", icon: ClipboardList, label: "Actividades" },
      { to: "/inspecciones", icon: SearchCheck, label: "Inspecciones" },
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
      { to: "/kardex", icon: BookOpen, label: "Kardex" },
    ],
  },

  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    children: [
      { to: "/usuarios", icon: Settings, label: "Usuarios" },
      { to: "/catalogos/departamentos", icon: MapPin, label: "Departamentos" },
      { to: "/catalogos/tipos-cultivo", icon: Wheat, label: "Tipos de Cultivo" },
      { to: "/catalogos/tipos-suelo", icon: MapPin, label: "Tipos de Suelo" },
      { to: "/catalogos/fuentes-agua", icon: MapPin, label: "Fuentes de Agua" },
      { to: "/catalogos/sistemas-riego", icon: MapPin, label: "Sistemas de Riego" },
      { to: "/catalogos/zonas-agroecologicas", icon: MapPin, label: "Zonas Agroecológicas" },
      { to: "/catalogos/tipos-actividad", icon: ClipboardList, label: "Tipos de Actividad" },
      { to: "/catalogos/tipos-documento", icon: Package, label: "Tipos de Documento" },
      { to: "/catalogos/parentescos", icon: Users, label: "Parentescos" },
      { to: "/catalogos/criterios-checklist", icon: ClipboardList, label: "Criterios de Inspección" },
    ],
  },
];

const isSubmenu = (entry: SidebarEntry): entry is Submenu => "children" in entry;

export default function AdminSidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: AdminSidebarProps) {
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

  useEffect(() => {
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

  const filtered = navItems;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 text-sm font-medium transition-all duration-200 ease-in-out ${
      collapsed ? "justify-center px-2.5 py-3" : "px-4 py-3"
    } ${
      isActive
        ? "bg-gray-50 text-[#0A4174] shadow-lg shadow-black/20 rounded-l-xl -mr-6 z-10"
        : "text-white/70 hover:bg-white/10 hover:text-white rounded-xl"
    }`;

  const submenuLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ease-in-out pl-9 ${
      collapsed ? "justify-center px-2.5 pl-2.5" : ""
    } ${
      isActive
        ? "bg-white/15 text-white"
        : "text-blue-100/60 hover:bg-white/10 hover:text-white"
    }`;

  const tooltip = (label: string) =>
    collapsed ? (
      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    ) : null;

  const renderEntry = (entry: SidebarEntry, index: number) => {
    if (isSubmenu(entry)) {
      const isExpanded = expandedSubmenus.has(entry.id);
      const Icon = entry.icon;
      const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
      const hasActiveChild = entry.children.some((child) => location.pathname === child.to);

      return (
        <li key={`submenu-${entry.id}`}>
          <button
            type="button"
            onClick={() => toggleSubmenu(entry.id)}
            className={`group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
              collapsed ? "justify-center px-2.5" : ""
            } ${hasActiveChild && !isExpanded ? "bg-white/15 rounded-l-xl -mr-6 z-10" : "hover:bg-white/10 rounded-xl"} text-blue-100/90 hover:text-white`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
              hasActiveChild ? "bg-white/20 text-white" : "bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white"
            }`}>
              <Icon className="h-4 w-4" />
            </span>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left">{entry.label}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-md transition-all duration-200 ${
                  isExpanded ? "bg-white/15" : "bg-transparent"
                }`}>
                  <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "text-white" : "text-white/50"}`} />
                </span>
              </>
            )}
            {tooltip(entry.label)}
          </button>

          {!collapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                {entry.children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      end={child.end}
                      onClick={onMobileClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-white/15 text-white rounded-l-lg -mr-6 z-10"
                            : "text-blue-100/50 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <child.icon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                            isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
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
          onClick={onMobileClose}
          className={({ isActive }) => linkClass({ isActive })}
        >
          {({ isActive }) => (
            <>
              <entry.icon
                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                  isActive ? "text-[#0A4174]" : "text-white/70 group-hover:text-white"
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
    <div className="flex h-full flex-col bg-[#001D39]">
      {/* Marca */}
      <div
        className="relative flex h-28 shrink-0 items-start border-b border-white/10 justify-center pt-5 pb-3 px-5"
      >
        {collapsed ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0A4174] shadow-lg shadow-[#0A4174]/30">
            <Sprout size={24} />
          </span>
        ) : (
          <span className="flex flex-col items-center gap-2">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0A4174] shadow-lg shadow-[#0A4174]/30">
              <Sprout size={24} />
            </span>
            <span className="text-center">
              <span className="block text-lg font-bold leading-tight text-white">
                AgroData
              </span>
              <span className="block text-[11px] font-medium leading-tight text-blue-200/60">
                Gestión cooperativa
              </span>
            </span>
          </span>
        )}

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center rounded-lg p-2 text-blue-200/70 transition-colors duration-200 hover:bg-white/10 hover:text-white hidden lg:flex"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navegación */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-1">
          {filtered.map((entry, index) => renderEntry(entry, index))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div
          className="fixed inset-y-0 left-0 z-30 hidden shadow-xl shadow-black/10 overflow-hidden transition-all duration-300 ease-in-out lg:block"
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
