import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.campanias.findFirst({
    where: { codigo: { startsWith: `CAM-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `CAM-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `CAM-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.campanias.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const parts = current.split('-');
    const num = parseInt(parts.pop() || '0', 10) + 1;
    current = `${parts.join('-')}-${String(num).padStart(2, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  anio_agricola?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.anio_agricola) where.anio_agricola = filters.anio_agricola;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { nombre: { contains: filters.search } },
      { anio_agricola: { contains: filters.search } },
      { responsable: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.campanias.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.campanias.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const campania = await prisma.campanias.findFirst({
    where: { id, activo: true },
  });

  if (!campania) {
    throw createError('Campaña no encontrada', 404);
  }

  return campania;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.campanias.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  return prisma.campanias.create({
    data: {
      codigo,
      nombre: data.nombre as string,
      anio_agricola: data.anio_agricola as string,
      fecha_inicio: new Date(data.fecha_inicio as string),
      fecha_fin: new Date(data.fecha_fin as string),
      descripcion: (data.descripcion as string) || null,
      estado: (data.estado as 'PLANIFICADA' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA') || 'PLANIFICADA',
      responsable: data.responsable as string,
      tecnico_coordinador: data.tecnico_coordinador as string,
      objetivo: (data.objetivo as string) || null,
      permitir_cultivos: (data.permitir_cultivos as boolean) ?? true,
      permitir_actividades: (data.permitir_actividades as boolean) ?? true,
      permitir_cosechas: (data.permitir_cosechas as boolean) ?? true,
      permitir_inspecciones: (data.permitir_inspecciones as boolean) ?? true,
      permitir_acopio: (data.permitir_acopio as boolean) ?? true,
      permitir_procesamiento: (data.permitir_procesamiento as boolean) ?? true,
      visible: (data.visible as boolean) ?? true,
      activa: (data.activa as boolean) ?? false,
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.campanias.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'nombre', 'anio_agricola', 'responsable', 'tecnico_coordinador'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['descripcion', 'objetivo', 'observaciones'];
  for (const field of nullableFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.fecha_inicio !== undefined) updateData.fecha_inicio = new Date(data.fecha_inicio as string);
  if (data.fecha_fin !== undefined) updateData.fecha_fin = new Date(data.fecha_fin as string);
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.permitir_cultivos !== undefined) updateData.permitir_cultivos = data.permitir_cultivos;
  if (data.permitir_actividades !== undefined) updateData.permitir_actividades = data.permitir_actividades;
  if (data.permitir_cosechas !== undefined) updateData.permitir_cosechas = data.permitir_cosechas;
  if (data.permitir_inspecciones !== undefined) updateData.permitir_inspecciones = data.permitir_inspecciones;
  if (data.permitir_acopio !== undefined) updateData.permitir_acopio = data.permitir_acopio;
  if (data.permitir_procesamiento !== undefined) updateData.permitir_procesamiento = data.permitir_procesamiento;
  if (data.visible !== undefined) updateData.visible = data.visible;
  if (data.activa !== undefined) updateData.activa = data.activa;

  if (userId) updateData.updated_by = userId;

  return prisma.campanias.update({
    where: { id },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.campanias.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  await prisma.campanias.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Campaña eliminada exitosamente' };
};
