import Joi from 'joi';

const tipoActividadEnum = ['PREPARACION_TERRENO', 'SIEMBRA', 'RESIEMBRA', 'FERTILIZACION', 'COMPOSTAJE', 'APLICACION_BIOLES', 'CONTROL_BIOLOGICO', 'MANEJO_PLAGAS', 'MANEJO_ENFERMEDADES', 'DESHIERBIE', 'RIEGO', 'PODA', 'APORQUE', 'COSECHA', 'OTRA'];
const prioridadEnum = ['ALTA', 'MEDIA', 'BAJA'];
const estadoEnum = ['PROGRAMADA', 'EN_PROCESO', 'COMPLETADA'];
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const insumoSchema = Joi.object({
  producto: Joi.string().max(150).required(),
  categoria: Joi.string().max(100).allow('', null),
  fabricante: Joi.string().max(150).allow('', null),
  cantidad: Joi.number().min(0).allow(null),
  unidad: Joi.string().max(20).allow('', null),
  lote: Joi.string().max(100).allow('', null),
  costo_unitario: Joi.number().min(0).allow(null),
  costo_total: Joi.number().min(0).allow(null),
  observaciones: Joi.string().allow('', null),
});

const trabajadorSchema = Joi.object({
  trabajador: Joi.string().max(150).required(),
  funcion: Joi.string().max(100).allow('', null),
  jornales: Joi.number().min(0).allow(null),
  horas: Joi.number().min(0).allow(null),
  observaciones: Joi.string().allow('', null),
});

const maquinariaSchema = Joi.object({
  equipo: Joi.string().max(150).required(),
  operador: Joi.string().max(150).allow('', null),
  horas_uso: Joi.number().min(0).allow(null),
  combustible: Joi.number().min(0).allow(null),
  observaciones: Joi.string().allow('', null),
});

export const createActividadSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  cultivo_id: Joi.number().integer().positive().required().messages({ 'any.required': 'El cultivo es obligatorio' }),
  fecha: Joi.date().iso().required().messages({ 'any.required': 'La fecha es obligatoria' }),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum).required().messages({ 'any.required': 'El tipo de actividad es obligatorio' }),
  descripcion: Joi.string().allow('', null),
  responsable_tecnico: Joi.string().max(150).trim().required().messages({ 'any.required': 'El responsable técnico es obligatorio' }),
  hora_inicio: Joi.string().pattern(timePattern).allow('', null).messages({ 'string.pattern.base': 'Formato de hora inválido (HH:MM)' }),
  hora_fin: Joi.string().pattern(timePattern).allow('', null).messages({ 'string.pattern.base': 'Formato de hora inválido (HH:MM)' }),
  duracion_estimada: Joi.string().max(50).trim().allow('', null),
  prioridad: Joi.string().valid(...prioridadEnum).default('MEDIA'),
  estado: Joi.string().valid(...estadoEnum).default('PROGRAMADA'),
  jornales: Joi.number().integer().min(0).allow(null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  altitud: Joi.string().max(50).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  observaciones_tecnicas: Joi.string().allow('', null),
  recomendaciones: Joi.string().allow('', null),
  objetivo: Joi.string().allow('', null),
  resultado: Joi.string().allow('', null),
  proxima_actividad: Joi.string().max(200).trim().allow('', null),
  insumos: Joi.array().items(insumoSchema),
  mano_obra: Joi.array().items(trabajadorSchema),
  maquinaria: Joi.array().items(maquinariaSchema),
});

export const updateActividadSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  cultivo_id: Joi.number().integer().positive(),
  fecha: Joi.date().iso(),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum),
  descripcion: Joi.string().allow('', null),
  responsable_tecnico: Joi.string().max(150).trim(),
  hora_inicio: Joi.string().pattern(timePattern).allow('', null).messages({ 'string.pattern.base': 'Formato de hora inválido (HH:MM)' }),
  hora_fin: Joi.string().pattern(timePattern).allow('', null).messages({ 'string.pattern.base': 'Formato de hora inválido (HH:MM)' }),
  duracion_estimada: Joi.string().max(50).trim().allow('', null),
  prioridad: Joi.string().valid(...prioridadEnum),
  estado: Joi.string().valid(...estadoEnum),
  jornales: Joi.number().integer().min(0).allow(null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  altitud: Joi.string().max(50).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  observaciones_tecnicas: Joi.string().allow('', null),
  recomendaciones: Joi.string().allow('', null),
  objetivo: Joi.string().allow('', null),
  resultado: Joi.string().allow('', null),
  proxima_actividad: Joi.string().max(200).trim().allow('', null),
  insumos: Joi.array().items(insumoSchema),
  mano_obra: Joi.array().items(trabajadorSchema),
  maquinaria: Joi.array().items(maquinariaSchema),
}).min(1);

export const getAllActividadesSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoEnum),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum),
  cultivo_id: Joi.number().integer().positive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
