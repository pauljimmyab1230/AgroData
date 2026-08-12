import Joi from 'joi';

const estadoCampaniaEnum = ['PLANIFICADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA'];

export const createCampaniaSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200).required().messages({
    'any.required': 'El nombre es obligatorio',
  }),
  anio_agricola: Joi.string().max(10).required().messages({
    'any.required': 'El año agrícola es obligatorio',
  }),
  fecha_inicio: Joi.date().iso().required().messages({
    'any.required': 'La fecha de inicio es obligatoria',
  }),
  fecha_fin: Joi.date().iso().required().messages({
    'any.required': 'La fecha de fin es obligatoria',
  }),
  descripcion: Joi.string().allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum).default('PLANIFICADA'),
  responsable: Joi.string().max(150).required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  tecnico_coordinador: Joi.string().max(150).required().messages({
    'any.required': 'El técnico coordinador es obligatorio',
  }),
  objetivo: Joi.string().allow('', null),
  permitir_cultivos: Joi.boolean().default(true),
  permitir_actividades: Joi.boolean().default(true),
  permitir_cosechas: Joi.boolean().default(true),
  permitir_inspecciones: Joi.boolean().default(true),
  permitir_acopio: Joi.boolean().default(true),
  permitir_procesamiento: Joi.boolean().default(true),
  visible: Joi.boolean().default(true),
  activa: Joi.boolean().default(false),
  observaciones: Joi.string().allow('', null),
});

export const updateCampaniaSchema = Joi.object({
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200),
  anio_agricola: Joi.string().max(10),
  fecha_inicio: Joi.date().iso(),
  fecha_fin: Joi.date().iso(),
  descripcion: Joi.string().allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum),
  responsable: Joi.string().max(150),
  tecnico_coordinador: Joi.string().max(150),
  objetivo: Joi.string().allow('', null),
  permitir_cultivos: Joi.boolean(),
  permitir_actividades: Joi.boolean(),
  permitir_cosechas: Joi.boolean(),
  permitir_inspecciones: Joi.boolean(),
  permitir_acopio: Joi.boolean(),
  permitir_procesamiento: Joi.boolean(),
  visible: Joi.boolean(),
  activa: Joi.boolean(),
  observaciones: Joi.string().allow('', null),
}).min(1);

export const getAllCampaniasSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum),
  anio_agricola: Joi.string().max(10).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
