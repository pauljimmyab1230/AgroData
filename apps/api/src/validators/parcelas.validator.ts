import Joi from 'joi';

const certificacionEnum = ['ORGANICA', 'EN_TRANSICION', 'CONVENCIONAL'];
const estadoParcelaEnum = ['ACTIVA', 'INACTIVA'];
const estadoDocumentoEnum = ['PENDIENTE', 'VERIFICADO', 'RECHAZADO'];

const opcional = () => Joi.string().max(200).allow('', null);

export const createParcelaSchema = Joi.object({
  productor_id: Joi.string().required(),
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200).required(),
  cultivo_principal: Joi.string().max(100).required(),
  area_total: Joi.number().positive().required(),
  area_certificada: Joi.number().min(0).allow(null),
  area_unidad: Joi.string().max(10).default('ha'),
  ubicacion: opcional(),
  comunidad: opcional(),
  sector: opcional(),
  altitud: opcional(),
  departamento: opcional(),
  provincia: opcional(),
  distrito: opcional(),
  centro_poblado: opcional(),
  ubigeo: Joi.string().max(6).allow('', null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  tipo_suelo: Joi.string().max(100).allow('', null),
  textura: Joi.string().max(50).allow('', null),
  pendiente: Joi.string().max(100).allow('', null),
  fuente_agua: Joi.string().max(100).allow('', null),
  sistema_riego: Joi.string().max(100).allow('', null),
  zona_agroecologica: Joi.string().max(100).allow('', null),
  disponibilidad_agua: Joi.string().max(50).allow('', null),
  observaciones: Joi.string().allow('', null),
  area_calculada: Joi.string().max(50).allow('', null),
  perimetro: Joi.string().max(50).allow('', null),
  vertices: Joi.number().integer().min(3).allow(null),
  poligono: Joi.array().items(Joi.array().items(Joi.number()).min(2)).min(3).allow(null),
  fecha_levantamiento: Joi.date().iso().allow(null),
  responsable: Joi.string().max(150).allow('', null),
  certificacion: Joi.string().valid(...certificacionEnum).default('CONVENCIONAL'),
  estado: Joi.string().valid(...estadoParcelaEnum).default('ACTIVA'),
});

export const updateParcelaSchema = Joi.object({
  productor_id: Joi.string(),
  codigo: Joi.string().max(20).allow(''),
  nombre: Joi.string().max(200),
  cultivo_principal: Joi.string().max(100),
  area_total: Joi.number().positive(),
  area_certificada: Joi.number().min(0).allow(null),
  area_unidad: Joi.string().max(10),
  ubicacion: opcional(),
  comunidad: opcional(),
  sector: opcional(),
  altitud: opcional(),
  departamento: opcional(),
  provincia: opcional(),
  distrito: opcional(),
  centro_poblado: opcional(),
  ubigeo: Joi.string().max(6).allow('', null),
  latitud: Joi.string().max(30).allow('', null),
  longitud: Joi.string().max(30).allow('', null),
  precision_gps: Joi.string().max(20).allow('', null),
  tipo_suelo: Joi.string().max(100).allow('', null),
  textura: Joi.string().max(50).allow('', null),
  pendiente: Joi.string().max(100).allow('', null),
  fuente_agua: Joi.string().max(100).allow('', null),
  sistema_riego: Joi.string().max(100).allow('', null),
  zona_agroecologica: Joi.string().max(100).allow('', null),
  disponibilidad_agua: Joi.string().max(50).allow('', null),
  observaciones: Joi.string().allow('', null),
  area_calculada: Joi.string().max(50).allow('', null),
  perimetro: Joi.string().max(50).allow('', null),
  vertices: Joi.number().integer().min(3).allow(null),
  poligono: Joi.array().items(Joi.array().items(Joi.number()).min(2)).min(3).allow(null),
  fecha_levantamiento: Joi.date().iso().allow(null),
  responsable: Joi.string().max(150).allow('', null),
  certificacion: Joi.string().valid(...certificacionEnum),
  estado: Joi.string().valid(...estadoParcelaEnum),
}).min(1);

export const createParcelaDocumentoSchema = Joi.object({
  tipo: Joi.string().max(100).required(),
  nombre_archivo: Joi.string().max(255).required(),
  ruta_archivo: Joi.string().max(500).required(),
  tamano_bytes: Joi.number().integer().min(0).required(),
  mime_type: Joi.string().max(100).required(),
  estado: Joi.string().valid(...estadoDocumentoEnum).default('PENDIENTE'),
});

export const updateParcelaDocumentoSchema = Joi.object({
  tipo: Joi.string().max(100),
  nombre_archivo: Joi.string().max(255),
  ruta_archivo: Joi.string().max(500),
  tamano_bytes: Joi.number().integer().min(0),
  mime_type: Joi.string().max(100),
  estado: Joi.string().valid(...estadoDocumentoEnum),
}).min(1);

export const createParcelaFotoSchema = Joi.object({
  titulo: Joi.string().max(150).required(),
  descripcion: Joi.string().max(500).allow('', null),
  fecha: Joi.date().iso().allow(null),
  autor: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
});

export const updateParcelaFotoSchema = Joi.object({
  titulo: Joi.string().max(150),
  descripcion: Joi.string().max(500).allow('', null),
  fecha: Joi.date().iso().allow(null),
  autor: Joi.string().max(150).allow('', null),
  observaciones: Joi.string().allow('', null),
  ruta_archivo: Joi.string().max(500).allow('', null),
}).min(1);

export const getAllParcelasSchema = Joi.object({
  search: Joi.string().max(100).allow('', null),
  comunidad: Joi.string().max(150).allow('', null),
  cultivo: Joi.string().max(100).allow('', null),
  estado: Joi.string().valid(...estadoParcelaEnum),
  productor_id: Joi.string().uuid(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
