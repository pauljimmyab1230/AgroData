import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import type {
  EstadoInspeccion,
  ResultadoInspeccion,
  CumplimientoCriterio,
  RiesgoNivel,
  SeveridadNoConformidad,
  EstadoNoConformidad,
  EstadoAccionCorrectiva,
} from '@agrodata/types';

// ─── Code Generation ────────────────────────────────────────
const generateCodigo = async (): Promise<string> => {
  const last = await prisma.inspecciones.findFirst({
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'INS-001';

  const num = parseInt(last.codigo.replace('INS-', ''), 10) + 1;
  return `INS-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.inspecciones.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('INS-', ''), 10) + 1;
    current = `INS-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const CULTIVO_INCLUDE = {
  select: {
    id: true,
    cultivo: true,
    codigo: true,
    campania: { select: { id: true, nombre: true, codigo: true } },
    parcela: {
      select: {
        id: true,
        nombre: true,
        codigo: true,
        productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true } },
      },
    },
  },
} as const;

const NO_CONFORMIDAD_INCLUDE = {
  acciones: true,
} as const;

const selectIncludes = {
  cultivo: CULTIVO_INCLUDE,
  checklist: true,
  no_conformidades: { include: NO_CONFORMIDAD_INCLUDE },
  evidencias: true,
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  cultivo_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.cultivo_id) where.cultivo_id = Number(filters.cultivo_id);

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { inspector: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.inspecciones.findMany({
      where,
      include: {
        cultivo: CULTIVO_INCLUDE,
        _count: { select: { checklist: true, no_conformidades: true, evidencias: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inspecciones.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const inspeccion = await prisma.inspecciones.findFirst({
    where: { id: Number(id), activo: true },
    include: selectIncludes,
  });

  if (!inspeccion) {
    throw createError('Inspección no encontrada', 404);
  }

  return inspeccion;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    codigo = await ensureUniqueCodigo(codigo);
  }

  const cultivoId = Number(data.cultivo_id);
  const cultivo = await prisma.cultivo.findUnique({ where: { id: cultivoId }, select: { id: true } });
  if (!cultivo) throw createError('Cultivo no encontrado', 404);

  const checklist = (data.checklist as Record<string, unknown>[]) || [];
  const noConformidades = (data.no_conformidades as Record<string, unknown>[]) || [];
  const evidencias = (data.evidencias as Record<string, unknown>[]) || [];

  return prisma.inspecciones.create({
    data: {
      codigo,
      cultivo_id: cultivoId,
      fecha: new Date(data.fecha as string),
      inspector: data.inspector as string,
      estado: (data.estado as EstadoInspeccion) || 'PENDIENTE',
      resultado: (data.resultado as ResultadoInspeccion) || null,
      latitud: (data.latitud as string) || null,
      longitud: (data.longitud as string) || null,
      altitud: (data.altitud as string) || null,
      precision_gps: (data.precision_gps as string) || null,
      observaciones: (data.observaciones as string) || null,
      comentarios_productor: (data.comentarios_productor as string) || null,
      recomendaciones: (data.recomendaciones as string) || null,
      prioridad_recomendacion: (data.prioridad_recomendacion as string) || null,
      responsable_recomendacion: (data.responsable_recomendacion as string) || null,
      fecha_recomendacion: data.fecha_recomendacion ? new Date(data.fecha_recomendacion as string) : null,
      riesgo_general: (data.riesgo_general as RiesgoNivel) || 'BAJO',
      resumen_ejecutivo: (data.resumen_ejecutivo as string) || null,
      fecha_proxima_inspeccion: data.fecha_proxima_inspeccion ? new Date(data.fecha_proxima_inspeccion as string) : null,
      nivel_cumplimiento: (data.nivel_cumplimiento as string) || null,
      created_by: userId || null,
      checklist: checklist.length
        ? {
            create: checklist.map((c) => ({
              criterio: c.criterio as string,
              cumplimiento: (c.cumplimiento as CumplimientoCriterio) || null,
              riesgo: (c.riesgo as RiesgoNivel) || 'BAJO',
              observacion: (c.observacion as string) || null,
              evidencia: (c.evidencia as string) || null,
            })),
          }
        : undefined,
      no_conformidades: noConformidades.length
        ? {
            create: noConformidades.map((nc) => ({
              codigo: nc.codigo ? String(nc.codigo) : '',
              tipo: nc.tipo as string,
              categoria: nc.categoria as string,
              descripcion: nc.descripcion as string,
              severidad: (nc.severidad as SeveridadNoConformidad) || 'LEVE',
              responsable: nc.responsable as string,
              fecha_compromiso: nc.fecha_compromiso ? new Date(nc.fecha_compromiso as string) : null,
              estado: (nc.estado as EstadoNoConformidad) || 'PENDIENTE',
              accion_correctiva: (nc.accion_correctiva as string) || null,
              acciones: {
                create: ((nc.acciones as Record<string, unknown>[]) || []).map((ac) => ({
                  accion: ac.accion as string,
                  responsable: ac.responsable as string,
                  fecha_inicio: ac.fecha_inicio ? new Date(ac.fecha_inicio as string) : null,
                  fecha_limite: ac.fecha_limite ? new Date(ac.fecha_limite as string) : null,
                  estado: (ac.estado as EstadoAccionCorrectiva) || 'PENDIENTE',
                  observaciones: (ac.observaciones as string) || null,
                })),
              },
            })),
          }
        : undefined,
      evidencias: evidencias.length
        ? {
            create: evidencias.map((e) => ({
              nombre: e.nombre as string,
              descripcion: (e.descripcion as string) || null,
              tipo: (e.tipo as string) || null,
              ruta_archivo: (e.ruta_archivo as string) || null,
              fecha: e.fecha ? new Date(e.fecha as string) : null,
              responsable: (e.responsable as string) || null,
            })),
          }
        : undefined,
    },
    include: selectIncludes,
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.inspecciones.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Inspección no encontrada', 404);

  const updateData: Record<string, unknown> = {};

  const stringFields = [
    'codigo', 'inspector', 'latitud', 'longitud', 'altitud', 'precision_gps',
    'observaciones', 'comentarios_productor', 'recomendaciones', 'prioridad_recomendacion',
    'responsable_recomendacion', 'resumen_ejecutivo', 'nivel_cumplimiento',
  ];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.cultivo_id !== undefined) updateData.cultivo_id = Number(data.cultivo_id);

  const enumFields = ['estado', 'resultado', 'riesgo_general'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.fecha_recomendacion !== undefined) {
    updateData.fecha_recomendacion = data.fecha_recomendacion ? new Date(data.fecha_recomendacion as string) : null;
  }
  if (data.fecha_proxima_inspeccion !== undefined) {
    updateData.fecha_proxima_inspeccion = data.fecha_proxima_inspeccion ? new Date(data.fecha_proxima_inspeccion as string) : null;
  }
  if (userId) updateData.updated_by = userId;

  const hasChecklistUpdate = data.checklist !== undefined;
  const hasNoConformidadesUpdate = data.no_conformidades !== undefined;
  const hasEvidenciasUpdate = data.evidencias !== undefined;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const updated = await tx.inspecciones.update({
      where: { id: Number(id) },
      data: updateData,
    });

    if (hasChecklistUpdate) {
      await tx.inspeccion_checklist.deleteMany({ where: { inspeccion_id: Number(id) } });
      const checklist = (data.checklist as Record<string, unknown>[]) || [];
      if (checklist.length) {
        await tx.inspeccion_checklist.createMany({
          data: checklist.map((c) => ({
            inspeccion_id: Number(id),
            criterio: c.criterio as string,
            cumplimiento: (c.cumplimiento as CumplimientoCriterio) || null,
            riesgo: (c.riesgo as RiesgoNivel) || 'BAJO',
            observacion: (c.observacion as string) || null,
            evidencia: (c.evidencia as string) || null,
          })),
        });
      }
    }

    if (hasNoConformidadesUpdate) {
      const existingNC = await tx.no_conformidades.findMany({
        where: { inspeccion_id: Number(id) },
        select: { id: true },
      });
      if (existingNC.length) {
        const ncIds = existingNC.map((nc) => nc.id);
        await tx.acciones_correctivas.deleteMany({ where: { no_conformidad_id: { in: ncIds } } });
        await tx.no_conformidades.deleteMany({ where: { inspeccion_id: Number(id) } });
      }

      const noConformidades = (data.no_conformidades as Record<string, unknown>[]) || [];
      for (const nc of noConformidades) {
        const createdNC = await tx.no_conformidades.create({
          data: {
            inspeccion_id: Number(id),
            codigo: nc.codigo ? String(nc.codigo) : '',
            tipo: nc.tipo as string,
            categoria: nc.categoria as string,
            descripcion: nc.descripcion as string,
            severidad: (nc.severidad as SeveridadNoConformidad) || 'LEVE',
            responsable: nc.responsable as string,
            fecha_compromiso: nc.fecha_compromiso ? new Date(nc.fecha_compromiso as string) : null,
            estado: (nc.estado as EstadoNoConformidad) || 'PENDIENTE',
            accion_correctiva: (nc.accion_correctiva as string) || null,
          },
        });

        const acciones = (nc.acciones as Record<string, unknown>[]) || [];
        if (acciones.length) {
          await tx.acciones_correctivas.createMany({
            data: acciones.map((ac) => ({
              no_conformidad_id: createdNC.id,
              accion: ac.accion as string,
              responsable: ac.responsable as string,
              fecha_inicio: ac.fecha_inicio ? new Date(ac.fecha_inicio as string) : null,
              fecha_limite: ac.fecha_limite ? new Date(ac.fecha_limite as string) : null,
              estado: (ac.estado as EstadoAccionCorrectiva) || 'PENDIENTE',
              observaciones: (ac.observaciones as string) || null,
            })),
          });
        }
      }
    }

    if (hasEvidenciasUpdate) {
      await tx.evidencia.deleteMany({ where: { inspeccion_id: Number(id) } });
      const evidencias = (data.evidencias as Record<string, unknown>[]) || [];
      if (evidencias.length) {
        await tx.evidencia.createMany({
          data: evidencias.map((e) => ({
            inspeccion_id: Number(id),
            nombre: e.nombre as string,
            descripcion: (e.descripcion as string) || null,
            tipo: (e.tipo as string) || null,
            ruta_archivo: (e.ruta_archivo as string) || null,
            fecha: e.fecha ? new Date(e.fecha as string) : null,
            responsable: (e.responsable as string) || null,
          })),
        });
      }
    }

    return tx.inspecciones.findFirst({
      where: { id: Number(id) },
      include: selectIncludes,
    });
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.inspecciones.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Inspección no encontrada', 404);

  await prisma.inspecciones.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Inspección eliminada exitosamente' };
};

// ─── Stats ─────────────────────────────────────────────────

export const getGlobalStats = async (filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: string;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters?.estado) where.estado = filters.estado;
  if (filters?.cultivo_id) where.cultivo_id = Number(filters.cultivo_id);
  if (filters?.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { inspector: { contains: filters.search } },
    ];
  }

  const [total, porEstado] = await Promise.all([
    prisma.inspecciones.count({ where }),
    prisma.inspecciones.groupBy({
      by: ['estado'],
      where,
      _count: { id: true },
    }),
  ]);

  const estados: Record<string, number> = {
    PENDIENTE: 0,
    APROBADA: 0,
    NO_CONFORME: 0,
  };
  for (const item of porEstado) {
    estados[item.estado] = item._count.id;
  }

  return {
    total,
    pendientes: estados.PENDIENTE,
    aprobadas: estados.APROBADA,
    noConformes: estados.NO_CONFORME,
  };
};
