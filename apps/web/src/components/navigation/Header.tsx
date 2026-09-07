import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ProfileModal from "./ProfileModal";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initials = user?.nombre?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
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

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4174] text-xs font-semibold text-white">
                  {initials}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfile(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      Mi perfil
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/usuarios");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      Configuraci\u00f3n
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
