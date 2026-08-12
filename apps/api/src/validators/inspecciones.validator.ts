import Joi from 'joi';

const estadoInspeccionEnum = ['PENDIENTE', 'APROBADA', 'NO_CONFORME'];
const resultadoInspeccionEnum = ['CONFORME', 'CONFORME_CON_OBSERVACIONES', 'NO_CONFORME'];
const cumplimientoEnum = ['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'];
const riesgoEnum = ['BAJO', 'MEDIO', 'ALTO'];
const severidadEnum = ['LEVE', 'MODERADA', 'CRITICA'];
const estadoNoConformidadEnum = ['PENDIENTE', 'EN_PROCESO', 'CORREGIDA', 'VERIFICADA'];

const checklistItemSchema = Joi.object({
  criterio: Joi.string().max(200).required(),
  cumplimiento: Joi.string().valid(...cumplimientoEnum).allow(null),
  riesgo: Joi.string().valid(...riesgoEnum).default('BAJO'),
  observacion: Joi.string().allow('', null),
  evidencia: Joi.string().max(500).allow('', null),
});

const noConformidadSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  tipo: Joi.string().max(100).required(),
  categoria: Joi.string().max(100).required(),
  descripcion: Joi.string().required(),
  severidad: Joi.string().valid(...severidadEnum).default('LEVE'),
  responsable: Joi.string().max(150).required(),
  fecha_compromiso: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoNoConformidadEnum).default('PENDIENTE'),
  accion_correctiva: Joi.string().allow('', null),
});

const accionCorrectivaSchema = Joi.object({
  accion: Joi.string().required(),
  responsable: Joi.string().max(150).required(),
  fecha_inicio: Joi.date().iso().allow(null),
  fecha_limite: Joi.date().iso().allow(null),
  estado: Joi.string().max(20).default('PENDIENTE'),
  observaciones: Joi.string().allow('', null),
});

const evidenciaSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  descripcion: Joi.string().max(500).allow('', null),
  tipo: Joi.string().max(100).allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
  fecha: Joi.date().iso().allow(null),
  responsable: Joi.string().max(150).allow('', null),
});

const historialSchema = Joi.object({
  titulo: Joi.string().max(200).required(),
  descripcion: Joi.string().allow('', null),
  tipo: Joi.string().max(50).required(),
});

export const createInspeccionSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid().required().messages({ 'any.required': 'La campaña es obligatoria' }),
  productor_id: Joi.string().uuid().required().messages({ 'any.required': 'El productor es obligatorio' }),
  parcela_id: Joi.string().uuid().required().messages({ 'any.required': 'La parcela es obligatoria' }),
  cultivo_id: Joi.string().uuid().allow(null),
  fecha: Joi.date().iso().required().messages({ 'any.required': 'La fecha es obligatoria' }),
  inspector: Joi.string().max(150).required().messages({ 'any.required': 'El inspector es obligatorio' }),
  estado: Joi.string().valid(...estadoInspeccionEnum).default('PENDIENTE'),
  resultado: Joi.string().valid(...resultadoInspeccionEnum).allow(null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  altitud: Joi.string().max(50).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  observaciones: Joi.string().allow('', null),
  comentarios_productor: Joi.string().allow('', null),
  recomendaciones: Joi.string().allow('', null),
  prioridad_recomendacion: Joi.string().max(150).allow('', null),
  responsable_recomendacion: Joi.string().max(150).allow('', null),
  fecha_recomendacion: Joi.date().iso().allow(null),
  riesgo_general: Joi.string().valid(...riesgoEnum).default('BAJO'),
  resumen_ejecutivo: Joi.string().allow('', null),
  fecha_proxima_inspeccion: Joi.date().iso().allow(null),
  nivel_cumplimiento: Joi.string().max(50).allow('', null),
  checklist: Joi.array().items(checklistItemSchema),
  no_conformidades: Joi.array().items(noConformidadSchema),
  acciones_correctivas: Joi.array().items(accionCorrectivaSchema),
  evidencias: Joi.array().items(evidenciaSchema),
  historial: Joi.array().items(historialSchema),
});

export const updateInspeccionSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  cultivo_id: Joi.string().uuid().allow(null),
  fecha: Joi.date().iso(),
  inspector: Joi.string().max(150),
  estado: Joi.string().valid(...estadoInspeccionEnum),
  resultado: Joi.string().valid(...resultadoInspeccionEnum).allow(null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  altitud: Joi.string().max(50).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  observaciones: Joi.string().allow('', null),
  comentarios_productor: Joi.string().allow('', null),
  recomendaciones: Joi.string().allow('', null),
  prioridad_recomendacion: Joi.string().max(150).allow('', null),
  responsable_recomendacion: Joi.string().max(150).allow('', null),
  fecha_recomendacion: Joi.date().iso().allow(null),
  riesgo_general: Joi.string().valid(...riesgoEnum),
  resumen_ejecutivo: Joi.string().allow('', null),
  fecha_proxima_inspeccion: Joi.date().iso().allow(null),
  nivel_cumplimiento: Joi.string().max(50).allow('', null),
  checklist: Joi.array().items(checklistItemSchema),
  no_conformidades: Joi.array().items(noConformidadSchema),
  acciones_correctivas: Joi.array().items(accionCorrectivaSchema),
  evidencias: Joi.array().items(evidenciaSchema),
  historial: Joi.array().items(historialSchema),
}).min(1);

export const getAllInspeccionesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoInspeccionEnum),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
