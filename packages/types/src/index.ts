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

// ─── Campañas ───────────────────────────────────────────────
export type EstadoCampania = 'PLANIFICADA' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

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
  created_at: string;
  updated_at: string;
}

// ─── Cultivos ───────────────────────────────────────────────
export type EstadoCultivo = 'ACTIVO' | 'EN_DESARROLLO' | 'COSECHADO' | 'FINALIZADO';

export interface Cultivo {
  id: string;
  codigo: string;
  campania_id: string;
  productor_id: string;
  parcela_id: string;
  cultivo: string;
  variedad: string | null;
  area_sembrada: number | null;
  fecha_siembra: string | null;
  metodo_siembra: string | null;
  sistema_productivo: string | null;
  tipo_agricultura: string | null;
  certificacion: string;
  estado: EstadoCultivo;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Actividades ────────────────────────────────────────────
export type EstadoActividad = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
export type TipoActividad = 'FERTILIZACION' | 'RIEGO' | 'COSECHA' | 'SIEMBRA' | 'CONTROL_PLAGAS' | 'OTRO';

export interface Actividad {
  id: string;
  codigo: string;
  campania_id: string;
  cultivo_id: string;
  parcela_id: string;
  tipo: TipoActividad;
  nombre: string;
  descripcion: string | null;
  fecha_planificada: string;
  fecha_ejecutada: string | null;
  estado: EstadoActividad;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Acopios ────────────────────────────────────────────────
export type EstadoAcopio = 'EN_PROCESO' | 'COMPLETADO' | 'EN_PLANTA';

export interface Acopio {
  id: string;
  codigo: string;
  campania_id: string;
  productor_id: string;
  parcela_id: string;
  cultivo_id: string | null;
  fecha: string;
  acopiador: string;
  vehiculo: string | null;
  ruta_acopio: string | null;
  lote_productor: string | null;
  total_sacos: number;
  peso_total: number;
  peso_promedio: number | null;
  peso_maximo: number | null;
  peso_minimo: number | null;
  estado: EstadoAcopio;
  estado_producto: string | null;
  humedad: number | null;
  impurezas: number | null;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Recepciones ────────────────────────────────────────────
export type EstadoRecepcion = 'PENDIENTE_PESAJE' | 'EN_CONTROL_CALIDAD' | 'DISPONIBLE' | 'RECHAZADA';
export type ResultadoRecepcion = 'ACEPTADO' | 'ACEPTADO_CON_OBSERVACIONES' | 'RECHAZADO';

export interface Recepcion {
  id: string;
  codigo: string;
  campania_id: string;
  acopio_id: string | null;
  lote_productor: string;
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
  estado_producto: string | null;
  categoria: string | null;
  destino: string | null;
  resultado: ResultadoRecepcion | null;
  motivo: string | null;
  estado: EstadoRecepcion;
  observaciones: string | null;
  documento_firmado: boolean;
  firma_responsable_url: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
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
