import Joi from 'joi';

const estadoAcopioEnum = ['EN_CAMPO', 'EN_TRANSITO', 'RECIBIDO'] as const;

const sacoSchema = Joi.object({
  codigo: Joi.string().max(50).trim().required().messages({
    'any.required': 'El código del saco es obligatorio',
    'string.empty': 'El código del saco no puede estar vacío',
  }),
  peso: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El peso del saco es obligatorio',
    'number.base': 'El peso debe ser un número',
    'number.positive': 'El peso debe ser un valor positivo',
  }),
  observaciones: Joi.string().allow('', null).optional(),
});

const acopioDetalleSchema = Joi.object({
  productor_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El productor es obligatorio',
    'number.base': 'El ID del productor debe ser un número',
    'number.positive': 'El ID del productor debe ser positivo',
  }),
  cultivo_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El cultivo es obligatorio',
    'number.base': 'El ID del cultivo debe ser un número',
    'number.positive': 'El ID del cultivo debe ser positivo',
  }),
  parcela_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'El ID de la parcela debe ser un número',
    'number.positive': 'El ID de la parcela debe ser positivo',
  }),
  observaciones: Joi.string().allow('', null).optional(),
  sacos: Joi.array().items(sacoSchema).min(1).required().messages({
    'array.min': 'Debe agregar al menos un saco',
    'any.required': 'Los sacos son obligatorios',
  }),
});

const validateSacoUniqueness = (detalles: Array<{ sacos: Array<{ codigo: string }> }>, helpers: Joi.CustomHelpers) => {
  const codigos = new Set<string>();
  for (const detalle of detalles) {
    for (const saco of detalle.sacos) {
      if (codigos.has(saco.codigo)) {
        return helpers.error('any.sacoDuplicate', { codigo: saco.codigo });
      }
      codigos.add(saco.codigo);
    }
  }
  return detalles;
};

export const createAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional().messages({
    'string.max': 'El código no puede exceder 20 caracteres',
  }),
  fecha: Joi.date().iso().required().messages({
    'any.required': 'La fecha es obligatoria',
    'date.base': 'La fecha debe ser una fecha válida',
    'date.format': 'La fecha debe estar en formato ISO',
  }),
  acopiador: Joi.string().max(150).trim().required().messages({
    'any.required': 'El acopiador es obligatorio',
    'string.empty': 'El acopiador no puede estar vacío',
  }),
  vehiculo: Joi.string().max(100).trim().allow('', null).optional(),
  ruta_acopio: Joi.string().max(200).trim().allow('', null).optional(),
  peso_bruto: Joi.number().min(0).precision(2).default(0).messages({
    'number.base': 'El peso bruto debe ser un número',
    'number.min': 'El peso bruto no puede ser negativo',
  }),
  tara: Joi.number().min(0).precision(2).default(0).messages({
    'number.base': 'La tara debe ser un número',
    'number.min': 'La tara no puede ser negativa',
  }),
  estado: Joi.string().valid(...estadoAcopioEnum).default('EN_CAMPO').messages({
    'any.only': `El estado debe ser uno de: ${estadoAcopioEnum.join(', ')}`,
  }),
  observaciones: Joi.string().allow('', null).optional(),
  detalles: Joi.array().items(acopioDetalleSchema).min(1).required().custom(validateSacoUniqueness).messages({
    'array.min': 'Debe agregar al menos un productor',
    'any.required': 'Los detalles de productores son obligatorios',
    'any.sacoDuplicate': 'El código del saco {{#codigo}} está duplicado',
  }),
}).custom((value, helpers) => {
  if (value.peso_bruto > 0 && value.tara > value.peso_bruto) {
    return helpers.error('any.taraExceedsBruto');
  }
  return value;
}, 'Validación peso bruto vs tara').messages({
  'any.taraExceedsBruto': 'La tara no puede ser mayor al peso bruto',
});

export const updateAcopioSchema = Joi.object({
  codigo: Joi.string().max(20).trim().empty('').optional(),
  fecha: Joi.date().iso().messages({
    'date.base': 'La fecha debe ser una fecha válida',
    'date.format': 'La fecha debe estar en formato ISO',
  }),
  acopiador: Joi.string().max(150).trim().messages({
    'string.empty': 'El acopiador no puede estar vacío',
  }),
  vehiculo: Joi.string().max(100).trim().allow('', null).optional(),
  ruta_acopio: Joi.string().max(200).trim().allow('', null).optional(),
  peso_bruto: Joi.number().min(0).precision(2).messages({
    'number.base': 'El peso bruto debe ser un número',
    'number.min': 'El peso bruto no puede ser negativo',
  }),
  tara: Joi.number().min(0).precision(2).messages({
    'number.base': 'La tara debe ser un número',
    'number.min': 'La tara no puede ser negativa',
  }),
  estado: Joi.string().valid(...estadoAcopioEnum).messages({
    'any.only': `El estado debe ser uno de: ${estadoAcopioEnum.join(', ')}`,
  }),
  observaciones: Joi.string().allow('', null).optional(),
  detalles: Joi.array().items(acopioDetalleSchema).min(1).custom(validateSacoUniqueness).messages({
    'array.min': 'Debe agregar al menos un productor',
    'any.sacoDuplicate': 'El código del saco {{#codigo}} está duplicado',
  }),
}).min(1).custom((value, helpers) => {
  if (value.peso_bruto !== undefined && value.tara !== undefined && value.tara > value.peso_bruto) {
    return helpers.error('any.taraExceedsBruto');
  }
  return value;
}, 'Validación peso bruto vs tara').messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
  'any.taraExceedsBruto': 'La tara no puede ser mayor al peso bruto',
});

export const getAllAcopiosSchema = Joi.object({
  search: Joi.string().max(100).trim().allow('', null).optional(),
  estado: Joi.string().valid(...estadoAcopioEnum).optional(),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'La página debe ser mayor a 0',
  }),
  limit: Joi.number().integer().min(1).max(500).default(20).messages({
    'number.min': 'El límite debe ser mayor a 0',
    'number.max': 'El límite no puede exceder 100',
  }),
});
