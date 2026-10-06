import CustomHeader from "./CustomHeader";
import { useUsuarioActual } from "../../hooks/useUsuarioActual";

interface HeaderUsuarioProps {
  title?: string;
  showBack?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
}

/**
 * Header con la identidad real del usuario autenticado.
 * Sustituye a CustomHeader con userName/userRole hardcodeados.
 */
export default function HeaderUsuario({ title, showBack, isDarkMode, onToggleTheme, onLogout, onBack }: HeaderUsuarioProps) {
  const { user } = useUsuarioActual();

  return (
    <CustomHeader
      userName={user?.nombre ?? "Usuario"}
      userRole={user?.rol === "ADMIN" ? "Administrador" : "Usuario"}
      title={title}
      showBack={showBack}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      onLogout={onLogout}
      onBack={onBack}
    />
  );
}
