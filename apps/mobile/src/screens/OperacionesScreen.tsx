import React from "react";
import { Truck, Settings, Archive } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { MenuScreenLayout } from "../components/layouts/MenuScreenLayout";
import CustomHeader from "../components/ui/CustomHeader";
import { useTheme } from "../contexts/ThemeContext";
import { useLogout } from "../hooks/useLogout";

const menuItems = [
  { id: "recepcion", title: "Recepción", description: "Control de ingreso a planta/bodega", icon: Truck, color: "#2563EB", bg: "#DBEAFE", screen: "Recepciones" },
  { id: "procesamiento", title: "Procesamiento", description: "Gestión de procesamiento", icon: Settings, color: "#4F46E5", bg: "#E0E7FF", screen: "Procesamientos" },
  { id: "kardex", title: "Kardex", description: "Control de inventario y stock", icon: Archive, color: "#7C3AED", bg: "#F3E8FF", screen: "Kardex" },
];

export default function OperacionesScreen() {
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
      menuItems={menuItems}
      onNavigate={(screen) => navigation.navigate(screen)}
    />
  );
}
