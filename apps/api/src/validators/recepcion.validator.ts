import Joi from 'joi';

const estadoRecepcionEnum = ['PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA'];
const categoriaEnum = ['PRIMERA', 'SEGUNDA', 'TERCERA', 'RECHAZADA'];
const destinoEnum = ['PROCESAMIENTO', 'ALMACENAMIENTO', 'DEVOLUCION', 'RECHAZO'];
const resultadoEnum = ['ACEPTADO', 'ACEPTADO_CON_OBSERVACIONES', 'RECHAZADO'];

const sacoSchema = Joi.object({
  codigo: Joi.string().max(50).required(),
  peso: Joi.number().precision(2).min(0).required(),
  observaciones: Joi.string().allow('', null),
});

export const createRecepcionSchema = Joi.object({
  acopio_id: Joi.number().integer().positive().allow(null),
  lote_productor: Joi.string().max(100).allow('', null),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  responsable: Joi.string().max(150).trim().required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  planta: Joi.string().max(100).trim().required().messages({
    'any.required': 'La planta es obligatoria',
  }),
  sacos: Joi.number().integer().min(0).default(0),
  peso_campo: Joi.number().precision(2).min(0).allow(null),
  peso_bruto: Joi.number().precision(2).min(0).allow(null),
  tara: Joi.number().precision(2).min(0).allow(null),
  peso_neto: Joi.number().precision(2).min(0).allow(null),
  diferencia: Joi.number().precision(2).allow(null),
  merma: Joi.number().precision(2).min(0).max(100).allow(null),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null),
  materia_extrana: Joi.number().precision(2).min(0).max(100).allow(null),
  color: Joi.string().max(50).allow('', null),
  olor: Joi.string().max(50).allow('', null),
  presencia_insectos: Joi.string().max(50).allow('', null),
  estado_producto: Joi.string().max(50).allow('', null),
  categoria: Joi.string().valid(...categoriaEnum).allow(null),
  destino: Joi.string().valid(...destinoEnum).allow(null),
  resultado: Joi.string().valid(...resultadoEnum).allow(null),
  motivo: Joi.string().allow('', null),
  observaciones: Joi.string().allow('', null),
  documento_firmado: Joi.boolean().default(false),
  firma_responsable_url: Joi.string().max(500).allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum).default('PENDIENTE_PESAJE'),
  sacos_detalle: Joi.array().items(sacoSchema).default([]),
});

export const updateRecepcionSchema = Joi.object({
  acopio_id: Joi.number().integer().positive().allow(null),
  lote_productor: Joi.string().max(100).allow('', null),
  fecha: Joi.date().iso(),
  responsable: Joi.string().max(150).trim(),
  planta: Joi.string().max(100).trim(),
  sacos: Joi.number().integer().min(0),
  peso_campo: Joi.number().precision(2).min(0).allow(null),
  peso_bruto: Joi.number().precision(2).min(0).allow(null),
  tara: Joi.number().precision(2).min(0).allow(null),
  peso_neto: Joi.number().precision(2).min(0).allow(null),
  diferencia: Joi.number().precision(2).allow(null),
  merma: Joi.number().precision(2).min(0).max(100).allow(null),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null),
  materia_extrana: Joi.number().precision(2).min(0).max(100).allow(null),
  color: Joi.string().max(50).allow('', null),
  olor: Joi.string().max(50).allow('', null),
  presencia_insectos: Joi.string().max(50).allow('', null),
  estado_producto: Joi.string().max(50).allow('', null),
  categoria: Joi.string().valid(...categoriaEnum).allow(null),
  destino: Joi.string().valid(...destinoEnum).allow(null),
  resultado: Joi.string().valid(...resultadoEnum).allow(null),
  motivo: Joi.string().allow('', null),
  observaciones: Joi.string().allow('', null),
  documento_firmado: Joi.boolean(),
  firma_responsable_url: Joi.string().max(500).allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum),
  sacos_detalle: Joi.array().items(sacoSchema),
}).min(1);

export const getAllRecepcionesSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
