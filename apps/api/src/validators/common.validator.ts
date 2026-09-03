import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().uuid(),
  ).required().messages({
    'any.required': 'El ID es obligatorio',
    'alternatives.types': 'El ID debe ser un número entero o un UUID válido',
  }),
});

export const idFamiliarParamSchema = Joi.object({
  familiarId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del familiar debe ser un número',
    'number.integer': 'El ID del familiar debe ser un número entero',
    'number.positive': 'El ID del familiar debe ser un número positivo',
    'any.required': 'El ID del familiar es obligatorio',
  }),
});

export const idDocumentoParamSchema = Joi.object({
  documentoId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del documento debe ser un número',
    'number.integer': 'El ID del documento debe ser un número entero',
    'number.positive': 'El ID del documento debe ser un número positivo',
    'any.required': 'El ID del documento es obligatorio',
  }),
});
