import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `CAM-${year}-`;

  const last = await prisma.campanias.findFirst({
    where: { codigo: { startsWith: prefix } },
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  const nextNum = last ? parseInt(last.codigo.split('-').pop() || '0', 10) + 1 : 1;
  return `${prefix}${String(nextNum).padStart(2, '0')}`;
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
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { nombre: { contains: filters.search, mode: 'insensitive' } },
      { anio_agricola: { contains: filters.search, mode: 'insensitive' } },
      { responsable: { contains: filters.search, mode: 'insensitive' } },
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
    where: { id: Number(id), activo: true },
  });

  if (!campania) {
    throw createError('Campaña no encontrada', 404);
  }

  return campania;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
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
  const existing = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.codigo !== undefined && (data.codigo as string).trim()) {
    const codigo = (data.codigo as string).trim();
    const existingCodigo = await prisma.campanias.findFirst({
      where: { codigo, id: { not: Number(id) } },
      select: { id: true },
    });
    if (existingCodigo) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
    updateData.codigo = codigo;
  }

  const stringFields = ['nombre', 'anio_agricola', 'responsable', 'tecnico_coordinador'];
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
    where: { id: Number(id) },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  await prisma.campanias.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Campaña eliminada exitosamente' };
};

// ─── Stats ─────────────────────────────────────────────────

const cultivoFilter = (campaniaId: number) => ({
  cultivo: { campanias_id: campaniaId, activo: true },
});

export const getStats = async (id: string) => {
  const campania = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });
  if (!campania) throw createError('Campaña no encontrada', 404);

  const campaniaId = Number(id);
  const filter = cultivoFilter(campaniaId);

  const [cultivos, actividades, inspecciones, acopios] = await Promise.all([
    prisma.cultivo.findMany({
      where: { campanias_id: campaniaId, activo: true },
      select: { id: true, area_sembrada: true, parcela_id: true, cultivo: true },
    }),
    prisma.actividades.count({ where: { activo: true, ...filter } }),
    prisma.inspecciones.count({ where: { activo: true, ...filter } }),
    prisma.acopio.count({ where: { activo: true, ...filter } }),
  ]);

  const parcelasIds = new Set(cultivos.map((c) => c.parcela_id));
  const areaSembrada = cultivos.reduce((acc: number, c) => acc + (Number(c.area_sembrada) || 0), 0);

  const cultivosPorTipo: Record<string, number> = {};
  for (const c of cultivos) {
    cultivosPorTipo[c.cultivo] = (cultivosPorTipo[c.cultivo] || 0) + 1;
  }

  return {
    parcelas: parcelasIds.size,
    cultivos: cultivos.length,
    areaSembrada: Math.round(areaSembrada * 100) / 100,
    actividades,
    inspecciones,
    acopios,
    cultivosPorTipo,
  };
};

// ─── Global Stats ──────────────────────────────────────────

export const getGlobalStats = async (filters?: {
  search?: string;
  estado?: string;
  anio_agricola?: string;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters?.estado) where.estado = filters.estado;
  if (filters?.anio_agricola) where.anio_agricola = filters.anio_agricola;

  if (filters?.search) {
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { nombre: { contains: filters.search, mode: 'insensitive' } },
      { anio_agricola: { contains: filters.search, mode: 'insensitive' } },
      { responsable: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [total, porEstado] = await Promise.all([
    prisma.campanias.count({ where }),
    prisma.campanias.groupBy({
      by: ['estado'],
      where,
      _count: { id: true },
    }),
  ]);

  const estados: Record<string, number> = {
    PLANIFICADA: 0,
    ACTIVA: 0,
    FINALIZADA: 0,
    CANCELADA: 0,
  };
  for (const item of porEstado) {
    estados[item.estado] = item._count.id;
  }

  return { total, estados };
};

// ─── Timeline ──────────────────────────────────────────────

export const getTimeline = async (id: string) => {
  const campania = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });
  if (!campania) throw createError('Campaña no encontrada', 404);

  const campaniaId = Number(id);

  const cultivosCampania = await prisma.cultivo.findMany({
    where: { campanias_id: campaniaId, activo: true },
    select: { id: true },
  });
  const cultivoIds = cultivosCampania.map(c => c.id);

  const [cultivos, actividades, inspecciones, acopios] = await Promise.all([
    prisma.cultivo.findMany({
      where: { campanias_id: campaniaId, activo: true },
      select: {
        id: true,
        cultivo: true,
        created_at: true,
        fecha_siembra: true,
        parcela: { select: { nombre: true, productor: { select: { nombres: true, apellido_paterno: true } } } },
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    }),
    cultivoIds.length > 0 ? prisma.actividades.findMany({
      where: { activo: true, cultivo_id: { in: cultivoIds } },
      select: {
        id: true,
        tipo_actividad: true,
        descripcion: true,
        responsable_tecnico: true,
        estado: true,
        created_at: true,
        fecha: true,
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    }) : [],
    cultivoIds.length > 0 ? prisma.inspecciones.findMany({
      where: { activo: true, cultivo_id: { in: cultivoIds } },
      select: {
        id: true,
        codigo: true,
        inspector: true,
        estado: true,
        created_at: true,
        fecha: true,
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    }) : [],
    cultivoIds.length > 0 ? prisma.acopio.findMany({
      where: { activo: true, detalles: { some: { cultivo_id: { in: cultivoIds } } } },
      select: {
        id: true,
        codigo: true,
        acopiador: true,
        peso_total: true,
        created_at: true,
        fecha: true,
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    }) : [],
  ]);

  const items: Array<{
    id: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha: string;
  }> = [];

  for (const c of cultivos) {
    items.push({
      id: `cultivo-${c.id}`,
      tipo: 'cultivo',
      titulo: `Cultivo registrado: ${c.cultivo}`,
      descripcion: `${(c.parcela as any)?.productor?.nombres ?? ''} ${(c.parcela as any)?.productor?.apellido_paterno ?? ''} - ${c.parcela?.nombre ?? ''}`,
      fecha: (c.created_at ?? c.fecha_siembra) as unknown as string,
    });
  }

  for (const a of actividades) {
    items.push({
      id: `actividad-${a.id}`,
      tipo: 'actividad',
      titulo: `Actividad: ${a.tipo_actividad ?? a.descripcion ?? 'Sin descripción'}`,
      descripcion: `${a.responsable_tecnico ?? ''} - ${a.estado ?? ''}`,
      fecha: (a.created_at ?? a.fecha) as unknown as string,
    });
  }

  for (const i of inspecciones) {
    items.push({
      id: `inspeccion-${i.id}`,
      tipo: 'inspeccion',
      titulo: `Inspección: ${i.codigo}`,
      descripcion: `${i.inspector ?? ''} - ${i.estado ?? ''}`,
      fecha: (i.created_at ?? i.fecha) as unknown as string,
    });
  }

  for (const a of acopios) {
    items.push({
      id: `acopio-${a.id}`,
      tipo: 'acopio',
      titulo: `Acopio: ${a.codigo}`,
      descripcion: `${a.acopiador ?? ''} - ${a.peso_total ?? 0} kg`,
      fecha: (a.created_at ?? a.fecha) as unknown as string,
    });
  }

  items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return items.slice(0, 10);
};
