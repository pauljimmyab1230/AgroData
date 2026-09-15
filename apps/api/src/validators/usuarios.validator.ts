import Joi from 'joi';
import { ROL_VALUES, ROL_SIC_VALUES } from '../types/usuarios.types';

// ─── Param schemas ────────────────────────────────────────
export const usuarioIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'any.required': 'El ID es obligatorio',
    'string.uuid': 'El ID debe ser un UUID válido',
    'string.empty': 'El ID es obligatorio',
  }),
});

// ─── Query schemas ────────────────────────────────────────
export const listUsuariosQuerySchema = Joi.object({
  search: Joi.string().max(100).optional().allow('', null),
  rol: Joi.string()
    .valid(...ROL_VALUES)
    .optional()
    .allow('', null),
  rol_sic: Joi.string()
    .valid(...ROL_SIC_VALUES)
    .optional()
    .allow('', null),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(500).default(20).optional(),
});

// ─── Body schemas ─────────────────────────────────────────
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
  rol: Joi.string()
    .valid(...ROL_VALUES)
    .default('USER'),
  rol_sic: Joi.string()
    .valid(...ROL_SIC_VALUES)
    .allow(null)
    .optional(),
});

export const updateUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).optional(),
  rol: Joi.string()
    .valid(...ROL_VALUES)
    .optional(),
  rol_sic: Joi.string()
    .valid(...ROL_SIC_VALUES)
    .allow(null)
    .optional(),
  activo: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar',
  });
