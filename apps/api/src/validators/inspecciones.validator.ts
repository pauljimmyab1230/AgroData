import Joi from 'joi';

const estadoInspeccionEnum = ['PENDIENTE', 'APROBADA', 'NO_CONFORME'] as const;
const resultadoInspeccionEnum = ['CONFORME', 'CONFORME_CON_OBSERVACIONES', 'NO_CONFORME'] as const;
const cumplimientoEnum = ['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'] as const;
const riesgoEnum = ['BAJO', 'MEDIO', 'ALTO'] as const;
const severidadEnum = ['LEVE', 'MODERADA', 'CRITICA'] as const;
const estadoNoConformidadEnum = ['PENDIENTE', 'EN_PROCESO', 'CORREGIDA', 'VERIFICADA'] as const;
const estadoAccionCorrectivaEnum = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'VERIFICADA'] as const;

const checklistItemSchema = Joi.object({
  criterio: Joi.string().max(200).required(),
  cumplimiento: Joi.string().valid(...cumplimientoEnum).allow(null),
  riesgo: Joi.string().valid(...riesgoEnum).default('BAJO'),
  observacion: Joi.string().allow('', null),
  evidencia: Joi.string().max(500).allow('', null),
});

const accionCorrectivaSchema = Joi.object({
  accion: Joi.string().required(),
  responsable: Joi.string().max(150).required(),
  fecha_inicio: Joi.date().iso().allow(null),
  fecha_limite: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoAccionCorrectivaEnum).default('PENDIENTE'),
  observaciones: Joi.string().allow('', null),
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
  acciones: Joi.array().items(accionCorrectivaSchema),
});

const evidenciaSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  descripcion: Joi.string().max(500).allow('', null),
  tipo: Joi.string().max(100).allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
  fecha: Joi.date().iso().allow(null),
  responsable: Joi.string().max(150).allow('', null),
});

export const createInspeccionSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  cultivo_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El cultivo es obligatorio',
    'number.base': 'El cultivo debe ser un número',
    'number.positive': 'El cultivo debe ser un ID válido',
  }),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
    'date.base': 'La fecha debe ser una fecha válida',
  }),
  inspector: Joi.string().max(150).required().messages({
    'any.required': 'El inspector es obligatorio',
    'string.max': 'El nombre del inspector no puede exceder 150 caracteres',
  }),
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
  evidencias: Joi.array().items(evidenciaSchema),
});

export const updateInspeccionSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  cultivo_id: Joi.number().integer().positive(),
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
  evidencias: Joi.array().items(evidenciaSchema),
}).min(1);

export const getAllInspeccionesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoInspeccionEnum),
  cultivo_id: Joi.number().integer().positive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
