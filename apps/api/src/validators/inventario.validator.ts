import Joi from 'joi';

const estadoInventarioEnum = ['DISPONIBLE', 'RESERVADO', 'CONSUMIDO', 'VENCIDO'];
const tipoMovimientoEnum = ['ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE'];

const movimientoSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  tipo: Joi.string().valid(...tipoMovimientoEnum).required().messages({
    'any.required': 'El tipo de movimiento es obligatorio',
  }),
  cantidad: Joi.number().precision(2).positive().required().messages({
    'any.required': 'La cantidad es obligatoria',
    'number.positive': 'La cantidad debe ser un valor positivo',
  }),
  referencia: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  fecha: Joi.date().iso().allow(null),
});

export const createInventarioSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  producto: Joi.string().max(200).required().messages({
    'any.required': 'El producto es obligatorio',
  }),
  categoria: Joi.string().max(100).required().messages({
    'any.required': 'La categoría es obligatoria',
  }),
  unidad: Joi.string().max(10).default('kg'),
  cantidad_actual: Joi.number().precision(2).min(0).default(0),
  cantidad_minima: Joi.number().precision(2).min(0).allow(null),
  cantidad_maxima: Joi.number().precision(2).min(0).allow(null),
  ubicacion: Joi.string().max(200).allow('', null),
  estado: Joi.string().valid(...estadoInventarioEnum).default('DISPONIBLE'),
  lote_id: Joi.string().max(36).allow('', null),
  fecha_ingreso: Joi.date().iso().required().messages({
    'any.required': 'La fecha de ingreso es obligatoria',
  }),
  fecha_vencimiento: Joi.date().iso().allow(null),
  proveedor: Joi.string().max(200).allow('', null),
  costo_unitario: Joi.number().precision(2).min(0).allow(null),
  observaciones: Joi.string().allow('', null),
  movimientos: Joi.array().items(movimientoSchema).default([]),
});

export const updateInventarioSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  producto: Joi.string().max(200),
  categoria: Joi.string().max(100),
  unidad: Joi.string().max(10),
  cantidad_actual: Joi.number().precision(2).min(0),
  cantidad_minima: Joi.number().precision(2).min(0).allow(null),
  cantidad_maxima: Joi.number().precision(2).min(0).allow(null),
  ubicacion: Joi.string().max(200).allow('', null),
  estado: Joi.string().valid(...estadoInventarioEnum),
  lote_id: Joi.string().max(36).allow('', null),
  fecha_ingreso: Joi.date().iso(),
  fecha_vencimiento: Joi.date().iso().allow(null),
  proveedor: Joi.string().max(200).allow('', null),
  costo_unitario: Joi.number().precision(2).min(0).allow(null),
  observaciones: Joi.string().allow('', null),
  movimientos: Joi.array().items(movimientoSchema),
}).min(1);

export const getAllInventarioSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoInventarioEnum),
  categoria: Joi.string().max(100).allow('', null),
  lote_id: Joi.string().max(36).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const addMovimientoSchema = Joi.object({
  tipo: Joi.string().valid(...tipoMovimientoEnum).required().messages({
    'any.required': 'El tipo de movimiento es obligatorio',
  }),
  cantidad: Joi.number().precision(2).positive().required().messages({
    'any.required': 'La cantidad es obligatoria',
    'number.positive': 'La cantidad debe ser un valor positivo',
  }),
  referencia: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  fecha: Joi.date().iso().allow(null),
});
