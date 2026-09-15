import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = React.memo(function EmptyState({ title, description }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityLabel={`${title}. ${description}`} accessibilityRole="text">
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
  },
});
