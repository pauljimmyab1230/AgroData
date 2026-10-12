import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Save } from "lucide-react-native";
import { Card, LoadingSpinner } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../utils/toast";
import {
  useOrden,
  useCreateOrden,
  useUpdateOrden,
  useRecetasActivas,
  useReceta,
  useOperacionesActivas,
} from "../hooks/useOrdenes";
import { useRecepciones } from "../hooks/useRecepciones";

const ETAPA_OPTIONS = ["PRIMARIA", "SECUNDARIA", "EMPAQUE"] as const;
const FORMATO_OPTIONS = ["GRANO", "HARINA", "HOJUELA", "POP", "GRANEL", "OTRO"] as const;
const CALIDAD_OPTIONS = ["", "PRIMERA", "SEGUNDA", "TERCERA", "DESCARTE"] as const;

const etapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

const formatoLabels: Record<string, string> = {
  GRANO: "Grano",
  HARINA: "Harina",
  HOJUELA: "Hojuelas",
  POP: "Pop",
  GRANEL: "Granel",
  OTRO: "Otro",
};

const calidadLabels: Record<string, string> = {
  "": "Sin definir",
  PRIMERA: "Primera",
  SEGUNDA: "Segunda",
  TERCERA: "Tercera",
  DESCARTE: "Descarte",
};

const inputStyle = {
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 8,
  color: "#111827",
  backgroundColor: "#FFF",
} as const;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: active ? "#4F46E5" : "#D1D5DB",
        backgroundColor: active ? "#EEF2FF" : "#FFF",
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Text style={{ fontSize: 11, color: active ? "#4F46E5" : "#111827" }}>{label}</Text>
    </TouchableOpacity>
  );
}

interface OpSeleccion {
  operacion_id: number;
  nombre: string;
}

interface RecepcionAsignada {
  recepcion_id: number;
  codigo: string;
  pesoNeto: number | null;
  cantidad_asignada: string;
}

export default function ProcesamientoFormScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const id = route.params?.id as number | undefined;
  const isEdit = !!id;

  const [planta, setPlanta] = useState("Planta San Juan");
  const [responsable, setResponsable] = useState("");
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState("");
  const [etapa, setEtapa] = useState<(typeof ETAPA_OPTIONS)[number]>("PRIMARIA");
  const [formatoSalida, setFormatoSalida] = useState<(typeof FORMATO_OPTIONS)[number]>("GRANO");
  const [recetaId, setRecetaId] = useState<number | null>(null);
  const [productoSalida, setProductoSalida] = useState("");
  const [pesoEntrada, setPesoEntrada] = useState("");
  const [humedadFinal, setHumedadFinal] = useState("");
  const [calidad, setCalidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState("");
  const [operaciones, setOperaciones] = useState<OpSeleccion[]>([]);
  const [recepcionesAsignadas, setRecepcionesAsignadas] = useState<RecepcionAsignada[]>([]);

  const { data: orden, isLoading: loadingOrden } = useOrden(id || null);
  const { data: recetas = [] } = useRecetasActivas(etapa);
  const { data: recetaDetalle } = useReceta(recetaId);
  const { data: catalogoOperaciones = [] } = useOperacionesActivas();
  const { data: recepcionesResult } = useRecepciones({ limit: 50 });
  const createMutation = useCreateOrden();
  const updateMutation = useUpdateOrden();

  useEffect(() => {
    if (isEdit && orden) {
      setPlanta(orden.planta);
      setResponsable(orden.responsable);
      setFechaInicio(orden.fecha_inicio?.slice(0, 10) ?? "");
      setFechaFin(orden.fecha_fin ? orden.fecha_fin.slice(0, 10) : "");
      setEtapa(orden.etapa as any);
      setFormatoSalida(orden.formato_salida as any);
      setRecetaId(orden.receta_id);
      setProductoSalida(orden.producto_salida);
      setPesoEntrada(orden.peso_entrada != null ? String(orden.peso_entrada) : "");
      setHumedadFinal(orden.humedad_final != null ? String(orden.humedad_final) : "");
      setCalidad(orden.calidad ?? "");
      setObservaciones(orden.observaciones ?? "");
      setOperaciones(
        (orden.operaciones ?? []).map((op) => ({
          operacion_id: op.operacion.id,
          nombre: op.operacion.nombre,
        })),
      );
      setRecepcionesAsignadas(
        (orden.recepciones ?? []).map((r) => ({
          recepcion_id: r.recepcion.id,
          codigo: r.recepcion.codigo,
          pesoNeto: r.recepcion.peso_neto ?? null,
          cantidad_asignada: String(r.cantidad_asignada ?? 0),
        })),
      );
    }
  }, [isEdit, orden]);

  useEffect(() => {
    if (recetaDetalle?.operaciones && recetaDetalle.operaciones.length > 0) {
      setOperaciones(
        recetaDetalle.operaciones.map((ro) => ({
          operacion_id: ro.operacion.id,
          nombre: ro.operacion.nombre,
        })),
      );
    }
  }, [recetaDetalle]);

  const toggleOperacion = (op: OpSeleccion) => {
    setOperaciones((prev) => {
      const existe = prev.some((p) => p.operacion_id === op.operacion_id);
      return existe ? prev.filter((p) => p.operacion_id !== op.operacion_id) : [...prev, op];
    });
  };

  const asignarRecepcion = (r: { id: number; codigo: string; pesoNeto: number | null }) => {
    setRecepcionesAsignadas((prev) =>
      prev.some((p) => p.recepcion_id === r.id)
        ? prev.filter((p) => p.recepcion_id !== r.id)
        : [...prev, { recepcion_id: r.id, codigo: r.codigo, pesoNeto: r.pesoNeto, cantidad_asignada: "" }],
    );
  };

  const actualizarAsignada = (recepcionId: number, cantidad: string) => {
    setRecepcionesAsignadas((prev) =>
      prev.map((p) => (p.recepcion_id === recepcionId ? { ...p, cantidad_asignada: cantidad } : p)),
    );
  };

  const handleSubmit = async () => {
    if (!planta.trim() || !responsable.trim() || !productoSalida.trim()) {
      toast.error("Completa planta, responsable y producto de salida");
      return;
    }
    const payload: any = {
      planta: planta.trim(),
      responsable: responsable.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || null,
      etapa,
      formato_salida: formatoSalida,
      receta_id: recetaId,
      producto_salida: productoSalida.trim(),
      peso_entrada: pesoEntrada ? Number(pesoEntrada) : 0,
      humedad_final: humedadFinal ? Number(humedadFinal) : null,
      calidad: calidad || null,
      observaciones: observaciones.trim() || null,
      operaciones: operaciones.map((o, i) => ({ operacion_id: o.operacion_id, orden: i + 1 })),
      recepciones: recepcionesAsignadas
        .filter((r) => r.cantidad_asignada !== "" && Number(r.cantidad_asignada) > 0)
        .map((r) => ({ recepcion_id: r.recepcion_id, cantidad_asignada: Number(r.cantidad_asignada) })),
    };
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        toast.success("Orden actualizada");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Orden creada");
      }
      navigation.navigate("Procesamientos", { refresh: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error;
      toast.error(msg || "No se pudo guardar la orden");
    }
  };

  if (isEdit && loadingOrden) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando orden..." />
      </SafeAreaView>
    );
  }

  const recepciones = recepcionesResult?.data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={{ marginLeft: 6, fontSize: 14, color: colors.text }}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.primary }}
          >
            <Save size={16} color="#FFF" />
            <Text style={{ marginLeft: 6, fontSize: 13, color: "#FFF" }}>{isEdit ? "Guardar" : "Crear"}</Text>
          </TouchableOpacity>
        </View>

        <Card style={{ padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Datos de la orden</Text>

          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Planta</Text>
          <TextInput style={inputStyle} value={planta} onChangeText={setPlanta} />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Responsable</Text>
          <TextInput style={inputStyle} value={responsable} onChangeText={setResponsable} placeholder="Nombre del responsable" />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Fecha inicio (YYYY-MM-DD)</Text>
          <TextInput style={inputStyle} value={fechaInicio} onChangeText={setFechaInicio} />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Fecha fin (opcional)</Text>
          <TextInput style={inputStyle} value={fechaFin} onChangeText={setFechaFin} placeholder="YYYY-MM-DD" />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Etapa</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
            {ETAPA_OPTIONS.map((e) => (
              <Chip key={e} label={etapaLabels[e]} active={etapa === e} onPress={() => setEtapa(e)} />
            ))}
          </View>

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Formato de salida</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
            {FORMATO_OPTIONS.map((f) => (
              <Chip key={f} label={formatoLabels[f]} active={formatoSalida === f} onPress={() => setFormatoSalida(f)} />
            ))}
          </View>

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Producto de salida</Text>
          <TextInput style={inputStyle} value={productoSalida} onChangeText={setProductoSalida} placeholder="Ej. Quinua beneficiada" />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Peso entrada (kg)</Text>
          <TextInput keyboardType="numeric" style={inputStyle} value={pesoEntrada} onChangeText={setPesoEntrada} />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Humedad final (%)</Text>
          <TextInput keyboardType="numeric" style={inputStyle} value={humedadFinal} onChangeText={setHumedadFinal} />

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Calidad</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
            {CALIDAD_OPTIONS.map((c) => (
              <Chip key={c || "vacio"} label={calidadLabels[c]} active={calidad === c} onPress={() => setCalidad(c)} />
            ))}
          </View>

          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Observaciones</Text>
          <TextInput style={inputStyle} value={observaciones} onChangeText={setObservaciones} placeholder="Opcional" />
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Receta (opcional)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Chip label="Sin receta" active={recetaId === null} onPress={() => setRecetaId(null)} />
            {recetas.map((r) => (
              <Chip key={r.id} label={r.nombre} active={recetaId === r.id} onPress={() => setRecetaId(r.id)} />
            ))}
          </View>
          <Text style={{ marginTop: 8, fontSize: 11, color: colors.textMuted }}>
            La receta precarga las operaciones del proceso.
          </Text>
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Operaciones</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {catalogoOperaciones.map((o: any) => {
              const activa = operaciones.some((p) => p.operacion_id === o.id);
              return <Chip key={o.id} label={o.nombre} active={activa} onPress={() => toggleOperacion({ operacion_id: o.id, nombre: o.nombre })} />;
            })}
          </View>
          {operaciones.length > 0 && (
            <Text style={{ marginTop: 8, fontSize: 11, color: colors.textSecondary }}>{operaciones.length} operacion(es) en orden</Text>
          )}
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Recepciones asignadas</Text>
          {recepciones.length === 0 && <Text style={{ fontSize: 12, color: colors.textMuted }}>No hay recepciones disponibles</Text>}
          {recepciones.map((r: any) => {
            const asignada = recepcionesAsignadas.find((p) => p.recepcion_id === r.id);
            return (
              <View key={r.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>{r.codigo}</Text>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                      {r.pesoNeto != null ? `${Number(r.pesoNeto).toLocaleString("es-PE")} kg netos` : "Sin pesaje"}
                    </Text>
                  </View>
                  <Switch
                    value={!!asignada}
                    onValueChange={() => asignarRecepcion({ id: r.id, codigo: r.codigo, pesoNeto: r.pesoNeto ?? null })}
                  />
                </View>
                {!!asignada && (
                  <>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>Cantidad asignada (kg)</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={inputStyle}
                      value={asignada.cantidad_asignada}
                      onChangeText={(t) => actualizarAsignada(r.id, t)}
                      placeholder="0"
                    />
                  </>
                )}
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}