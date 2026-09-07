import Joi from 'joi';

const estadoAcopioEnum = ['EN_PROCESO', 'COMPLETADO', 'EN_PLANTA'];

const sacoSchema = Joi.object({
  codigo: Joi.string().max(50).trim().required().messages({
    'any.required': 'El código del saco es obligatorio',
  }),
  peso: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El peso del saco es obligatorio',
    'number.positive': 'El peso debe ser un valor positivo',
  }),
  observaciones: Joi.string().allow('', null),
});

const acopioDetalleSchema = Joi.object({
  productor_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El productor es obligatorio',
  }),
  cultivo_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El cultivo es obligatorio',
  }),
  observaciones: Joi.string().allow('', null),
  sacos: Joi.array().items(sacoSchema).min(1).required().messages({
    'array.min': 'Debe agregar al menos un saco',
    'any.required': 'Los sacos son obligatorios',
  }),
});

export const createAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  acopiador: Joi.string().max(150).trim().required().messages({
    'any.required': 'El acopiador es obligatorio',
  }),
  vehiculo: Joi.string().max(100).trim().allow('', null),
  ruta_acopio: Joi.string().max(200).trim().allow('', null),
  estado: Joi.string().valid(...estadoAcopioEnum).default('EN_PROCESO'),
  observaciones: Joi.string().allow('', null),
  detalles: Joi.array().items(acopioDetalleSchema).min(1).required().messages({
    'array.min': 'Debe agregar al menos un productor',
    'any.required': 'Los detalles de productores son obligatorios',
  }),
});

export const updateAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  fecha: Joi.date().iso(),
  acopiador: Joi.string().max(150).trim(),
  vehiculo: Joi.string().max(100).trim().allow('', null),
  ruta_acopio: Joi.string().max(200).trim().allow('', null),
  estado: Joi.string().valid(...estadoAcopioEnum),
  observaciones: Joi.string().allow('', null),
  detalles: Joi.array().items(acopioDetalleSchema).min(1),
}).min(1);

export const getAllAcopiosSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoAcopioEnum),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
