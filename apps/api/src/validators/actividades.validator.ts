import Joi from 'joi';

const tipoActividadEnum = ['PREPARACION_TERRENO', 'SIEMBRA', 'RESIEMBRA', 'FERTILIZACION', 'COMPOSTAJE', 'APLICACION_BIOLES', 'CONTROL_BIOLOGICO', 'MANEJO_PLAGAS', 'MANEJO_ENFERMEDADES', 'DESHIERBIE', 'RIEGO', 'PODA', 'APORQUE', 'COSECHA', 'OTRA'];
const prioridadEnum = ['ALTA', 'MEDIA', 'BAJA'];
const estadoEnum = ['PROGRAMADA', 'EN_PROCESO', 'COMPLETADA'];

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
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid().required().messages({ 'any.required': 'La campaña es obligatoria' }),
  productor_id: Joi.string().uuid().required().messages({ 'any.required': 'El productor es obligatorio' }),
  parcela_id: Joi.string().uuid().required().messages({ 'any.required': 'La parcela es obligatoria' }),
  cultivo_id: Joi.string().uuid().allow(null),
  fecha: Joi.date().iso().required().messages({ 'any.required': 'La fecha es obligatoria' }),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum).required().messages({ 'any.required': 'El tipo de actividad es obligatorio' }),
  descripcion: Joi.string().allow('', null),
  responsable_tecnico: Joi.string().max(150).required().messages({ 'any.required': 'El responsable técnico es obligatorio' }),
  hora_inicio: Joi.string().max(5).allow('', null),
  hora_fin: Joi.string().max(5).allow('', null),
  duracion_estimada: Joi.string().max(50).allow('', null),
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
  proxima_actividad: Joi.string().max(200).allow('', null),
  insumos: Joi.array().items(insumoSchema),
  mano_obra: Joi.array().items(trabajadorSchema),
  maquinaria: Joi.array().items(maquinariaSchema),
});

export const updateActividadSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  cultivo_id: Joi.string().uuid().allow(null),
  fecha: Joi.date().iso(),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum),
  descripcion: Joi.string().allow('', null),
  responsable_tecnico: Joi.string().max(150),
  hora_inicio: Joi.string().max(5).allow('', null),
  hora_fin: Joi.string().max(5).allow('', null),
  duracion_estimada: Joi.string().max(50).allow('', null),
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
  proxima_actividad: Joi.string().max(200).allow('', null),
  insumos: Joi.array().items(insumoSchema),
  mano_obra: Joi.array().items(trabajadorSchema),
  maquinaria: Joi.array().items(maquinariaSchema),
}).min(1);

export const getAllActividadesSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoEnum),
  tipo_actividad: Joi.string().valid(...tipoActividadEnum),
  campania_id: Joi.string().uuid(),
  productor_id: Joi.string().uuid(),
  parcela_id: Joi.string().uuid(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
