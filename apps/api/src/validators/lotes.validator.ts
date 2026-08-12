import Joi from 'joi';

const estadoLoteEnum = ['REGISTRADO', 'EN_PROCESAMIENTO', 'DISPONIBLE', 'CONSUMIDO', 'VENCIDO'];
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
  destino: Joi.string().max(200).allow('', null),
  referencia: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  fecha: Joi.date().iso().allow(null),
});

export const createLoteSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200).required().messages({
    'any.required': 'El nombre es obligatorio',
  }),
  campania_id: Joi.string().max(36).required().messages({
    'any.required': 'La campaña es obligatoria',
  }),
  cultivo: Joi.string().max(100).required().messages({
    'any.required': 'El cultivo es obligatorio',
  }),
  origen: Joi.string().max(100).required().messages({
    'any.required': 'El origen es obligatorio',
  }),
  peso_inicial: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El peso inicial es obligatorio',
    'number.positive': 'El peso inicial debe ser un valor positivo',
  }),
  peso_disponible: Joi.number().precision(2).min(0).allow(null),
  unidad: Joi.string().max(10).default('kg'),
  estado: Joi.string().valid(...estadoLoteEnum).default('REGISTRADO'),
  fecha_produccion: Joi.date().iso().allow(null),
  fecha_vencimiento: Joi.date().iso().allow(null),
  calidad: Joi.string().max(50).allow('', null),
  certificacion: Joi.string().max(50).allow('', null),
  ubicacion: Joi.string().max(200).allow('', null),
  observaciones: Joi.string().allow('', null),
  movimientos: Joi.array().items(movimientoSchema).default([]),
});

export const updateLoteSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200),
  campania_id: Joi.string().max(36),
  cultivo: Joi.string().max(100),
  origen: Joi.string().max(100),
  peso_inicial: Joi.number().precision(2).positive(),
  peso_disponible: Joi.number().precision(2).min(0).allow(null),
  unidad: Joi.string().max(10),
  estado: Joi.string().valid(...estadoLoteEnum),
  fecha_produccion: Joi.date().iso().allow(null),
  fecha_vencimiento: Joi.date().iso().allow(null),
  calidad: Joi.string().max(50).allow('', null),
  certificacion: Joi.string().max(50).allow('', null),
  ubicacion: Joi.string().max(200).allow('', null),
  observaciones: Joi.string().allow('', null),
  movimientos: Joi.array().items(movimientoSchema),
}).min(1);

export const getAllLotesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoLoteEnum),
  campania_id: Joi.string().max(36).allow('', null),
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
