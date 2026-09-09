import Joi from 'joi';

const estadoCultivoEnum = ['EN_CRECIMIENTO', 'COSECHADO', 'PERDIDO'];
const metodoSiembraEnum = ['DIRECTA', 'TRASPLANTE', 'ALMACIGO', 'OTRO'];
const sistemaProductivoEnum = ['AGROECOLOGICO', 'ORGANICO', 'CONVENCIONAL', 'EN_TRANSICION'];
const tipoAgriculturaEnum = ['TRADICIONAL', 'TECNIFICADA', 'MIXTA'];
const certificacionCultivoEnum = ['ORGANICA', 'EN_TRANSICION', 'SIN_CERTIFICAR'];
const procedenciaSemillaEnum = ['CERTIFICADA', 'COMUN', 'PRODUCIDA_EN_CAMPO', 'CONSERVADA_POR_AGRICULTOR'];
const destinoProduccionEnum = ['VENTA_COOPERATIVA', 'COMERCIALIZACION_LOCAL', 'AUTOCONSUMO', 'SEMILLA'];

const fechaSiembraCosechaValidation = Joi.object({
  fecha_siembra: Joi.date().iso().allow(null),
  fecha_cosecha: Joi.date().iso().allow(null),
}).custom((obj, helpers) => {
  if (obj.fecha_siembra && obj.fecha_cosecha) {
    const siembra = new Date(obj.fecha_siembra);
    const cosecha = new Date(obj.fecha_cosecha);
    if (cosecha <= siembra) {
      return helpers.error('any.invalid', { message: 'La fecha de cosecha debe ser posterior a la fecha de siembra' });
    }
  }
  return obj;
}).messages({
  'any.invalid': '{{#message}}',
});

export const createCultivoSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  campania_id: Joi.number().integer().positive().required().messages({
    'any.required': 'La campaña es obligatoria',
    'number.base': 'La campaña debe ser un número válido',
    'number.positive': 'La campaña debe ser un ID válido',
  }),
  parcela_id: Joi.number().integer().positive().required().messages({
    'any.required': 'La parcela es obligatoria',
    'number.base': 'La parcela debe ser un número válido',
    'number.positive': 'La parcela debe ser un ID válido',
  }),
  cultivo: Joi.string().max(100).trim().required().messages({
    'any.required': 'El cultivo es obligatorio',
    'string.empty': 'El cultivo no puede estar vacío',
  }),
  variedad: Joi.string().max(100).trim().allow('', null),
  area_sembrada: Joi.number().positive().precision(2).allow(null).messages({
    'number.positive': 'La área sembrada debe ser un valor positivo',
  }),
  fecha_siembra: Joi.date().iso().allow(null),
  metodo_siembra: Joi.string().valid(...metodoSiembraEnum).allow(null),
  sistema_productivo: Joi.string().valid(...sistemaProductivoEnum).allow(null),
  tipo_agricultura: Joi.string().valid(...tipoAgriculturaEnum).allow(null),
  certificacion: Joi.string().valid(...certificacionCultivoEnum).default('SIN_CERTIFICAR'),
  procedencia_semilla: Joi.string().valid(...procedenciaSemillaEnum).allow(null),
  cantidad_semilla: Joi.number().min(0).precision(2).allow(null),
  unidad_semilla: Joi.string().max(10).trim().allow('', null),
  fecha_cosecha: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoCultivoEnum).default('EN_CRECIMIENTO'),
  observaciones: Joi.string().allow('', null),
  rendimiento_esperado: Joi.number().min(0).precision(2).allow(null),
  produccion_estimada: Joi.number().min(0).precision(2).allow(null),
  destino_produccion: Joi.string().valid(...destinoProduccionEnum).allow(null),
  distanciamiento_surcos: Joi.string().max(50).trim().allow('', null),
  distanciamiento_plantas: Joi.string().max(50).trim().allow('', null),
  densidad_siembra: Joi.string().max(50).trim().allow('', null),
  tipo_semilla: Joi.string().max(100).trim().allow('', null),
  lote_semilla: Joi.string().max(100).trim().allow('', null),
  proveedor_semilla: Joi.string().max(150).trim().allow('', null),
}).concat(fechaSiembraCosechaValidation);

export const updateCultivoSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  campania_id: Joi.number().integer().positive(),
  parcela_id: Joi.number().integer().positive(),
  cultivo: Joi.string().max(100).trim(),
  variedad: Joi.string().max(100).trim().allow('', null),
  area_sembrada: Joi.number().positive().precision(2).allow(null),
  fecha_siembra: Joi.date().iso().allow(null),
  metodo_siembra: Joi.string().valid(...metodoSiembraEnum).allow(null),
  sistema_productivo: Joi.string().valid(...sistemaProductivoEnum).allow(null),
  tipo_agricultura: Joi.string().valid(...tipoAgriculturaEnum).allow(null),
  certificacion: Joi.string().valid(...certificacionCultivoEnum),
  procedencia_semilla: Joi.string().valid(...procedenciaSemillaEnum).allow(null),
  cantidad_semilla: Joi.number().min(0).precision(2).allow(null),
  unidad_semilla: Joi.string().max(10).trim().allow('', null),
  fecha_cosecha: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoCultivoEnum),
  observaciones: Joi.string().allow('', null),
  rendimiento_esperado: Joi.number().min(0).precision(2).allow(null),
  produccion_estimada: Joi.number().min(0).precision(2).allow(null),
  destino_produccion: Joi.string().valid(...destinoProduccionEnum).allow(null),
  distanciamiento_surcos: Joi.string().max(50).trim().allow('', null),
  distanciamiento_plantas: Joi.string().max(50).trim().allow('', null),
  densidad_siembra: Joi.string().max(50).trim().allow('', null),
  tipo_semilla: Joi.string().max(100).trim().allow('', null),
  lote_semilla: Joi.string().max(100).trim().allow('', null),
  proveedor_semilla: Joi.string().max(150).trim().allow('', null),
}).min(1).concat(fechaSiembraCosechaValidation);

export const getAllCultivosSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoCultivoEnum),
  campania_id: Joi.number().integer().positive(),
  parcela_id: Joi.number().integer().positive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const getStatsCultivosSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoCultivoEnum),
  campania_id: Joi.number().integer().positive(),
});
