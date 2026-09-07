import Joi from 'joi';

const estadoKardexEnum = ['DISPONIBLE', 'RESERVADO', 'CONSUMIDO', 'VENCIDO'];
const tipoMovimientoEnum = ['ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE'];

export const createKardexSchema = Joi.object({
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
  estado: Joi.string().valid(...estadoKardexEnum).default('DISPONIBLE'),
  fecha_ingreso: Joi.date().iso().required().messages({
    'any.required': 'La fecha de ingreso es obligatoria',
  }),
  fecha_vencimiento: Joi.date().iso().allow(null),
  proveedor: Joi.string().max(200).allow('', null),
  costo_unitario: Joi.number().precision(2).min(0).allow(null),
  observaciones: Joi.string().allow('', null),
});

export const updateKardexSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  producto: Joi.string().max(200),
  categoria: Joi.string().max(100),
  unidad: Joi.string().max(10),
  cantidad_minima: Joi.number().precision(2).min(0).allow(null),
  cantidad_maxima: Joi.number().precision(2).min(0).allow(null),
  ubicacion: Joi.string().max(200).allow('', null),
  estado: Joi.string().valid(...estadoKardexEnum),
  fecha_ingreso: Joi.date().iso(),
  fecha_vencimiento: Joi.date().iso().allow(null),
  proveedor: Joi.string().max(200).allow('', null),
  costo_unitario: Joi.number().precision(2).min(0).allow(null),
  observaciones: Joi.string().allow('', null),
}).min(1);

export const getAllKardexSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoKardexEnum),
  categoria: Joi.string().max(100).allow('', null),
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
  destino: Joi.string().max(200).allow('', null),
  referencia: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  fecha: Joi.date().iso().allow(null),
});
