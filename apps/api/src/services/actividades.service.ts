import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.actividades.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'ACT-001';

  const num = parseInt(last.codigo.replace('ACT-', ''), 10) + 1;
  return `ACT-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.actividades.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('ACT-', ''), 10) + 1;
    current = `ACT-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const ensureRelationExists = async (model: string, id: string | number) => {
  const numId = Number(id);
  const lookupId = !isNaN(numId) && String(numId) === String(id) ? numId : id;
  const exists = await (prisma as any)[model].findUnique({ where: { id: lookupId }, select: { id: true } });
  if (!exists) throw createError(`${model} no encontrado`, 404);
};

const selectIncludes = {
  cultivo: { select: { id: true, cultivo: true, codigo: true } },
  insumos: true,
  mano_obra: true,
  maquinaria: true,
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  cultivo_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.tipo_actividad) where.tipo_actividad = filters.tipo_actividad;
  if (filters.cultivo_id) where.cultivo_id = Number(filters.cultivo_id);

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { descripcion: { contains: filters.search, mode: 'insensitive' } },
      { responsable_tecnico: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.actividades.findMany({
      where,
      include: {
        cultivo: { select: { id: true, cultivo: true, codigo: true } },
        _count: { select: { insumos: true, mano_obra: true, maquinaria: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.actividades.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const actividad = await prisma.actividades.findFirst({
    where: { id: Number(id), activo: true },
    include: selectIncludes,
  });

  if (!actividad) {
    throw createError('Actividad no encontrada', 404);
  }

  return actividad;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.actividades.findUnique({ where: { codigo } });
    if (exists) throw createError(`El código ${codigo} ya está en uso`, 409);
  }

  await ensureRelationExists('cultivo', Number(data.cultivo_id));

  const insumos = (data.insumos as any[]) || [];
  const manoObra = (data.mano_obra as any[]) || [];
  const maquinaria = (data.maquinaria as any[]) || [];

  return prisma.actividades.create({
    data: {
      codigo,
      cultivo_id: Number(data.cultivo_id),
      fecha: new Date(data.fecha as string),
      tipo_actividad: data.tipo_actividad as any,
      descripcion: (data.descripcion as string) || null,
      responsable_tecnico: data.responsable_tecnico as string,
      hora_inicio: (data.hora_inicio as string) || null,
      hora_fin: (data.hora_fin as string) || null,
      duracion_estimada: (data.duracion_estimada as string) || null,
      prioridad: (data.prioridad as any) || 'MEDIA',
      estado: (data.estado as any) || 'PROGRAMADA',
      jornales: data.jornales ? Number(data.jornales) : 0,
      latitud: (data.latitud as string) || null,
      longitud: (data.longitud as string) || null,
      altitud: (data.altitud as string) || null,
      precision_gps: (data.precision_gps as string) || null,
      observaciones_tecnicas: (data.observaciones_tecnicas as string) || null,
      recomendaciones: (data.recomendaciones as string) || null,
      objetivo: (data.objetivo as string) || null,
      resultado: (data.resultado as string) || null,
      proxima_actividad: (data.proxima_actividad as string) || null,
      created_by: userId || null,
      insumos: insumos.length ? { create: insumos } : undefined,
      mano_obra: manoObra.length ? { create: manoObra } : undefined,
      maquinaria: maquinaria.length ? { create: maquinaria } : undefined,
    },
    include: selectIncludes,
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.actividades.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Actividad no encontrada', 404);

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'descripcion', 'responsable_tecnico', 'hora_inicio', 'hora_fin', 'duracion_estimada', 'latitud', 'longitud', 'altitud', 'precision_gps', 'observaciones_tecnicas', 'recomendaciones', 'objetivo', 'resultado', 'proxima_actividad'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.cultivo_id !== undefined) updateData.cultivo_id = data.cultivo_id ? Number(data.cultivo_id) : null;

  const enumFields = ['tipo_actividad', 'prioridad', 'estado'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.jornales !== undefined) updateData.jornales = data.jornales !== null ? Number(data.jornales) : 0;
  if (userId) updateData.updated_by = userId;

  // Handle nested arrays
  const hasInsumosUpdate = data.insumos !== undefined;
  const hasManoObraUpdate = data.mano_obra !== undefined;
  const hasMaquinariaUpdate = data.maquinaria !== undefined;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const updated = await tx.actividades.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // Replace insumos if provided
    if (hasInsumosUpdate) {
      await tx.insumo_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const insumos = (data.insumos as any[]) || [];
      if (insumos.length) {
        for (const i of insumos) {
          const insumo = await tx.insumo.create({
            data: {
              producto: i.nombre || i.producto,
              cantidad: i.cantidad ? Number(i.cantidad) : null,
              unidad: i.unidad || null,
              costo_unitario: i.costo ? Number(i.costo) : null,
            },
          });
          await tx.insumo_has_actividades.create({
            data: { insumo_id: insumo.id, actividades_id: Number(id) },
          });
        }
      }
    }

    // Replace mano_obra if provided
    if (hasManoObraUpdate) {
      await tx.mano_de_obra_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const manoObra = (data.mano_obra as any[]) || [];
      if (manoObra.length) {
        for (const m of manoObra) {
          const mo = await tx.mano_de_obra.create({
            data: {
              trabajador: m.nombre || m.trabajador,
              horas: m.horas ? Number(m.horas) : null,
              jornales: m.tarifa ? Number(m.tarifa) : null,
            },
          });
          await tx.mano_de_obra_has_actividades.create({
            data: { mano_de_obra_id: mo.id, actividades_id: Number(id) },
          });
        }
      }
    }

    // Replace maquinaria if provided
    if (hasMaquinariaUpdate) {
      await tx.maquinaria_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const maquinaria = (data.maquinaria as any[]) || [];
      if (maquinaria.length) {
        for (const m of maquinaria) {
          const mq = await tx.maquinaria.create({
            data: {
              equipo: m.nombre || m.equipo,
              horas_uso: m.horas ? Number(m.horas) : null,
              combustible: m.costo ? Number(m.costo) : null,
            },
          });
          await tx.maquinaria_has_actividades.create({
            data: { maquinaria_id: mq.id, actividades_id: Number(id) },
          });
        }
      }
    }

    return tx.actividades.findFirst({
      where: { id: Number(id) },
      include: selectIncludes,
    });
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.actividades.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Actividad no encontrada', 404);

  await prisma.actividades.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Actividad eliminada exitosamente' };
};
