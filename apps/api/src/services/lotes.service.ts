import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.lotes.findFirst({
    where: { codigo: { startsWith: `LOTE-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `LOTE-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `LOTE-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.lotes.findUnique({ where: { codigo: current }, select: { id: true } });
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
  campania_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.campania_id) where.campania_id = filters.campania_id;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { nombre: { contains: filters.search } },
      { cultivo: { contains: filters.search } },
      { origen: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.lotes.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        campania: { select: { id: true, codigo: true, nombre: true } },
        movimientos: { orderBy: { fecha: 'desc' } },
      },
    }),
    prisma.lotes.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const lote = await prisma.lotes.findFirst({
    where: { id, activo: true },
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      movimientos: { orderBy: { fecha: 'desc' } },
    },
  });

  if (!lote) {
    throw createError('Lote no encontrado', 404);
  }

  return lote;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.lotes.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const movimientosData = (data.movimientos as Array<Record<string, unknown>>) || [];
  const pesoInicial = Number(data.peso_inicial);

  return prisma.lotes.create({
    data: {
      codigo,
      nombre: data.nombre as string,
      campania_id: data.campania_id as string,
      cultivo: data.cultivo as string,
      origen: data.origen as string,
      peso_inicial: pesoInicial,
      peso_disponible: data.peso_disponible != null ? Number(data.peso_disponible) : pesoInicial,
      unidad: (data.unidad as string) || 'kg',
      estado: (data.estado as 'REGISTRADO' | 'EN_PROCESAMIENTO' | 'DISPONIBLE' | 'CONSUMIDO' | 'VENCIDO') || 'REGISTRADO',
      fecha_produccion: data.fecha_produccion ? new Date(data.fecha_produccion as string) : null,
      fecha_vencimiento: data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null,
      calidad: (data.calidad as string) || null,
      certificacion: (data.certificacion as string) || null,
      ubicacion: (data.ubicacion as string) || null,
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      movimientos: {
        create: movimientosData.map(m => ({
          tipo: m.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
          cantidad: Number(m.cantidad),
          destino: (m.destino as string) || null,
          referencia: (m.referencia as string) || null,
          responsable: (m.responsable as string) || null,
          observaciones: (m.observaciones as string) || null,
          fecha: m.fecha ? new Date(m.fecha as string) : new Date(),
        })),
      },
    },
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      movimientos: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.lotes.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Lote no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['nombre', 'cultivo', 'origen', 'calidad', 'certificacion', 'ubicacion', 'observaciones'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.campania_id !== undefined) updateData.campania_id = data.campania_id;
  if (data.peso_inicial !== undefined) updateData.peso_inicial = Number(data.peso_inicial);
  if (data.peso_disponible !== undefined) updateData.peso_disponible = data.peso_disponible != null ? Number(data.peso_disponible) : null;
  if (data.unidad !== undefined) updateData.unidad = data.unidad;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.fecha_produccion !== undefined) updateData.fecha_produccion = data.fecha_produccion ? new Date(data.fecha_produccion as string) : null;
  if (data.fecha_vencimiento !== undefined) updateData.fecha_vencimiento = data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null;

  if (userId) updateData.updated_by = userId;

  if (data.movimientos !== undefined) {
    const movimientosData = data.movimientos as Array<Record<string, unknown>>;
    await prisma.lote_movimientos.deleteMany({ where: { lote_id: id } });
    if (movimientosData.length > 0) {
      await prisma.lote_movimientos.createMany({
        data: movimientosData.map(m => ({
          lote_id: id,
          tipo: m.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
          cantidad: Number(m.cantidad),
          destino: (m.destino as string) || null,
          referencia: (m.referencia as string) || null,
          responsable: (m.responsable as string) || null,
          observaciones: (m.observaciones as string) || null,
          fecha: m.fecha ? new Date(m.fecha as string) : new Date(),
        })),
      });
    }
  }

  return prisma.lotes.update({
    where: { id },
    data: updateData,
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      movimientos: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.lotes.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Lote no encontrado', 404);
  }

  await prisma.lotes.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Lote eliminado exitosamente' };
};

// ─── Movimientos ──────────────────────────────────────────

export const addMovimiento = async (loteId: string, data: Record<string, unknown>) => {
  const lote = await prisma.lotes.findFirst({ where: { id: loteId, activo: true } });

  if (!lote) {
    throw createError('Lote no encontrado', 404);
  }

  const cantidad = Number(data.cantidad);

  if (data.tipo === 'SALIDA') {
    const pesoDisponible = Number(lote.peso_disponible);
    if (cantidad > pesoDisponible) {
      throw createError('La cantidad excede el peso disponible del lote', 400);
    }
  }

  const movimiento = await prisma.$transaction(async (tx) => {
    const mov = await tx.lote_movimientos.create({
      data: {
        lote_id: loteId,
        tipo: data.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
        cantidad,
        destino: (data.destino as string) || null,
        referencia: (data.referencia as string) || null,
        responsable: (data.responsable as string) || null,
        observaciones: (data.observaciones as string) || null,
        fecha: data.fecha ? new Date(data.fecha as string) : new Date(),
      },
    });

    const pesoActual = Number(lote.peso_disponible);
    let nuevoPeso = pesoActual;

    if (data.tipo === 'ENTRADA') {
      nuevoPeso = pesoActual + cantidad;
    } else if (data.tipo === 'SALIDA') {
      nuevoPeso = pesoActual - cantidad;
    }

    await tx.lotes.update({
      where: { id: loteId },
      data: { peso_disponible: nuevoPeso },
    });

    return mov;
  });

  return movimiento;
};

export const removeMovimiento = async (loteId: string, movimientoId: string) => {
  const lote = await prisma.lotes.findFirst({ where: { id: loteId, activo: true } });

  if (!lote) {
    throw createError('Lote no encontrado', 404);
  }

  const movimiento = await prisma.lote_movimientos.findFirst({
    where: { id: movimientoId, lote_id: loteId },
  });

  if (!movimiento) {
    throw createError('Movimiento no encontrado', 404);
  }

  await prisma.$transaction(async (tx) => {
    const pesoActual = Number(lote.peso_disponible);
    const cantidad = Number(movimiento.cantidad);
    let nuevoPeso = pesoActual;

    if (movimiento.tipo === 'ENTRADA') {
      nuevoPeso = pesoActual - cantidad;
    } else if (movimiento.tipo === 'SALIDA') {
      nuevoPeso = pesoActual + cantidad;
    }

    await tx.lotes.update({
      where: { id: loteId },
      data: { peso_disponible: nuevoPeso },
    });

    await tx.lote_movimientos.delete({
      where: { id: movimientoId },
    });
  });

  return { message: 'Movimiento eliminado exitosamente' };
};
