import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Sprout,
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
  LogOut,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };
type Section = { section: string };

type SidebarEntry = NavItem | Section;

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const navItems: SidebarEntry[] = [
  { section: "Producción" },
  { to: "/productores", icon: Users, label: "Productores" },
  { to: "/parcelas", icon: MapPin, label: "Parcelas" },
  { to: "/campanias", icon: CalendarDays, label: "Campañas" },
  { to: "/cultivos", icon: Wheat, label: "Cultivos" },
  { to: "/actividades", icon: ClipboardList, label: "Actividades Agrícolas" },
  { to: "/inspecciones", icon: SearchCheck, label: "Inspecciones" },
  { to: "/acopio", icon: Warehouse, label: "Acopio" },
  { section: "Procesamiento" },
  { to: "/recepcion", icon: PackageCheck, label: "Recepción" },
  { to: "/procesamiento", icon: Factory, label: "Procesamiento" },
  { to: "/lotes", icon: Layers, label: "Lotes" },
  { to: "/inventario", icon: Package, label: "Inventario" },
  { to: "/trazabilidad", icon: Route, label: "Trazabilidad" },
];

export default function AdminSidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: AdminSidebarProps) {
  const sidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-forest-50/60">
      <div
        className={`flex h-16 items-center border-b border-gray-200/80 bg-white/80 backdrop-blur-sm ${
          collapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        {!collapsed ? (
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md shadow-forest-600/30 ring-1 ring-forest-600/20">
              <Sprout size={18} />
            </span>
            <span className="text-lg font-bold text-forest-800">AgroData</span>
          </span>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md shadow-forest-600/30 ring-1 ring-forest-600/20">
            <Sprout size={18} />
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="hidden items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700 lg:flex"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if ("section" in item) {
              return !collapsed ? (
                <li key={item.section} className="px-3 pb-2 pt-5">
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    <span className="h-1 w-1 rounded-full bg-forest-400" />
                    {item.section}
                  </span>
                </li>
              ) : null;
            }
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-forest-600 to-forest-500 text-white shadow-md shadow-forest-600/25"
                        : "text-gray-600 hover:bg-forest-600/10 hover:text-forest-700"
                    }`
                  }
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      collapsed
                        ? ""
                        : "text-gray-400 group-hover:text-forest-600"
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`border-t border-gray-200/80 bg-white/80 p-3 ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl border border-forest-100 bg-forest-50/70 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-sm font-semibold text-white ring-2 ring-white">
              P
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#111827]">Paul</p>
              <p className="truncate text-xs text-gray-500">Administrador</p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden transition-all duration-300 lg:block ${collapsed ? "w-[68px]" : "w-64"}`}>
        <div className="fixed inset-y-0 left-0 z-30" style={{ width: collapsed ? 68 : 256 }}>
          {sidebarContent}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
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
