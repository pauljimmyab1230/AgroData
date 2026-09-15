import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[] | SelectOption[];
  onSelect: (val: string) => void;
  placeholder?: string;
}

function isSelectOptionArray(options: string[] | SelectOption[]): options is SelectOption[] {
  return options.length > 0 && typeof options[0] === "object" && "label" in options[0];
}

export function SelectField({ label, value, options, onSelect, placeholder = "Seleccionar" }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  const getLabel = useCallback((item: string | SelectOption): string => {
    if (typeof item === "string") return item.replace(/_/g, " ");
    return item.label;
  }, []);

  const getValue = useCallback((item: string | SelectOption): string => {
    if (typeof item === "string") return item;
    return item.value;
  }, []);

  const getLabelFromValue = useCallback((val: string): string => {
    if (!val) return placeholder;
    if (isSelectOptionArray(options)) {
      const found = options.find((o) => o.value === val);
      if (found) return found.label;
    }
    return val.replace(/_/g, " ");
  }, [options, placeholder]);

  const displayValue = getLabelFromValue(value);
  const hasValue = !!value;

  return (
    <View style={styles.field}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.selectButton, { borderColor: colors.disabled, backgroundColor: colors.surface }]}
        onPress={() => setVisible(true)}
        accessibilityLabel={`${label}: ${displayValue}`}
        accessibilityRole="button"
      >
        <Text style={[styles.selectText, { color: colors.text }, !hasValue && { color: colors.placeholder }]} numberOfLines={1}>
          {displayValue}
        </Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{label || "Seleccionar"}</Text>
              <TouchableOpacity onPress={() => setVisible(false)} accessibilityLabel="Cerrar" accessibilityRole="button">
                <Text style={[styles.closeBtn, { color: colors.primary }]}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options as any[]}
              keyExtractor={(item: any, index: number) => `${getValue(item)}-${index}`}
              renderItem={({ item }) => {
                const itemValue = getValue(item);
                const itemLabel = getLabel(item);
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, { borderBottomColor: colors.divider }, value === itemValue && { backgroundColor: colors.primaryLight }]}
                    onPress={() => { onSelect(itemValue); setVisible(false); }}
                    accessibilityLabel={itemLabel}
                    accessibilityRole="button"
                    accessibilityState={{ selected: value === itemValue }}
                  >
                    <Text style={[styles.optionText, { color: colors.text }, value === itemValue && { color: colors.primary, fontWeight: "600" }]}>
                      {itemLabel}
                    </Text>
                    {value === itemValue && <Check size={18} color={colors.primary} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.placeholder }]}>No hay opciones disponibles</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 4 },
  selectButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 12,
  },
  selectText: { fontSize: 14, flex: 1 },
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", alignItems: "center",
  },
  modal: {
    borderRadius: 12,
    width: "85%", maxHeight: "70%", overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 16, fontWeight: "600" },
  closeBtn: { fontSize: 14, fontWeight: "600" },
  optionItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 15, flex: 1 },
  emptyText: { padding: 16, textAlign: "center" },
});
