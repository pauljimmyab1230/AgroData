import Joi from 'joi';

const sexoEnum = ['MASCULINO', 'FEMENINO'];
const estadoCivilEnum = ['SOLTERO', 'CASADO', 'CONVIVIENTE', 'VIUDO'];
const nivelEducativoEnum = ['SIN_ESTUDIOS', 'PRIMARIA', 'SECUNDARIA', 'TECNICO', 'UNIVERSITARIO'];
const idiomaEnum = ['QUECHUA', 'ESPANOL', 'OTRO', 'NINGUNO'];
const estadoProductorEnum = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];
const cargoEnum = ['SOCIO', 'DIRECTIVO', 'PRESIDENTE', 'VICEPRESIDENTE', 'SECRETARIO', 'TESORERO', 'VOCAL', 'OTRO'];
const certificacionEnum = ['ORGANICA', 'EN_TRANSICION', 'CONVENCIONAL'];
const estadoParcelaEnum = ['ACTIVA', 'INACTIVA'];
const categoriaDocEnum = ['PERSONAL', 'INSTITUCIONAL', 'OTROS'];

export const createProductorSchema = Joi.object({
  dni: Joi.string().length(8).required().messages({
    'string.length': 'El DNI debe tener 8 dígitos',
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
  telefono: Joi.string().max(20).allow('', null),
  correo: Joi.string().email().allow('', null),
  departamento: Joi.string().max(100).required(),
  provincia: Joi.string().max(100).required(),
  distrito: Joi.string().max(100).required(),
  comunidad: Joi.string().max(150).required(),
  direccion: Joi.string().allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum).required(),
  idioma_principal: Joi.string().valid(...idiomaEnum.filter(i => i !== 'NINGUNO')).required(),
  idioma_secundario: Joi.string().valid(...idiomaEnum).default('NINGUNO'),
  estado: Joi.string().valid(...estadoProductorEnum).default('ACTIVO'),
  fecha_ingreso: Joi.date().iso().required(),
  organizacion: Joi.string().max(200).required(),
  cargo: Joi.string().valid(...cargoEnum).required(),
  foto_url: Joi.string().uri().allow('', null),
  firma_url: Joi.string().uri().allow('', null),
});

export const updateProductorSchema = Joi.object({
  dni: Joi.string().length(8),
  nombres: Joi.string().min(2).max(100),
  apellido_paterno: Joi.string().min(2).max(100),
  apellido_materno: Joi.string().min(2).max(100),
  sexo: Joi.string().valid(...sexoEnum),
  fecha_nacimiento: Joi.date().iso(),
  estado_civil: Joi.string().valid(...estadoCivilEnum),
  telefono: Joi.string().max(20).allow('', null),
  correo: Joi.string().email().allow('', null),
  departamento: Joi.string().max(100),
  provincia: Joi.string().max(100),
  distrito: Joi.string().max(100),
  comunidad: Joi.string().max(150),
  direccion: Joi.string().allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum),
  idioma_principal: Joi.string().valid(...idiomaEnum.filter(i => i !== 'NINGUNO')),
  idioma_secundario: Joi.string().valid(...idiomaEnum),
  estado: Joi.string().valid(...estadoProductorEnum),
  fecha_ingreso: Joi.date().iso(),
  organizacion: Joi.string().max(200),
  cargo: Joi.string().valid(...cargoEnum),
  foto_url: Joi.string().uri().allow('', null),
  firma_url: Joi.string().uri().allow('', null),
}).min(1);

export const createFamiliarSchema = Joi.object({
  nombres: Joi.string().min(2).max(200).required(),
  parentesco: Joi.string().max(50).required(),
  dni: Joi.string().length(8).allow('', null),
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
  dni: Joi.string().length(8).allow('', null),
  sexo: Joi.string().valid(...sexoEnum),
  fecha_nacimiento: Joi.date().iso(),
  ocupacion: Joi.string().max(100).allow('', null),
  nivel_educativo: Joi.string().valid(...nivelEducativoEnum).allow(null),
  telefono: Joi.string().max(20).allow('', null),
  dependiente: Joi.boolean(),
  vive_con_productor: Joi.boolean(),
}).min(1);

export const createParcelaSchema = Joi.object({
  codigo: Joi.string().max(20).required(),
  nombre: Joi.string().max(200).required(),
  cultivo: Joi.string().max(100).required(),
  area: Joi.number().positive().required(),
  area_unidad: Joi.string().max(10).default('ha'),
  ubicacion: Joi.string().max(200).required(),
  certificacion: Joi.string().valid(...certificacionEnum).default('CONVENCIONAL'),
  estado: Joi.string().valid(...estadoParcelaEnum).default('ACTIVA'),
});

export const updateParcelaSchema = Joi.object({
  codigo: Joi.string().max(20),
  nombre: Joi.string().max(200),
  cultivo: Joi.string().max(100),
  area: Joi.number().positive(),
  area_unidad: Joi.string().max(10),
  ubicacion: Joi.string().max(200),
  certificacion: Joi.string().valid(...certificacionEnum),
  estado: Joi.string().valid(...estadoParcelaEnum),
}).min(1);

export const createDocumentoSchema = Joi.object({
  tipo: Joi.string().max(100).required(),
  categoria: Joi.string().valid(...categoriaDocEnum).required(),
  nombre_archivo: Joi.string().max(255).required(),
  ruta_archivo: Joi.string().max(500).required(),
  tamano_bytes: Joi.number().integer().positive().required(),
  mime_type: Joi.string().max(100).required(),
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
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
