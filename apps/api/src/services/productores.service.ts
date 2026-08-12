import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.productores.findFirst({
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'SOC-001';

  const num = parseInt(last.codigo.replace('SOC-', ''), 10) + 1;
  return `SOC-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.productores.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('SOC-', ''), 10) + 1;
    current = `SOC-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

// ─── Productores ────────────────────────────────────────────

export const getComunidades = async (): Promise<string[]> => {
  const result = await prisma.productores.findMany({
    where: { activo: true },
    select: { comunidad: true },
    distinct: ['comunidad'],
    orderBy: { comunidad: 'asc' },
  });
  return result.map((r) => r.comunidad);
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
      { codigo: { contains: search } },
      { dni: { contains: search } },
      { nombres: { contains: search } },
      { apellido_paterno: { contains: search } },
      { apellido_materno: { contains: search } },
      { comunidad: { contains: search } },
    ];
  }

  const [productores, total] = await Promise.all([
    prisma.productores.findMany({
      where,
      include: {
        _count: { select: { familiares: true, parcelas: true, documentos: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.productores.count({ where }),
  ]);

  return { data: productores, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const productor = await prisma.productores.findFirst({
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
  const codigo = await ensureUniqueCodigo(await generateCodigo());

  const productor = await prisma.productores.create({
    data: {
      codigo,
      dni: data.dni as string,
      nombres: data.nombres as string,
      apellido_paterno: data.apellido_paterno as string,
      apellido_materno: data.apellido_materno as string,
      sexo: data.sexo as 'MASCULINO' | 'FEMENINO',
      fecha_nacimiento: new Date(data.fecha_nacimiento as string),
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
      estado: (data.estado as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') || 'ACTIVO',
      fecha_ingreso: new Date(data.fecha_ingreso as string),
      organizacion: data.organizacion as string,
      cargo: data.cargo as 'SOCIO' | 'DIRECTIVO' | 'PRESIDENTE' | 'VICEPRESIDENTE' | 'SECRETARIO' | 'TESORERO' | 'VOCAL' | 'OTRO',
      foto_url: (data.foto_url as string) || null,
      firma_url: (data.firma_url as string) || null,
      created_by: userId || null,
    },
  });

  return productor;
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.productores.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Productor no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['dni', 'nombres', 'apellido_paterno', 'apellido_materno', 'departamento', 'provincia', 'distrito', 'comunidad', 'organizacion'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['telefono', 'correo', 'direccion', 'foto_url', 'firma_url'];
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
  if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = new Date(data.fecha_nacimiento as string);
  if (data.fecha_ingreso !== undefined) updateData.fecha_ingreso = new Date(data.fecha_ingreso as string);

  if (userId) updateData.updated_by = userId;

  const updated = await prisma.productores.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

export const remove = async (id: string) => {
  const existing = await prisma.productores.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Productor no encontrado', 404);
  }

  await prisma.productores.update({
    where: { id },
    data: { activo: false, estado: 'INACTIVO' },
  });

  return { message: 'Productor eliminado exitosamente' };
};

// ─── Familiares ─────────────────────────────────────────────

export const getFamiliares = async (productorId: string) => {
  await ensureProductorExists(productorId);

  return prisma.familiares_productor.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'asc' },
  });
};

export const createFamiliar = async (productorId: string, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  return prisma.familiares_productor.create({
    data: {
      productor_id: productorId,
      nombres: data.nombres as string,
      parentesco: data.parentesco as string,
      dni: (data.dni as string) || null,
      sexo: data.sexo as 'MASCULINO' | 'FEMENINO',
      fecha_nacimiento: new Date(data.fecha_nacimiento as string),
      ocupacion: (data.ocupacion as string) || null,
      nivel_educativo: (data.nivel_educativo as 'SIN_ESTUDIOS' | 'PRIMARIA' | 'SECUNDARIA' | 'TECNICO' | 'UNIVERSITARIO') || null,
      telefono: (data.telefono as string) || null,
      dependiente: (data.dependiente as boolean) ?? false,
      vive_con_productor: (data.vive_con_productor as boolean) ?? true,
    },
  });
};

export const updateFamiliar = async (productorId: string, familiarId: string, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.familiares_productor.findFirst({
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
  if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = new Date(data.fecha_nacimiento as string);
  if (data.dni !== undefined) updateData.dni = (data.dni as string) || null;
  if (data.ocupacion !== undefined) updateData.ocupacion = (data.ocupacion as string) || null;
  if (data.telefono !== undefined) updateData.telefono = (data.telefono as string) || null;

  return prisma.familiares_productor.update({
    where: { id: familiarId },
    data: updateData,
  });
};

export const removeFamiliar = async (productorId: string, familiarId: string) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.familiares_productor.findFirst({
    where: { id: familiarId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Familiar no encontrado', 404);
  }

  await prisma.familiares_productor.delete({ where: { id: familiarId } });

  return { message: 'Familiar eliminado exitosamente' };
};

// ─── Parcelas ───────────────────────────────────────────────

export const getParcelas = async (productorId: string) => {
  await ensureProductorExists(productorId);

  return prisma.parcelas_productor.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'asc' },
  });
};

export const createParcela = async (productorId: string, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  return prisma.parcelas_productor.create({
    data: {
      productor_id: productorId,
      codigo: data.codigo as string,
      nombre: data.nombre as string,
      cultivo: data.cultivo as string,
      area: data.area as number,
      area_unidad: (data.area_unidad as string) || 'ha',
      ubicacion: data.ubicacion as string,
      certificacion: (data.certificacion as 'ORGANICA' | 'EN_TRANSICION' | 'CONVENCIONAL') || 'CONVENCIONAL',
      estado: (data.estado as 'ACTIVA' | 'INACTIVA') || 'ACTIVA',
    },
  });
};

export const updateParcela = async (productorId: string, parcelaId: string, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.parcelas_productor.findFirst({
    where: { id: parcelaId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = ['codigo', 'nombre', 'cultivo', 'area', 'area_unidad', 'ubicacion', 'certificacion', 'estado'];
  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  return prisma.parcelas_productor.update({
    where: { id: parcelaId },
    data: updateData,
  });
};

export const removeParcela = async (productorId: string, parcelaId: string) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.parcelas_productor.findFirst({
    where: { id: parcelaId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  await prisma.parcelas_productor.delete({ where: { id: parcelaId } });

  return { message: 'Parcela eliminada exitosamente' };
};

// ─── Documentos ─────────────────────────────────────────────

export const getDocumentos = async (productorId: string) => {
  await ensureProductorExists(productorId);

  return prisma.documentos_productor.findMany({
    where: { productor_id: productorId },
    orderBy: { created_at: 'desc' },
  });
};

export const createDocumento = async (productorId: string, data: Record<string, unknown>) => {
  await ensureProductorExists(productorId);

  return prisma.documentos_productor.create({
    data: {
      productor_id: productorId,
      tipo: data.tipo as string,
      categoria: data.categoria as 'PERSONAL' | 'INSTITUCIONAL' | 'OTROS',
      nombre_archivo: data.nombre_archivo as string,
      ruta_archivo: data.ruta_archivo as string,
      tamano_bytes: data.tamano_bytes as number,
      mime_type: data.mime_type as string,
      estado: 'PENDIENTE',
    },
  });
};

export const updateDocumentoEstado = async (productorId: string, documentoId: string, estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO') => {
  await ensureProductorExists(productorId);

  const existing = await prisma.documentos_productor.findFirst({
    where: { id: documentoId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }

  return prisma.documentos_productor.update({
    where: { id: documentoId },
    data: { estado },
  });
};

export const removeDocumento = async (productorId: string, documentoId: string) => {
  await ensureProductorExists(productorId);

  const existing = await prisma.documentos_productor.findFirst({
    where: { id: documentoId, productor_id: productorId },
  });

  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }

  await prisma.documentos_productor.delete({ where: { id: documentoId } });

  return { message: 'Documento eliminado exitosamente' };
};

// ─── Helpers ────────────────────────────────────────────────

const ensureProductorExists = async (id: string) => {
  const exists = await prisma.productores.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError('Productor no encontrado', 404);
  }
};
