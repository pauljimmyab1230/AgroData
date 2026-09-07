import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

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

const generateCodigo = async (tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<string> => {
  const client = tx || prisma;
  const last = await client.productor.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'SOC-001';

  const num = parseInt(last.codigo.replace('SOC-', ''), 10) + 1;
  return `SOC-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string, tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<string> => {
  const client = tx || prisma;
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

// ─── Stats ───────────────────────────────────────────────

export const getStats = async () => {
  const where = { activo: true };

  const [total, activos, inactivos, suspendidos, mujeres, varones] = await Promise.all([
    prisma.productor.count({ where }),
    prisma.productor.count({ where: { ...where, estado: 'ACTIVO' } }),
    prisma.productor.count({ where: { ...where, estado: 'INACTIVO' } }),
    prisma.productor.count({ where: { ...where, estado: 'SUSPENDIDO' } }),
    prisma.productor.count({ where: { ...where, sexo: 'FEMENINO' } }),
    prisma.productor.count({ where: { ...where, sexo: 'MASCULINO' } }),
  ]);

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
  return result.map((r: { comunidad: string | null }) => r.comunidad ?? "").filter((c: string) => c !== "");
};

export const getAll = async (
  search?: string,
  estado?: string,
  cargo?: string,
  sexo?: string,
  comunidad?: string,
  page = 1,
  limit = 20,
) => {
  const where: Record<string, unknown> = { activo: true };

  if (estado) {
    where.estado = estado;
  }

  if (cargo) {
    where.cargo = cargo;
  }

  if (sexo) {
    where.sexo = sexo;
  }

  if (comunidad) {
    where.comunidad = comunidad;
  }

  if (search) {
    where.OR = [
      { codigo: { contains: search, mode: 'insensitive' } },
      { dni: { contains: search, mode: 'insensitive' } },
      { nombres: { contains: search, mode: 'insensitive' } },
      { apellido_paterno: { contains: search, mode: 'insensitive' } },
      { apellido_materno: { contains: search, mode: 'insensitive' } },
      { comunidad: { contains: search, mode: 'insensitive' } },
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

export const getById = async (id: number) => {
  const productor = await prisma.productor.findFirst({
    where: { id, activo: true },
    include: {
      familiares: true,
      parcelas: true,
      documentos: true,
    },
  });

  if (!productor) {
    throw createError('Productor no encontrado', 404);
  }

  return productor;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  const productor = await prisma.$transaction(async (tx) => {
    const codigo = await ensureUniqueCodigo(await generateCodigo(tx), tx);

    return tx.productor.create({
      data: {
        codigo,
        dni: data.dni as string,
        nombres: data.nombres as string,
        apellido_paterno: data.apellido_paterno as string,
        apellido_materno: data.apellido_materno as string,
        sexo: data.sexo as 'MASCULINO' | 'FEMENINO',
        fecha_nacimiento: parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento'),
        estado_civil: data.estado_civil as 'SOLTERO' | 'CASADO' | 'CONVIVIENTE' | 'VIUDO',
        telefono: (data.telefono as string) || null,
        correo: (data.correo as string) || null,
        departamento: data.departamento as string,
        provincia: data.provincia as string,
        distrito: data.distrito as string,
        comunidad: data.comunidad as string,
        direccion: (data.direccion as string) || null,
        nivel_educativo: data.nivel_educativo as 'SIN_ESTUDIOS' | 'PRIMARIA' | 'SECUNDARIA' | 'TECNICO' | 'UNIVERSITARIO',
        idioma_principal: data.idioma_principal as 'QUECHUA' | 'ESPANOL' | 'OTRO',
        idioma_secundario: (data.idioma_secundario as 'NINGUNO' | 'QUECHUA' | 'ESPANOL' | 'OTRO') || 'NINGUNO',
        material_vivienda: (data.material_vivienda as string) || null,
        acceso_agua: (data.acceso_agua as string) || null,
        acceso_energia: (data.acceso_energia as string) || null,
        acceso_internet: (data.acceso_internet as string) || null,
        seguro_salud: (data.seguro_salud as string) || null,
        acceso_credito: (data.acceso_credito as string) || null,
        servicio_sanitario: (data.servicio_sanitario as string) || null,
        estado: (data.estado as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') || 'ACTIVO',
        fecha_ingreso: parseValidDate(data.fecha_ingreso, 'fecha_ingreso'),
        organizacion: data.organizacion as string,
        cargo: data.cargo as 'SOCIO' | 'DIRECTIVO' | 'PRESIDENTE' | 'VICEPRESIDENTE' | 'SECRETARIO' | 'TESORERO' | 'VOCAL' | 'OTRO',
        foto_url: (data.foto_url as string) || null,
        firma_url: (data.firma_url as string) || null,
        created_by: userId || null,
      },
    });
  });

  return productor;
};

export const update = async (id: number, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.productor.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Productor no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['dni', 'nombres', 'apellido_paterno', 'apellido_materno', 'departamento', 'provincia', 'distrito', 'comunidad', 'organizacion'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['telefono', 'correo', 'direccion', 'foto_url', 'firma_url', 'material_vivienda', 'acceso_agua', 'acceso_energia', 'acceso_internet', 'seguro_salud', 'acceso_credito', 'servicio_sanitario'];
  for (const field of nullableFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
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

export const remove = async (id: number) => {
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

export const getFamiliares = async (productorId: number) => {
  await ensureProductorExists(productorId);

  return prisma.familiar.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'asc' },
  });
};

export const createFamiliar = async (productorId: number, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  return prisma.familiar.create({
    data: {
      productor_id: productorId,
      nombres: data.nombres as string,
      parentesco: data.parentesco as string,
      dni: (data.dni as string) || null,
      sexo: data.sexo as 'MASCULINO' | 'FEMENINO',
      fecha_nacimiento: parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento del familiar'),
      ocupacion: (data.ocupacion as string) || null,
      nivel_educativo: (data.nivel_educativo as 'SIN_ESTUDIOS' | 'PRIMARIA' | 'SECUNDARIA' | 'TECNICO' | 'UNIVERSITARIO') || null,
      telefono: (data.telefono as string) || null,
      dependiente: (data.dependiente as boolean) ?? false,
      vive_con_productor: (data.vive_con_productor as boolean) ?? true,
    },
  });
};

export const updateFamiliar = async (productorId: number, familiarId: number, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.familiar.findFirst({
    where: { id: familiarId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Familiar no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = ['nombres', 'parentesco', 'dni', 'sexo', 'ocupacion', 'nivel_educativo', 'telefono', 'dependiente', 'vive_con_productor'];
  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }
  if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = parseValidDate(data.fecha_nacimiento, 'fecha_nacimiento del familiar');
  if (data.dni !== undefined) updateData.dni = (data.dni as string) || null;
  if (data.ocupacion !== undefined) updateData.ocupacion = (data.ocupacion as string) || null;
  if (data.telefono !== undefined) updateData.telefono = (data.telefono as string) || null;

  return prisma.familiar.update({
    where: { id: familiarId },
    data: updateData,
  });
};

export const removeFamiliar = async (productorId: number, familiarId: number) => {
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

export const getDocumentos = async (productorId: number) => {
  await ensureProductorExists(productorId);

  return prisma.documentos.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'desc' },
  });
};

export const createDocumento = async (productorId: number, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  const tamanoBytes = data.tamano_bytes as number;
  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

  if (tamanoBytes > maxSizeBytes) {
    throw createError('El archivo no debe superar los 10 MB', 400);
  }

  const mimeTypesPermitidos = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
  const mimeType = data.mime_type as string;

  if (!mimeTypesPermitidos.includes(mimeType)) {
    throw createError('El tipo de archivo no está permitido. Use JPEG, PNG, PDF o WebP', 400);
  }

  return prisma.documentos.create({
    data: {
      productor_id: productorId,
      tipo: data.tipo as string,
      categoria: data.categoria as 'PERSONAL' | 'INSTITUCIONAL' | 'OTROS',
      nombre_archivo: data.nombre_archivo as string,
      ruta_archivo: data.ruta_archivo as string,
      tamano_bytes: tamanoBytes,
      mime_type: mimeType,
      estado: 'PENDIENTE',
    },
  });
};

export const updateDocumentoEstado = async (productorId: number, documentoId: number, estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO') => {
  await ensureProductorExists(productorId);

  const existing = await prisma.documentos.findFirst({
    where: { id: documentoId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }

  const transicionesValidas: Record<string, string[]> = {
    PENDIENTE: ['VERIFICADO', 'RECHAZADO'],
    RECHAZADO: ['PENDIENTE'],
    VERIFICADO: ['PENDIENTE'],
  };

  const permitidos = transicionesValidas[existing.estado] || [];
  if (!permitidos.includes(estado)) {
    throw createError(`No se puede cambiar de estado ${existing.estado} a ${estado}`, 400);
  }

  return prisma.documentos.update({
    where: { id: documentoId },
    data: { estado },
  });
};

export const removeDocumento = async (productorId: number, documentoId: number) => {
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

export const removeOrphanDocumentos = async (productorId: number, keptDocumentIds: number[]) => {
  await ensureProductorExists(productorId);

  if (keptDocumentIds.length === 0) {
    throw createError('No se pueden eliminar todos los documentos. Proporcione al menos un ID a conservar.', 400);
  }

  const validDocuments = await prisma.documentos.findMany({
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

  await prisma.documentos.deleteMany({
    where: {
      productor_id: productorId,
      id: { notIn: keptDocumentIds },
    },
  });
};

// ─── Helpers ────────────────────────────────────────────────

const ensureProductorExists = async (id: number) => {
  const exists = await prisma.productor.findFirst({ where: { id, activo: true }, select: { id: true } });
  if (!exists) {
    throw createError('Productor no encontrado', 404);
  }
};
