import Joi from 'joi';

// ─── Enums synced with Prisma schema ─────────────────────
const estadoRecepcionEnum = ['PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA'] as const;
const categoriaEnum = ['PRIMERA', 'SEGUNDA', 'INDUSTRIAL', 'DESCARTE'] as const;
const destinoEnum = ['PROCESAMIENTO', 'ALMACEN_TEMPORAL', 'RECHAZADO'] as const;
const resultadoEnum = ['ACEPTADO', 'ACEPTADO_CON_OBSERVACIONES', 'RECHAZADO'] as const;
const estadoProductoEnum = ['EXCELENTE', 'BUENO', 'REGULAR', 'RECHAZADO'] as const;

// ─── Saco sub-schema ─────────────────────────────────────
const sacoSchema = Joi.object({
  codigo: Joi.string().max(50).trim().required().messages({
    'any.required': 'El código del saco es obligatorio',
    'string.empty': 'El código del saco no puede estar vacío',
  }),
  peso: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El peso del saco es obligatorio',
    'number.base': 'El peso debe ser un número',
    'number.positive': 'El peso del saco debe ser un valor positivo',
  }),
  observaciones: Joi.string().allow('', null).optional(),
});

// ─── Create schema ───────────────────────────────────────
export const createRecepcionSchema = Joi.object({
  acopio_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'El ID del acopio debe ser un número',
    'number.positive': 'El ID del acopio debe ser positivo',
  }),
  lote_productor: Joi.string().max(100).trim().allow('', null).optional(),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
    'date.base': 'La fecha debe ser una fecha válida',
    'date.format': 'La fecha debe estar en formato ISO',
  }),
  responsable: Joi.string().max(150).trim().required().messages({
    'any.required': 'El responsable es obligatorio',
    'string.empty': 'El responsable no puede estar vacío',
  }),
  planta: Joi.string().max(100).trim().required().messages({
    'any.required': 'La planta es obligatoria',
    'string.empty': 'La planta no puede estar vacía',
  }),
  sacos: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'La cantidad de sacos debe ser un número entero',
    'number.min': 'La cantidad de sacos no puede ser negativa',
  }),
  peso_campo: Joi.number().precision(2).min(0).allow(null).optional().messages({
    'number.base': 'El peso de campo debe ser un número',
    'number.min': 'El peso de campo no puede ser negativo',
  }),
  peso_bruto: Joi.number().precision(2).min(0).allow(null).optional().messages({
    'number.base': 'El peso bruto debe ser un número',
    'number.min': 'El peso bruto no puede ser negativo',
  }),
  tara: Joi.number().precision(2).min(0).allow(null).optional().messages({
    'number.base': 'La tara debe ser un número',
    'number.min': 'La tara no puede ser negativa',
  }),
  peso_neto: Joi.number().precision(2).min(0).allow(null).optional().messages({
    'number.base': 'El peso neto debe ser un número',
    'number.min': 'El peso neto no puede ser negativo',
  }),
  diferencia: Joi.number().precision(2).allow(null).optional(),
  merma: Joi.number().precision(2).min(0).max(100).allow(null).optional().messages({
    'number.base': 'La merma debe ser un número',
    'number.min': 'La merma no puede ser menor a 0',
    'number.max': 'La merma no puede ser mayor a 100',
  }),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null).optional().messages({
    'number.base': 'La humedad debe ser un número',
    'number.min': 'La humedad no puede ser menor a 0',
    'number.max': 'La humedad no puede ser mayor a 100',
  }),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null).optional().messages({
    'number.base': 'Las impurezas deben ser un número',
    'number.min': 'Las impurezas no pueden ser menores a 0',
    'number.max': 'Las impurezas no pueden ser mayores a 100',
  }),
  materia_extrana: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  color: Joi.string().max(50).allow('', null).optional(),
  olor: Joi.string().max(50).allow('', null).optional(),
  presencia_insectos: Joi.string().max(50).allow('', null).optional(),
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null).optional(),
  categoria: Joi.string().valid(...categoriaEnum).allow(null).optional(),
  destino: Joi.string().valid(...destinoEnum).allow(null).optional(),
  resultado: Joi.string().valid(...resultadoEnum).allow(null).optional(),
  motivo: Joi.string().allow('', null).optional(),
  observaciones: Joi.string().allow('', null).optional(),
  documento_firmado: Joi.boolean().default(false),
  firma_responsable_url: Joi.string().max(500).allow('', null).optional(),
  estado: Joi.string().valid(...estadoRecepcionEnum).default('PENDIENTE_PESAJE'),
  sacos_detalle: Joi.array().items(sacoSchema).default([]),
});

// ─── Update schema ───────────────────────────────────────
export const updateRecepcionSchema = Joi.object({
  acopio_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'El ID del acopio debe ser un número',
    'number.positive': 'El ID del acopio debe ser positivo',
  }),
  lote_productor: Joi.string().max(100).trim().allow('', null).optional(),
  fecha: Joi.date().iso().optional().messages({
    'date.base': 'La fecha debe ser una fecha válida',
    'date.format': 'La fecha debe estar en formato ISO',
  }),
  responsable: Joi.string().max(150).trim().optional(),
  planta: Joi.string().max(100).trim().optional(),
  sacos: Joi.number().integer().min(0).optional(),
  peso_campo: Joi.number().precision(2).min(0).allow(null).optional(),
  peso_bruto: Joi.number().precision(2).min(0).allow(null).optional(),
  tara: Joi.number().precision(2).min(0).allow(null).optional(),
  peso_neto: Joi.number().precision(2).min(0).allow(null).optional(),
  diferencia: Joi.number().precision(2).allow(null).optional(),
  merma: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  materia_extrana: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  color: Joi.string().max(50).allow('', null).optional(),
  olor: Joi.string().max(50).allow('', null).optional(),
  presencia_insectos: Joi.string().max(50).allow('', null).optional(),
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null).optional(),
  categoria: Joi.string().valid(...categoriaEnum).allow(null).optional(),
  destino: Joi.string().valid(...destinoEnum).allow(null).optional(),
  resultado: Joi.string().valid(...resultadoEnum).allow(null).optional(),
  motivo: Joi.string().allow('', null).optional(),
  observaciones: Joi.string().allow('', null).optional(),
  documento_firmado: Joi.boolean().optional(),
  firma_responsable_url: Joi.string().max(500).allow('', null).optional(),
  estado: Joi.string().valid(...estadoRecepcionEnum).optional(),
  sacos_detalle: Joi.array().items(sacoSchema).optional(),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});

// ─── Query schema ────────────────────────────────────────
export const getAllRecepcionesSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null).optional(),
  estado: Joi.string().valid(...estadoRecepcionEnum).optional(),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'La página debe ser mayor a 0',
  }),
  limit: Joi.number().integer().min(1).max(500).default(20).messages({
    'number.min': 'El límite debe ser mayor a 0',
    'number.max': 'El límite no puede exceder 100',
  }),
});
