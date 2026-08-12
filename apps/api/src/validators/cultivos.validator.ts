import Joi from 'joi';

const estadoCultivoEnum = ['ACTIVO', 'EN_DESARROLLO', 'COSECHADO', 'FINALIZADO'];
const metodoSiembraEnum = ['DIRECTA', 'TRASPLANTE', 'ALMACIGO', 'OTRO'];
const sistemaProductivoEnum = ['AGROECOLOGICO', 'ORGANICO', 'CONVENCIONAL', 'EN_TRANSICION'];
const tipoAgriculturaEnum = ['TRADICIONAL', 'TECNIFICADA', 'MIXTA'];
const certificacionCultivoEnum = ['ORGANICA', 'EN_TRANSICION', 'SIN_CERTIFICAR'];
const procedenciaSemillaEnum = ['CERTIFICADA', 'COMUN', 'PRODUCIDA_EN_CAMPO', 'CONSERVADA_POR_AGRICULTOR'];
const destinoProduccionEnum = ['VENTA_COOPERATIVA', 'COMERCIALIZACION_LOCAL', 'AUTOCONSUMO', 'SEMILLA'];

export const createCultivoSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid().required().messages({
    'any.required': 'La campaña es obligatoria',
  }),
  productor_id: Joi.string().uuid().required().messages({
    'any.required': 'El productor es obligatorio',
  }),
  parcela_id: Joi.string().uuid().required().messages({
    'any.required': 'La parcela es obligatoria',
  }),
  cultivo: Joi.string().max(100).required().messages({
    'any.required': 'El cultivo es obligatorio',
  }),
  variedad: Joi.string().max(100).allow('', null),
  area_sembrada: Joi.number().positive().allow(null),
  fecha_siembra: Joi.date().iso().allow(null),
  metodo_siembra: Joi.string().valid(...metodoSiembraEnum).allow(null),
  sistema_productivo: Joi.string().valid(...sistemaProductivoEnum).allow(null),
  tipo_agricultura: Joi.string().valid(...tipoAgriculturaEnum).allow(null),
  certificacion: Joi.string().valid(...certificacionCultivoEnum).default('SIN_CERTIFICAR'),
  procedencia_semilla: Joi.string().valid(...procedenciaSemillaEnum).allow(null),
  cantidad_semilla: Joi.number().min(0).allow(null),
  unidad_semilla: Joi.string().max(10).allow('', null),
  fecha_emergencia: Joi.date().iso().allow(null),
  fecha_floracion: Joi.date().iso().allow(null),
  fecha_cosecha: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoCultivoEnum).default('ACTIVO'),
  observaciones: Joi.string().allow('', null),
  estado_fenologico: Joi.string().max(100).allow('', null),
  rendimiento_esperado: Joi.number().min(0).allow(null),
  produccion_estimada: Joi.number().min(0).allow(null),
  destino_produccion: Joi.string().valid(...destinoProduccionEnum).allow(null),
  distanciamiento_surcos: Joi.string().max(50).allow('', null),
  distanciamiento_plantas: Joi.string().max(50).allow('', null),
  densidad_siembra: Joi.string().max(50).allow('', null),
  tipo_semilla: Joi.string().max(100).allow('', null),
  lote_semilla: Joi.string().max(100).allow('', null),
  proveedor_semilla: Joi.string().max(150).allow('', null),
});

export const updateCultivoSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  cultivo: Joi.string().max(100),
  variedad: Joi.string().max(100).allow('', null),
  area_sembrada: Joi.number().positive().allow(null),
  fecha_siembra: Joi.date().iso().allow(null),
  metodo_siembra: Joi.string().valid(...metodoSiembraEnum).allow(null),
  sistema_productivo: Joi.string().valid(...sistemaProductivoEnum).allow(null),
  tipo_agricultura: Joi.string().valid(...tipoAgriculturaEnum).allow(null),
  certificacion: Joi.string().valid(...certificacionCultivoEnum),
  procedencia_semilla: Joi.string().valid(...procedenciaSemillaEnum).allow(null),
  cantidad_semilla: Joi.number().min(0).allow(null),
  unidad_semilla: Joi.string().max(10).allow('', null),
  fecha_emergencia: Joi.date().iso().allow(null),
  fecha_floracion: Joi.date().iso().allow(null),
  fecha_cosecha: Joi.date().iso().allow(null),
  estado: Joi.string().valid(...estadoCultivoEnum),
  observaciones: Joi.string().allow('', null),
  estado_fenologico: Joi.string().max(100).allow('', null),
  rendimiento_esperado: Joi.number().min(0).allow(null),
  produccion_estimada: Joi.number().min(0).allow(null),
  destino_produccion: Joi.string().valid(...destinoProduccionEnum).allow(null),
  distanciamiento_surcos: Joi.string().max(50).allow('', null),
  distanciamiento_plantas: Joi.string().max(50).allow('', null),
  densidad_siembra: Joi.string().max(50).allow('', null),
  tipo_semilla: Joi.string().max(100).allow('', null),
  lote_semilla: Joi.string().max(100).allow('', null),
  proveedor_semilla: Joi.string().max(150).allow('', null),
}).min(1);

export const getAllCultivosSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoCultivoEnum),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
