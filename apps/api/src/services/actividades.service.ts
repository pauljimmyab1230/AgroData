import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.actividades.findFirst({
    orderBy: { created_at: 'desc' },
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

const ensureRelationExists = async (model: string, id: string) => {
  const exists = await (prisma as any)[model].findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw createError(`${model} no encontrado`, 404);
};

const selectIncludes = {
  campania: { select: { id: true, nombre: true, codigo: true } },
  productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
  parcela: { select: { id: true, nombre: true, codigo: true } },
  cultivo: { select: { id: true, cultivo: true, codigo: true } },
  insumos: true,
  mano_obra: true,
  maquinaria: true,
  fotos: true,
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  campania_id?: string;
  productor_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.tipo_actividad) where.tipo_actividad = filters.tipo_actividad;
  if (filters.campania_id) where.campania_id = filters.campania_id;
  if (filters.productor_id) where.productor_id = filters.productor_id;
  if (filters.parcela_id) where.parcela_id = filters.parcela_id;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { descripcion: { contains: filters.search } },
      { responsable_tecnico: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.actividades.findMany({
      where,
      include: {
        campania: { select: { id: true, nombre: true, codigo: true } },
        productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
        parcela: { select: { id: true, nombre: true, codigo: true } },
        cultivo: { select: { id: true, cultivo: true, codigo: true } },
        _count: { select: { insumos: true, mano_obra: true, maquinaria: true, fotos: true } },
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
    where: { id, activo: true },
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
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.actividades.findUnique({ where: { codigo } });
    if (exists) throw createError(`El código ${codigo} ya está en uso`, 409);
  }

  await ensureRelationExists('campanias', data.campania_id as string);
  await ensureRelationExists('productores', data.productor_id as string);
  await ensureRelationExists('parcelas_productor', data.parcela_id as string);
  if (data.cultivo_id) await ensureRelationExists('cultivos', data.cultivo_id as string);

  const insumos = (data.insumos as any[]) || [];
  const manoObra = (data.mano_obra as any[]) || [];
  const maquinaria = (data.maquinaria as any[]) || [];

  return prisma.actividades.create({
    data: {
      codigo,
      campania_id: data.campania_id as string,
      productor_id: data.productor_id as string,
      parcela_id: data.parcela_id as string,
      cultivo_id: (data.cultivo_id as string) || null,
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
  const existing = await prisma.actividades.findFirst({ where: { id, activo: true } });
  if (!existing) throw createError('Actividad no encontrada', 404);

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'descripcion', 'responsable_tecnico', 'hora_inicio', 'hora_fin', 'duracion_estimada', 'latitud', 'longitud', 'altitud', 'precision_gps', 'observaciones_tecnicas', 'recomendaciones', 'objetivo', 'resultado', 'proxima_actividad'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  const uuidFields = ['campania_id', 'productor_id', 'parcela_id', 'cultivo_id'];
  for (const field of uuidFields) {
    if (data[field] !== undefined) updateData[field] = data[field] || null;
  }

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

  return prisma.$transaction(async (tx) => {
    const updated = await tx.actividades.update({
      where: { id },
      data: updateData,
    });

    // Replace insumos if provided
    if (hasInsumosUpdate) {
      await tx.actividad_insumos.deleteMany({ where: { actividad_id: id } });
      const insumos = (data.insumos as any[]) || [];
      if (insumos.length) {
        await tx.actividad_insumos.createMany({
          data: insumos.map((i) => ({
            actividad_id: id,
            producto: i.producto,
            categoria: i.categoria || null,
            fabricante: i.fabricante || null,
            cantidad: i.cantidad ? Number(i.cantidad) : null,
            unidad: i.unidad || null,
            lote: i.lote || null,
            costo_unitario: i.costo_unitario ? Number(i.costo_unitario) : null,
            costo_total: i.costo_total ? Number(i.costo_total) : null,
            observaciones: i.observaciones || null,
          })),
        });
      }
    }

    // Replace mano_obra if provided
    if (hasManoObraUpdate) {
      await tx.actividad_manobra.deleteMany({ where: { actividad_id: id } });
      const manoObra = (data.mano_obra as any[]) || [];
      if (manoObra.length) {
        await tx.actividad_manobra.createMany({
          data: manoObra.map((m) => ({
            actividad_id: id,
            trabajador: m.trabajador,
            funcion: m.funcion || null,
            jornales: m.jornales ? Number(m.jornales) : null,
            horas: m.horas ? Number(m.horas) : null,
            observaciones: m.observaciones || null,
          })),
        });
      }
    }

    // Replace maquinaria if provided
    if (hasMaquinariaUpdate) {
      await tx.actividad_maquinaria.deleteMany({ where: { actividad_id: id } });
      const maquinaria = (data.maquinaria as any[]) || [];
      if (maquinaria.length) {
        await tx.actividad_maquinaria.createMany({
          data: maquinaria.map((m) => ({
            actividad_id: id,
            equipo: m.equipo,
            operador: m.operador || null,
            horas_uso: m.horas_uso ? Number(m.horas_uso) : null,
            combustible: m.combustible ? Number(m.combustible) : null,
            observaciones: m.observaciones || null,
          })),
        });
      }
    }

    return tx.actividades.findFirst({
      where: { id },
      include: selectIncludes,
    });
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.actividades.findFirst({ where: { id, activo: true } });
  if (!existing) throw createError('Actividad no encontrada', 404);

  await prisma.actividades.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Actividad eliminada exitosamente' };
};
