import Joi from 'joi';

const idMensaje = {
  'any.required': 'El ID es obligatorio',
  'number.base': 'El ID debe ser un número entero',
  'number.integer': 'El ID debe ser un número entero',
  'number.positive': 'El ID debe ser un número positivo',
};

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages(idMensaje),
});

export const idFamiliarParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages(idMensaje),
  familiarId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del familiar debe ser un número',
    'number.integer': 'El ID del familiar debe ser un número entero',
    'number.positive': 'El ID del familiar debe ser un número positivo',
    'any.required': 'El ID del familiar es obligatorio',
  }),
});

export const idDocumentoParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages(idMensaje),
  documentoId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del documento debe ser un número',
    'number.integer': 'El ID del documento debe ser un número entero',
    'number.positive': 'El ID del documento debe ser un número positivo',
    'any.required': 'El ID del documento es obligatorio',
  }),
});

export const idFotoParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages(idMensaje),
  fotoId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID de la foto debe ser un número',
    'number.integer': 'El ID de la foto debe ser un número entero',
    'number.positive': 'El ID de la foto debe ser un número positivo',
    'any.required': 'El ID de la foto es obligatorio',
  }),
});

export const codigoParamSchema = Joi.object({
  codigo: Joi.string().min(1).max(50).required().messages({
    'any.required': 'El código es obligatorio',
    'string.empty': 'El código es obligatorio',
    'string.min': 'El código debe tener al menos 1 carácter',
    'string.max': 'El código no debe exceder 50 caracteres',
  }),
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
