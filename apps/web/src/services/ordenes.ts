import api from "./api";

// ==================== Tipos ====================
export interface OperacionProceso {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
}

export interface RecetaOperacion {
  id: number;
  orden: number;
  requerida: boolean;
  parametros_default: string | null;
  operacion: OperacionProceso;
}

export interface Receta {
  id: number;
  codigo: string;
  nombre: string;
  producto_base: string;
  etapa: EtapaProceso;
  formato_salida: FormatoSalida | null;
  descripcion: string | null;
  activo: boolean;
  operaciones?: RecetaOperacion[];
}

export type EtapaProceso = "PRIMARIA" | "SECUNDARIA" | "EMPAQUE";
export type EstadoOrden = "BORRADOR" | "EN_PROCESO" | "FINALIZADO" | "PAUSADA" | "CANCELADA";
export type TipoSalida = "PRODUCTO_BUENO" | "MERMA" | "PIEDRAS" | "SAPONINA" | "ENVASE" | "OTRO";
export type FormatoSalida = "GRANO" | "HARINA" | "HOJUELA" | "POP" | "GRANEL" | "OTRO";
export type DestinoSalida = "KARDEX" | "DESCARTE" | "REPROCESO" | "SUBPRODUCTO" | "VENTA_DIRECTA";
export type UnidadMedida = "KG" | "UNIDAD" | "LT";
export type CalidadProducto = "PRIMERA" | "SEGUNDA" | "TERCERA" | "DESCARTE";

export interface OrdenOperacion {
  id: number;
  orden: number;
  fecha: string;
  operario: string | null;
  peso_antes: number | null;
  peso_despues: number | null;
  humedad: number | null;
  resultado: string | null;
  observaciones: string | null;
  completada: boolean;
  operacion: { id: number; codigo: string; nombre: string };
}

export interface OrdenSalida {
  id: number;
  tipo_salida: TipoSalida;
  descripcion: string;
  cantidad: number;
  unidad: UnidadMedida;
  humedad: number | null;
  destino: DestinoSalida;
  cuenta_en_balance: boolean;
  observaciones: string | null;
}

export interface OrdenRecepcion {
  id: number;
  cantidad_asignada: number;
  observaciones: string | null;
  recepcion: { id: number; codigo: string; lote_productor: string | null; peso_neto: number | null };
}

export interface OrdenProcesamiento {
  id: number;
  codigo: string;
  planta: string;
  responsable: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: EstadoOrden;
  etapa: EtapaProceso;
  formato_salida: FormatoSalida;
  receta_id: number | null;
  orden_origen_id: number | null;
  producto_salida: string;
  peso_entrada: number;
  peso_salida_total: number;
  merma_total: number;
  rendimiento: number;
  humedad_final: number | null;
  calidad: CalidadProducto | null;
  balance_ok: boolean;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  receta?: { id: number; codigo: string; nombre: string; producto_base: string; etapa: EtapaProceso; formato_salida: FormatoSalida | null } | null;
  orden_origen?: { id: number; codigo: string; producto_salida: string; etapa: EtapaProceso } | null;
  operaciones?: OrdenOperacion[];
  salidas?: OrdenSalida[];
  recepciones?: OrdenRecepcion[];
}

export interface BalanceOrden {
  orden_id: number;
  codigo: string;
  peso_entrada: number;
  suma_salidas: number;
  diferencia: number;
  diferencia_pct: number;
  tolerancia_pct: number;
  balance_ok: boolean;
  por_tipo: Record<string, number>;
  salidas: OrdenSalida[];
  recepciones: OrdenRecepcion[];
}

export interface OrdenStats {
  total_ordenes: number;
  por_estado: Record<string, number>;
  por_etapa: Record<string, number>;
  kg_procesados: number;
  kg_a_kardex: number;
}

export interface OrdenInput {
  planta: string;
  responsable: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  etapa: EtapaProceso;
  formato_salida?: FormatoSalida;
  receta_id?: number | null;
  orden_origen_id?: number | null;
  producto_salida: string;
  peso_entrada?: number;
  humedad_final?: number | null;
  calidad?: CalidadProducto | null;
  observaciones?: string | null;
  operaciones?: { operacion_id: number; orden?: number }[];
  recepciones?: { recepcion_id: number; cantidad_asignada: number; observaciones?: string }[];
}

export interface SalidaInput {
  tipo_salida: TipoSalida;
  descripcion: string;
  cantidad: number;
  unidad?: UnidadMedida;
  humedad?: number | null;
  destino?: DestinoSalida;
  cuenta_en_balance?: boolean;
  observaciones?: string | null;
}

export interface OperacionEjecutadaInput {
  operacion_id: number;
  orden?: number;
  fecha?: string;
  operario?: string | null;
  peso_antes?: number | null;
  peso_despues?: number | null;
  humedad?: number | null;
  resultado?: string | null;
  observaciones?: string | null;
  completada?: boolean;
}

// ==================== Operaciones de proceso ====================
export async function fetchOperaciones(params?: {
  search?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: OperacionProceso[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await api.get("/operaciones-proceso", { params });
  return {
    data: res.data.data ?? [],
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 100,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchOperacionesActivas(): Promise<OperacionProceso[]> {
  const res = await api.get("/operaciones-proceso/activas");
  return res.data.data ?? [];
}

export async function fetchOperacion(id: number): Promise<OperacionProceso> {
  const res = await api.get(`/operaciones-proceso/${id}`);
  return res.data.data;
}

export async function createOperacion(data: {
  codigo: string;
  nombre: string;
  descripcion?: string;
  orden?: number;
  activo?: boolean;
}): Promise<OperacionProceso> {
  const res = await api.post("/operaciones-proceso", data);
  return res.data.data;
}

export async function updateOperacionCatalogo(
  id: number,
  data: Partial<{ codigo: string; nombre: string; descripcion: string; orden: number; activo: boolean }>,
): Promise<OperacionProceso> {
  const res = await api.put(`/operaciones-proceso/${id}`, data);
  return res.data.data;
}

export async function deleteOperacionCatalogo(id: number): Promise<void> {
  await api.delete(`/operaciones-proceso/${id}`);
}

// ==================== Recetas ====================
export async function fetchRecetas(params?: {
  search?: string;
  etapa?: string;
  producto_base?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: Receta[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await api.get("/recetas", { params });
  return {
    data: res.data.data ?? [],
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 50,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchRecetasActivas(etapa?: string): Promise<Receta[]> {
  const res = await api.get("/recetas/activas", { params: etapa ? { etapa } : {} });
  return res.data.data ?? [];
}

export async function fetchReceta(id: number): Promise<Receta> {
  const res = await api.get(`/recetas/${id}`);
  return res.data.data;
}

export async function createReceta(data: {
  codigo: string;
  nombre: string;
  producto_base: string;
  etapa: EtapaProceso;
  formato_salida?: FormatoSalida | null;
  descripcion?: string;
  activo?: boolean;
  operaciones?: { operacion_id: number; orden?: number; requerida?: boolean }[];
}): Promise<Receta> {
  const res = await api.post("/recetas", data);
  return res.data.data;
}

export async function updateReceta(
  id: number,
  data: Partial<{
    codigo: string;
    nombre: string;
    producto_base: string;
    etapa: EtapaProceso;
    formato_salida: FormatoSalida | null;
    descripcion: string;
    activo: boolean;
    operaciones: { operacion_id: number; orden?: number; requerida?: boolean }[];
  }>,
): Promise<Receta> {
  const res = await api.put(`/recetas/${id}`, data);
  return res.data.data;
}

export async function deleteReceta(id: number): Promise<void> {
  await api.delete(`/recetas/${id}`);
}

// ==================== Órdenes ====================
export async function fetchOrdenes(params?: {
  search?: string;
  estado?: string;
  etapa?: string;
  formato_salida?: string;
  receta_id?: number;
  page?: number;
  limit?: number;
}): Promise<{ data: OrdenProcesamiento[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await api.get("/ordenes-procesamiento", { params });
  return {
    data: res.data.data ?? [],
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchOrden(id: number): Promise<OrdenProcesamiento> {
  const res = await api.get(`/ordenes-procesamiento/${id}`);
  return res.data.data;
}

export async function fetchBalance(id: number): Promise<BalanceOrden> {
  const res = await api.get(`/ordenes-procesamiento/${id}/balance`);
  return res.data.data;
}

export async function fetchTrazabilidad(id: number): Promise<Record<string, unknown>> {
  const res = await api.get(`/ordenes-procesamiento/${id}/trazabilidad`);
  return res.data.data;
}

export async function fetchOrdenStats(): Promise<OrdenStats> {
  const res = await api.get("/ordenes-procesamiento/stats");
  return res.data.data;
}

export async function createOrden(data: OrdenInput): Promise<OrdenProcesamiento> {
  const res = await api.post("/ordenes-procesamiento", data);
  return res.data.data;
}

export async function updateOrden(id: number, data: Partial<OrdenInput>): Promise<OrdenProcesamiento> {
  const res = await api.put(`/ordenes-procesamiento/${id}`, data);
  return res.data.data;
}

export async function deleteOrden(id: number): Promise<void> {
  await api.delete(`/ordenes-procesamiento/${id}`);
}

export async function addOperacion(ordenId: number, data: OperacionEjecutadaInput): Promise<OrdenOperacion> {
  const res = await api.post(`/ordenes-procesamiento/${ordenId}/operaciones`, data);
  return res.data.data;
}

export async function updateOperacion(
  ordenId: number,
  operacionOrdenId: number,
  data: Partial<OperacionEjecutadaInput>,
): Promise<OrdenOperacion> {
  const res = await api.put(`/ordenes-procesamiento/${ordenId}/operaciones/${operacionOrdenId}`, data);
  return res.data.data;
}

export async function removeOperacion(ordenId: number, operacionOrdenId: number): Promise<void> {
  await api.delete(`/ordenes-procesamiento/${ordenId}/operaciones/${operacionOrdenId}`);
}

export async function addSalida(ordenId: number, data: SalidaInput): Promise<OrdenSalida> {
  const res = await api.post(`/ordenes-procesamiento/${ordenId}/salidas`, data);
  return res.data.data;
}

export async function updateSalida(ordenId: number, salidaId: number, data: Partial<SalidaInput>): Promise<OrdenSalida> {
  const res = await api.put(`/ordenes-procesamiento/${ordenId}/salidas/${salidaId}`, data);
  return res.data.data;
}

export async function removeSalida(ordenId: number, salidaId: number): Promise<void> {
  await api.delete(`/ordenes-procesamiento/${ordenId}/salidas/${salidaId}`);
}

export async function finalizarOrden(id: number): Promise<OrdenProcesamiento> {
  const res = await api.post(`/ordenes-procesamiento/${id}/finalizar`);
  return res.data.data;
}

export async function encadenarOrden(id: number, data: OrdenInput): Promise<OrdenProcesamiento> {
  const res = await api.post(`/ordenes-procesamiento/${id}/encadenar`, data);
  return res.data.data;
}
