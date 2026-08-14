import Joi from 'joi';

const rolEnum = ['ADMIN', 'USER'];
const rolSicEnum = ['RESPONSABLE_SIC', 'INSPECTOR', 'COMITE_DECISION', 'TECNICO_CAMPO', 'ACOPIADOR', 'CAPACITADOR'];

export const createUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El email no es válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(6).max(50).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
  rol: Joi.string().valid(...rolEnum).default('USER'),
  rol_sic: Joi.string().valid(...rolSicEnum).allow(null).optional(),
});

export const updateUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).optional(),
  rol: Joi.string().valid(...rolEnum).optional(),
  rol_sic: Joi.string().valid(...rolSicEnum).allow(null).optional(),
  activo: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
