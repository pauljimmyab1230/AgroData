import Joi from 'joi';

const passwordComplexity = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .required()
  .messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no puede exceder 128 caracteres',
    'string.pattern.base':
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    'any.required': 'La contraseña es obligatoria',
  });

export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El email no es válido',
    'any.required': 'El email es obligatorio',
  }),
  password: passwordComplexity,
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email no es válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(1).max(128).required().messages({
    'string.min': 'La contraseña es obligatoria',
    'any.required': 'La contraseña es obligatoria',
  }),
});

export const changePasswordSchema = Joi.object({
  passwordActual: Joi.string().min(1).max(128).required().messages({
    'any.required': 'La contraseña actual es obligatoria',
    'string.empty': 'La contraseña actual es obligatoria',
  }),
  passwordNueva: passwordComplexity.messages({
    'any.required': 'La nueva contraseña es obligatoria',
    'string.empty': 'La nueva contraseña es obligatoria',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().min(10).max(500).required().messages({
    'any.required': 'El refresh token es obligatorio',
    'string.empty': 'El refresh token es obligatorio',
    'string.min': 'El refresh token no es válido',
    'string.max': 'El refresh token no es válido',
  }),
});
