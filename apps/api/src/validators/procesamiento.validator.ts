import Joi from 'joi';

// ─── Enums ─────────────────────────────────────────────────
const estadoProcesamientoEnum = ['REGISTRADA', 'EN_PROCESO', 'FINALIZADO', 'PAUSADA', 'CANCELADA'] as const;
const tipoProcesoEnum = ['SECADO', 'LIMPIEZA', 'MOLIENDA', 'TOSTADO', 'EMPAQUE', 'TRANSFORMACION'] as const;
const lineaProcesamientoEnum = ['GRANOS', 'TUBERCULOS', 'LEGUMBRES', 'SEMILLAS'] as const;
const calidadProductoEnum = ['PRIMERA', 'SEGUNDA', 'TERCERA', 'DESCARTE'] as const;
const estadoOperacionEnum = ['PENDIENTE', 'EN_CURSO', 'COMPLETADA', 'NO_APLICA'] as const;

// ─── Common Schemas ────────────────────────────────────────
const loteSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  lote_productor: Joi.string().max(100).required().messages({
    'any.required': 'El lote del productor es obligatorio',
  }),
  productor_nombre: Joi.string().max(200).allow('', null),
  parcela_nombre: Joi.string().max(200).allow('', null),
  cultivo_nombre: Joi.string().max(100).allow('', null),
  peso_recepcionado: Joi.number().precision(2).min(0).allow(null),
});

const operacionSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  nombre: Joi.string().max(100).required().messages({
    'any.required': 'El nombre de la operación es obligatorio',
  }),
  responsable: Joi.string().max(150).allow('', null),
  estado: Joi.string().valid(...estadoOperacionEnum).default('PENDIENTE'),
  observaciones: Joi.string().allow('', null),
});

// ─── Create Schema ─────────────────────────────────────────
export const createProcesamientoSchema = Joi.object({
  fecha_inicio: Joi.date().iso().required().messages({
    'any.required': 'La fecha de inicio es obligatoria',
    'date.iso': 'La fecha de inicio debe ser una fecha válida en formato ISO',
  }),
  fecha_fin: Joi.date().iso().allow(null).messages({
    'date.iso': 'La fecha de fin debe ser una fecha válida en formato ISO',
  }),
  producto: Joi.string().max(100).trim().required().messages({
    'any.required': 'El producto es obligatorio',
    'string.max': 'El producto no puede exceder 100 caracteres',
  }),
  responsable: Joi.string().max(150).trim().required().messages({
    'any.required': 'El responsable es obligatorio',
    'string.max': 'El responsable no puede exceder 150 caracteres',
  }),
  planta: Joi.string().max(100).trim().required().messages({
    'any.required': 'La planta es obligatoria',
    'string.max': 'La planta no puede exceder 100 caracteres',
  }),
  linea_procesamiento: Joi.string().valid(...lineaProcesamientoEnum).required().messages({
    'any.required': 'La línea de procesamiento es obligatoria',
    'any.only': 'La línea de procesamiento debe ser: GRANOS, TUBERCULOS, LEGUMBRES o SEMILLAS',
  }),
  tipo_proceso: Joi.string().valid(...tipoProcesoEnum).required().messages({
    'any.required': 'El tipo de proceso es obligatorio',
    'any.only': 'El tipo de proceso debe ser: SECADO, LIMPIEZA, MOLIENDA, TOSTADO, EMPAQUE o TRANSFORMACION',
  }),
  estado: Joi.string().valid(...estadoProcesamientoEnum).default('REGISTRADA'),
  observaciones: Joi.string().allow('', null),
  peso_entrada: Joi.number().precision(2).min(0).allow(null).messages({
    'number.min': 'El peso de entrada no puede ser negativo',
  }),
  peso_salida: Joi.number().precision(2).min(0).allow(null).messages({
    'number.min': 'El peso de salida no puede ser negativo',
  }),
  merma: Joi.number().precision(2).min(0).allow(null).messages({
    'number.min': 'La merma no puede ser negativa',
  }),
  rendimiento: Joi.number().precision(2).min(0).max(100).allow(null).messages({
    'number.min': 'El rendimiento no puede ser menor a 0%',
    'number.max': 'El rendimiento no puede exceder 100%',
  }),
  producto_base: Joi.string().max(100).trim().allow('', null),
  calidad_producto: Joi.string().valid(...calidadProductoEnum).allow(null),
  peso_final: Joi.number().precision(2).min(0).allow(null),
  humedad_final: Joi.number().precision(2).min(0).max(100).allow(null),
  recepcion_id: Joi.number().integer().positive().allow(null).messages({
    'number.base': 'El ID de recepción debe ser un número',
    'number.integer': 'El ID de recepción debe ser un número entero',
    'number.positive': 'El ID de recepción debe ser un número positivo',
  }),
  lotes: Joi.array().items(loteSchema).min(0),
  operaciones: Joi.array().items(operacionSchema).min(0),
});

// ─── Update Schema ─────────────────────────────────────────
export const updateProcesamientoSchema = Joi.object({
  fecha_inicio: Joi.date().iso().messages({
    'date.iso': 'La fecha de inicio debe ser una fecha válida en formato ISO',
  }),
  fecha_fin: Joi.date().iso().allow(null),
  producto: Joi.string().max(100).trim(),
  responsable: Joi.string().max(150).trim(),
  planta: Joi.string().max(100).trim(),
  linea_procesamiento: Joi.string().valid(...lineaProcesamientoEnum),
  tipo_proceso: Joi.string().valid(...tipoProcesoEnum),
  estado: Joi.string().valid(...estadoProcesamientoEnum),
  observaciones: Joi.string().allow('', null),
  peso_entrada: Joi.number().precision(2).min(0).allow(null),
  peso_salida: Joi.number().precision(2).min(0).allow(null),
  merma: Joi.number().precision(2).min(0).allow(null),
  rendimiento: Joi.number().precision(2).min(0).max(100).allow(null),
  producto_base: Joi.string().max(100).trim().allow('', null),
  calidad_producto: Joi.string().valid(...calidadProductoEnum).allow(null),
  peso_final: Joi.number().precision(2).min(0).allow(null),
  humedad_final: Joi.number().precision(2).min(0).max(100).allow(null),
  recepcion_id: Joi.number().integer().positive().allow(null),
  lotes: Joi.array().items(loteSchema).min(0),
  operaciones: Joi.array().items(operacionSchema).min(0),
}).min(1);

// ─── Query Schema ──────────────────────────────────────────
export const getAllProcesamientosSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoProcesamientoEnum),
  tipo_proceso: Joi.string().valid(...tipoProcesoEnum),
  linea_procesamiento: Joi.string().valid(...lineaProcesamientoEnum),
  recepcion_id: Joi.number().integer().positive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// ─── Additional Schemas ────────────────────────────────────
export const addLoteSchema = Joi.object({
  lote_productor: Joi.string().max(100).required().messages({
    'any.required': 'El lote del productor es obligatorio',
  }),
  productor_nombre: Joi.string().max(200).allow('', null),
  parcela_nombre: Joi.string().max(200).allow('', null),
  cultivo_nombre: Joi.string().max(100).allow('', null),
  peso_recepcionado: Joi.number().precision(2).min(0).allow(null),
});

export const addOperacionSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    'any.required': 'El nombre de la operación es obligatorio',
  }),
  responsable: Joi.string().max(150).allow('', null),
  estado: Joi.string().valid(...estadoOperacionEnum).default('PENDIENTE'),
  observaciones: Joi.string().allow('', null),
});

export const updateOperacionSchema = Joi.object({
  nombre: Joi.string().max(100),
  responsable: Joi.string().max(150).allow('', null),
  estado: Joi.string().valid(...estadoOperacionEnum),
  observaciones: Joi.string().allow('', null),
}).min(1);
