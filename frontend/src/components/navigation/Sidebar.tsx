import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
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
  Search,
  X,
  SearchX,
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
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
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

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function AdminSidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: AdminSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return navItems;

    type Group = { section: string; items: NavItem[] };
    const groups: Group[] = [];
    let current: Group | null = null;
    for (const entry of navItems) {
      if ("section" in entry) {
        current = { section: entry.section, items: [] };
        groups.push(current);
        continue;
      }
      current?.items.push(entry);
    }

    const result: SidebarEntry[] = [];
    const hasMatch = (label: string) => normalize(label).includes(q);

    for (const group of groups) {
      const sectionMatch = hasMatch(group.section);
      const itemMatches = group.items.filter((item) => hasMatch(item.label));
      if (!sectionMatch && itemMatches.length === 0) continue;
      result.push({ section: group.section });
      result.push(...(sectionMatch ? group.items : itemMatches));
    }
    return result;
  }, [query]);

  const hasResults = filtered.some((entry) => "to" in entry);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      collapsed ? "justify-center px-2.5" : ""
    } ${
      isActive
        ? "bg-forest-700 text-white"
        : "text-forest-100/80 hover:bg-white/5 hover:text-white"
    }`;

  const tooltip = (label: string) =>
    collapsed ? (
      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    ) : null;

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
            {filtered.map((entry) => {
              if ("section" in entry) {
                return !collapsed ? (
                  <li key={entry.section} className="px-3 pb-2 pt-5">
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-forest-300/60">
                      <span className="h-1 w-1 rounded-full bg-forest-400" />
                      {entry.section}
                    </span>
                  </li>
                ) : (
                  <li key={entry.section} className="px-3 pb-1 pt-4">
                    <span className="mx-auto block h-px w-5 bg-white/15" />
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
            })}
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
