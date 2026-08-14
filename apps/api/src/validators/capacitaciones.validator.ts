import Joi from 'joi';

const tipoCapacitacionEnum = ['PRODUCTORES', 'PERSONAL_SIC'];

export const createCapacitacionSchema = Joi.object({
  tipo: Joi.string().valid(...tipoCapacitacionEnum).required().messages({
    'any.required': 'El tipo de capacitación es obligatorio',
    'any.only': 'El tipo debe ser PRODUCTORES o PERSONAL_SIC',
  }),
  tema: Joi.string().min(3).max(200).required().messages({
    'string.min': 'El tema debe tener al menos 3 caracteres',
    'any.required': 'El tema es obligatorio',
  }),
  descripcion: Joi.string().allow('', null),
  capacitador: Joi.string().min(2).max(150).required().messages({
    'any.required': 'El capacitador es obligatorio',
  }),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  hora_inicio: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('', null),
  hora_fin: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('', null),
  duracion_horas: Joi.number().positive().max(24).allow(null),
  lugar: Joi.string().min(2).max(200).required().messages({
    'any.required': 'El lugar es obligatorio',
  }),
  departamento: Joi.string().max(100).allow('', null),
  provincia: Joi.string().max(100).allow('', null),
  distrito: Joi.string().max(100).allow('', null),
  material_entregado: Joi.string().allow('', null),
  observaciones: Joi.string().allow('', null),
  participantes: Joi.array().items(Joi.object({
    productor_id: Joi.string().uuid().allow(null),
    usuario_id: Joi.string().uuid().allow(null),
    asistio: Joi.boolean().default(false),
    firma_url: Joi.string().uri().allow('', null),
    observaciones: Joi.string().allow('', null),
  })).default([]),
});

export const updateCapacitacionSchema = Joi.object({
  tipo: Joi.string().valid(...tipoCapacitacionEnum),
  tema: Joi.string().min(3).max(200),
  descripcion: Joi.string().allow('', null),
  capacitador: Joi.string().min(2).max(150),
  fecha: Joi.date().iso(),
  hora_inicio: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('', null),
  hora_fin: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('', null),
  duracion_horas: Joi.number().positive().max(24).allow(null),
  lugar: Joi.string().min(2).max(200),
  departamento: Joi.string().max(100).allow('', null),
  provincia: Joi.string().max(100).allow('', null),
  distrito: Joi.string().max(100).allow('', null),
  material_entregado: Joi.string().allow('', null),
  observaciones: Joi.string().allow('', null),
}).min(1);

export const addParticipanteSchema = Joi.object({
  productor_id: Joi.string().uuid().allow(null),
  usuario_id: Joi.string().uuid().allow(null),
  asistio: Joi.boolean().default(false),
  firma_url: Joi.string().uri().allow('', null),
  observaciones: Joi.string().allow('', null),
}).or('productor_id', 'usuario_id');

export const updateParticipanteSchema = Joi.object({
  asistio: Joi.boolean(),
  firma_url: Joi.string().uri().allow('', null),
  observaciones: Joi.string().allow('', null),
}).min(1);

export const getAllCapacitacionesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  tipo: Joi.string().valid(...tipoCapacitacionEnum),
  fecha_inicio: Joi.date().iso(),
  fecha_fin: Joi.date().iso(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
