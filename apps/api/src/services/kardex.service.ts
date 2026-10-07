import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

// ─── Types ─────────────────────────────────────────────────

type TipoMovimiento = 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';

// ─── Helpers ───────────────────────────────────────────────

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

function calcularNuevoSaldo(saldoActual: number, tipo: TipoMovimiento, cantidad: number): number {
  switch (tipo) {
    case 'ENTRADA':
      return saldoActual + cantidad;
    case 'SALIDA':
    case 'TRANSFERENCIA':
      return saldoActual - cantidad;
    case 'AJUSTE':
      return saldoActual + cantidad;
    default: {
      const _exhaustive: never = tipo;
      throw new Error(`Tipo de movimiento no soportado: ${_exhaustive}`);
    }
  }
}

function validarSaldoNegativo(nuevoSaldo: number, tipo: TipoMovimiento): void {
  if (nuevoSaldo < 0) {
    const etiqueta = tipo === 'TRANSFERENCIA' ? 'la transferencia' : tipo === 'SALIDA' ? 'la salida' : 'el ajuste';
    throw createError(`La operación de ${etiqueta} resultaría en un saldo negativo`, 400);
  }
}

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

export const getMovimientos = async (kardexId: string, page = 1, limit = 50) => {
  const kardex = await prisma.kardex.findFirst({
    where: { id: Number(kardexId), activo: true },
    select: { id: true },
  });

  if (!kardex) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const where = { kardex_id: Number(kardexId) };

  const [data, total] = await Promise.all([
    prisma.kardex_movimiento.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.kardex_movimiento.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    codigo = await ensureUniqueCodigo(codigo.trim());
  }

  const cantidadInicial = Number(data.cantidad_actual) || 0;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const kardex = await tx.kardex.create({
      data: {
        codigo,
        producto: data.producto as string,
        categoria: data.categoria as 'PRODUCTO_CAMPO' | 'PRODUCTO_PROCESADO' | 'SUBPRODUCTO' | 'ENVASE',
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
  const kardexIdNum = Number(kardexId);
  const kardex = await prisma.kardex.findFirst({ where: { id: kardexIdNum, activo: true } });

  if (!kardex) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const tipo = data.tipo as TipoMovimiento;
  const cantidad = Math.abs(Number(data.cantidad));

  if (cantidad === 0) {
    throw createError('La cantidad debe ser distinta de cero', 400);
  }

  const esSalida = tipo === 'SALIDA' || tipo === 'TRANSFERENCIA';

  // La actualización del saldo se hace con updateMany condicional dentro de la
  // transacción: dos SALIDA concurrentes no pueden dejar el saldo en negativo.
  const movimiento = await prisma.$transaction(async (tx: PrismaTransaction) => {
    if (esSalida) {
      const resultado = await tx.kardex.updateMany({
        where: { id: kardexIdNum, cantidad_actual: { gte: cantidad } },
        data: { cantidad_actual: { decrement: cantidad } },
      });
      if (resultado.count === 0) {
        throw createError('La cantidad excede el saldo disponible', 400);
      }
    } else {
      await tx.kardex.update({
        where: { id: kardexIdNum },
        data: { cantidad_actual: { increment: cantidad } },
      });
    }

    const actualizado = await tx.kardex.findUnique({
      where: { id: kardexIdNum },
      select: { cantidad_actual: true },
    });

    const saldoAnterior = esSalida
      ? Number(actualizado?.cantidad_actual ?? 0) + cantidad
      : Number(actualizado?.cantidad_actual ?? 0) - cantidad;
    const saldoPosterior = Number(actualizado?.cantidad_actual ?? 0);

    return tx.kardex_movimiento.create({
      data: {
        kardex_id: kardexIdNum,
        tipo,
        cantidad,
        saldo_anterior: saldoAnterior,
        saldo_posterior: saldoPosterior,
        destino: (data.destino as string) || null,
        referencia: (data.referencia as string) || null,
        responsable: (data.responsable as string) || null,
        observaciones: (data.observaciones as string) || null,
        fecha: data.fecha ? new Date(data.fecha as string) : new Date(),
      },
    });
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

  const tipo = movimiento.tipo as TipoMovimiento;
  const cantidad = Math.abs(Number(movimiento.cantidad));
  const saldoActual = Number(kardex.cantidad_actual);

  const saldoRevertido = calcularNuevoSaldo(saldoActual, tipo, -cantidad);
  validarSaldoNegativo(saldoRevertido, tipo);

  await prisma.$transaction(async (tx: PrismaTransaction) => {
    await tx.kardex.update({
      where: { id: Number(kardexId) },
      data: { cantidad_actual: saldoRevertido },
    });

    await tx.kardex_movimiento.delete({
      where: { id: Number(movimientoId) },
    });
  });

  return { message: 'Movimiento eliminado exitosamente' };
};

// ─── Recomputar stock desde movimientos ───────────────────

export const recomputeStock = async (kardexId: string) => {
  const kardex = await prisma.kardex.findFirst({ where: { id: Number(kardexId), activo: true } });

  if (!kardex) {
    throw createError('Item de kardex no encontrado', 404);
  }

  const movimientos = await prisma.kardex_movimiento.findMany({
    where: { kardex_id: Number(kardexId) },
    orderBy: { fecha: 'asc' },
  });

  let saldo = 0;
  for (const mov of movimientos) {
    const tipo = mov.tipo as TipoMovimiento;
    const cantidad = Math.abs(Number(mov.cantidad));
    saldo = calcularNuevoSaldo(saldo, tipo, cantidad);
  }

  await prisma.kardex.update({
    where: { id: Number(kardexId) },
    data: { cantidad_actual: saldo },
  });

  return { stock_recalculado: saldo, movimientos_procesados: movimientos.length };
};
