import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.trazabilidad.findFirst({
    where: { codigo: { startsWith: `TRZ-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `TRZ-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `TRZ-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.trazabilidad.findUnique({ where: { codigo: current }, select: { id: true } });
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
  cultivo?: string;
  lote_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.cultivo) where.cultivo = { contains: filters.cultivo };
  if (filters.lote_id) where.lote_id = filters.lote_id;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { producto: { contains: filters.search } },
      { cultivo: { contains: filters.search } },
      { origen: { contains: filters.search } },
      { productor: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.trazabilidad.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        eventos: { orderBy: { fecha: 'desc' } },
      },
    }),
    prisma.trazabilidad.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const item = await prisma.trazabilidad.findFirst({
    where: { id, activo: true },
    include: {
      eventos: { orderBy: { fecha: 'desc' } },
    },
  });

  if (!item) {
    throw createError('Registro de trazabilidad no encontrado', 404);
  }

  return item;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.trazabilidad.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const eventosData = (data.eventos as Array<Record<string, unknown>>) || [];

  return prisma.trazabilidad.create({
    data: {
      codigo,
      lote_id: (data.lote_id as string) || null,
      producto: data.producto as string,
      cultivo: data.cultivo as string,
      origen: data.origen as string,
      productor: (data.productor as string) || null,
      parcela: (data.parcela as string) || null,
      comunidad: (data.comunidad as string) || null,
      fecha_siembra: data.fecha_siembra ? new Date(data.fecha_siembra as string) : null,
      fecha_cosecha: data.fecha_cosecha ? new Date(data.fecha_cosecha as string) : null,
      fecha_procesamiento: data.fecha_procesamiento ? new Date(data.fecha_procesamiento as string) : null,
      peso_total: data.peso_total != null ? Number(data.peso_total) : null,
      unidad: (data.unidad as string) || null,
      calidad: (data.calidad as string) || null,
      certificacion: (data.certificacion as string) || null,
      destino: (data.destino as string) || null,
      estado: (data.estado as string) || 'REGISTRADO',
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      eventos: {
        create: eventosData.map(e => ({
          fecha: new Date(e.fecha as string),
          titulo: e.titulo as string,
          descripcion: (e.descripcion as string) || null,
          tipo: e.tipo as string,
          ubicacion: (e.ubicacion as string) || null,
          responsable: (e.responsable as string) || null,
        })),
      },
    },
    include: {
      eventos: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.trazabilidad.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Registro de trazabilidad no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['producto', 'cultivo', 'origen', 'productor', 'parcela', 'comunidad', 'calidad', 'certificacion', 'destino', 'estado', 'observaciones'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.lote_id !== undefined) updateData.lote_id = (data.lote_id as string) || null;
  if (data.unidad !== undefined) updateData.unidad = (data.unidad as string) || null;
  if (data.fecha_siembra !== undefined) updateData.fecha_siembra = data.fecha_siembra ? new Date(data.fecha_siembra as string) : null;
  if (data.fecha_cosecha !== undefined) updateData.fecha_cosecha = data.fecha_cosecha ? new Date(data.fecha_cosecha as string) : null;
  if (data.fecha_procesamiento !== undefined) updateData.fecha_procesamiento = data.fecha_procesamiento ? new Date(data.fecha_procesamiento as string) : null;
  if (data.peso_total !== undefined) updateData.peso_total = data.peso_total != null ? Number(data.peso_total) : null;

  if (userId) updateData.updated_by = userId;

  if (data.eventos !== undefined) {
    const eventosData = data.eventos as Array<Record<string, unknown>>;
    await prisma.trazabilidad_eventos.deleteMany({ where: { trazabilidad_id: id } });
    if (eventosData.length > 0) {
      await prisma.trazabilidad_eventos.createMany({
        data: eventosData.map(e => ({
          trazabilidad_id: id,
          fecha: new Date(e.fecha as string),
          titulo: e.titulo as string,
          descripcion: (e.descripcion as string) || null,
          tipo: e.tipo as string,
          ubicacion: (e.ubicacion as string) || null,
          responsable: (e.responsable as string) || null,
        })),
      });
    }
  }

  return prisma.trazabilidad.update({
    where: { id },
    data: updateData,
    include: {
      eventos: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.trazabilidad.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Registro de trazabilidad no encontrado', 404);
  }

  await prisma.trazabilidad.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Registro de trazabilidad eliminado exitosamente' };
};

// ─── Eventos ──────────────────────────────────────────────

export const addEvento = async (trazabilidadId: string, data: Record<string, unknown>) => {
  const item = await prisma.trazabilidad.findFirst({ where: { id: trazabilidadId, activo: true } });

  if (!item) {
    throw createError('Registro de trazabilidad no encontrado', 404);
  }

  const evento = await prisma.trazabilidad_eventos.create({
    data: {
      trazabilidad_id: trazabilidadId,
      fecha: new Date(data.fecha as string),
      titulo: data.titulo as string,
      descripcion: (data.descripcion as string) || null,
      tipo: data.tipo as string,
      ubicacion: (data.ubicacion as string) || null,
      responsable: (data.responsable as string) || null,
    },
  });

  return evento;
};

export const removeEvento = async (trazabilidadId: string, eventoId: string) => {
  const item = await prisma.trazabilidad.findFirst({ where: { id: trazabilidadId, activo: true } });

  if (!item) {
    throw createError('Registro de trazabilidad no encontrado', 404);
  }

  const evento = await prisma.trazabilidad_eventos.findFirst({
    where: { id: eventoId, trazabilidad_id: trazabilidadId },
  });

  if (!evento) {
    throw createError('Evento no encontrado', 404);
  }

  await prisma.trazabilidad_eventos.delete({
    where: { id: eventoId },
  });

  return { message: 'Evento eliminado exitosamente' };
};
