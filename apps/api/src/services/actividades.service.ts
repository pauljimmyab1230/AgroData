import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import type { TipoActividad, PrioridadActividad, EstadoActividad } from '@agrodata/types';

// ─── Types ──────────────────────────────────────────────────
interface InsumoInput {
  id?: string;
  producto: string;
  categoria?: string | null;
  fabricante?: string | null;
  cantidad?: number | null;
  unidad?: string | null;
  lote?: string | null;
  costo_unitario?: number | null;
  observaciones?: string | null;
}

interface ManoObraInput {
  id?: string;
  trabajador: string;
  funcion?: string | null;
  jornales?: number | null;
  horas?: number | null;
  costo_jornal?: number | null;
  observaciones?: string | null;
}

interface MaquinariaInput {
  id?: string;
  equipo: string;
  operador?: string | null;
  horas_uso?: number | null;
  costo_hora?: number | null;
  combustible?: number | null;
  observaciones?: string | null;
}

// ─── Code Generation ────────────────────────────────────────
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

const selectIncludes = {
  cultivo: {
    select: {
      id: true,
      cultivo: true,
      codigo: true,
      parcela: { select: { id: true, nombre: true, codigo: true } },
    },
  },
  insumos: { select: { insumo: true } },
  mano_obra: { select: { mano_de_obra: true } },
  maquinaria: { select: { maquinaria: true } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenActividad(raw: any) {
  if (!raw) return null;
  return {
    ...raw,
    insumos: (raw.insumos ?? []).map((r: { insumo: unknown }) => r.insumo),
    mano_obra: (raw.mano_obra ?? []).map((r: { mano_de_obra: unknown }) => r.mano_de_obra),
    maquinaria: (raw.maquinaria ?? []).map((r: { maquinaria: unknown }) => r.maquinaria),
  };
}

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
        cultivo: {
          select: {
            id: true,
            cultivo: true,
            codigo: true,
            parcela: { select: { id: true, nombre: true, codigo: true } },
          },
        },
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
  const raw = await prisma.actividades.findFirst({
    where: { id: Number(id), activo: true },
    include: selectIncludes,
  });

  if (!raw) throw createError('Actividad no encontrada', 404);

  return flattenActividad(raw);
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.actividades.findUnique({ where: { codigo } });
    if (exists) throw createError(`El código ${codigo} ya está en uso`, 409);
  }

  const cultivoExists = await prisma.cultivo.findUnique({ where: { id: Number(data.cultivo_id) }, select: { id: true } });
  if (!cultivoExists) throw createError('Cultivo no encontrado', 404);

  const insumos = (data.insumos as InsumoInput[]) || [];
  const manoObra = (data.mano_obra as ManoObraInput[]) || [];
  const maquinaria = (data.maquinaria as MaquinariaInput[]) || [];

  const raw = await prisma.actividades.create({
    data: {
      codigo,
      cultivo_id: Number(data.cultivo_id),
      fecha: new Date(data.fecha as string),
      tipo_actividad: (data.tipo_actividad as TipoActividad) || 'OTRA',
      descripcion: (data.descripcion as string) || null,
      responsable_tecnico: data.responsable_tecnico as string,
      hora_inicio: (data.hora_inicio as string) || null,
      hora_fin: (data.hora_fin as string) || null,
      duracion_estimada: (data.duracion_estimada as string) || null,
      prioridad: (data.prioridad as PrioridadActividad) || 'MEDIA',
      estado: (data.estado as EstadoActividad) || 'PROGRAMADA',
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
      insumos: insumos.length
        ? { create: insumos.map((i) => ({ insumo: { create: buildInsumoData(i) } })) }
        : undefined,
      mano_obra: manoObra.length
        ? { create: manoObra.map((m) => ({ mano_de_obra: { create: buildManoObraData(m) } })) }
        : undefined,
      maquinaria: maquinaria.length
        ? { create: maquinaria.map((m) => ({ maquinaria: { create: buildMaquinariaData(m) } })) }
        : undefined,
    },
    include: selectIncludes,
  });

  return flattenActividad(raw);
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.actividades.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Actividad no encontrada', 404);

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'descripcion', 'responsable_tecnico', 'hora_inicio', 'hora_fin', 'duracion_estimada', 'latitud', 'longitud', 'altitud', 'precision_gps', 'observaciones_tecnicas', 'recomendaciones', 'objetivo', 'resultado', 'proxima_actividad'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.cultivo_id !== undefined) {
    const cultivoExists = await prisma.cultivo.findUnique({ where: { id: Number(data.cultivo_id) }, select: { id: true } });
    if (!cultivoExists) throw createError('Cultivo no encontrado', 404);
    updateData.cultivo_id = Number(data.cultivo_id);
  }

  const enumFields = ['tipo_actividad', 'prioridad', 'estado'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.jornales !== undefined) updateData.jornales = data.jornales !== null ? Number(data.jornales) : 0;
  if (userId) updateData.updated_by = userId;

  const hasInsumosUpdate = data.insumos !== undefined;
  const hasManoObraUpdate = data.mano_obra !== undefined;
  const hasMaquinariaUpdate = data.maquinaria !== undefined;

  const raw = await prisma.$transaction(async (tx: PrismaTransaction) => {
    const updated = await tx.actividades.update({
      where: { id: Number(id) },
      data: updateData,
    });

    if (hasInsumosUpdate) {
      await tx.insumo_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const insumos = (data.insumos as InsumoInput[]) || [];
      for (const i of insumos) {
        const insumoData = buildInsumoData(i);
        const insumo = i.id
          ? await tx.insumo.update({ where: { id: i.id }, data: insumoData })
          : await tx.insumo.create({ data: insumoData });
        await tx.insumo_has_actividades.create({
          data: { insumo_id: insumo.id, actividades_id: Number(id) },
        });
      }
    }

    if (hasManoObraUpdate) {
      await tx.mano_de_obra_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const manoObra = (data.mano_obra as ManoObraInput[]) || [];
      for (const m of manoObra) {
        const moData = buildManoObraData(m);
        const mo = m.id
          ? await tx.mano_de_obra.update({ where: { id: m.id }, data: moData })
          : await tx.mano_de_obra.create({ data: moData });
        await tx.mano_de_obra_has_actividades.create({
          data: { mano_de_obra_id: mo.id, actividades_id: Number(id) },
        });
      }
    }

    if (hasMaquinariaUpdate) {
      await tx.maquinaria_has_actividades.deleteMany({ where: { actividades_id: Number(id) } });
      const maquinaria = (data.maquinaria as MaquinariaInput[]) || [];
      for (const m of maquinaria) {
        const mqData = buildMaquinariaData(m);
        const mq = m.id
          ? await tx.maquinaria.update({ where: { id: m.id }, data: mqData })
          : await tx.maquinaria.create({ data: mqData });
        await tx.maquinaria_has_actividades.create({
          data: { maquinaria_id: mq.id, actividades_id: Number(id) },
        });
      }
    }

    return tx.actividades.findFirst({
      where: { id: Number(id) },
      include: selectIncludes,
    });
  });

  return flattenActividad(raw);
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

// ─── Stats ─────────────────────────────────────────────────

export const getStats = async () => {
  const [total, porEstado] = await Promise.all([
    prisma.actividades.count({ where: { activo: true } }),
    prisma.actividades.groupBy({
      by: ['estado'],
      where: { activo: true },
      _count: { id: true },
    }),
  ]);

  const estados: Record<string, number> = {
    PROGRAMADA: 0,
    EN_PROCESO: 0,
    COMPLETADA: 0,
  };
  for (const item of porEstado) {
    estados[item.estado] = item._count.id;
  }

  return {
    total,
    estados,
  };
};

// ─── Helpers ──────────────────────────────────────────────

function buildInsumoData(i: InsumoInput) {
  const cantidad = i.cantidad ? Number(i.cantidad) : null;
  const costo_unitario = i.costo_unitario ? Number(i.costo_unitario) : null;
  return {
    producto: i.producto,
    categoria: i.categoria || null,
    fabricante: i.fabricante || null,
    cantidad,
    unidad: i.unidad || null,
    lote: i.lote || null,
    costo_unitario,
    costo_total: cantidad !== null && costo_unitario !== null ? Number(cantidad) * Number(costo_unitario) : null,
    observaciones: i.observaciones || null,
  };
}

function buildManoObraData(m: ManoObraInput) {
  const jornales = m.jornales ? Number(m.jornales) : null;
  const costo_jornal = m.costo_jornal ? Number(m.costo_jornal) : null;
  return {
    trabajador: m.trabajador,
    funcion: m.funcion || null,
    jornales,
    horas: m.horas ? Number(m.horas) : null,
    costo_jornal,
    costo_total: jornales !== null && costo_jornal !== null ? jornales * costo_jornal : null,
    observaciones: m.observaciones || null,
  };
}

function buildMaquinariaData(m: MaquinariaInput) {
  const horas_uso = m.horas_uso ? Number(m.horas_uso) : null;
  const costo_hora = m.costo_hora ? Number(m.costo_hora) : null;
  const combustible = m.combustible ? Number(m.combustible) : null;
  return {
    equipo: m.equipo,
    operador: m.operador || null,
    horas_uso,
    costo_hora,
    costo_total: horas_uso !== null && costo_hora !== null ? horas_uso * costo_hora : null,
    combustible,
    observaciones: m.observaciones || null,
  };
}
