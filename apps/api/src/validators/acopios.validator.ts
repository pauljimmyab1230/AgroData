import Joi from 'joi';

const estadoAcopioEnum = ['EN_PROCESO', 'COMPLETADO', 'EN_PLANTA'];
const estadoProductoEnum = ['EXCELENTE', 'BUENO', 'REGULAR', 'RECHAZADO'];

const sacoSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  codigo: Joi.string().max(50).required().messages({
    'any.required': 'El código del saco es obligatorio',
  }),
  peso: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El peso del saco es obligatorio',
    'number.positive': 'El peso debe ser un valor positivo',
  }),
  observaciones: Joi.string().allow('', null),
});

const fotoSchema = Joi.object({
  id: Joi.string().max(36).allow('', null),
  nombre: Joi.string().max(255).required().messages({
    'any.required': 'El nombre de la foto es obligatorio',
  }),
  descripcion: Joi.string().max(500).allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
});

export const createAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().max(36).required().messages({
    'any.required': 'La campaña es obligatoria',
  }),
  productor_id: Joi.string().max(36).required().messages({
    'any.required': 'El productor es obligatorio',
  }),
  parcela_id: Joi.string().max(36).required().messages({
    'any.required': 'La parcela es obligatoria',
  }),
  cultivo_id: Joi.string().max(36).allow('', null),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
  }),
  acopiador: Joi.string().max(150).required().messages({
    'any.required': 'El acopiador es obligatorio',
  }),
  vehiculo: Joi.string().max(100).allow('', null),
  ruta_acopio: Joi.string().max(200).allow('', null),
  lote_productor: Joi.string().max(100).allow('', null),
  total_sacos: Joi.number().integer().min(0).default(0),
  peso_total: Joi.number().precision(2).min(0).default(0),
  peso_promedio: Joi.number().precision(2).allow(null),
  peso_maximo: Joi.number().precision(2).allow(null),
  peso_minimo: Joi.number().precision(2).allow(null),
  estado: Joi.string().valid(...estadoAcopioEnum).default('EN_PROCESO'),
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null),
  observaciones_calidad: Joi.string().allow('', null),
  firma_productor_url: Joi.string().max(500).allow('', null),
  firma_acopiador_url: Joi.string().max(500).allow('', null),
  observaciones: Joi.string().allow('', null),
  sacos: Joi.array().items(sacoSchema).default([]),
  fotos: Joi.array().items(fotoSchema).default([]),
});

export const updateAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().max(36),
  productor_id: Joi.string().max(36),
  parcela_id: Joi.string().max(36),
  cultivo_id: Joi.string().max(36).allow('', null),
  fecha: Joi.date().iso(),
  acopiador: Joi.string().max(150),
  vehiculo: Joi.string().max(100).allow('', null),
  ruta_acopio: Joi.string().max(200).allow('', null),
  lote_productor: Joi.string().max(100).allow('', null),
  total_sacos: Joi.number().integer().min(0),
  peso_total: Joi.number().precision(2).min(0),
  peso_promedio: Joi.number().precision(2).allow(null),
  peso_maximo: Joi.number().precision(2).allow(null),
  peso_minimo: Joi.number().precision(2).allow(null),
  estado: Joi.string().valid(...estadoAcopioEnum),
  estado_producto: Joi.string().valid(...estadoProductoEnum).allow(null),
  humedad: Joi.number().precision(2).min(0).max(100).allow(null),
  impurezas: Joi.number().precision(2).min(0).max(100).allow(null),
  observaciones_calidad: Joi.string().allow('', null),
  firma_productor_url: Joi.string().max(500).allow('', null),
  firma_acopiador_url: Joi.string().max(500).allow('', null),
  observaciones: Joi.string().allow('', null),
  sacos: Joi.array().items(sacoSchema),
  fotos: Joi.array().items(fotoSchema),
}).min(1);

export const getAllAcopiosSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoAcopioEnum),
  campania_id: Joi.string().max(36).allow('', null),
  productor_id: Joi.string().max(36).allow('', null),
  comunidad: Joi.string().max(150).allow('', null),
  acopiador: Joi.string().max(150).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
