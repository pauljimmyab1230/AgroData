import Joi from 'joi';

const sexoEnum = ['MASCULINO', 'FEMENINO'];
const estadoCivilEnum = ['SOLTERO', 'CASADO', 'CONVIVIENTE', 'VIUDO'];
const nivelEducativoEnum = ['SIN_ESTUDIOS', 'PRIMARIA', 'SECUNDARIA', 'TECNICO', 'UNIVERSITARIO'];
const idiomaEnum = ['QUECHUA', 'ESPANOL', 'OTRO', 'NINGUNO'];
const estadoProductorEnum = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];
const cargoEnum = ['SOCIO', 'DIRECTIVO', 'PRESIDENTE', 'VICEPRESIDENTE', 'SECRETARIO', 'TESORERO', 'VOCAL', 'OTRO'];
const categoriaDocEnum = ['PERSONAL', 'INSTITUCIONAL', 'OTROS'];
const mimeTypesPermitidos = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];

export const createProductorSchema = Joi.object({
  dni: Joi.string().pattern(/^\d{8}$/).required().messages({
    'string.pattern.base': 'El DNI debe tener exactamente 8 dígitos numéricos',
    'any.required': 'El DNI es obligatorio',
  }),
  nombres: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Los nombres deben tener al menos 2 caracteres',
    'any.required': 'Los nombres son obligatorios',
  }),
  apellido_paterno: Joi.string().min(2).max(100).required().messages({
    'any.required': 'El apellido paterno es obligatorio',
  }),
  apellido_materno: Joi.string().min(2).max(100).required().messages({
    'any.required': 'El apellido materno es obligatorio',
  }),
  sexo: Joi.string().valid(...sexoEnum).required(),
  fecha_nacimiento: Joi.date().iso().required(),
  estado_civil: Joi.string().valid(...estadoCivilEnum).required(),
  telefono: Joi.string().pattern(/^[\d\s\-\+\(\)]{7,20}$/).allow('', null).optional().messages({
    'string.pattern.base': 'El teléfono debe tener entre 7 y 20 caracteres numéricos',
  }),
  correo: Joi.string().email().allow('', null).optional(),
  departamento: Joi.string().max(100).required(),
  provincia: Joi.string().max(100).required(),
  distrito: Joi.string().max(100).required(),
  comunidad: Joi.string().max(150).required(),
  direccion: Joi.string().allow('', null).optional(),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum).required(),
  idioma_principal: Joi.string().valid(...idiomaEnum.filter(i => i !== 'NINGUNO')).required(),
  idioma_secundario: Joi.string().valid(...idiomaEnum).default('NINGUNO').optional(),
  material_vivienda: Joi.string().max(50).allow('', null).optional(),
  acceso_agua: Joi.string().valid('SI', 'NO').allow('', null).optional(),
  acceso_energia: Joi.string().valid('SI', 'NO').allow('', null).optional(),
  acceso_internet: Joi.string().valid('SI', 'NO').allow('', null).optional(),
  seguro_salud: Joi.string().valid('ESSALUD', 'PRIVADO', 'SIN_SEGURO', 'OTRO').allow('', null).optional(),
  acceso_credito: Joi.string().valid('SI', 'NO').allow('', null).optional(),
  servicio_sanitario: Joi.string().valid('INODRO', 'LETRINA', 'BANO_QUIMICO', 'NINGUNO').allow('', null).optional(),
  estado: Joi.string().valid(...estadoProductorEnum).default('ACTIVO').optional(),
  fecha_ingreso: Joi.date().iso().required(),
  organizacion: Joi.string().max(200).allow('', null).optional(),
  cargo: Joi.string().valid(...cargoEnum).required(),
  foto_url: Joi.string().allow('', null).optional(),
  firma_url: Joi.string().allow('', null).optional(),
  ubigeo_id: Joi.number().integer().positive().allow(null).optional(),
});

export const updateProductorSchema = Joi.object({
  dni: Joi.string().pattern(/^\d{8}$/).messages({
    'string.pattern.base': 'El DNI debe tener exactamente 8 dígitos numéricos',
  }),
  nombres: Joi.string().min(2).max(100),
  apellido_paterno: Joi.string().min(2).max(100),
  apellido_materno: Joi.string().min(2).max(100),
  sexo: Joi.string().valid(...sexoEnum),
  fecha_nacimiento: Joi.date().iso(),
  estado_civil: Joi.string().valid(...estadoCivilEnum),
  telefono: Joi.string().pattern(/^[\d\s\-\+\(\)]{7,20}$/).allow('', null).messages({
    'string.pattern.base': 'El teléfono debe tener entre 7 y 20 caracteres numéricos',
  }),
  correo: Joi.string().email().allow('', null),
  departamento: Joi.string().max(100),
  provincia: Joi.string().max(100),
  distrito: Joi.string().max(100),
  comunidad: Joi.string().max(150),
  direccion: Joi.string().allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum),
  idioma_principal: Joi.string().valid(...idiomaEnum.filter(i => i !== 'NINGUNO')),
  idioma_secundario: Joi.string().valid(...idiomaEnum),
  material_vivienda: Joi.string().max(50).allow('', null),
  acceso_agua: Joi.string().valid('SI', 'NO').allow('', null),
  acceso_energia: Joi.string().valid('SI', 'NO').allow('', null),
  acceso_internet: Joi.string().valid('SI', 'NO').allow('', null),
  seguro_salud: Joi.string().valid('ESSALUD', 'PRIVADO', 'SIN_SEGURO', 'OTRO').allow('', null),
  acceso_credito: Joi.string().valid('SI', 'NO').allow('', null),
  servicio_sanitario: Joi.string().valid('INODRO', 'LETRINA', 'BANO_QUIMICO', 'NINGUNO').allow('', null),
  estado: Joi.string().valid(...estadoProductorEnum),
  fecha_ingreso: Joi.date().iso(),
  organizacion: Joi.string().max(200),
  cargo: Joi.string().valid(...cargoEnum),
  foto_url: Joi.string().allow('', null),
  firma_url: Joi.string().allow('', null),
  ubigeo_id: Joi.number().integer().positive().allow(null),
}).min(1);

export const createFamiliarSchema = Joi.object({
  nombres: Joi.string().min(2).max(200).required(),
  parentesco: Joi.string().max(50).required(),
  dni: Joi.string().pattern(/^\d{8}$/).allow('', null).messages({
    'string.pattern.base': 'El DNI debe tener exactamente 8 dígitos numéricos',
  }),
  sexo: Joi.string().valid(...sexoEnum).required(),
  fecha_nacimiento: Joi.date().iso().required(),
  ocupacion: Joi.string().max(100).allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum).allow(null),
  telefono: Joi.string().max(20).allow('', null),
  dependiente: Joi.boolean().default(false),
  vive_con_productor: Joi.boolean().default(true),
});

export const updateFamiliarSchema = Joi.object({
  nombres: Joi.string().min(2).max(200),
  parentesco: Joi.string().max(50),
  dni: Joi.string().pattern(/^\d{8}$/).allow('', null).messages({
    'string.pattern.base': 'El DNI debe tener exactamente 8 dígitos numéricos',
  }),
  sexo: Joi.string().valid(...sexoEnum),
  fecha_nacimiento: Joi.date().iso(),
  ocupacion: Joi.string().max(100).allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum).allow(null),
  telefono: Joi.string().max(20).allow('', null),
  dependiente: Joi.boolean(),
  vive_con_productor: Joi.boolean(),
}).min(1);

export const createDocumentoSchema = Joi.object({
  tipo: Joi.string().max(100).required(),
  categoria: Joi.string().valid(...categoriaDocEnum).required(),
  nombre_archivo: Joi.string().max(255).required(),
  ruta_archivo: Joi.string().max(500).required(),
  tamano_bytes: Joi.number().integer().positive().max(10 * 1024 * 1024).required().messages({
    'number.max': 'El archivo no debe superar los 10 MB',
  }),
  mime_type: Joi.string().valid(...mimeTypesPermitidos).required().messages({
    'any.only': 'El tipo de archivo no está permitido. Use JPEG, PNG, PDF o WebP',
  }),
});

export const updateDocumentoEstadoSchema = Joi.object({
  estado: Joi.string().valid('PENDIENTE', 'VERIFICADO', 'RECHAZADO').required(),
});

export const getAllProductoresSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoProductorEnum),
  cargo: Joi.string().valid(...cargoEnum),
  sexo: Joi.string().valid(...sexoEnum),
  comunidad: Joi.string().max(150).allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum),
  idioma_principal: Joi.string().valid(...idiomaEnum.filter(i => i !== 'NINGUNO')),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(500).default(20),
});

export const cleanupOrphanDocumentosSchema = Joi.object({
  keptDocumentIds: Joi.array().items(Joi.number().integer().positive()).default([]).messages({
    'array.base': 'keptDocumentIds debe ser un arreglo de números',
    'number.base': 'Cada ID debe ser un número entero positivo',
  }),
});
