import React, { useState } from "react";
import { View, Text, TextInput, Switch, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateFamiliar, deleteFamiliar } from "../services/productores";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { DatePickerField } from "../components/ui/DatePickerField";
import { useTheme } from "../contexts/ThemeContext";

const SEXO_OPTIONS = ["MASCULINO", "FEMENINO"];
const PARENTESCO_OPTIONS = ["CONYUGE", "HIJO", "PADRE", "MADRE", "HERMANO", "OTRO"];
const NIVEL_EDUCATIVO_OPTIONS = ["SIN_ESTUDIOS", "PRIMARIA", "SECUNDARIA", "TECNICO", "UNIVERSITARIO"];

export default function FamiliarEditScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productorId, familiar } = route.params;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ ...familiar });

  const updateField = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.nombres?.trim() || !form.parentesco) {
      Alert.alert("Error", "Nombre y parentesco son obligatorios"); return;
    }
    setSaving(true);
    try {
      await updateFamiliar(productorId, familiar.id, form);
      Alert.alert("Éxito", "Familiar actualizado", [{ text: "OK", onPress: () => navigation.navigate("Familiares", { refresh: true, productorId, productorNombre: route.params?.productorNombre }) }]);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar Familiar", `¿Eliminar a ${form.nombres}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteFamiliar(productorId, familiar.id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <FormScreenLayout
      title="Familiar"
      isEdit
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
    >
      <FormSection title="Datos del Familiar">
        <FormField label="Nombres *">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.nombres} onChangeText={(v) => updateField("nombres", v)} />
        </FormField>
        <SelectField label="Parentesco *" value={form.parentesco} options={PARENTESCO_OPTIONS} onSelect={(v) => updateField("parentesco", v)} />
        <FormField label="DNI">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.dni} onChangeText={(v) => updateField("dni", v)} keyboardType="numeric" maxLength={8} />
        </FormField>
        <SelectField label="Sexo" value={form.sexo} options={SEXO_OPTIONS} onSelect={(v) => updateField("sexo", v)} />
        <DatePickerField label="Fecha Nacimiento" value={form.fechaNacimiento} onChange={(v) => updateField("fechaNacimiento", v)} maximumDate={new Date()} />
        <FormField label="Ocupación">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.ocupacion} onChangeText={(v) => updateField("ocupacion", v)} />
        </FormField>
        <SelectField label="Nivel Educativo" value={form.nivelEducativo} options={NIVEL_EDUCATIVO_OPTIONS} onSelect={(v) => updateField("nivelEducativo", v)} />
        <FormField label="Teléfono">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.telefono} onChangeText={(v) => updateField("telefono", v)} keyboardType="phone-pad" />
        </FormField>
      </FormSection>

      <FormSection title="Condición">
        <View style={[styles.switchRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.switchInfo}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>Es dependiente</Text>
          </View>
          <Switch value={form.dependiente} onValueChange={(v) => updateField("dependiente", v)} trackColor={{ false: colors.disabled, true: colors.primaryLight }} thumbColor={form.dependiente ? colors.primary : colors.borderLight} />
        </View>
        <View style={[styles.switchRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.switchInfo}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>Vive con el productor</Text>
          </View>
          <Switch value={form.viveConProductor} onValueChange={(v) => updateField("viveConProductor", v)} trackColor={{ false: colors.disabled, true: colors.primaryLight }} thumbColor={form.viveConProductor ? colors.primary : colors.borderLight} />
        </View>
      </FormSection>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  switchInfo: { flex: 1, marginRight: 12 },
  switchLabel: { fontSize: 14, fontWeight: "500" },
});
