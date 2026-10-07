import Joi from 'joi';
import { idParamSchema } from './common.validator';

const ETAPAS = ['PRIMARIA', 'SECUNDARIA', 'EMPAQUE'] as const;
const FORMATOS = ['GRANO', 'HARINA', 'HOJUELA', 'POP', 'GRANEL', 'OTRO'] as const;
const TIPOS_SALIDA = ['PRODUCTO_BUENO', 'MERMA', 'PIEDRAS', 'SAPONINA', 'ENVASE', 'OTRO'] as const;
const DESTINOS = ['KARDEX', 'DESCARTE', 'REPROCESO', 'SUBPRODUCTO', 'VENTA_DIRECTA'] as const;
const UNIDADES = ['KG', 'UNIDAD', 'LT'] as const;
const ESTADOS_ORDEN = ['BORRADOR', 'EN_PROCESO', 'FINALIZADO', 'PAUSADA', 'CANCELADA'] as const;
const CALIDADES = ['PRIMERA', 'SEGUNDA', 'TERCERA', 'DESCARTE'] as const;

// ==================== Operaciones de proceso ====================
export const createOperacionSchema = Joi.object({
  codigo: Joi.string().min(2).max(20).required().messages({
    'any.required': 'El código es obligatorio',
    'string.min': 'El código debe tener al menos 2 caracteres',
    'string.max': 'El código no debe exceder 20 caracteres',
  }),
  nombre: Joi.string().min(2).max(100).required().messages({
    'any.required': 'El nombre es obligatorio',
  }),
  descripcion: Joi.string().max(500).allow('', null).optional(),
  orden: Joi.number().integer().min(0).default(0),
  activo: Joi.boolean().default(true),
});

export const updateOperacionSchema = createOperacionSchema
  .fork(['codigo', 'nombre'], (s) => s.optional())
  .min(1);

// ==================== Recetas ====================
const recetaOperacionSchema = Joi.object({
  operacion_id: Joi.number().integer().positive().required(),
  orden: Joi.number().integer().min(0).optional(),
  requerida: Joi.boolean().default(true),
  parametros_default: Joi.string().max(1000).allow('', null).optional(),
});

export const createRecetaSchema = Joi.object({
  codigo: Joi.string().min(2).max(20).required(),
  nombre: Joi.string().min(2).max(150).required(),
  producto_base: Joi.string().min(2).max(100).required(),
  etapa: Joi.string().valid(...ETAPAS).required(),
  formato_salida: Joi.string().valid(...FORMATOS).allow(null).optional(),
  descripcion: Joi.string().max(2000).allow('', null).optional(),
  activo: Joi.boolean().default(true),
  operaciones: Joi.array().items(recetaOperacionSchema).default([]),
});

export const updateRecetaSchema = createRecetaSchema
  .fork(['codigo', 'nombre', 'producto_base', 'etapa'], (s) => s.optional())
  .min(1);

// ==================== Órdenes de procesamiento ====================
const recepcionAsignadaSchema = Joi.object({
  recepcion_id: Joi.number().integer().positive().required(),
  cantidad_asignada: Joi.number().positive().required().messages({
    'number.positive': 'La cantidad asignada debe ser positiva',
    'any.required': 'La cantidad asignada es obligatoria',
  }),
  observaciones: Joi.string().max(500).allow('', null).optional(),
});

const operacionOrdenSchema = Joi.object({
  operacion_id: Joi.number().integer().positive().required(),
  orden: Joi.number().integer().min(0).optional(),
});

export const createOrdenSchema = Joi.object({
  planta: Joi.string().min(2).max(100).required().messages({
    'any.required': 'La planta es obligatoria',
  }),
  responsable: Joi.string().min(2).max(150).required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  fecha_inicio: Joi.date().required().messages({
    'any.required': 'La fecha de inicio es obligatoria',
  }),
  fecha_fin: Joi.date().allow(null).optional(),
  etapa: Joi.string().valid(...ETAPAS).required(),
  formato_salida: Joi.string().valid(...FORMATOS).default('GRANO'),
  receta_id: Joi.number().integer().positive().allow(null).optional(),
  orden_origen_id: Joi.number().integer().positive().allow(null).optional(),
  producto_salida: Joi.string().min(2).max(150).required().messages({
    'any.required': 'El producto de salida es obligatorio',
  }),
  peso_entrada: Joi.number().min(0).default(0),
  humedad_final: Joi.number().min(0).max(100).allow(null).optional(),
  calidad: Joi.string().valid(...CALIDADES).allow(null).optional(),
  observaciones: Joi.string().max(2000).allow('', null).optional(),
  operaciones: Joi.array().items(operacionOrdenSchema).optional(),
  recepciones: Joi.array().items(recepcionAsignadaSchema).optional(),
});

export const updateOrdenSchema = createOrdenSchema
  .fork(
    ['planta', 'responsable', 'fecha_inicio', 'etapa', 'producto_salida'],
    (s) => s.optional(),
  )
  .min(1);

export const listOrdenesQuerySchema = Joi.object({
  search: Joi.string().max(100).allow('', null).optional(),
  estado: Joi.string().valid(...ESTADOS_ORDEN).allow('', null).optional(),
  etapa: Joi.string().valid(...ETAPAS).allow('', null).optional(),
  formato_salida: Joi.string().valid(...FORMATOS).allow('', null).optional(),
  receta_id: Joi.number().integer().positive().allow('', null).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// ==================== Operaciones ejecutadas ====================
export const createOperacionEjecutadaSchema = Joi.object({
  operacion_id: Joi.number().integer().positive().required(),
  orden: Joi.number().integer().min(0).default(0),
  fecha: Joi.date().optional(),
  operario: Joi.string().max(150).allow('', null).optional(),
  peso_antes: Joi.number().min(0).allow(null).optional(),
  peso_despues: Joi.number().min(0).allow(null).optional(),
  humedad: Joi.number().min(0).max(100).allow(null).optional(),
  resultado: Joi.string().max(50).allow('', null).optional(),
  observaciones: Joi.string().max(1000).allow('', null).optional(),
  completada: Joi.boolean().default(true),
});

export const updateOperacionEjecutadaSchema = createOperacionEjecutadaSchema
  .fork(['operacion_id'], (s) => s.optional())
  .min(1);

// ==================== Salidas pesadas ====================
export const createSalidaSchema = Joi.object({
  tipo_salida: Joi.string().valid(...TIPOS_SALIDA).required().messages({
    'any.required': 'El tipo de salida es obligatorio',
  }),
  descripcion: Joi.string().min(2).max(200).required().messages({
    'any.required': 'La descripción es obligatoria',
  }),
  cantidad: Joi.number().positive().required().messages({
    'number.positive': 'La cantidad debe ser positiva',
    'any.required': 'La cantidad es obligatoria',
  }),
  unidad: Joi.string().valid(...UNIDADES).default('KG'),
  humedad: Joi.number().min(0).max(100).allow(null).optional(),
  destino: Joi.string().valid(...DESTINOS).default('SUBPRODUCTO'),
  cuenta_en_balance: Joi.boolean().optional(),
  observaciones: Joi.string().max(1000).allow('', null).optional(),
});

export const updateSalidaSchema = createSalidaSchema
  .fork(['tipo_salida', 'descripcion', 'cantidad'], (s) => s.optional())
  .min(1);

// ==================== Params ====================
export const idSalidaParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  salidaId: Joi.number().integer().positive().required(),
});

export const idOperacionOrdenParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  operacionOrdenId: Joi.number().integer().positive().required(),
});

export { idParamSchema };
