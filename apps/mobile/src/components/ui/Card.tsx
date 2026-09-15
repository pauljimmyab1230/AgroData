import React from "react";
import { View, type ViewProps, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "highlighted";
}

export function Card({ children, variant = "default", style, ...props }: CardProps) {
  const { colors, isDarkMode } = useTheme();

  const cardStyle =
    variant === "highlighted"
      ? { backgroundColor: isDarkMode ? "#1E3A5F" : "#001D39" }
      : { backgroundColor: colors.surface };

  return (
    <View style={[styles.base, variant === "highlighted" ? styles.highlighted : styles.defaultShadow, cardStyle, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  defaultShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  highlighted: {},
});
