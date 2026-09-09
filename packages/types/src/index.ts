// ─── Branded Types (re-export) ──────────────────────────────
export * from './branded';

// ─── Users ──────────────────────────────────────────────────
export type Rol = 'ADMIN' | 'USER';
export type RolSic = 'RESPONSABLE_SIC' | 'INSPECTOR' | 'COMITE_DECISION' | 'TECNICO_CAMPO' | 'ACOPIADOR' | 'CAPACITADOR';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rol_sic: RolSic | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Productores ────────────────────────────────────────────
export type Sexo = 'MASCULINO' | 'FEMENINO';
export type EstadoCivil = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'CONVIVIENTE';
export type NivelEducativo = 'NINGUNO' | 'PRIMARIA' | 'SECUNDARIA' | 'SUPERIOR' | 'UNIVERSITARIO';
export type EstadoProductor = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface Productor {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: Sexo;
  fecha_nacimiento: string;
  estado_civil: EstadoCivil;
  nivel_educativo: NivelEducativo;
  idioma: string;
  comunidad: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: EstadoProductor;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Parcelas ───────────────────────────────────────────────
export type EstadoParcela = 'ACTIVA' | 'INACTIVA';
export type CertificacionParcela = 'ORGANICA' | 'EN_TRANSICION' | 'CONVENCIONAL';

export interface Parcela {
  id: number;
  productor_id: number;
  codigo: string;
  nombre: string;
  cultivo: string;
  area: number;
  area_certificada: number | null;
  area_unidad: string;
  acreditacion: string | null;
  ubicacion: string | null;
  comunidad: string | null;
  sector: string | null;
  altitud: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  centro_poblado: string | null;
  ubigeo: string | null;
  ubigeo_id: number | null;
  latitud: string | null;
  longitud: string | null;
  precision_gps: string | null;
  utm_este: string | null;
  utm_norte: string | null;
  utm_zona: string | null;
  tipo_suelo: string | null;
  textura: string | null;
  pendiente: string | null;
  fuente_agua: string | null;
  sistema_riego: string | null;
  zona_agroecologica: string | null;
  disponibilidad_agua: string | null;
  observaciones: string | null;
  area_calculada: string | null;
  perimetro: string | null;
  vertices: number | null;
  poligono: [number, number][] | null;
  fecha_levantamiento: string | null;
  responsable: string | null;
  certificacion: CertificacionParcela;
  estado: EstadoParcela;
  activo: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ─── GeoJSON ────────────────────────────────────────────────
export type GeoJsonPosition = [number, number] | [number, number, number];

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: GeoJsonPosition;
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: GeoJsonPosition[][];
}

export interface GeoJsonMultiPolygon {
  type: 'MultiPolygon';
  coordinates: GeoJsonPosition[][][];
}

export type GeoJsonGeometry = GeoJsonPoint | GeoJsonPolygon | GeoJsonMultiPolygon;

export interface GeoJsonFeature<G extends GeoJsonGeometry = GeoJsonGeometry> {
  type: 'Feature';
  geometry: G;
  properties: Record<string, unknown>;
}

export interface GeoJsonFeatureCollection<G extends GeoJsonGeometry = GeoJsonGeometry> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<G>[];
}

export function coordsToGeoJsonPolygon(coords: [number, number][]): GeoJsonPolygon {
  const closed =
    coords.length > 0 &&
    coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1];
  const ring = closed ? coords : [...coords, coords[0]];
  return {
    type: 'Polygon',
    coordinates: [ring.map(([lat, lng]) => [lng, lat] as GeoJsonPosition)],
  };
}

export function geoJsonPolygonToCoords(geojson: GeoJsonPolygon): [number, number][] {
  const ring = geojson.coordinates[0];
  const coords = ring.map(([lng, lat]) => [lat, lng] as [number, number]);
  if (coords.length > 1 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1]) {
    return coords.slice(0, -1);
  }
  return coords;
}

// ─── Campañas ───────────────────────────────────────────────
export type EstadoCampania = 'PLANIFICADA' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

export const ESTADO_CAMPANIA_VALUES: readonly EstadoCampania[] = ['PLANIFICADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA'];

export interface Campania {
  id: number;
  codigo: string;
  nombre: string;
  anio_agricola: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string | null;
  estado: EstadoCampania;
  responsable: string;
  tecnico_coordinador: string;
  objetivo: string | null;
  permitir_cultivos: boolean;
  permitir_actividades: boolean;
  permitir_cosechas: boolean;
  permitir_inspecciones: boolean;
  permitir_acopio: boolean;
  permitir_procesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string | null;
  activo: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export type CampaniaPermisoModulo =
  | 'permitir_cultivos'
  | 'permitir_actividades'
  | 'permitir_cosechas'
  | 'permitir_inspecciones'
  | 'permitir_acopio'
  | 'permitir_procesamiento';

export interface CreateCampaniaInput {
  codigo?: string;
  nombre: string;
  anio_agricola: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion?: string | null;
  estado?: EstadoCampania;
  responsable: string;
  tecnico_coordinador: string;
  objetivo: string;
  permitir_cultivos?: boolean;
  permitir_actividades?: boolean;
  permitir_cosechas?: boolean;
  permitir_inspecciones?: boolean;
  permitir_acopio?: boolean;
  permitir_procesamiento?: boolean;
  visible?: boolean;
  activa?: boolean;
  observaciones?: string | null;
}

export interface UpdateCampaniaInput {
  codigo?: string;
  nombre?: string;
  anio_agricola?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  descripcion?: string | null;
  estado?: EstadoCampania;
  responsable?: string;
  tecnico_coordinador?: string;
  objetivo?: string | null;
  permitir_cultivos?: boolean;
  permitir_actividades?: boolean;
  permitir_cosechas?: boolean;
  permitir_inspecciones?: boolean;
  permitir_acopio?: boolean;
  permitir_procesamiento?: boolean;
  visible?: boolean;
  activa?: boolean;
  observaciones?: string | null;
}

export interface CampaniaFilters {
  search?: string;
  estado?: EstadoCampania;
  anio_agricola?: string;
  page?: number;
  limit?: number;
}

export interface CampaniaStats {
  productores: number;
  parcelas: number;
  cultivos: number;
  areaSembrada: number;
  actividades: number;
  inspecciones: number;
  acopios: number;
  cultivosPorTipo: Record<string, number>;
}

export interface CampaniaGlobalStats {
  total: number;
  estados: Record<EstadoCampania, number>;
}

export interface CampaniaTimelineEvent {
  id: string;
  tipo: 'cultivo' | 'actividad' | 'inspeccion' | 'acopio';
  titulo: string;
  descripcion: string;
  fecha: string;
}

// ─── Cultivos ───────────────────────────────────────────────
export type EstadoCultivo = 'EN_CRECIMIENTO' | 'COSECHADO' | 'PERDIDO';

export const ESTADO_CULTIVO_VALUES: readonly EstadoCultivo[] = ['EN_CRECIMIENTO', 'COSECHADO', 'PERDIDO'];

export type MetodoSiembra = 'DIRECTA' | 'TRASPLANTE' | 'ALMACIGO' | 'OTRO';
export type SistemaProductivo = 'AGROECOLOGICO' | 'ORGANICO' | 'CONVENCIONAL' | 'EN_TRANSICION';
export type TipoAgricultura = 'TRADICIONAL' | 'TECNIFICADA' | 'MIXTA';
export type CertificacionCultivo = 'ORGANICA' | 'EN_TRANSICION' | 'SIN_CERTIFICAR';
export type ProcedenciaSemilla = 'CERTIFICADA' | 'COMUN' | 'PRODUCIDA_EN_CAMPO' | 'CONSERVADA_POR_AGRICULTOR';
export type DestinoProduccion = 'VENTA_COOPERATIVA' | 'COMERCIALIZACION_LOCAL' | 'AUTOCONSUMO' | 'SEMILLA';

export interface Cultivo {
  id: number;
  codigo: string;
  cultivo: string;
  variedad: string | null;
  area_sembrada: number | null;
  fecha_siembra: string | null;
  metodo_siembra: MetodoSiembra | null;
  sistema_productivo: SistemaProductivo | null;
  tipo_agricultura: TipoAgricultura | null;
  certificacion: CertificacionCultivo;
  procedencia_semilla: ProcedenciaSemilla | null;
  cantidad_semilla: number | null;
  unidad_semilla: string | null;
  fecha_cosecha: string | null;
  estado: EstadoCultivo;
  observaciones: string | null;
  rendimiento_esperado: number | null;
  produccion_estimada: number | null;
  destino_produccion: DestinoProduccion | null;
  distanciamiento_surcos: string | null;
  distanciamiento_plantas: string | null;
  densidad_siembra: string | null;
  tipo_semilla: string | null;
  lote_semilla: string | null;
  proveedor_semilla: string | null;
  activo: boolean;
  campanias_id: number;
  parcela_id: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CultivoConRelaciones extends Cultivo {
  campania: Pick<Campania, 'id' | 'nombre' | 'codigo'>;
  parcela: Pick<Parcela, 'id' | 'nombre' | 'codigo' | 'cultivo' | 'area'> & {
    productor: Pick<Productor, 'id' | 'nombres' | 'apellido_paterno' | 'apellido_materno' | 'codigo'>;
  };
}

export interface CreateCultivoInput {
  campania_id: number;
  parcela_id: number;
  cultivo: string;
  variedad?: string | null;
  area_sembrada?: number | null;
  fecha_siembra?: string | null;
  metodo_siembra?: MetodoSiembra | null;
  sistema_productivo?: SistemaProductivo | null;
  tipo_agricultura?: TipoAgricultura | null;
  certificacion?: CertificacionCultivo;
  procedencia_semilla?: ProcedenciaSemilla | null;
  cantidad_semilla?: number | null;
  unidad_semilla?: string | null;
  fecha_cosecha?: string | null;
  estado?: EstadoCultivo;
  observaciones?: string | null;
  rendimiento_esperado?: number | null;
  produccion_estimada?: number | null;
  destino_produccion?: DestinoProduccion | null;
  distanciamiento_surcos?: string | null;
  distanciamiento_plantas?: string | null;
  densidad_siembra?: string | null;
  tipo_semilla?: string | null;
  lote_semilla?: string | null;
  proveedor_semilla?: string | null;
}

export type UpdateCultivoInput = Partial<CreateCultivoInput>;

// ─── Actividades ────────────────────────────────────────────
export type EstadoActividad = 'PROGRAMADA' | 'EN_PROCESO' | 'COMPLETADA';
export type PrioridadActividad = 'ALTA' | 'MEDIA' | 'BAJA';
export type TipoActividad =
  | 'PREPARACION_TERRENO' | 'SIEMBRA' | 'RESIEMBRA' | 'FERTILIZACION'
  | 'COMPOSTAJE' | 'APLICACION_BIOLES' | 'CONTROL_BIOLOGICO' | 'MANEJO_PLAGAS'
  | 'MANEJO_ENFERMEDADES' | 'DESHIERBIE' | 'RIEGO' | 'PODA' | 'APORQUE'
  | 'COSECHA' | 'OTRA';

export interface ActividadInsumo {
  id: string;
  producto: string;
  categoria: string | null;
  fabricante: string | null;
  cantidad: number | null;
  unidad: string | null;
  lote: string | null;
  costo_unitario: number | null;
  costo_total: number | null;
  observaciones: string | null;
}

export interface ActividadManoObra {
  id: string;
  trabajador: string;
  funcion: string | null;
  jornales: number | null;
  horas: number | null;
  observaciones: string | null;
}

export interface ActividadMaquinaria {
  id: string;
  equipo: string;
  operador: string | null;
  horas_uso: number | null;
  combustible: number | null;
  observaciones: string | null;
}

export interface Actividad {
  id: number;
  codigo: string;
  cultivo_id: number;
  cultivo: { id: number; cultivo: string; codigo: string } | null;
  fecha: string;
  tipo_actividad: TipoActividad;
  descripcion: string | null;
  responsable_tecnico: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  duracion_estimada: string | null;
  prioridad: PrioridadActividad;
  estado: EstadoActividad;
  jornales: number | null;
  latitud: string | null;
  longitud: string | null;
  altitud: string | null;
  precision_gps: string | null;
  observaciones_tecnicas: string | null;
  recomendaciones: string | null;
  objetivo: string | null;
  resultado: string | null;
  proxima_actividad: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  insumos: ActividadInsumo[];
  mano_obra: ActividadManoObra[];
  maquinaria: ActividadMaquinaria[];
}

export type CreateActividadInput = Omit<Actividad, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'insumos' | 'mano_obra' | 'maquinaria'> & {
  insumos?: Omit<ActividadInsumo, 'id'>[];
  mano_obra?: Omit<ActividadManoObra, 'id'>[];
  maquinaria?: Omit<ActividadMaquinaria, 'id'>[];
};

export type UpdateActividadInput = Partial<CreateActividadInput>;

// ─── Acopios ────────────────────────────────────────────────
export type EstadoAcopio = 'EN_CAMPO' | 'EN_TRANSITO' | 'RECIBIDO';

export const ESTADO_ACOPIO_VALUES: readonly EstadoAcopio[] = ['EN_CAMPO', 'EN_TRANSITO', 'RECIBIDO'];

export interface AcopioSaco {
  id: string;
  codigo: string;
  peso: number;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  acopio_detalle_id: number;
}

export interface AcopioDetalle {
  id: number;
  acopio_id: number;
  productor_id: number;
  cultivo_id: number;
  parcela_id: number | null;
  total_sacos: number;
  peso_total: number;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  productor: Pick<Productor, 'id' | 'nombres' | 'apellido_paterno' | 'apellido_materno' | 'codigo'>;
  cultivo: Pick<Cultivo, 'id' | 'codigo' | 'cultivo' | 'variedad'>;
  parcela: Pick<Parcela, 'id' | 'nombre' | 'codigo' | 'area'> | null;
  sacos: AcopioSaco[];
}

export interface Acopio {
  id: number;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string | null;
  ruta_acopio: string | null;
  total_sacos: number;
  peso_total: number;
  peso_bruto: number;
  tara: number;
  peso_neto: number;
  estado: EstadoAcopio;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  detalles: AcopioDetalle[];
}

export interface AcopioDetalleInput {
  productor_id: number;
  cultivo_id: number;
  parcela_id?: number | null;
  observaciones?: string | null;
  sacos: AcopioSacoInput[];
}

export interface AcopioSacoInput {
  codigo: string;
  peso: number;
  observaciones?: string | null;
}

export interface CreateAcopioInput {
  codigo?: string;
  fecha: string;
  acopiador: string;
  vehiculo?: string | null;
  ruta_acopio?: string | null;
  peso_bruto?: number;
  tara?: number;
  estado?: EstadoAcopio;
  observaciones?: string | null;
  detalles: AcopioDetalleInput[];
}

export type UpdateAcopioInput = Partial<Omit<CreateAcopioInput, 'detalles'>> & {
  detalles?: AcopioDetalleInput[];
};

export interface AcopioFilters {
  search?: string;
  estado?: EstadoAcopio;
  page?: number;
  limit?: number;
}

// ─── Recepciones ────────────────────────────────────────────
export type EstadoRecepcion = 'PENDIENTE_PESAJE' | 'EN_CONTROL_CALIDAD' | 'DISPONIBLE' | 'RECHAZADA';
export type ResultadoRecepcion = 'ACEPTADO' | 'ACEPTADO_CON_OBSERVACIONES' | 'RECHAZADO';
export type CategoriaRecepcion = 'PRIMERA' | 'SEGUNDA' | 'INDUSTRIAL' | 'DESCARTE';
export type DestinoRecepcion = 'PROCESAMIENTO' | 'ALMACEN_TEMPORAL' | 'RECHAZADO';
export type EstadoProducto = 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'RECHAZADO';

export const ESTADO_RECEPCION_VALUES: readonly EstadoRecepcion[] = ['PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA'];
export const CATEGORIA_RECEPCION_VALUES: readonly CategoriaRecepcion[] = ['PRIMERA', 'SEGUNDA', 'INDUSTRIAL', 'DESCARTE'];
export const DESTINO_RECEPCION_VALUES: readonly DestinoRecepcion[] = ['PROCESAMIENTO', 'ALMACEN_TEMPORAL', 'RECHAZADO'];
export const RESULTADO_RECEPCION_VALUES: readonly ResultadoRecepcion[] = ['ACEPTADO', 'ACEPTADO_CON_OBSERVACIONES', 'RECHAZADO'];

export interface RecepcionSaco {
  id: number;
  codigo: string;
  peso: number;
  observaciones: string | null;
}

export interface Recepcion {
  id: number;
  codigo: string;
  acopio_id: number | null;
  acopio: { id: number; codigo: string } | null;
  lote_productor: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  peso_campo: number | null;
  peso_bruto: number | null;
  tara: number | null;
  peso_neto: number | null;
  diferencia: number | null;
  merma: number | null;
  humedad: number | null;
  impurezas: number | null;
  materia_extrana: number | null;
  color: string | null;
  olor: string | null;
  presencia_insectos: string | null;
  estado_producto: EstadoProducto | null;
  categoria: CategoriaRecepcion | null;
  destino: DestinoRecepcion | null;
  resultado: ResultadoRecepcion | null;
  motivo: string | null;
  estado: EstadoRecepcion;
  observaciones: string | null;
  documento_firmado: boolean;
  firma_responsable_url: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  sacos_detalle: RecepcionSaco[];
}

export interface CreateRecepcionInput {
  acopio_id: number;
  lote_productor?: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos?: number;
  peso_campo?: number | null;
  peso_bruto?: number | null;
  tara?: number | null;
  peso_neto?: number | null;
  diferencia?: number | null;
  merma?: number | null;
  humedad?: number | null;
  impurezas?: number | null;
  materia_extrana?: number | null;
  color?: string | null;
  olor?: string | null;
  presencia_insectos?: string | null;
  estado_producto?: EstadoProducto | null;
  categoria?: CategoriaRecepcion | null;
  destino?: DestinoRecepcion | null;
  resultado?: ResultadoRecepcion | null;
  motivo?: string | null;
  observaciones?: string | null;
  documento_firmado?: boolean;
  firma_responsable_url?: string | null;
  estado?: EstadoRecepcion;
  sacos_detalle?: Array<{ codigo: string; peso: number; observaciones?: string | null }>;
}

export type UpdateRecepcionInput = Partial<Omit<CreateRecepcionInput, 'acopio_id'>> & {
  acopio_id?: number | null;
};

export interface RecepcionFilters {
  search?: string;
  estado?: EstadoRecepcion;
  page?: number;
  limit?: number;
}

// ─── Inspecciones ───────────────────────────────────────────
export type EstadoInspeccion = 'PENDIENTE' | 'APROBADA' | 'NO_CONFORME';
export type ResultadoInspeccion = 'CONFORME' | 'CONFORME_CON_OBSERVACIONES' | 'NO_CONFORME';
export type CumplimientoCriterio = 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA';
export type RiesgoNivel = 'BAJO' | 'MEDIO' | 'ALTO';
export type SeveridadNoConformidad = 'LEVE' | 'MODERADA' | 'CRITICA';
export type EstadoNoConformidad = 'PENDIENTE' | 'EN_PROCESO' | 'CORREGIDA' | 'VERIFICADA';
export type EstadoAccionCorrectiva = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'VERIFICADA';

export const ESTADO_INSPECCION_VALUES: readonly EstadoInspeccion[] = ['PENDIENTE', 'APROBADA', 'NO_CONFORME'];
export const RESULTADO_INSPECCION_VALUES: readonly ResultadoInspeccion[] = ['CONFORME', 'CONFORME_CON_OBSERVACIONES', 'NO_CONFORME'];
export const CUMPLIMIENTO_VALUES: readonly CumplimientoCriterio[] = ['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'];
export const RIESGO_VALUES: readonly RiesgoNivel[] = ['BAJO', 'MEDIO', 'ALTO'];
export const SEVERIDAD_VALUES: readonly SeveridadNoConformidad[] = ['LEVE', 'MODERADA', 'CRITICA'];

export interface InspeccionChecklist {
  id: number;
  criterio: string;
  cumplimiento: CumplimientoCriterio | null;
  riesgo: RiesgoNivel;
  observacion: string | null;
  evidencia: string | null;
  created_at: string;
  updated_at: string;
  inspeccion_id: number;
}

export interface NoConformidad {
  id: number;
  codigo: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  severidad: SeveridadNoConformidad;
  responsable: string;
  fecha_compromiso: string | null;
  estado: EstadoNoConformidad;
  accion_correctiva: string | null;
  created_at: string;
  updated_at: string;
  inspeccion_id: number;
  acciones: AccionCorrectiva[];
}

export interface AccionCorrectiva {
  id: number;
  accion: string;
  responsable: string;
  fecha_inicio: string | null;
  fecha_limite: string | null;
  estado: EstadoAccionCorrectiva;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  no_conformidad_id: number;
}

export interface EvidenciaInspeccion {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: string | null;
  ruta_archivo: string | null;
  fecha: string | null;
  responsable: string | null;
  created_at: string;
  updated_at: string;
  inspeccion_id: number;
}

export interface Inspeccion {
  id: number;
  codigo: string;
  fecha: string;
  inspector: string;
  estado: EstadoInspeccion;
  resultado: ResultadoInspeccion | null;
  latitud: string | null;
  longitud: string | null;
  altitud: string | null;
  precision_gps: string | null;
  observaciones: string | null;
  comentarios_productor: string | null;
  recomendaciones: string | null;
  prioridad_recomendacion: string | null;
  responsable_recomendacion: string | null;
  fecha_recomendacion: string | null;
  riesgo_general: RiesgoNivel;
  resumen_ejecutivo: string | null;
  fecha_proxima_inspeccion: string | null;
  nivel_cumplimiento: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  cultivo_id: number;
  cultivo: {
    id: number;
    cultivo: string;
    codigo: string;
    campania: { id: number; nombre: string; codigo: string };
    parcela: {
      id: number;
      nombre: string;
      codigo: string;
      productor: { id: number; nombres: string; apellido_paterno: string; apellido_materno: string; codigo: string };
    };
  } | null;
  checklist: InspeccionChecklist[];
  no_conformidades: NoConformidad[];
  evidencias: EvidenciaInspeccion[];
}

export interface CreateInspeccionInput {
  codigo?: string;
  cultivo_id: number;
  fecha: string;
  inspector: string;
  estado?: EstadoInspeccion;
  resultado?: ResultadoInspeccion | null;
  latitud?: string | null;
  longitud?: string | null;
  altitud?: string | null;
  precision_gps?: string | null;
  observaciones?: string | null;
  comentarios_productor?: string | null;
  recomendaciones?: string | null;
  prioridad_recomendacion?: string | null;
  responsable_recomendacion?: string | null;
  fecha_recomendacion?: string | null;
  riesgo_general?: RiesgoNivel;
  resumen_ejecutivo?: string | null;
  fecha_proxima_inspeccion?: string | null;
  nivel_cumplimiento?: string | null;
  checklist?: Omit<InspeccionChecklist, 'id' | 'created_at' | 'updated_at' | 'inspeccion_id'>[];
  no_conformidades?: Omit<NoConformidad, 'id' | 'created_at' | 'updated_at' | 'inspeccion_id' | 'acciones'>[];
  evidencias?: Omit<EvidenciaInspeccion, 'id' | 'created_at' | 'updated_at' | 'inspeccion_id'>[];
}

export type UpdateInspeccionInput = Partial<CreateInspeccionInput>;

export interface InspeccionFilters {
  search?: string;
  estado?: EstadoInspeccion;
  cultivo_id?: number;
  page?: number;
  limit?: number;
}

// ─── API Response Types ─────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}
