import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.kardex.findFirst({
    where: { codigo: { startsWith: `KDX-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `KDX-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `KDX-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.kardex.findUnique({ where: { codigo: current }, select: { id: true } });
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
  categoria?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.categoria) where.categoria = { contains: filters.categoria };

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { producto: { contains: filters.search } },
      { categoria: { contains: filters.search } },
      { proveedor: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.kardex.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        movimientos: { orderBy: { fecha: 'desc' }, take: 1 },
      },
    }),
    prisma.kardex.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const item = await prisma.kardex.findFirst({
    where: { id: Number(id), activo: true },
    include: {
      movimientos: { orderBy: { fecha: 'desc' } },
    },
  });

  if (!item) {
    throw createError('Item de kardex no encontrado', 404);
  }

  return item;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.kardex.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const cantidadInicial = Number(data.cantidad_actual) || 0;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const kardex = await tx.kardex.create({
      data: {
        codigo,
        producto: data.producto as string,
        categoria: data.categoria as string,
        unidad: (data.unidad as string) || 'kg',
        cantidad_actual: cantidadInicial,
        cantidad_minima: data.cantidad_minima != null ? Number(data.cantidad_minima) : null,
        cantidad_maxima: data.cantidad_maxima != null ? Number(data.cantidad_maxima) : null,
        ubicacion: (data.ubicacion as string) || null,
        estado: (data.estado as 'DISPONIBLE' | 'RESERVADO' | 'CONSUMIDO' | 'VENCIDO') || 'DISPONIBLE',
        fecha_ingreso: new Date(data.fecha_ingreso as string),
        fecha_vencimiento: data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null,
        proveedor: (data.proveedor as string) || null,
        costo_unitario: data.costo_unitario != null ? Number(data.costo_unitario) : null,
        observaciones: (data.observaciones as string) || null,
        created_by: userId || null,
      },
    });

    if (cantidadInicial > 0) {
      await tx.kardex_movimiento.create({
        data: {
          kardex_id: kardex.id,
          tipo: 'ENTRADA',
          cantidad: cantidadInicial,
          saldo_anterior: 0,
          saldo_posterior: cantidadInicial,
          referencia: 'Stock inicial',
          responsable: userId || null,
          fecha: new Date(),
        },
      });
    }

    return kardex;
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.kardex.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['producto', 'categoria', 'ubicacion', 'proveedor', 'observaciones'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.unidad !== undefined) updateData.unidad = data.unidad;
  if (data.cantidad_minima !== undefined) updateData.cantidad_minima = data.cantidad_minima != null ? Number(data.cantidad_minima) : null;
  if (data.cantidad_maxima !== undefined) updateData.cantidad_maxima = data.cantidad_maxima != null ? Number(data.cantidad_maxima) : null;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.fecha_ingreso !== undefined) updateData.fecha_ingreso = new Date(data.fecha_ingreso as string);
  if (data.fecha_vencimiento !== undefined) updateData.fecha_vencimiento = data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null;
  if (data.costo_unitario !== undefined) updateData.costo_unitario = data.costo_unitario != null ? Number(data.costo_unitario) : null;

  if (userId) updateData.updated_by = userId;

  return prisma.kardex.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.kardex.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Item de kardex no encontrado', 404);
  }

  await prisma.kardex.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Item de kardex eliminado exitosamente' };
};

// ─── Movimientos ──────────────────────────────────────────

export const addMovimiento = async (kardexId: string, data: Record<string, unknown>) => {
  const kardex = await prisma.kardex.findFirst({ where: { id: Number(kardexId), activo: true } });

  if (!kardex) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const cantidad = Number(data.cantidad);
  const tipo = data.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';
  const saldoActual = Number(kardex.cantidad_actual);

  if (tipo === 'SALIDA') {
    if (cantidad > saldoActual) {
      throw createError('La cantidad excede el saldo disponible', 400);
    }
  }

  let nuevoSaldo = saldoActual;
  if (tipo === 'ENTRADA') {
    nuevoSaldo = saldoActual + cantidad;
  } else if (tipo === 'SALIDA') {
    nuevoSaldo = saldoActual - cantidad;
  }

  const movimiento = await prisma.$transaction(async (tx: PrismaTransaction) => {
    const mov = await tx.kardex_movimiento.create({
      data: {
        kardex_id: Number(kardexId),
        tipo,
        cantidad,
        saldo_anterior: saldoActual,
        saldo_posterior: nuevoSaldo,
        destino: (data.destino as string) || null,
        referencia: (data.referencia as string) || null,
        responsable: (data.responsable as string) || null,
        observaciones: (data.observaciones as string) || null,
        fecha: data.fecha ? new Date(data.fecha as string) : new Date(),
      },
    });

    await tx.kardex.update({
      where: { id: Number(kardexId) },
      data: { cantidad_actual: nuevoSaldo },
    });

    return mov;
  });

  return movimiento;
};

export const removeMovimiento = async (kardexId: string, movimientoId: string) => {
  const kardex = await prisma.kardex.findFirst({ where: { id: Number(kardexId), activo: true } });

  if (!kardex) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const movimiento = await prisma.kardex_movimiento.findFirst({
    where: { id: Number(movimientoId), kardex_id: Number(kardexId) },
  });

  if (!movimiento) {
    throw createError('Movimiento no encontrado', 404);
  }

  await prisma.$transaction(async (tx: PrismaTransaction) => {
    const saldoActual = Number(kardex.cantidad_actual);
    const cantidad = Number(movimiento.cantidad);
    let nuevoSaldo = saldoActual;

    if (movimiento.tipo === 'ENTRADA') {
      nuevoSaldo = saldoActual - cantidad;
    } else if (movimiento.tipo === 'SALIDA') {
      nuevoSaldo = saldoActual + cantidad;
    }

    await tx.kardex.update({
      where: { id: Number(kardexId) },
      data: { cantidad_actual: nuevoSaldo },
    });

    await tx.kardex_movimiento.delete({
      where: { id: Number(movimientoId) },
    });
  });

  return { message: 'Movimiento eliminado exitosamente' };
};
