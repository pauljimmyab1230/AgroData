import React from "react";
import { MapPin, CalendarDays, Wheat, ClipboardCheck, Wrench, Package } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { MenuScreenLayout } from "../components/layouts/MenuScreenLayout";
import CustomHeader from "../components/ui/CustomHeader";
import { useTheme } from "../contexts/ThemeContext";
import { useLogout } from "../hooks/useLogout";

const menuItems = [
  { id: "parcelas", title: "Parcelas", description: "Gestión de parcelas agrícolas", icon: MapPin, color: "#F59E0B", bg: "#FFFBEB", screen: "Parcelas" },
  { id: "campanias", title: "Campañas", description: "Ciclos agrícolas y planificación", icon: CalendarDays, color: "#6366F1", bg: "#EEF2FF", screen: "Campanias" },
  { id: "cultivos", title: "Cultivos", description: "Registro de cultivos por parcela", icon: Wheat, color: "#10B981", bg: "#ECFDF5", screen: "Cultivos" },
  { id: "actividades", title: "Bitácora", description: "Registro de actividades del campo", icon: Wrench, color: "#059669", bg: "#D1FAE5", screen: "Actividades" },
  { id: "acopio", title: "Acopio", description: "Recolección de cosechas en campo", icon: Package, color: "#D97706", bg: "#FEF3C7", screen: "Acopios" },
  { id: "inspecciones", title: "Inspecciones", description: "Control de calidad orgánica", icon: ClipboardCheck, color: "#2563EB", bg: "#DBEAFE", screen: "Inspecciones" },
];

const quickActions = [
  { id: "nuevaActividad", title: "Nueva\nActividad", icon: Wrench, color: "#10B981", bg: "#ECFDF5", screen: "Actividades" },
  { id: "nuevoAcopio", title: "Nuevo\nAcopio", icon: Package, color: "#D97706", bg: "#FEF3C7", screen: "Acopios" },
  { id: "nuevaInspeccion", title: "Nueva\nInspección", icon: ClipboardCheck, color: "#2563EB", bg: "#DBEAFE", screen: "Inspecciones" },
  { id: "verParcelas", title: "Ver\nParcelas", icon: MapPin, color: "#F59E0B", bg: "#FFFBEB", screen: "Parcelas" },
];

export default function CampoScreen() {
  const navigation = useNavigation<any>();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  return (
    <MenuScreenLayout
      header={
        <CustomHeader
          userName="Juan Péruz"
          userRole="Administrador"
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      }
      quickActions={quickActions}
      menuItems={menuItems}
      onNavigate={(screen) => navigation.navigate(screen)}
    />
  );
}
