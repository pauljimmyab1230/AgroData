import Joi from 'joi';

const tipoEventoEnum = ['SIEMBRA', 'COSECHA', 'PROCESAMIENTO', 'ENVIO', 'RECEPCION', 'INSPECCION', 'ALMACENAMIENTO', 'OTRO'];

const eventoSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha del evento es obligatoria',
  }),
  titulo: Joi.string().max(200).required().messages({
    'any.required': 'El título del evento es obligatorio',
  }),
  descripcion: Joi.string().allow('', null),
  tipo: Joi.string().max(50).required().messages({
    'any.required': 'El tipo de evento es obligatorio',
  }),
  ubicacion: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
});

export const createTrazabilidadSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  lote_id: Joi.string().max(36).allow('', null),
  producto: Joi.string().max(200).required().messages({
    'any.required': 'El producto es obligatorio',
  }),
  cultivo: Joi.string().max(100).required().messages({
    'any.required': 'El cultivo es obligatorio',
  }),
  origen: Joi.string().max(200).required().messages({
    'any.required': 'El origen es obligatorio',
  }),
  productor: Joi.string().max(200).allow('', null),
  parcela: Joi.string().max(200).allow('', null),
  comunidad: Joi.string().max(150).allow('', null),
  fecha_siembra: Joi.date().iso().allow(null),
  fecha_cosecha: Joi.date().iso().allow(null),
  fecha_procesamiento: Joi.date().iso().allow(null),
  peso_total: Joi.number().precision(2).min(0).allow(null),
  unidad: Joi.string().max(10).allow('', null),
  calidad: Joi.string().max(50).allow('', null),
  certificacion: Joi.string().max(50).allow('', null),
  destino: Joi.string().max(200).allow('', null),
  estado: Joi.string().max(50).default('REGISTRADO'),
  observaciones: Joi.string().allow('', null),
  eventos: Joi.array().items(eventoSchema).default([]),
});

export const updateTrazabilidadSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  lote_id: Joi.string().max(36).allow('', null),
  producto: Joi.string().max(200),
  cultivo: Joi.string().max(100),
  origen: Joi.string().max(200),
  productor: Joi.string().max(200).allow('', null),
  parcela: Joi.string().max(200).allow('', null),
  comunidad: Joi.string().max(150).allow('', null),
  fecha_siembra: Joi.date().iso().allow(null),
  fecha_cosecha: Joi.date().iso().allow(null),
  fecha_procesamiento: Joi.date().iso().allow(null),
  peso_total: Joi.number().precision(2).min(0).allow(null),
  unidad: Joi.string().max(10).allow('', null),
  calidad: Joi.string().max(50).allow('', null),
  certificacion: Joi.string().max(50).allow('', null),
  destino: Joi.string().max(200).allow('', null),
  estado: Joi.string().max(50),
  observaciones: Joi.string().allow('', null),
  eventos: Joi.array().items(eventoSchema),
}).min(1);

export const getAllTrazabilidadSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().max(50).allow('', null),
  cultivo: Joi.string().max(100).allow('', null),
  lote_id: Joi.string().max(36).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const addEventoSchema = Joi.object({
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha del evento es obligatoria',
  }),
  titulo: Joi.string().max(200).required().messages({
    'any.required': 'El título del evento es obligatorio',
  }),
  descripcion: Joi.string().allow('', null),
  tipo: Joi.string().max(50).required().messages({
    'any.required': 'El tipo de evento es obligatorio',
  }),
  ubicacion: Joi.string().max(200).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
});
