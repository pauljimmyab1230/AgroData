import { Bell, Menu, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const initials = user?.nombre?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex w-full items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-sm font-medium text-gray-700">{user?.nombre}</span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-xs font-semibold text-white shadow-md shadow-forest-600/25">
            {initials}
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
