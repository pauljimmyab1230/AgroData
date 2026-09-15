import Joi from 'joi';

const tiposPermitidos = [
  'departamentos',
  'tipos-cultivo',
  'tipos-suelo',
  'fuentes-agua',
  'sistemas-riego',
  'zonas-agroecologicas',
  'tipos-actividad',
  'tipos-documento',
  'parentescos',
  'criterios-checklist',
];

export const createCatalogoSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.max': 'El nombre no puede exceder 100 caracteres',
  }),
  descripcion: Joi.string().max(500).allow('', null),
  activo: Joi.boolean().default(true),
  orden: Joi.number().integer().min(0).default(0),
});

export const updateCatalogoSchema = Joi.object({
  nombre: Joi.string().max(100),
  descripcion: Joi.string().max(500).allow('', null),
  activo: Joi.boolean(),
  orden: Joi.number().integer().min(0),
}).min(1);

export const getAllCatalogosSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  activo: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(500).default(50),
});

export const catalogoTipoSchema = Joi.object({
  tipo: Joi.string().valid(...tiposPermitidos).required().messages({
    'any.required': 'El tipo de catálogo es obligatorio',
    'any.invalid': 'Tipo de catálogo no válido',
  }),
});

export const catalogoIdSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'any.required': 'El ID es obligatorio',
    'number.base': 'El ID debe ser un número',
  }),
});
