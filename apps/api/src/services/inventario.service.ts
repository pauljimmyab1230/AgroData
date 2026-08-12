import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.inventario.findFirst({
    where: { codigo: { startsWith: `INV-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `INV-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `INV-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.inventario.findUnique({ where: { codigo: current }, select: { id: true } });
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
  lote_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.categoria) where.categoria = { contains: filters.categoria };
  if (filters.lote_id) where.lote_id = filters.lote_id;

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
    prisma.inventario.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        movimientos: { orderBy: { fecha: 'desc' } },
      },
    }),
    prisma.inventario.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const item = await prisma.inventario.findFirst({
    where: { id, activo: true },
    include: {
      movimientos: { orderBy: { fecha: 'desc' } },
    },
  });

  if (!item) {
    throw createError('Item de inventario no encontrado', 404);
  }

  return item;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.inventario.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const movimientosData = (data.movimientos as Array<Record<string, unknown>>) || [];

  return prisma.inventario.create({
    data: {
      codigo,
      producto: data.producto as string,
      categoria: data.categoria as string,
      unidad: (data.unidad as string) || 'kg',
      cantidad_actual: Number(data.cantidad_actual) || 0,
      cantidad_minima: data.cantidad_minima != null ? Number(data.cantidad_minima) : null,
      cantidad_maxima: data.cantidad_maxima != null ? Number(data.cantidad_maxima) : null,
      ubicacion: (data.ubicacion as string) || null,
      estado: (data.estado as 'DISPONIBLE' | 'RESERVADO' | 'CONSUMIDO' | 'VENCIDO') || 'DISPONIBLE',
      lote_id: (data.lote_id as string) || null,
      fecha_ingreso: new Date(data.fecha_ingreso as string),
      fecha_vencimiento: data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null,
      proveedor: (data.proveedor as string) || null,
      costo_unitario: data.costo_unitario != null ? Number(data.costo_unitario) : null,
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      movimientos: {
        create: movimientosData.map(m => ({
          tipo: m.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
          cantidad: Number(m.cantidad),
          referencia: (m.referencia as string) || null,
          responsable: (m.responsable as string) || null,
          observaciones: (m.observaciones as string) || null,
          fecha: m.fecha ? new Date(m.fecha as string) : new Date(),
        })),
      },
    },
    include: {
      movimientos: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.inventario.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Item de inventario no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['producto', 'categoria', 'ubicacion', 'proveedor', 'observaciones'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.unidad !== undefined) updateData.unidad = data.unidad;
  if (data.cantidad_actual !== undefined) updateData.cantidad_actual = Number(data.cantidad_actual);
  if (data.cantidad_minima !== undefined) updateData.cantidad_minima = data.cantidad_minima != null ? Number(data.cantidad_minima) : null;
  if (data.cantidad_maxima !== undefined) updateData.cantidad_maxima = data.cantidad_maxima != null ? Number(data.cantidad_maxima) : null;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.lote_id !== undefined) updateData.lote_id = (data.lote_id as string) || null;
  if (data.fecha_ingreso !== undefined) updateData.fecha_ingreso = new Date(data.fecha_ingreso as string);
  if (data.fecha_vencimiento !== undefined) updateData.fecha_vencimiento = data.fecha_vencimiento ? new Date(data.fecha_vencimiento as string) : null;
  if (data.costo_unitario !== undefined) updateData.costo_unitario = data.costo_unitario != null ? Number(data.costo_unitario) : null;

  if (userId) updateData.updated_by = userId;

  if (data.movimientos !== undefined) {
    const movimientosData = data.movimientos as Array<Record<string, unknown>>;
    await prisma.inventario_movimientos.deleteMany({ where: { inventario_id: id } });
    if (movimientosData.length > 0) {
      await prisma.inventario_movimientos.createMany({
        data: movimientosData.map(m => ({
          inventario_id: id,
          tipo: m.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
          cantidad: Number(m.cantidad),
          referencia: (m.referencia as string) || null,
          responsable: (m.responsable as string) || null,
          observaciones: (m.observaciones as string) || null,
          fecha: m.fecha ? new Date(m.fecha as string) : new Date(),
        })),
      });
    }
  }

  return prisma.inventario.update({
    where: { id },
    data: updateData,
    include: {
      movimientos: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.inventario.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Item de inventario no encontrado', 404);
  }

  await prisma.inventario.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Item de inventario eliminado exitosamente' };
};

// ─── Movimientos ──────────────────────────────────────────

export const addMovimiento = async (inventarioId: string, data: Record<string, unknown>) => {
  const item = await prisma.inventario.findFirst({ where: { id: inventarioId, activo: true } });

  if (!item) {
    throw createError('Item de inventario no encontrado', 404);
  }

  const cantidad = Number(data.cantidad);

  if (data.tipo === 'SALIDA') {
    const cantidadActual = Number(item.cantidad_actual);
    if (cantidad > cantidadActual) {
      throw createError('La cantidad excede el stock disponible', 400);
    }
  }

  const movimiento = await prisma.$transaction(async (tx) => {
    const mov = await tx.inventario_movimientos.create({
      data: {
        inventario_id: inventarioId,
        tipo: data.tipo as 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE',
        cantidad,
        referencia: (data.referencia as string) || null,
        responsable: (data.responsable as string) || null,
        observaciones: (data.observaciones as string) || null,
        fecha: data.fecha ? new Date(data.fecha as string) : new Date(),
      },
    });

    const cantidadActual = Number(item.cantidad_actual);
    let nuevaCantidad = cantidadActual;

    if (data.tipo === 'ENTRADA') {
      nuevaCantidad = cantidadActual + cantidad;
    } else if (data.tipo === 'SALIDA') {
      nuevaCantidad = cantidadActual - cantidad;
    }

    await tx.inventario.update({
      where: { id: inventarioId },
      data: { cantidad_actual: nuevaCantidad },
    });

    return mov;
  });

  return movimiento;
};
