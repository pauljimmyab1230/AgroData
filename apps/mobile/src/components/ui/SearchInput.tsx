import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchInput({ placeholder = "Buscar...", value, onChangeText }: SearchInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Search size={18} color={colors.placeholder} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <X size={16} color={colors.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});
