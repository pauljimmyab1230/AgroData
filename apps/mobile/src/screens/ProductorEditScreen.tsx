import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { User, UserPlus, Plus, Trash2 } from "lucide-react-native";
import { fetchProductor, updateProductor, deleteProductor, fetchFamiliares, createFamiliar, deleteFamiliar, type Familiar } from "../services/productores";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { UbigeoSelect } from "../components/ui/UbigeoSelect";
import { DatePickerField } from "../components/ui/DatePickerField";
import { useUbigeo } from "../hooks/useUbigeo";
import { LoadingSpinner } from "../components/ui";
import {
  SEXO_OPTIONS, ESTADO_CIVIL_OPTIONS, NIVEL_EDUCATIVO_OPTIONS, IDIOMA_OPTIONS, ESTADO_PRODUCTOR_OPTIONS, CARGO_OPTIONS, PARENTESCO_OPTIONS,
} from "../constants/options";
import { useTheme } from "../contexts/ThemeContext";

const STEPS = ["Datos Personales", "Familiares", "Contacto"];

export default function ProductorEditScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [showFamiliarForm, setShowFamiliarForm] = useState(false);
  const [familiarForm, setFamiliarForm] = useState({ nombres: "", parentesco: "", dni: "", sexo: "", fechaNacimiento: "" });

  const ubigeo = useUbigeo();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const [p, fams] = await Promise.all([fetchProductor(id), fetchFamiliares(id)]);
        if (!controller.signal.aborted) {
          setForm(p);
          setFamiliares(fams);
          if (p.departamento) ubigeo.setDepartamento(p.departamento);
          if (p.provincia) ubigeo.setProvincia(p.provincia);
          if (p.distrito) ubigeo.setDistrito(p.distrito);
        }
      } catch { Alert.alert("Error", "No se pudo cargar"); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [id]);

  const update = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const addFamiliar = async () => {
    if (!familiarForm.nombres.trim() || !familiarForm.parentesco) {
      Alert.alert("Error", "Nombre y parentesco son obligatorios"); return;
    }
    try {
      const newFam = await createFamiliar(id, familiarForm);
      setFamiliares((prev) => [...prev, newFam]);
      setFamiliarForm({ nombres: "", parentesco: "", dni: "", sexo: "", fechaNacimiento: "" });
      setShowFamiliarForm(false);
    } catch (err: any) { Alert.alert("Error", err?.response?.data?.message || "No se pudo agregar"); }
  };

  const removeFamiliar = (familiarId: number) => {
    Alert.alert("Eliminar", "¿Eliminar este familiar?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteFamiliar(id, familiarId); setFamiliares((prev) => prev.filter((f) => f.id !== familiarId)); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  const handleSave = async () => {
    if (!form.nombres?.trim() || !form.apellidoPaterno?.trim()) {
      Alert.alert("Error", "Nombres y apellido paterno son obligatorios"); return;
    }
    setSaving(true);
    try {
      await updateProductor(id, form);
      Alert.alert("Éxito", "Productor actualizado", [{ text: "OK", onPress: () => navigation.navigate("ProductoresMain", { refresh: true }) }]);
    } catch (err: any) { Alert.alert("Error", err?.response?.data?.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar Productor", `¿Eliminar a ${form.nombres} ${form.apellidoPaterno}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteProductor(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  const renderStep0 = () => (
    <FormSection title="Datos Personales" subtitle="Información básica del productor" icon={User} iconBg={colors.primaryLight} iconColor={colors.primary}>
      <FormField label="DNI *">
        <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.dni} onChangeText={(v) => update("dni", v)} keyboardType="numeric" maxLength={8} placeholder="8 dígitos" placeholderTextColor={colors.placeholder} />
      </FormField>
      <FormField label="Nombres *">
        <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.nombres} onChangeText={(v) => update("nombres", v)} placeholder="Nombres completos" placeholderTextColor={colors.placeholder} />
      </FormField>
      <FormField row>
        <FormField label="Apellido Paterno *">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.apellidoPaterno} onChangeText={(v) => update("apellidoPaterno", v)} />
        </FormField>
        <FormField label="Apellido Materno">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.apellidoMaterno} onChangeText={(v) => update("apellidoMaterno", v)} />
        </FormField>
      </FormField>
      <FormField row>
        <SelectField label="Sexo *" value={form.sexo} options={SEXO_OPTIONS} onSelect={(v) => update("sexo", v)} />
        <SelectField label="Estado Civil" value={form.estadoCivil} options={ESTADO_CIVIL_OPTIONS} onSelect={(v) => update("estadoCivil", v)} />
      </FormField>
      <FormField row>
        <DatePickerField label="Fecha Nacimiento" value={form.fechaNacimiento} onChange={(v) => update("fechaNacimiento", v)} maximumDate={new Date()} />
        <SelectField label="Cargo" value={form.cargo} options={CARGO_OPTIONS} onSelect={(v) => update("cargo", v)} />
      </FormField>
    </FormSection>
  );

  const renderStep1 = () => (
    <FormSection title={`Familiares (${familiares.length})`} subtitle="Personas dependientes del productor" icon={UserPlus} iconBg={colors.primaryLight} iconColor={colors.primary}>
      <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => setShowFamiliarForm(!showFamiliarForm)}>
        <Plus size={16} color={colors.textInverse} /><Text style={[styles.addBtnText, { color: colors.textInverse }]}>{showFamiliarForm ? "Cancelar" : "Agregar"}</Text>
      </TouchableOpacity>

      {showFamiliarForm && (
        <View style={[styles.familiarForm, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
          <FormField label="Nombres *">
            <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={familiarForm.nombres} onChangeText={(v) => setFamiliarForm((p) => ({ ...p, nombres: v }))} placeholder="Nombre del familiar" placeholderTextColor={colors.placeholder} />
          </FormField>
          <FormField row>
            <SelectField label="Parentesco *" value={familiarForm.parentesco} options={PARENTESCO_OPTIONS} onSelect={(v) => setFamiliarForm((p) => ({ ...p, parentesco: v }))} />
            <SelectField label="Sexo" value={familiarForm.sexo} options={SEXO_OPTIONS} onSelect={(v) => setFamiliarForm((p) => ({ ...p, sexo: v }))} />
          </FormField>
          <FormField row>
            <FormField label="DNI">
              <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={familiarForm.dni} onChangeText={(v) => setFamiliarForm((p) => ({ ...p, dni: v }))} keyboardType="numeric" placeholder="Opcional" placeholderTextColor={colors.placeholder} />
            </FormField>
            <DatePickerField label="Fecha Nacimiento" value={familiarForm.fechaNacimiento} onChange={(v) => setFamiliarForm((p) => ({ ...p, fechaNacimiento: v }))} maximumDate={new Date()} />
          </FormField>
          <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={addFamiliar}>
            <Plus size={16} color={colors.textInverse} /><Text style={[styles.confirmBtnText, { color: colors.textInverse }]}>Agregar Familiar</Text>
          </TouchableOpacity>
        </View>
      )}

      {familiares.length === 0 ? (
        <View style={styles.emptyContainer}>
          <User size={32} color={colors.disabled} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay familiares</Text>
          <Text style={[styles.emptyHint, { color: colors.placeholder }]}>Toca "Agregar" para comenzar</Text>
        </View>
      ) : (
        familiares.map((fam) => (
          <View key={fam.id} style={[styles.familiarCard, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
            <View style={[styles.familiarAvatar, { backgroundColor: colors.primaryLight }]}><User size={16} color={colors.primary} /></View>
            <View style={styles.familiarInfo}>
              <Text style={[styles.familiarName, { color: colors.text }]}>{fam.nombres}</Text>
              <Text style={[styles.familiarSub, { color: colors.textSecondary }]}>{fam.parentesco} {fam.dni ? `· DNI: ${fam.dni}` : ""}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFamiliar(fam.id)} style={[styles.deleteBtn, { backgroundColor: colors.errorLight }]}>
              <Trash2 size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </FormSection>
  );

  const renderStep2 = () => (
    <>
      <FormSection title="Contacto" subtitle="Información de contacto" icon={User} iconBg={colors.primaryLight} iconColor={colors.primary}>
        <FormField row>
          <FormField label="Teléfono">
            <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.telefono} onChangeText={(v) => update("telefono", v)} keyboardType="phone-pad" placeholder="Ej. 999888777" placeholderTextColor={colors.placeholder} />
          </FormField>
          <FormField label="Correo">
            <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.correo} onChangeText={(v) => update("correo", v)} keyboardType="email-address" autoCapitalize="none" placeholder="email@ejemplo.com" placeholderTextColor={colors.placeholder} />
          </FormField>
        </FormField>
      </FormSection>

      <FormSection title="Ubicación" subtitle="Dirección del productor" icon={User} iconBg="#DBEAFE" iconColor="#2563EB">
        <UbigeoSelect
          departamento={ubigeo.departamento} provincia={ubigeo.provincia} distrito={ubigeo.distrito}
          departamentos={ubigeo.departamentos} provincias={ubigeo.provincias} distritos={ubigeo.distritos}
          loadingDeptos={ubigeo.loadingDeptos} loadingProvs={ubigeo.loadingProvs} loadingDists={ubigeo.loadingDists}
          onDepartamentoChange={(v) => { ubigeo.onDepartamentoChange(v); update("departamento", v); }}
          onProvinciaChange={(v) => { ubigeo.onProvinciaChange(v); update("provincia", v); }}
          onDistritoChange={(v) => { ubigeo.onDistritoChange(v); update("distrito", v); }}
        />
        <FormField row>
          <FormField label="Comunidad *">
            <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.comunidad} onChangeText={(v) => update("comunidad", v)} placeholder="Nombre de la comunidad" placeholderTextColor={colors.placeholder} />
          </FormField>
          <FormField label="Dirección">
            <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.direccion} onChangeText={(v) => update("direccion", v)} placeholder="Dirección específica" placeholderTextColor={colors.placeholder} />
          </FormField>
        </FormField>
      </FormSection>

      <FormSection title="Información Adicional" subtitle="Datos complementarios" icon={User} iconBg="#FEF3C7" iconColor="#D97706">
        <FormField row>
          <SelectField label="Nivel Educativo" value={form.nivelEducativo} options={NIVEL_EDUCATIVO_OPTIONS} onSelect={(v) => update("nivelEducativo", v)} />
          <SelectField label="Idioma Principal" value={form.idiomaPrincipal} options={IDIOMA_OPTIONS} onSelect={(v) => update("idiomaPrincipal", v)} />
        </FormField>
        <FormField label="Organización">
          <TextInput style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.organizacion} onChangeText={(v) => update("organizacion", v)} placeholder="Nombre de la organización" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField row>
          <DatePickerField label="Fecha Ingreso" value={form.fechaIngreso} onChange={(v) => update("fechaIngreso", v)} />
          <SelectField label="Estado" value={form.estado} options={ESTADO_PRODUCTOR_OPTIONS} onSelect={(v) => update("estado", v)} />
        </FormField>
      </FormSection>
    </>
  );

  const stepsContent = [renderStep0, renderStep1, renderStep2];

  if (loading) return <LoadingSpinner text="Cargando..." />;

  return (
    <FormScreenLayout
      title="Productor"
      isEdit
      steps={STEPS}
      currentStep={step}
      onStepChange={setStep}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
    >
      {stepsContent[step]()}
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  addBtn: { flexDirection: "row", alignItems: "center", alignSelf: "flex-end", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, gap: 4, marginBottom: 12 },
  addBtnText: { fontSize: 12, fontWeight: "600" },
  familiarForm: { borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1 },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10, paddingVertical: 12, gap: 6, marginTop: 4 },
  confirmBtnText: { fontSize: 14, fontWeight: "600" },
  familiarCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  familiarAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  familiarInfo: { flex: 1, marginLeft: 10 },
  familiarName: { fontSize: 14, fontWeight: "500" },
  familiarSub: { fontSize: 12, marginTop: 2 },
  deleteBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  emptyContainer: { alignItems: "center", paddingVertical: 24 },
  emptyText: { fontSize: 14, fontWeight: "500", marginTop: 8 },
  emptyHint: { fontSize: 12, marginTop: 4 },
});
