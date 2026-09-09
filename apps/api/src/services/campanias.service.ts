import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import type {
  CreateCampaniaInput,
  UpdateCampaniaInput,
  CampaniaFilters,
  EstadoCampania,
} from '@agrodata/types';
import type {
  CampaniaRecord,
  CampaniaStats,
  CampaniaGlobalStats,
  CampaniaTimelineEvent,
} from '../types/campanias.types';

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

export const getAll = async (
  filters: {
    search?: string;
    estado?: string;
    anio_agricola?: string;
    page?: number;
    limit?: number;
  },
): Promise<{ data: CampaniaRecord[]; total: number; page: number; limit: number; totalPages: number }> => {
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

export const getById = async (id: string): Promise<CampaniaRecord> => {
  const campania = await prisma.campanias.findFirst({
    where: { id: Number(id), activo: true },
  });

  if (!campania) {
    throw createError('Campaña no encontrada', 404);
  }

  return campania;
};

export const create = async (data: CreateCampaniaInput, userId?: string): Promise<CampaniaRecord> => {
  let codigo = data.codigo || '';
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
      nombre: data.nombre,
      anio_agricola: data.anio_agricola,
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: new Date(data.fecha_fin),
      descripcion: data.descripcion ?? null,
      estado: data.estado ?? 'PLANIFICADA',
      responsable: data.responsable,
      tecnico_coordinador: data.tecnico_coordinador,
      objetivo: data.objetivo ?? null,
      permitir_cultivos: data.permitir_cultivos ?? true,
      permitir_actividades: data.permitir_actividades ?? true,
      permitir_cosechas: data.permitir_cosechas ?? true,
      permitir_inspecciones: data.permitir_inspecciones ?? true,
      permitir_acopio: data.permitir_acopio ?? true,
      permitir_procesamiento: data.permitir_procesamiento ?? true,
      visible: data.visible ?? true,
      activa: data.activa ?? false,
      observaciones: data.observaciones ?? null,
      created_by: userId ?? null,
    },
  });
};

export const update = async (id: string, data: UpdateCampaniaInput, userId?: string): Promise<CampaniaRecord> => {
  const existing = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.codigo !== undefined && data.codigo.trim()) {
    const codigo = data.codigo.trim();
    const existingCodigo = await prisma.campanias.findFirst({
      where: { codigo, id: { not: Number(id) } },
      select: { id: true },
    });
    if (existingCodigo) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
    updateData.codigo = codigo;
  }

  const stringFields = ['nombre', 'anio_agricola', 'responsable', 'tecnico_coordinador'] as const;
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['descripcion', 'objetivo', 'observaciones'] as const;
  for (const field of nullableFields) {
    if (data[field] !== undefined) updateData[field] = data[field] || null;
  }

  if (data.fecha_inicio !== undefined) updateData.fecha_inicio = new Date(data.fecha_inicio);
  if (data.fecha_fin !== undefined) updateData.fecha_fin = new Date(data.fecha_fin);
  if (data.estado !== undefined) updateData.estado = data.estado;

  const booleanFields = [
    'permitir_cultivos', 'permitir_actividades', 'permitir_cosechas',
    'permitir_inspecciones', 'permitir_acopio', 'permitir_procesamiento',
    'visible', 'activa',
  ] as const;
  for (const field of booleanFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (userId) updateData.updated_by = userId;

  return prisma.campanias.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

export const remove = async (id: string): Promise<{ message: string }> => {
  const existing = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Campaña no encontrada', 404);
  }

  const cultivosCount = await prisma.cultivo.count({
    where: { campania_id: Number(id), activo: true },
  });

  if (cultivosCount > 0) {
    throw createError('No se puede eliminar la campaña porque tiene cultivos asociados', 409);
  }

  await prisma.campanias.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Campaña eliminada exitosamente' };
};

// ─── Stats ─────────────────────────────────────────────────

export const getStats = async (id: string): Promise<CampaniaStats> => {
  const campania = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });
  if (!campania) throw createError('Campaña no encontrada', 404);

  const campaniaId = Number(id);

  const cultivos = await prisma.cultivo.findMany({
    where: { campania_id: campaniaId, activo: true },
    select: { id: true, area_sembrada: true, parcela_id: true, cultivo: true },
  });

  const cultivoIds = cultivos.map((c) => c.id);
  const parcelasIds = new Set(cultivos.map((c) => c.parcela_id));

  const [actividades, inspecciones, acopios, parcelas] = await Promise.all([
    prisma.actividades.count({ where: { activo: true, cultivo_id: { in: cultivoIds } } }),
    prisma.inspecciones.count({ where: { activo: true, cultivo_id: { in: cultivoIds } } }),
    prisma.acopio.count({ where: { activo: true, detalles: { some: { cultivo_id: { in: cultivoIds } } } } }),
    prisma.parcela.findMany({
      where: { id: { in: Array.from(parcelasIds) } },
      select: { productores_id: true },
    }),
  ]);

  const productoresIds = new Set(parcelas.map((p) => p.productores_id));
  const areaSembrada = cultivos.reduce((acc, c) => acc + (Number(c.area_sembrada) || 0), 0);

  const cultivosPorTipo: Record<string, number> = {};
  for (const c of cultivos) {
    cultivosPorTipo[c.cultivo] = (cultivosPorTipo[c.cultivo] || 0) + 1;
  }

  return {
    productores: productoresIds.size,
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
}): Promise<CampaniaGlobalStats> => {
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

  const estados: Record<EstadoCampania, number> = {
    PLANIFICADA: 0,
    ACTIVA: 0,
    FINALIZADA: 0,
    CANCELADA: 0,
  };
  for (const item of porEstado) {
    estados[item.estado as EstadoCampania] = item._count.id;
  }

  return { total, estados };
};

// ─── Timeline ──────────────────────────────────────────────

export const getTimeline = async (id: string): Promise<CampaniaTimelineEvent[]> => {
  const campania = await prisma.campanias.findFirst({ where: { id: Number(id), activo: true } });
  if (!campania) throw createError('Campaña no encontrada', 404);

  const campaniaId = Number(id);

  const cultivosCampania = await prisma.cultivo.findMany({
    where: { campania_id: campaniaId, activo: true },
    select: { id: true },
  });
  const cultivoIds = cultivosCampania.map((c) => c.id);

  const [cultivos, actividades, inspecciones, acopios] = await Promise.all([
    prisma.cultivo.findMany({
      where: { campania_id: campaniaId, activo: true },
      select: {
        id: true,
        cultivo: true,
        created_at: true,
        fecha_siembra: true,
        parcela: {
          select: {
            nombre: true,
            productor: { select: { nombres: true, apellido_paterno: true } },
          },
        },
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    }),
    cultivoIds.length > 0
      ? prisma.actividades.findMany({
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
        })
      : [],
    cultivoIds.length > 0
      ? prisma.inspecciones.findMany({
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
        })
      : [],
    cultivoIds.length > 0
      ? prisma.acopio.findMany({
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
        })
      : [],
  ]);

  const items: CampaniaTimelineEvent[] = [];

  for (const c of cultivos) {
    const productor = (c.parcela as { productor?: { nombres?: string; apellido_paterno?: string } | null })?.productor;
    items.push({
      id: `cultivo-${c.id}`,
      tipo: 'cultivo',
      titulo: `Cultivo registrado: ${c.cultivo}`,
      descripcion: `${productor?.nombres ?? ''} ${productor?.apellido_paterno ?? ''} - ${c.parcela?.nombre ?? ''}`,
      fecha: String(c.created_at ?? c.fecha_siembra),
    });
  }

  for (const a of actividades) {
    items.push({
      id: `actividad-${a.id}`,
      tipo: 'actividad',
      titulo: `Actividad: ${a.tipo_actividad ?? a.descripcion ?? 'Sin descripción'}`,
      descripcion: `${a.responsable_tecnico ?? ''} - ${a.estado ?? ''}`,
      fecha: String(a.created_at ?? a.fecha),
    });
  }

  for (const i of inspecciones) {
    items.push({
      id: `inspeccion-${i.id}`,
      tipo: 'inspeccion',
      titulo: `Inspección: ${i.codigo}`,
      descripcion: `${i.inspector ?? ''} - ${i.estado ?? ''}`,
      fecha: String(i.created_at ?? i.fecha),
    });
  }

  for (const a of acopios) {
    items.push({
      id: `acopio-${a.id}`,
      tipo: 'acopio',
      titulo: `Acopio: ${a.codigo}`,
      descripcion: `${a.acopiador ?? ''} - ${a.peso_total ?? 0} kg`,
      fecha: String(a.created_at ?? a.fecha),
    });
  }

  items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return items.slice(0, 10);
};
