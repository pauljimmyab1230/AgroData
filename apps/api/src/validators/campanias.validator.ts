import Joi from 'joi';
import type { EstadoCampania } from '@agrodata/types';

const estadoCampaniaEnum: readonly EstadoCampania[] = ['PLANIFICADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA'];

const anioAgricolaPattern = /^\d{4}-\d{4}$/;

export const createCampaniaSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  nombre: Joi.string().max(200).trim().required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
  anio_agricola: Joi.string().max(10).trim().pattern(anioAgricolaPattern).required().messages({
    'any.required': 'El año agrícola es obligatorio',
    'string.pattern.base': 'El año agrícola debe tener el formato YYYY-YYYY (ej: 2025-2026)',
  }),
  fecha_inicio: Joi.date().iso().required().messages({
    'any.required': 'La fecha de inicio es obligatoria',
    'date.base': 'La fecha de inicio debe ser una fecha válida',
  }),
  fecha_fin: Joi.date().iso().required().greater(Joi.ref('fecha_inicio')).messages({
    'any.required': 'La fecha de fin es obligatoria',
    'date.greater': 'La fecha de fin debe ser posterior a la de inicio',
  }),
  descripcion: Joi.string().trim().allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum).default('PLANIFICADA'),
  responsable: Joi.string().max(150).trim().required().messages({
    'any.required': 'El responsable es obligatorio',
  }),
  tecnico_coordinador: Joi.string().max(150).trim().required().messages({
    'any.required': 'El técnico coordinador es obligatorio',
  }),
  objetivo: Joi.string().trim().allow('', null).required().messages({
    'any.required': 'El objetivo es obligatorio',
  }),
  permitir_cultivos: Joi.boolean().default(true),
  permitir_actividades: Joi.boolean().default(true),
  permitir_cosechas: Joi.boolean().default(true),
  permitir_inspecciones: Joi.boolean().default(true),
  permitir_acopio: Joi.boolean().default(true),
  permitir_procesamiento: Joi.boolean().default(true),
  visible: Joi.boolean().default(true),
  activa: Joi.boolean().default(false),
  observaciones: Joi.string().trim().allow('', null),
});

export const updateCampaniaSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  nombre: Joi.string().max(200).trim(),
  anio_agricola: Joi.string().max(10).trim().pattern(anioAgricolaPattern).messages({
    'string.pattern.base': 'El año agrícola debe tener el formato YYYY-YYYY (ej: 2025-2026)',
  }),
  fecha_inicio: Joi.date().iso(),
  fecha_fin: Joi.date().iso(),
  descripcion: Joi.string().trim().allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum),
  responsable: Joi.string().max(150).trim(),
  tecnico_coordinador: Joi.string().max(150).trim(),
  objetivo: Joi.string().trim().allow('', null),
  permitir_cultivos: Joi.boolean(),
  permitir_actividades: Joi.boolean(),
  permitir_cosechas: Joi.boolean(),
  permitir_inspecciones: Joi.boolean(),
  permitir_acopio: Joi.boolean(),
  permitir_procesamiento: Joi.boolean(),
  visible: Joi.boolean(),
  activa: Joi.boolean(),
  observaciones: Joi.string().trim().allow('', null),
})
  .min(1)
  .custom((obj, helpers) => {
    if (obj.fecha_inicio && obj.fecha_fin) {
      if (new Date(obj.fecha_fin) <= new Date(obj.fecha_inicio)) {
        return helpers.error('any.invalid', {
          message: 'La fecha de fin debe ser posterior a la de inicio',
        });
      }
    }
    return obj;
  })
  .messages({
    'any.invalid': 'La fecha de fin debe ser posterior a la de inicio',
  });

export const getAllCampaniasSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null),
  estado: Joi.string().valid(...estadoCampaniaEnum),
  anio_agricola: Joi.string().max(10).allow('', null),
  responsable: Joi.string().max(150).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(500).default(20),
});
