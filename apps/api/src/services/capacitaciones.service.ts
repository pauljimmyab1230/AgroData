import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.sic_capacitaciones.findFirst({
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'CAP-001';

  const num = parseInt(last.codigo.replace('CAP-', ''), 10) + 1;
  return `CAP-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.sic_capacitaciones.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('CAP-', ''), 10) + 1;
    current = `CAP-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

// ─── Capacitaciones ──────────────────────────────────────────

export const getAll = async (
  search?: string,
  tipo?: string,
  fechaInicio?: string,
  fechaFin?: string,
  page = 1,
  limit = 20,
) => {
  const where: Record<string, unknown> = { activo: true };

  if (tipo) {
    where.tipo = tipo;
  }

  if (fechaInicio || fechaFin) {
    where.fecha = {};
    if (fechaInicio) (where.fecha as Record<string, unknown>).gte = new Date(fechaInicio);
    if (fechaFin) (where.fecha as Record<string, unknown>).lte = new Date(fechaFin);
  }

  if (search) {
    where.OR = [
      { codigo: { contains: search } },
      { tema: { contains: search } },
      { capacitador: { contains: search } },
      { lugar: { contains: search } },
    ];
  }

  const [capacitaciones, total] = await Promise.all([
    prisma.sic_capacitaciones.findMany({
      where,
      include: {
        _count: { select: { participantes: true } },
        participantes: {
          include: {
            productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, dni: true } },
            usuario: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sic_capacitaciones.count({ where }),
  ]);

  return { data: capacitaciones, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const capacitacion = await prisma.sic_capacitaciones.findFirst({
    where: { id, activo: true },
    include: {
      participantes: {
        include: {
          productor: { select: { id: true, codigo: true, nombres: true, apellido_paterno: true, apellido_materno: true, dni: true, comunidad: true } },
          usuario: { select: { id: true, nombre: true, email: true, rol_sic: true } },
        },
        orderBy: { created_at: 'asc' },
      },
    },
  });

  if (!capacitacion) {
    throw createError('Capacitación no encontrada', 404);
  }

  return capacitacion;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  const codigo = await ensureUniqueCodigo(await generateCodigo());

  const participantes = (data.participantes as Array<Record<string, unknown>>) || [];

  const capacitacion = await prisma.sic_capacitaciones.create({
    data: {
      codigo,
      tipo: data.tipo as 'PRODUCTORES' | 'PERSONAL_SIC',
      tema: data.tema as string,
      descripcion: (data.descripcion as string) || null,
      capacitador: data.capacitador as string,
      fecha: new Date(data.fecha as string),
      hora_inicio: (data.hora_inicio as string) || null,
      hora_fin: (data.hora_fin as string) || null,
      duracion_horas: (data.duracion_horas as number) || null,
      lugar: data.lugar as string,
      departamento: (data.departamento as string) || null,
      provincia: (data.provincia as string) || null,
      distrito: (data.distrito as string) || null,
      material_entregado: (data.material_entregado as string) || null,
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      participantes: participantes.length > 0 ? {
        create: participantes.map((p) => ({
          productor_id: (p.productor_id as string) || null,
          usuario_id: (p.usuario_id as string) || null,
          asistio: (p.asistio as boolean) ?? false,
          firma_url: (p.firma_url as string) || null,
          observaciones: (p.observaciones as string) || null,
        })),
      } : undefined,
    },
    include: {
      participantes: true,
    },
  });

  return capacitacion;
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.sic_capacitaciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Capacitación no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.tipo !== undefined) updateData.tipo = data.tipo;
  if (data.tema !== undefined) updateData.tema = data.tema;
  if (data.descripcion !== undefined) updateData.descripcion = (data.descripcion as string) || null;
  if (data.capacitador !== undefined) updateData.capacitador = data.capacitador;
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.hora_inicio !== undefined) updateData.hora_inicio = (data.hora_inicio as string) || null;
  if (data.hora_fin !== undefined) updateData.hora_fin = (data.hora_fin as string) || null;
  if (data.duracion_horas !== undefined) updateData.duracion_horas = (data.duracion_horas as number) || null;
  if (data.lugar !== undefined) updateData.lugar = data.lugar;
  if (data.departamento !== undefined) updateData.departamento = (data.departamento as string) || null;
  if (data.provincia !== undefined) updateData.provincia = (data.provincia as string) || null;
  if (data.distrito !== undefined) updateData.distrito = (data.distrito as string) || null;
  if (data.material_entregado !== undefined) updateData.material_entregado = (data.material_entregado as string) || null;
  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;

  if (userId) updateData.updated_by = userId;

  const updated = await prisma.sic_capacitaciones.update({
    where: { id },
    data: updateData,
    include: { participantes: true },
  });

  return updated;
};

export const remove = async (id: string) => {
  const existing = await prisma.sic_capacitaciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Capacitación no encontrada', 404);
  }

  await prisma.sic_capacitaciones.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Capacitación eliminada exitosamente' };
};

// ─── Participantes ───────────────────────────────────────────

export const addParticipante = async (capacitacionId: string, data: Record<string, unknown>) => {
  const capacitacion = await prisma.sic_capacitaciones.findFirst({ where: { id: capacitacionId, activo: true } });

  if (!capacitacion) {
    throw createError('Capacitación no encontrada', 404);
  }

  if (data.productor_id) {
    const productor = await prisma.productores.findFirst({ where: { id: data.productor_id as string, activo: true } });
    if (!productor) throw createError('Productor no encontrado', 404);
  }

  if (data.usuario_id) {
    const usuario = await prisma.usuarios.findFirst({ where: { id: data.usuario_id as string, activo: true } });
    if (!usuario) throw createError('Usuario no encontrado', 404);
  }

  const participante = await prisma.sic_capacitacion_participantes.create({
    data: {
      capacitacion_id: capacitacionId,
      productor_id: (data.productor_id as string) || null,
      usuario_id: (data.usuario_id as string) || null,
      asistio: (data.asistio as boolean) ?? false,
      firma_url: (data.firma_url as string) || null,
      observaciones: (data.observaciones as string) || null,
    },
    include: {
      productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, dni: true } },
      usuario: { select: { id: true, nombre: true, email: true } },
    },
  });

  return participante;
};

export const updateParticipante = async (capacitacionId: string, participanteId: string, data: Record<string, unknown>) => {
  const existing = await prisma.sic_capacitacion_participantes.findFirst({
    where: { id: participanteId, capacitacion_id: capacitacionId },
  });

  if (!existing) {
    throw createError('Participante no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};
  if (data.asistio !== undefined) updateData.asistio = data.asistio;
  if (data.firma_url !== undefined) updateData.firma_url = (data.firma_url as string) || null;
  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;

  return prisma.sic_capacitacion_participantes.update({
    where: { id: participanteId },
    data: updateData,
    include: {
      productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, dni: true } },
      usuario: { select: { id: true, nombre: true, email: true } },
    },
  });
};

export const removeParticipante = async (capacitacionId: string, participanteId: string) => {
  const existing = await prisma.sic_capacitacion_participantes.findFirst({
    where: { id: participanteId, capacitacion_id: capacitacionId },
  });

  if (!existing) {
    throw createError('Participante no encontrado', 404);
  }

  await prisma.sic_capacitacion_participantes.delete({ where: { id: participanteId } });

  return { message: 'Participante eliminado exitosamente' };
};

export const removeParticipantesBulk = async (capacitacionId: string, participanteIds: string[]) => {
  const capacitacion = await prisma.sic_capacitaciones.findFirst({ where: { id: capacitacionId, activo: true } });

  if (!capacitacion) {
    throw createError('Capacitación no encontrada', 404);
  }

  await prisma.sic_capacitacion_participantes.deleteMany({
    where: {
      id: { in: participanteIds },
      capacitacion_id: capacitacionId,
    },
  });

  return { message: 'Participantes eliminados exitosamente' };
};
