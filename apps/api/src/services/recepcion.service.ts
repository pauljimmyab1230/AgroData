import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.recepcion.findFirst({
    where: { codigo: { startsWith: `RCP-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `RCP-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `RCP-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.recepcion.findUnique({ where: { codigo: current }, select: { id: true } });
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
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { lote_productor: { contains: filters.search } },
      { responsable: { contains: filters.search } },
      { planta: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.recepcion.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        acopio: { select: { id: true, codigo: true } },
        sacos_detalle: {
          orderBy: { id: 'asc' },
          select: { id: true, codigo: true, peso: true, observaciones: true },
        },
      },
    }),
    prisma.recepcion.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const recepcion = await prisma.recepcion.findFirst({
    where: { id: Number(id), activo: true },
    include: {
      acopio: { select: { id: true, codigo: true } },
      sacos_detalle: {
        orderBy: { id: 'asc' },
        select: { id: true, codigo: true, peso: true, observaciones: true },
      },
    },
  });

  if (!recepcion) {
    throw createError('Recepción no encontrada', 404);
  }

  return recepcion;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.recepcion.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const sacosData = (data.sacos_detalle as Array<{ codigo: string; peso: number; observaciones?: string }>) || [];

  return prisma.recepcion.create({
    data: {
      codigo,
      acopio_id: data.acopio_id ? Number(data.acopio_id) : null,
      lote_productor: (data.lote_productor as string) || null,
      fecha: new Date(data.fecha as string),
      responsable: data.responsable as string,
      planta: data.planta as string,
      sacos: (data.sacos as number) || sacosData.length,
      peso_campo: data.peso_campo != null ? Number(data.peso_campo) : null,
      peso_bruto: data.peso_bruto != null ? Number(data.peso_bruto) : null,
      tara: data.tara != null ? Number(data.tara) : null,
      peso_neto: data.peso_neto != null ? Number(data.peso_neto) : null,
      diferencia: data.diferencia != null ? Number(data.diferencia) : null,
      merma: data.merma != null ? Number(data.merma) : null,
      humedad: data.humedad != null ? Number(data.humedad) : null,
      impurezas: data.impurezas != null ? Number(data.impurezas) : null,
      materia_extrana: data.materia_extrana != null ? Number(data.materia_extrana) : null,
      color: (data.color as string) || null,
      olor: (data.olor as string) || null,
      presencia_insectos: (data.presencia_insectos as string) || null,
      estado_producto: (data.estado_producto as string) || null,
      categoria: (data.categoria as string) || null,
      destino: (data.destino as string) || null,
      resultado: (data.resultado as string) || null,
      motivo: (data.motivo as string) || null,
      observaciones: (data.observaciones as string) || null,
      documento_firmado: (data.documento_firmado as boolean) ?? false,
      firma_responsable_url: (data.firma_responsable_url as string) || null,
      estado: (data.estado as 'PENDIENTE_PESAJE' | 'EN_CONTROL_CALIDAD' | 'DISPONIBLE' | 'RECHAZADA') || 'PENDIENTE_PESAJE',
      created_by: userId || null,
      sacos_detalle: sacosData.length > 0 ? {
        create: sacosData.map(s => ({
          codigo: s.codigo,
          peso: Number(s.peso),
          observaciones: s.observaciones || null,
        })),
      } : undefined,
    },
    include: {
      sacos_detalle: { orderBy: { id: 'asc' } },
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.recepcion.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.acopio_id !== undefined) updateData.acopio_id = data.acopio_id ? Number(data.acopio_id) : null;
  if (data.lote_productor !== undefined) updateData.lote_productor = (data.lote_productor as string) || null;
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.responsable !== undefined) updateData.responsable = data.responsable;
  if (data.planta !== undefined) updateData.planta = data.planta;
  if (data.sacos !== undefined) updateData.sacos = data.sacos;
  if (data.peso_campo !== undefined) updateData.peso_campo = data.peso_campo != null ? Number(data.peso_campo) : null;
  if (data.peso_bruto !== undefined) updateData.peso_bruto = data.peso_bruto != null ? Number(data.peso_bruto) : null;
  if (data.tara !== undefined) updateData.tara = data.tara != null ? Number(data.tara) : null;
  if (data.peso_neto !== undefined) updateData.peso_neto = data.peso_neto != null ? Number(data.peso_neto) : null;
  if (data.diferencia !== undefined) updateData.diferencia = data.diferencia != null ? Number(data.diferencia) : null;
  if (data.merma !== undefined) updateData.merma = data.merma != null ? Number(data.merma) : null;
  if (data.humedad !== undefined) updateData.humedad = data.humedad != null ? Number(data.humedad) : null;
  if (data.impurezas !== undefined) updateData.impurezas = data.impurezas != null ? Number(data.impurezas) : null;
  if (data.materia_extrana !== undefined) updateData.materia_extrana = data.materia_extrana != null ? Number(data.materia_extrana) : null;
  if (data.color !== undefined) updateData.color = (data.color as string) || null;
  if (data.olor !== undefined) updateData.olor = (data.olor as string) || null;
  if (data.presencia_insectos !== undefined) updateData.presencia_insectos = (data.presencia_insectos as string) || null;
  if (data.estado_producto !== undefined) updateData.estado_producto = (data.estado_producto as string) || null;
  if (data.categoria !== undefined) updateData.categoria = (data.categoria as string) || null;
  if (data.destino !== undefined) updateData.destino = (data.destino as string) || null;
  if (data.resultado !== undefined) updateData.resultado = (data.resultado as string) || null;
  if (data.motivo !== undefined) updateData.motivo = (data.motivo as string) || null;
  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;
  if (data.documento_firmado !== undefined) updateData.documento_firmado = data.documento_firmado;
  if (data.firma_responsable_url !== undefined) updateData.firma_responsable_url = (data.firma_responsable_url as string) || null;
  if (data.estado !== undefined) updateData.estado = data.estado;

  if (userId) updateData.updated_by = userId;

  const sacosData = data.sacos_detalle as Array<{ codigo: string; peso: number; observaciones?: string }> | undefined;

  return prisma.$transaction(async (tx) => {
    // Reemplazar sacos si se enviaron
    if (sacosData !== undefined) {
      await tx.recepcion_saco.deleteMany({ where: { recepcion_id: Number(id) } });
      if (sacosData.length > 0) {
        await tx.recepcion_saco.createMany({
          data: sacosData.map(s => ({
            recepcion_id: Number(id),
            codigo: s.codigo,
            peso: Number(s.peso),
            observaciones: s.observaciones || null,
          })),
        });
      }
      updateData.sacos = sacosData.length;
    }

    return tx.recepcion.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        sacos_detalle: { orderBy: { id: 'asc' } },
      },
    });
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.recepcion.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  await prisma.recepcion.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Recepción eliminada exitosamente' };
};
