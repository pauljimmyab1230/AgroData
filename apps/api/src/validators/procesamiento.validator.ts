import Joi from 'joi';

const estadoProcesamientoEnum = ['REGISTRADA', 'EN_PROCESO', 'COMPLETADA', 'PAUSADA', 'CANCELADA'];
const estadoOperacionEnum = ['PENDIENTE', 'EN_CURSO', 'COMPLETADA', 'NO_APLICA'];
const lineaProcesamientoEnum = ['GRANOS', 'TUBERCULOS', 'LEGUMBRES', 'SEMILLAS'];
const calidadProductoEnum = ['PRIMERA', 'SEGUNDA', 'TERCERA', 'DESCARTE'];

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

const evidenciaSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  nombre: Joi.string().max(255).required().messages({
    'any.required': 'El nombre de la evidencia es obligatorio',
  }),
  descripcion: Joi.string().max(500).allow('', null),
  tipo: Joi.string().max(50).allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
});

export const createProcesamientoSchema = Joi.object({
  campania_id: Joi.string().max(36).required().messages({
    'any.required': 'La campaña es obligatoria',
  }),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  producto: Joi.string().max(100).required().messages({
    'any.required': 'El producto es obligatorio',
  }),
  responsable: Joi.string().max(150).required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  planta: Joi.string().max(100).required().messages({
    'any.required': 'La planta es obligatoria',
  }),
  linea_procesamiento: Joi.string().valid(...lineaProcesamientoEnum).required().messages({
    'any.required': 'La línea de procesamiento es obligatoria',
  }),
  estado: Joi.string().valid(...estadoProcesamientoEnum).default('REGISTRADA'),
  observaciones: Joi.string().allow('', null),
  peso_entrada: Joi.number().precision(2).min(0).allow(null),
  peso_salida: Joi.number().precision(2).min(0).allow(null),
  merma: Joi.number().precision(2).min(0).allow(null),
  rendimiento: Joi.number().precision(2).min(0).max(100).allow(null),
  producto_base: Joi.string().max(100).allow('', null),
  calidad_producto: Joi.string().valid(...calidadProductoEnum).allow(null),
  peso_final: Joi.number().precision(2).min(0).allow(null),
  humedad_final: Joi.number().precision(2).min(0).max(100).allow(null),
  lotes: Joi.array().items(loteSchema).default([]),
  operaciones: Joi.array().items(operacionSchema).default([]),
  evidencias: Joi.array().items(evidenciaSchema).default([]),
});

export const updateProcesamientoSchema = Joi.object({
  campania_id: Joi.string().max(36),
  fecha: Joi.date().iso(),
  producto: Joi.string().max(100),
  responsable: Joi.string().max(150),
  planta: Joi.string().max(100),
  linea_procesamiento: Joi.string().valid(...lineaProcesamientoEnum),
  estado: Joi.string().valid(...estadoProcesamientoEnum),
  observaciones: Joi.string().allow('', null),
  peso_entrada: Joi.number().precision(2).min(0).allow(null),
  peso_salida: Joi.number().precision(2).min(0).allow(null),
  merma: Joi.number().precision(2).min(0).allow(null),
  rendimiento: Joi.number().precision(2).min(0).max(100).allow(null),
  producto_base: Joi.string().max(100).allow('', null),
  calidad_producto: Joi.string().valid(...calidadProductoEnum).allow(null),
  peso_final: Joi.number().precision(2).min(0).allow(null),
  humedad_final: Joi.number().precision(2).min(0).max(100).allow(null),
}).min(1);

export const getAllProcesamientosSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoProcesamientoEnum),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

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
