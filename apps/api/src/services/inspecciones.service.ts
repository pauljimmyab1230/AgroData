import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

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

const ensureRelationExists = async (model: string, id: string | number) => {
  const numId = Number(id);
  const lookupId = !isNaN(numId) && String(numId) === String(id) ? numId : id;
  const exists = await (prisma as any)[model].findUnique({ where: { id: lookupId }, select: { id: true } });
  if (!exists) throw createError(`${model} no encontrado`, 404);
};

const selectIncludes = {
  cultivo: { select: { id: true, cultivo: true, codigo: true } },
  checklist: true,
  no_conformidades: true,
  acciones_correctivas: true,
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
        cultivo: { select: { id: true, cultivo: true, codigo: true } },
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
    const exists = await prisma.inspecciones.findUnique({ where: { codigo } });
    if (exists) throw createError(`El código ${codigo} ya está en uso`, 409);
  }

  if (data.cultivo_id) await ensureRelationExists('cultivo', data.cultivo_id as string);

  const checklist = (data.checklist as any[]) || [];
  const noConformidades = (data.no_conformidades as any[]) || [];
  const evidencias = (data.evidencias as any[]) || [];

  return prisma.inspecciones.create({
    data: {
      codigo,
      cultivo_id: data.cultivo_id ? Number(data.cultivo_id) : 0,
      fecha: new Date(data.fecha as string),
      inspector: data.inspector as string,
      estado: (data.estado as 'PENDIENTE' | 'APROBADA' | 'NO_CONFORME') || 'PENDIENTE',
      resultado: (data.resultado as 'CONFORME' | 'CONFORME_CON_OBSERVACIONES' | 'NO_CONFORME') || null,
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
      riesgo_general: (data.riesgo_general as 'BAJO' | 'MEDIO' | 'ALTO') || 'BAJO',
      resumen_ejecutivo: (data.resumen_ejecutivo as string) || null,
      fecha_proxima_inspeccion: data.fecha_proxima_inspeccion ? new Date(data.fecha_proxima_inspeccion as string) : null,
      nivel_cumplimiento: (data.nivel_cumplimiento as string) || null,
      created_by: userId || null,
      checklist: checklist.length ? { create: checklist.map((c) => ({
        criterio: c.criterio,
        cumplimiento: c.cumplimiento || null,
        riesgo: c.riesgo || 'BAJO',
        observacion: c.observacion || null,
        evidencia: c.evidencia || null,
      }))} : undefined,
      no_conformidades: noConformidades.length ? { create: noConformidades.map((nc) => ({
        codigo: nc.codigo || null,
        tipo: nc.tipo,
        categoria: nc.categoria,
        descripcion: nc.descripcion,
        severidad: nc.severidad || 'LEVE',
        responsable: nc.responsable,
        fecha_compromiso: nc.fecha_compromiso ? new Date(nc.fecha_compromiso) : null,
        estado: nc.estado || 'PENDIENTE',
        accion_correctiva: nc.accion_correctiva || null,
      }))} : undefined,
      evidencias: evidencias.length ? { create: evidencias.map((e) => ({
        nombre: e.nombre,
        descripcion: e.descripcion || null,
        tipo: e.tipo || null,
        ruta_archivo: e.ruta_archivo || null,
        fecha: e.fecha ? new Date(e.fecha) : null,
        responsable: e.responsable || null,
      }))} : undefined,
    },
    include: selectIncludes,
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.inspecciones.findFirst({ where: { id: Number(id), activo: true } });
  if (!existing) throw createError('Inspección no encontrada', 404);

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'inspector', 'latitud', 'longitud', 'altitud', 'precision_gps', 'observaciones', 'comentarios_productor', 'recomendaciones', 'prioridad_recomendacion', 'responsable_recomendacion', 'resumen_ejecutivo', 'nivel_cumplimiento'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.inspector_id !== undefined) updateData.inspector_id = (data.inspector_id as string) || null;

  if (data.cultivo_id !== undefined) updateData.cultivo_id = data.cultivo_id ? Number(data.cultivo_id) : null;

  const enumFields = ['estado', 'resultado', 'riesgo_general'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.fecha_recomendacion !== undefined) updateData.fecha_recomendacion = data.fecha_recomendacion ? new Date(data.fecha_recomendacion as string) : null;
  if (data.fecha_proxima_inspeccion !== undefined) updateData.fecha_proxima_inspeccion = data.fecha_proxima_inspeccion ? new Date(data.fecha_proxima_inspeccion as string) : null;
  if (userId) updateData.updated_by = userId;

  // Handle nested arrays
  const hasChecklistUpdate = data.checklist !== undefined;
  const hasNoConformidadesUpdate = data.no_conformidades !== undefined;
  const hasAccionesCorrectivasUpdate = data.acciones_correctivas !== undefined;
  const hasEvidenciasUpdate = data.evidencias !== undefined;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const updated = await tx.inspecciones.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // Replace checklist if provided
    if (hasChecklistUpdate) {
      await tx.inspeccion_checklist.deleteMany({ where: { inspeccion_id: Number(id) } });
      const checklist = (data.checklist as any[]) || [];
      if (checklist.length) {
        await tx.inspeccion_checklist.createMany({
          data: checklist.map((c) => ({
            inspeccion_id: Number(id),
            criterio: c.criterio,
            cumplimiento: c.cumplimiento || null,
            riesgo: c.riesgo || 'BAJO',
            observacion: c.observacion || null,
            evidencia: c.evidencia || null,
          })),
        });
      }
    }

    // Replace no_conformidades if provided
    if (hasNoConformidadesUpdate) {
      await tx.no_conformidades.deleteMany({ where: { inspeccion_id: Number(id) } });
      const noConformidades = (data.no_conformidades as any[]) || [];
      if (noConformidades.length) {
        await tx.no_conformidades.createMany({
          data: noConformidades.map((nc) => ({
            inspeccion_id: Number(id),
            codigo: nc.codigo || null,
            tipo: nc.tipo,
            categoria: nc.categoria,
            descripcion: nc.descripcion,
            severidad: nc.severidad || 'LEVE',
            responsable: nc.responsable,
            fecha_compromiso: nc.fecha_compromiso ? new Date(nc.fecha_compromiso) : null,
            estado: nc.estado || 'PENDIENTE',
            accion_correctiva: nc.accion_correctiva || null,
          })),
        });
      }
    }

    // Replace acciones_correctivas if provided
    if (hasAccionesCorrectivasUpdate) {
      await tx.acciones_correctivas.deleteMany({ where: { no_conformidad: { inspeccion_id: Number(id) } } });
      const accionesCorrectivas = (data.acciones_correctivas as any[]) || [];
      if (accionesCorrectivas.length) {
        for (const ac of accionesCorrectivas) {
          await tx.acciones_correctivas.create({
            data: {
              accion: ac.accion,
              responsable: ac.responsable,
              fecha_inicio: ac.fecha_inicio ? new Date(ac.fecha_inicio) : null,
              fecha_limite: ac.fecha_limite ? new Date(ac.fecha_limite) : null,
              estado: ac.estado || 'PENDIENTE',
              observaciones: ac.observaciones || null,
              no_conformidad: { connect: { id: Number(id) } },
            },
          });
        }
      }
    }

    // Replace evidencias if provided
    if (hasEvidenciasUpdate) {
      await tx.evidencia.deleteMany({ where: { inspeccion_id: Number(id) } });
      const evidencias = (data.evidencias as any[]) || [];
      if (evidencias.length) {
        await tx.evidencia.createMany({
          data: evidencias.map((e) => ({
            inspeccion_id: Number(id),
            nombre: e.nombre,
            descripcion: e.descripcion || null,
            tipo: e.tipo || null,
            ruta_archivo: e.ruta_archivo || null,
            fecha: e.fecha ? new Date(e.fecha) : null,
            responsable: e.responsable || null,
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
