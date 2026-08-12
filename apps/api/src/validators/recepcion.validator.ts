import Joi from 'joi';

const estadoRecepcionEnum = ['PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA'];
const estadoProductoEnum = ['EXCELENTE', 'BUENO', 'REGULAR', 'RECHAZADO'];
const categoriaRecepcionEnum = ['PRIMERA', 'SEGUNDA', 'INDUSTRIAL', 'DESCARTE'];
const destinoRecepcionEnum = ['PROCESAMIENTO', 'ALMACEN_TEMPORAL', 'RECHAZADO'];
const resultadoRecepcionEnum = ['ACEPTADO', 'ACEPTADO_CON_OBSERVACIONES', 'RECHAZADO'];

const evidenciaSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  nombre: Joi.string().max(255).required().messages({
    'any.required': 'El nombre de la evidencia es obligatorio',
  }),
  descripcion: Joi.string().max(500).allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
});

export const createRecepcionSchema = Joi.object({
  campania_id: Joi.string().max(36).required().messages({
    'any.required': 'La campaña es obligatoria',
  }),
  acopio_id: Joi.string().max(36).allow('', null),
  lote_productor: Joi.string().max(100).required().messages({
    'any.required': 'El lote del productor es obligatorio',
  }),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  responsable: Joi.string().max(150).required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  planta: Joi.string().max(100).required().messages({
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
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null),
  categoria: Joi.string().valid(...categoriaRecepcionEnum).allow(null),
  destino: Joi.string().valid(...destinoRecepcionEnum).allow(null),
  resultado: Joi.string().valid(...resultadoRecepcionEnum).allow(null),
  motivo: Joi.string().allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum).default('PENDIENTE_PESAJE'),
  observaciones: Joi.string().allow('', null),
  documento_firmado: Joi.boolean().default(false),
  firma_responsable_url: Joi.string().max(500).allow('', null),
  evidencias: Joi.array().items(evidenciaSchema).default([]),
});

export const updateRecepcionSchema = Joi.object({
  campania_id: Joi.string().max(36),
  acopio_id: Joi.string().max(36).allow('', null),
  lote_productor: Joi.string().max(100),
  fecha: Joi.date().iso(),
  responsable: Joi.string().max(150),
  planta: Joi.string().max(100),
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
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null),
  categoria: Joi.string().valid(...categoriaRecepcionEnum).allow(null),
  destino: Joi.string().valid(...destinoRecepcionEnum).allow(null),
  resultado: Joi.string().valid(...resultadoRecepcionEnum).allow(null),
  motivo: Joi.string().allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum),
  observaciones: Joi.string().allow('', null),
  documento_firmado: Joi.boolean(),
  firma_responsable_url: Joi.string().max(500).allow('', null),
}).min(1);

export const getAllRecepcionesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoRecepcionEnum),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
