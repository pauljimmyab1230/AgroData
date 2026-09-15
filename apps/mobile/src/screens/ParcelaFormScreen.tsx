import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapPin, Sprout, Layers } from "lucide-react-native";
import * as Location from "expo-location";
import { createParcela, updateParcela, deleteParcela, fetchParcela } from "../services/campo";
import { fetchCatalogo, fetchProductoresOpciones } from "../services/catalogos";
import { SelectField } from "../components/ui/SelectField";
import { MapaInteractivo, PolygonMap } from "../components/map/Mapas";
import { UbigeoSelect } from "../components/ui/UbigeoSelect";
import { DatePickerField } from "../components/ui/DatePickerField";
import { useUbigeo } from "../hooks/useUbigeo";
import { LoadingSpinner } from "../components/ui";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import { ESTADO_PARCELA_OPTIONS, ACREDITACION_OPTIONS } from "../constants/options";
import { latLngToUtm } from "../utils/utm";
import type { CampoStackParamList } from "../navigation/types";

const STEPS = ["Datos Generales", "Ubicación", "Polígono"] as const;

type FormScreenRouteProp = RouteProp<CampoStackParamList, "ParcelaForm">;
type FormScreenNavigationProp = NativeStackNavigationProp<CampoStackParamList, "ParcelaForm">;

interface FormData {
  codigo: string;
  nombre: string;
  productorId: string;
  area: string;
  areaCertificada: string;
  cultivo: string;
  estado: string;
  acreditacion: string;
  sector: string;
  tipoSuelo: string;
  textura: string;
  pendiente: string;
  fuenteAgua: string;
  sistemaRiego: string;
  zonaAgroecologica: string;
  disponibilidadAgua: string;
  observaciones: string;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  centroPoblado: string;
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  utmEste: string;
  utmNorte: string;
  utmZona: string;
  poligono: number[][];
  fechaLevantamiento: string;
  responsable: string;
}

const initialForm: FormData = {
  codigo: "", nombre: "", productorId: "", area: "", areaCertificada: "",
  cultivo: "", estado: "ACTIVA", acreditacion: "",
  sector: "",
  tipoSuelo: "", textura: "", pendiente: "", fuenteAgua: "",
  sistemaRiego: "", zonaAgroecologica: "", disponibilidadAgua: "", observaciones: "",
  departamento: "", provincia: "", distrito: "", comunidad: "", centroPoblado: "",
  latitud: "", longitud: "", altitud: "", precisionGps: "",
  utmEste: "", utmNorte: "", utmZona: "",
  poligono: [], fechaLevantamiento: "", responsable: "",
};

function parsePolygonSafe(raw: unknown): number[][] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
}

export default function ParcelaFormScreen() {
  const navigation = useNavigation<FormScreenNavigationProp>();
  const route = useRoute<FormScreenRouteProp>();
  const { colors } = useTheme();
  const editId = route.params?.id;
  const isEdit = !!editId;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [productores, setProductores] = useState<{ id: number; label: string }[]>([]);
  const [catalogos, setCatalogos] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState<FormData>(initialForm);
  const ubigeo = useUbigeo();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prods, tsuelo, fagua, sriego, zagec] = await Promise.all([
          fetchProductoresOpciones(),
          fetchCatalogo("tipos-suelo"),
          fetchCatalogo("fuentes-agua"),
          fetchCatalogo("sistemas-riego"),
          fetchCatalogo("zonas-agroecologicas"),
        ]);
        if (!cancelled) {
          setProductores(prods);
          setCatalogos({ "tipos-suelo": tsuelo, "fuentes-agua": fagua, "sistemas-riego": sriego, "zonas-agroecologicas": zagec });
        }
      } catch {
        if (!cancelled) Alert.alert("Error", "No se pudieron cargar los catálogos");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    const controller = new AbortController();
    (async () => {
      try {
        const p = await fetchParcela(editId, controller.signal);
        if (cancelled) return;
        setForm({
          codigo: p.codigo,
          nombre: p.nombre,
          productorId: String(p.productorId || ""),
          area: String(p.area || ""),
          areaCertificada: String(p.areaCertificada || ""),
          cultivo: p.cultivo || "",
          estado: p.estado,
          acreditacion: p.acreditacion || "",
          sector: p.sector || "",
          tipoSuelo: p.tipoSuelo || "",
          textura: p.textura || "",
          pendiente: p.pendiente || "",
          fuenteAgua: p.fuenteAgua || "",
          sistemaRiego: p.sistemaRiego || "",
          zonaAgroecologica: p.zonaAgroecologica || "",
          disponibilidadAgua: p.disponibilidadAgua || "",
          observaciones: p.observaciones || "",
          departamento: p.departamento || "",
          provincia: p.provincia || "",
          distrito: p.distrito || "",
          comunidad: p.comunidad || "",
          centroPoblado: p.centroPoblado || "",
          latitud: p.latitud || "",
          longitud: p.longitud || "",
          altitud: p.altitud || "",
          precisionGps: p.precisionGps || "",
          utmEste: p.utmEste || "",
          utmNorte: p.utmNorte || "",
          utmZona: p.utmZona || "",
          poligono: parsePolygonSafe(p.poligono),
          fechaLevantamiento: p.fechaLevantamiento || "",
          responsable: p.responsable || "",
        });
        if (p.departamento) ubigeo.onDepartamentoChange(p.departamento);
        if (p.provincia) setTimeout(() => ubigeo.onProvinciaChange(p.provincia), 100);
        if (p.distrito) setTimeout(() => ubigeo.onDistritoChange(p.distrito), 200);
      } catch {
        if (!cancelled) Alert.alert("Error", "No se pudo cargar la parcela");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; controller.abort(); };
  }, [editId]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGetLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permiso requerido", "Activa el permiso de ubicación"); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      const utm = latLngToUtm(lat, lng);
      const altitud = loc.coords.altitude ? String(Math.round(loc.coords.altitude)) : "";
      setForm((prev) => ({
        ...prev,
        latitud: String(lat),
        longitud: String(lng),
        altitud: altitud || prev.altitud,
        utmEste: utm.este,
        utmNorte: utm.norte,
        utmZona: utm.zona,
      }));
    } catch {
      Alert.alert("Error", "No se pudo obtener la ubicación. Toca en el mapa.");
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.nombre?.trim()) { Alert.alert("Error", "El nombre es obligatorio"); return; }
    if (!form.productorId) { Alert.alert("Error", "El productor es obligatorio"); return; }
    const areaNum = form.area ? Number(form.area) : 0;
    if (form.area && !Number.isFinite(areaNum)) { Alert.alert("Error", "El área debe ser un número válido"); return; }
    if (areaNum <= 0) { Alert.alert("Error", "El área total debe ser mayor a 0"); return; }
    if (!form.cultivo?.trim()) { Alert.alert("Error", "El cultivo principal es obligatorio"); return; }
    if (form.areaCertificada) {
      const certNum = Number(form.areaCertificada);
      if (!Number.isFinite(certNum) || certNum < 0) {
        Alert.alert("Error", "El área certificada debe ser un número válido mayor o igual a 0");
        return;
      }
      if (certNum > areaNum) {
        Alert.alert("Error", "El área certificada no puede ser mayor al área total");
        return;
      }
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        area: areaNum,
        areaCertificada: form.areaCertificada ? Number(form.areaCertificada) : null,
        productorId: Number(form.productorId),
      };
      if (isEdit) { await updateParcela(editId, data); }
      else { await createParcela(data); }
      Alert.alert("Éxito", isEdit ? "Parcela actualizada" : "Parcela creada", [
        { text: "OK", onPress: () => navigation.navigate("Parcelas", { refresh: true }) },
      ]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      const errors = axiosErr?.response?.data?.errors;
      let message = axiosErr?.response?.data?.message || "Error al guardar la parcela";
      if (errors && Array.isArray(errors) && errors.length > 0) {
        message = errors.map((e: { message: string }) => e.message).join('\n');
      }
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  }, [form, isEdit, editId, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert("Eliminar Parcela", `¿Eliminar ${form.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteParcela(editId!); navigation.navigate("Parcelas", { refresh: true }); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  }, [form.nombre, editId, navigation]);

  const renderStep0 = () => (
    <View>
      <FormSection
        title="Datos Generales"
        subtitle="Información básica de la parcela"
        icon={MapPin}
        iconBg={colors.primaryLight}
        iconColor={colors.warning}
      >
        <View>
          <FormField label="Nombre *">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.nombre}
              onChangeText={(v) => update("nombre", v)}
              placeholder="Nombre de la parcela"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
          <FormField label="Productor *">
            <SelectField
              label="Productor *"
              value={productores.find(p => String(p.id) === form.productorId)?.label || ""}
              options={productores.map(p => p.label)}
              onSelect={(v) => { const p = productores.find(x => x.label === v); if (p) update("productorId", String(p.id)); }}
            />
          </FormField>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Área Total (ha) *">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.area}
                  onChangeText={(v) => update("area", v)}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Área Certificada (ha)">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.areaCertificada}
                  onChangeText={(v) => update("areaCertificada", v)}
                  keyboardType="numeric"
                  placeholder="Opcional"
                  placeholderTextColor={colors.textMuted}
                />
              </FormField>
            </View>
          </View>
          <FormField label="Cultivo Principal *">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.cultivo}
              onChangeText={(v) => update("cultivo", v)}
              placeholder="Ej. Quinua, Papa"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Estado"
                value={form.estado}
                options={ESTADO_PARCELA_OPTIONS}
                onSelect={(v) => update("estado", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Acreditación"
                value={form.acreditacion}
                options={ACREDITACION_OPTIONS}
                onSelect={(v) => update("acreditacion", v)}
              />
            </View>
          </View>
        </View>
      </FormSection>

      <FormSection
        title="Info Agroecológica"
        subtitle="Características del suelo y agua"
        icon={Sprout}
        iconBg="#ECFDF5"
        iconColor={colors.success}
      >
        <View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Tipo de Suelo"
                value={form.tipoSuelo}
                options={catalogos["tipos-suelo"] || []}
                onSelect={(v) => update("tipoSuelo", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Textura"
                value={form.textura}
                options={["FRANCA", "ARENOSA", "LIMOSA", "ARCILLOSA", "FRANCO-ARENOSA", "FRANCO-LIMOSA", "FRANCO-ARCILLOSA"]}
                onSelect={(v) => update("textura", v)}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Pendiente"
                value={form.pendiente}
                options={["PLANA", "SUAVE", "MODERADA", "PRONUNCIADA", "MUY_PRONUNCIADA"]}
                onSelect={(v) => update("pendiente", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Disponibilidad Agua"
                value={form.disponibilidadAgua}
                options={["ABUNDANTE", "MEDIA", "ESCASA", "MUY_ESCASA"]}
                onSelect={(v) => update("disponibilidadAgua", v)}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Fuente de Agua"
                value={form.fuenteAgua}
                options={catalogos["fuentes-agua"] || []}
                onSelect={(v) => update("fuenteAgua", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Sistema de Riego"
                value={form.sistemaRiego}
                options={catalogos["sistemas-riego"] || []}
                onSelect={(v) => update("sistemaRiego", v)}
              />
            </View>
          </View>
          <SelectField
            label="Zona Agroecológica"
            value={form.zonaAgroecologica}
            options={catalogos["zonas-agroecologicas"] || []}
            onSelect={(v) => update("zonaAgroecologica", v)}
          />
          <FormField label="Observaciones">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface, height: 80 }}
              value={form.observaciones}
              onChangeText={(v) => update("observaciones", v)}
              multiline
              textAlignVertical="top"
              placeholder="Notas adicionales..."
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
        </View>
      </FormSection>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <FormSection
        title="Ubicación Administrativa"
        icon={MapPin}
        iconBg={colors.primaryLight}
        iconColor={colors.primary}
      >
        <View>
          <UbigeoSelect
            departamento={ubigeo.departamento}
            provincia={ubigeo.provincia}
            distrito={ubigeo.distrito}
            departamentos={ubigeo.departamentos}
            provincias={ubigeo.provincias}
            distritos={ubigeo.distritos}
            loadingDeptos={ubigeo.loadingDeptos}
            loadingProvs={ubigeo.loadingProvs}
            loadingDists={ubigeo.loadingDists}
            onDepartamentoChange={(v) => { ubigeo.onDepartamentoChange(v); update("departamento", v); }}
            onProvinciaChange={(v) => { ubigeo.onProvinciaChange(v); update("provincia", v); }}
            onDistritoChange={(v) => { ubigeo.onDistritoChange(v); update("distrito", v); }}
          />
          <FormField label="Comunidad">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.comunidad}
              onChangeText={(v) => update("comunidad", v)}
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
          <FormField label="Centro Poblado">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.centroPoblado}
              onChangeText={(v) => update("centroPoblado", v)}
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
          <FormField label="Sector">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.sector}
              onChangeText={(v) => update("sector", v)}
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
        </View>
      </FormSection>

      <FormSection
        title="Coordenadas GPS y UTM"
        icon={MapPin}
        iconBg="#ECFDF5"
        iconColor={colors.primary}
      >
        <View>
          <MapaInteractivo
            latitud={form.latitud ? Number(form.latitud) : null}
            longitud={form.longitud ? Number(form.longitud) : null}
            onLocationChange={(lat, lng) => {
              const utm = latLngToUtm(lat, lng);
              setForm((prev) => ({ ...prev, latitud: String(lat), longitud: String(lng), utmEste: utm.este, utmNorte: utm.norte, utmZona: utm.zona }));
            }}
            onGetLocation={handleGetLocation}
            loadingLocation={loadingLocation}
            height={220}
          />
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
            WGS84 · UTM {form.utmZona || "18S"}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Latitud">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.latitud}
                  onChangeText={(v) => update("latitud", v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Longitud">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.longitud}
                  onChangeText={(v) => update("longitud", v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Altitud (m)">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.altitud}
                  onChangeText={(v) => update("altitud", v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Precisión GPS">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.precisionGps}
                  onChangeText={(v) => update("precisionGps", v)}
                  placeholder="± 5 m"
                  placeholderTextColor={colors.textMuted}
                />
              </FormField>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 8, marginBottom: 4 }}>
            Georreferenciación UTM
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Este (X)">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.utmEste}
                  onChangeText={(v) => update("utmEste", v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Norte (Y)">
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
                  value={form.utmNorte}
                  onChangeText={(v) => update("utmNorte", v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>
          </View>
          <FormField label="Zona UTM">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface, width: "30%" }}
              value={form.utmZona}
              onChangeText={(v) => update("utmZona", v)}
            />
          </FormField>
        </View>
      </FormSection>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <FormSection
        title="Polígono"
        icon={Layers}
        iconBg={colors.primaryLight}
        iconColor={colors.primary}
      >
        <View>
          <PolygonMap
            latitud={form.latitud ? Number(form.latitud) : null}
            longitud={form.longitud ? Number(form.longitud) : null}
            poligono={form.poligono}
            onPolygonChange={(coords) => update("poligono", coords)}
            onLocationChange={(lat, lng) => setForm((prev) => ({ ...prev, latitud: String(lat), longitud: String(lng) }))}
            onGetLocation={handleGetLocation}
            loadingLocation={loadingLocation}
            height={260}
          />
          <DatePickerField
            label="Fecha de Levantamiento"
            value={form.fechaLevantamiento}
            onChange={(v) => update("fechaLevantamiento", v)}
          />
          <FormField label="Responsable">
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text, backgroundColor: colors.surface }}
              value={form.responsable}
              onChangeText={(v) => update("responsable", v)}
              placeholderTextColor={colors.textMuted}
            />
          </FormField>
        </View>
      </FormSection>

      <FormSection title="Resumen">
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Área:</Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.area || "—"} ha</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Cultivo:</Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.cultivo || "—"}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Estado:</Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.estado}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Ubicación:</Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.comunidad || "—"}, {form.distrito || "—"}</Text>
          </View>
          {form.latitud && form.longitud && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>Coordenadas:</Text>
              <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.latitud}, {form.longitud}</Text>
            </View>
          )}
          {form.poligono.length > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>Polígono:</Text>
              <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{form.poligono.length} vértices</Text>
            </View>
          )}
        </View>
      </FormSection>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2];

  if (loading) {
    return (
      <FormScreenLayout
        title="Parcela"
        isEdit={isEdit}
        onBack={() => navigation.goBack()}
        onSave={() => {}}
        saving={false}
      >
        <LoadingSpinner text="Cargando..." />
      </FormScreenLayout>
    );
  }

  return (
    <FormScreenLayout
      title="Parcela"
      isEdit={isEdit}
      steps={STEPS as unknown as string[]}
      currentStep={step}
      onStepChange={setStep}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onDelete={isEdit ? handleDelete : undefined}
      saving={saving}
    >
      {steps[step]()}
    </FormScreenLayout>
  );
}
