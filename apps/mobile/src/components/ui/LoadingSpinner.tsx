import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "large";
}

export function LoadingSpinner({ text, size = "large" }: LoadingSpinnerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
  },
});
