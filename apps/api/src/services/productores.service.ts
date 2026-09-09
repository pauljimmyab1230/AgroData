import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import type { Prisma } from '@prisma/client';
import type {
  ProductorId,
  FamiliarId,
  DocumentoId,
} from '@agrodata/types';
import {
  toProductorId as _toProductorId,
  toFamiliarId as _toFamiliarId,
  toDocumentoId as _toDocumentoId,
} from '@agrodata/types';

// ─── Re-export Branded Types ───────────────────────────────
export type { ProductorId, FamiliarId, DocumentoId };
export const toProductorId = _toProductorId;
export const toFamiliarId = _toFamiliarId;
export const toDocumentoId = _toDocumentoId;

// ─── Enums ─────────────────────────────────────────────────

export type Sexo = 'MASCULINO' | 'FEMENINO';
export type EstadoCivil = 'SOLTERO' | 'CASADO' | 'CONVIVIENTE' | 'VIUDO';
export type NivelEducativo = 'SIN_ESTUDIOS' | 'PRIMARIA' | 'SECUNDARIA' | 'TECNICO' | 'UNIVERSITARIO';
export type Idioma = 'QUECHUA' | 'ESPANOL' | 'OTRO' | 'NINGUNO';
export type EstadoProductor = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
export type CargoProductor = 'SOCIO' | 'DIRECTIVO' | 'PRESIDENTE' | 'VICEPRESIDENTE' | 'SECRETARIO' | 'TESORERO' | 'VOCAL' | 'OTRO';
export type CategoriaDocumento = 'PERSONAL' | 'INSTITUCIONAL' | 'OTROS';
export type DocumentoEstado = 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';

// ─── Input Types ───────────────────────────────────────────

export interface CreateProductorInput {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: Sexo;
  fecha_nacimiento: string;
  estado_civil: EstadoCivil;
  telefono?: string | null;
  correo?: string | null;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  direccion?: string | null;
  nivel_educativo: NivelEducativo;
  idioma_principal: Exclude<Idioma, 'NINGUNO'>;
  idioma_secundario?: Idioma;
  material_vivienda?: string | null;
  acceso_agua?: string | null;
  acceso_energia?: string | null;
  acceso_internet?: string | null;
  seguro_salud?: string | null;
  acceso_credito?: string | null;
  servicio_sanitario?: string | null;
  estado?: EstadoProductor;
  fecha_ingreso: string;
  organizacion: string;
  cargo: CargoProductor;
  foto_url?: string | null;
  firma_url?: string | null;
  ubigeo_id?: number | null;
}

export type UpdateProductorInput = Partial<CreateProductorInput>;

export interface CreateFamiliarInput {
  nombres: string;
  parentesco: string;
  dni?: string | null;
  sexo: Sexo;
  fecha_nacimiento: string;
  ocupacion?: string | null;
  nivel_educativo?: NivelEducativo | null;
  telefono?: string | null;
  dependiente?: boolean;
  vive_con_productor?: boolean;
}

export type UpdateFamiliarInput = Partial<CreateFamiliarInput>;

export interface CreateDocumentoInput {
  tipo: string;
  categoria: CategoriaDocumento;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_bytes: number;
  mime_type: string;
}

export interface ProductorStats {
  total: number;
  activos: number;
  inactivos: number;
  suspendidos: number;
  mujeres: number;
  varones: number;
}

type PrismaClient = PrismaTransaction;

// ─── Helpers ────────────────────────────────────────────────

const parseValidDate = (value: unknown, fieldName: string): Date => {
  if (!value) {
    throw createError(`El campo ${fieldName} es obligatorio`, 400);
  }
  const date = new Date(value as string);
  if (isNaN(date.getTime())) {
    throw createError(`El campo ${fieldName} tiene una fecha inválida`, 400);
  }
  return date;
};

const generateCodigo = async (client: PrismaClient): Promise<string> => {
  const last = await client.productor.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'SOC-001';

  const num = parseInt(last.codigo.replace('SOC-', ''), 10) + 1;
  return `SOC-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string, client: PrismaClient): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await client.productor.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('SOC-', ''), 10) + 1;
    current = `SOC-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const ensureProductorExists = async (id: ProductorId): Promise<{ id: number }> => {
  const exists = await prisma.productor.findFirst({ where: { id, activo: true }, select: { id: true } });
  if (!exists) {
    throw createError('Productor no encontrado', 404);
  }
  return exists;
};

const ensureDniUnique = async (dni: string, excludeId?: ProductorId): Promise<void> => {
  const where: Prisma.ProductorWhereInput = { dni, activo: true };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const exists = await prisma.productor.findFirst({ where, select: { id: true } });
  if (exists) {
    throw createError('El DNI ya está registrado para otro productor', 409);
  }
};

// ─── Stats ───────────────────────────────────────────────

export const getStats = async (): Promise<ProductorStats> => {
  const result = await prisma.productor.aggregate({
    where: { activo: true },
    _count: true,
  });

  const grouped = await prisma.productor.groupBy({
    by: ['estado', 'sexo'],
    where: { activo: true },
    _count: true,
  });

  const total = result._count;
  let activos = 0;
  let inactivos = 0;
  let suspendidos = 0;
  let mujeres = 0;
  let varones = 0;

  for (const row of grouped) {
    if (row.estado === 'ACTIVO') activos += row._count;
    if (row.estado === 'INACTIVO') inactivos += row._count;
    if (row.estado === 'SUSPENDIDO') suspendidos += row._count;
    if (row.sexo === 'FEMENINO') mujeres += row._count;
    if (row.sexo === 'MASCULINO') varones += row._count;
  }

  return { total, activos, inactivos, suspendidos, mujeres, varones };
};

// ─── Productores ────────────────────────────────────────────

export const getComunidades = async (): Promise<string[]> => {
  const result = await prisma.productor.findMany({
    where: { activo: true },
    select: { comunidad: true },
    distinct: ['comunidad'],
    orderBy: { comunidad: 'asc' },
  });
  return result.map((r) => r.comunidad ?? '').filter((c) => c !== '');
};

export const getAll = async (
  search?: string,
  estado?: EstadoProductor,
  cargo?: CargoProductor,
  sexo?: Sexo,
  comunidad?: string,
  nivel_educativo?: NivelEducativo,
  idioma_principal?: string,
  page = 1,
  limit = 20,
) => {
  const where: Prisma.ProductorWhereInput = { activo: true };

  if (estado) where.estado = estado;
  if (cargo) where.cargo = cargo;
  if (sexo) where.sexo = sexo;
  if (comunidad) where.comunidad = comunidad;
  if (nivel_educativo) where.nivel_educativo = nivel_educativo;
  if (idioma_principal) where.idioma_principal = idioma_principal as Exclude<Idioma, 'NINGUNO'>;

  if (search) {
    where.OR = [
      { codigo: { contains: search } },
      { dni: { contains: search } },
      { nombres: { contains: search } },
      { apellido_paterno: { contains: search } },
      { apellido_materno: { contains: search } },
      { comunidad: { contains: search } },
    ];
  }

  const [productores, total] = await Promise.all([
    prisma.productor.findMany({
      where,
      include: {
        _count: { select: { familiares: true, parcelas: true, documentos: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.productor.count({ where }),
  ]);

  return { data: productores, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: ProductorId) => {
  const productor = await prisma.productor.findFirst({
    where: { id, activo: true },
    include: {
      familiares: { orderBy: { created_at: 'asc' } },
      parcelas: { orderBy: { created_at: 'asc' } },
      documentos: { orderBy: { created_at: 'desc' } },
      _count: { select: { familiares: true, parcelas: true, documentos: true } },
    },
  });

  if (!productor) {
    throw createError('Productor no encontrado', 404);
  }

  return productor;
};

export const create = async (data: CreateProductorInput, userId?: string) => {
  await ensureDniUnique(data.dni);

  const productor = await prisma.$transaction(async (tx) => {
    const codigo = await ensureUniqueCodigo(await generateCodigo(tx), tx);

    return tx.productor.create({
      data: {
        codigo,
        dni: data.dni,
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        sexo: data.sexo,
        fecha_nacimiento: parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento'),
        estado_civil: data.estado_civil,
        telefono: data.telefono || null,
        correo: data.correo || null,
        departamento: data.departamento,
        provincia: data.provincia,
        distrito: data.distrito,
        comunidad: data.comunidad,
        direccion: data.direccion || null,
        nivel_educativo: data.nivel_educativo,
        idioma_principal: data.idioma_principal,
        idioma_secundario: data.idioma_secundario || 'NINGUNO',
        material_vivienda: data.material_vivienda || null,
        acceso_agua: data.acceso_agua || null,
        acceso_energia: data.acceso_energia || null,
        acceso_internet: data.acceso_internet || null,
        seguro_salud: data.seguro_salud || null,
        acceso_credito: data.acceso_credito || null,
        servicio_sanitario: data.servicio_sanitario || null,
        estado: data.estado || 'ACTIVO',
        fecha_ingreso: parseValidDate(data.fecha_ingreso, 'fecha_ingreso'),
        organizacion: data.organizacion,
        cargo: data.cargo,
        foto_url: data.foto_url || null,
        firma_url: data.firma_url || null,
        created_by: userId || null,
        ubigeo_id: data.ubigeo_id ?? null,
      },
    });
  });

  return productor;
};

export const update = async (id: ProductorId, data: UpdateProductorInput, userId?: string) => {
  const existing = await prisma.productor.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Productor no encontrado', 404);
  }

  if (data.dni && data.dni !== existing.dni) {
    await ensureDniUnique(data.dni, id);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['dni', 'nombres', 'apellido_paterno', 'apellido_materno', 'departamento', 'provincia', 'distrito', 'comunidad', 'organizacion'] as const;
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['telefono', 'correo', 'direccion', 'foto_url', 'firma_url', 'material_vivienda', 'acceso_agua', 'acceso_energia', 'acceso_internet', 'seguro_salud', 'acceso_credito', 'servicio_sanitario'] as const;
  for (const field of nullableFields) {
    if (data[field] !== undefined) updateData[field] = data[field] || null;
  }

  if (data.sexo !== undefined) updateData.sexo = data.sexo;
  if (data.estado_civil !== undefined) updateData.estado_civil = data.estado_civil;
  if (data.nivel_educativo !== undefined) updateData.nivel_educativo = data.nivel_educativo;
  if (data.idioma_principal !== undefined) updateData.idioma_principal = data.idioma_principal;
  if (data.idioma_secundario !== undefined) updateData.idioma_secundario = data.idioma_secundario;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.cargo !== undefined) updateData.cargo = data.cargo;
  if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento');
  if (data.fecha_ingreso !== undefined) updateData.fecha_ingreso = parseValidDate(data.fecha_ingreso, 'fecha_ingreso');

  if (userId) updateData.updated_by = userId;

  const updated = await prisma.productor.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

export const remove = async (id: ProductorId) => {
  const existing = await prisma.productor.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Productor no encontrado', 404);
  }

  await prisma.productor.update({
    where: { id },
    data: { activo: false, estado: 'INACTIVO' },
  });

  return { message: 'Productor eliminado exitosamente' };
};

// ─── Familiares ─────────────────────────────────────────────

export const getFamiliares = async (productorId: ProductorId) => {
  await ensureProductorExists(productorId);

  return prisma.familiar.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'asc' },
  });
};

export const createFamiliar = async (productorId: ProductorId, data: CreateFamiliarInput) => {
  await ensureProductorExists(productorId);

  return prisma.familiar.create({
    data: {
      productor_id: productorId,
      nombres: data.nombres,
      parentesco: data.parentesco,
      dni: data.dni || null,
      sexo: data.sexo,
      fecha_nacimiento: parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento del familiar'),
      ocupacion: data.ocupacion || null,
      nivel_educativo: data.nivel_educativo || null,
      telefono: data.telefono || null,
      dependiente: data.dependiente ?? false,
      vive_con_productor: data.vive_con_productor ?? true,
    },
  });
};

export const updateFamiliar = async (productorId: ProductorId, familiarId: FamiliarId, data: UpdateFamiliarInput) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.familiar.findFirst({
    where: { id: familiarId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Familiar no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = ['nombres', 'parentesco', 'dni', 'sexo', 'ocupacion', 'nivel_educativo', 'telefono', 'dependiente', 'vive_con_productor'] as const;
  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }
  if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento del familiar');
  if (data.dni !== undefined) updateData.dni = data.dni || null;
  if (data.ocupacion !== undefined) updateData.ocupacion = data.ocupacion || null;
  if (data.telefono !== undefined) updateData.telefono = data.telefono || null;

  return prisma.familiar.update({
    where: { id: familiarId },
    data: updateData,
  });
};

export const removeFamiliar = async (productorId: ProductorId, familiarId: FamiliarId) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.familiar.findFirst({
    where: { id: familiarId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Familiar no encontrado', 404);
  }

  await prisma.familiar.delete({ where: { id: familiarId } });

  return { message: 'Familiar eliminado exitosamente' };
};

// ─── Documentos ─────────────────────────────────────────────

const MIME_TYPES_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const getDocumentos = async (productorId: ProductorId) => {
  await ensureProductorExists(productorId);

  return prisma.documentos.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'desc' },
  });
};

export const createDocumento = async (productorId: ProductorId, data: CreateDocumentoInput) => {
  await ensureProductorExists(productorId);

  if (data.tamano_bytes > MAX_SIZE_BYTES) {
    throw createError('El archivo no debe superar los 10 MB', 400);
  }

  if (!MIME_TYPES_PERMITIDOS.includes(data.mime_type)) {
    throw createError('El tipo de archivo no está permitido. Use JPEG, PNG, PDF o WebP', 400);
  }

  return prisma.documentos.create({
    data: {
      productor_id: productorId,
      tipo: data.tipo,
      categoria: data.categoria,
      nombre_archivo: data.nombre_archivo,
      ruta_archivo: data.ruta_archivo,
      tamano_bytes: data.tamano_bytes,
      mime_type: data.mime_type,
      estado: 'PENDIENTE',
    },
  });
};

export const updateDocumentoEstado = async (productorId: ProductorId, documentoId: DocumentoId, estado: DocumentoEstado) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.documentos.findFirst({
    where: { id: documentoId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }

  const transicionesValidas: Record<DocumentoEstado, DocumentoEstado[]> = {
    PENDIENTE: ['VERIFICADO', 'RECHAZADO'],
    RECHAZADO: ['PENDIENTE'],
    VERIFICADO: ['PENDIENTE'],
  };

  const permitidos = transicionesValidas[existing.estado as DocumentoEstado] || [];
  if (!permitidos.includes(estado)) {
    throw createError(`No se puede cambiar de estado ${existing.estado} a ${estado}`, 400);
  }

  return prisma.documentos.update({
    where: { id: documentoId },
    data: { estado },
  });
};

export const removeDocumento = async (productorId: ProductorId, documentoId: DocumentoId) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.documentos.findFirst({
    where: { id: documentoId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }

  await prisma.documentos.delete({ where: { id: documentoId } });

  return { message: 'Documento eliminado exitosamente' };
};

// ─── Cleanup documentos huérfanos ──────────────────────────

export const removeOrphanDocumentos = async (productorId: ProductorId, keptDocumentIds: number[]) => {
  await ensureProductorExists(productorId);

  if (keptDocumentIds.length === 0) {
    throw createError('Se requiere al menos un ID de documento a conservar', 400);
  }

  await prisma.$transaction(async (tx) => {
    const validDocuments = await tx.documentos.findMany({
      where: {
        id: { in: keptDocumentIds },
        productor_id: productorId,
      },
      select: { id: true },
    });

    const validIds = validDocuments.map((doc) => doc.id);
    const invalidIds = keptDocumentIds.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      throw createError(`Documentos no encontrados o no pertenecen al productor: ${invalidIds.join(', ')}`, 400);
    }

    await tx.documentos.deleteMany({
      where: {
        productor_id: productorId,
        id: { notIn: keptDocumentIds },
      },
    });
  });
};
