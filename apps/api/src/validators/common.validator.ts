import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'El ID es obligatorio',
    'number.base': 'El ID debe ser un número entero',
    'number.integer': 'El ID debe ser un número entero',
    'number.positive': 'El ID debe ser un número positivo',
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

export const idFotoParamSchema = Joi.object({
  fotoId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID de la foto debe ser un número',
    'number.integer': 'El ID de la foto debe ser un número entero',
    'number.positive': 'El ID de la foto debe ser un número positivo',
    'any.required': 'El ID de la foto es obligatorio',
  }),
});
