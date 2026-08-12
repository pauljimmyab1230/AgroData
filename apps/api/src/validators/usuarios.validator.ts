import Joi from 'joi';

export const updateUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  rol: Joi.string().valid('ADMIN', 'USER').optional(),
  activo: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
