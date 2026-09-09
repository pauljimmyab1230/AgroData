import type {
  EstadoCampania,
  CampaniaStats,
  CampaniaGlobalStats,
  CampaniaTimelineEvent,
} from '@agrodata/types';

export interface CampaniaRecord {
  id: number;
  codigo: string;
  nombre: string;
  anio_agricola: string;
  fecha_inicio: Date;
  fecha_fin: Date;
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
  created_at: Date;
  updated_at: Date;
}

export type { CampaniaStats, CampaniaGlobalStats, CampaniaTimelineEvent };
