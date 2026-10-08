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

// ==================== Inventario actual ====================
// Stock agrupado por producto con categoría, origen, etapa, ubicación, estado y mínimo.
export const getInventario = async (filters: {
  search?: string;
  origen?: string;
  categoria?: string;
  etapa?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };
  if (filters.origen) where.origen = filters.origen;
  if (filters.categoria) where.categoria = filters.categoria;
  if (filters.etapa) where.etapa = filters.etapa;
  if (filters.estado) where.estado = filters.estado;
  if (filters.search) {
    where.OR = [
      { producto: { contains: filters.search } },
      { codigo: { contains: filters.search } },
      { ubicacion: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 50, 200);

  const [data, total] = await Promise.all([
    prisma.kardex.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { producto: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        codigo: true,
        producto: true,
        categoria: true,
        origen: true,
        etapa: true,
        unidad: true,
        cantidad_actual: true,
        cantidad_minima: true,
        cantidad_maxima: true,
        ubicacion: true,
        estado: true,
        costo_unitario: true,
        fecha_ingreso: true,
        fecha_vencimiento: true,
        activo: true,
      },
    }),
    prisma.kardex.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ==================== Alertas ====================
// Items bajo stock mínimo y próximos a vencer (30 días).
export const getAlertas = async () => {
  const ahora = new Date();
  const en30Dias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [bajoMinimo, proximosVencer, vencidos] = await Promise.all([
    prisma.kardex.findMany({
      where: {
        activo: true,
        cantidad_minima: { not: null },
        cantidad_actual: { lte: prisma.kardex.fields.cantidad_minima },
      },
      select: {
        id: true, codigo: true, producto: true, categoria: true, origen: true,
        unidad: true, cantidad_actual: true, cantidad_minima: true, ubicacion: true,
      },
    }),
    prisma.kardex.findMany({
      where: {
        activo: true,
        fecha_vencimiento: { gte: ahora, lte: en30Dias },
      },
      select: {
        id: true, codigo: true, producto: true, categoria: true,
        unidad: true, cantidad_actual: true, fecha_vencimiento: true,
      },
    }),
    prisma.kardex.findMany({
      where: {
        activo: true,
        fecha_vencimiento: { lt: ahora },
      },
      select: {
        id: true, codigo: true, producto: true, categoria: true,
        unidad: true, cantidad_actual: true, fecha_vencimiento: true,
      },
    }),
  ]);

  return {
    bajo_minimo: bajoMinimo,
    proximos_vencer: proximosVencer,
    vencidos,
    total_alertas: bajoMinimo.length + proximosVencer.length + vencidos.length,
  };
};

// ==================== Movimientos globales ====================
// Historial de todos los movimientos con filtros y trazabilidad.
export const getMovimientosGlobales = async (filters: {
  kardex_id?: number;
  tipo?: string;
  origen?: string;
  referencia_tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = {};
  if (filters.kardex_id) where.kardex_id = filters.kardex_id;
  if (filters.tipo) where.tipo = filters.tipo;
  if (filters.origen) where.origen = filters.origen;
  if (filters.referencia_tipo) where.referencia_tipo = filters.referencia_tipo;
  if (filters.fecha_desde || filters.fecha_hasta) {
    where.fecha = {};
    if (filters.fecha_desde) (where.fecha as Record<string, unknown>).gte = new Date(filters.fecha_desde);
    if (filters.fecha_hasta) (where.fecha as Record<string, unknown>).lte = new Date(filters.fecha_hasta);
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 50, 200);

  const [data, total] = await Promise.all([
    prisma.kardex_movimiento.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        tipo: true,
        cantidad: true,
        saldo_anterior: true,
        saldo_posterior: true,
        origen: true,
        destino: true,
        referencia: true,
        referencia_tipo: true,
        referencia_id: true,
        responsable: true,
        observaciones: true,
        fecha: true,
        kardex: {
          select: { id: true, codigo: true, producto: true, categoria: true, unidad: true },
        },
      },
    }),
    prisma.kardex_movimiento.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ==================== Estadísticas ====================
export const getStats = async () => {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const [totalItems, porCategoria, porOrigen, valorTotal, entradasMes, salidasMes, bajasMes] = await Promise.all([
    prisma.kardex.count({ where: { activo: true } }),
    prisma.kardex.groupBy({
      by: ['categoria'],
      where: { activo: true },
      _count: { id: true },
      _sum: { cantidad_actual: true },
    }),
    prisma.kardex.groupBy({
      by: ['origen'],
      where: { activo: true },
      _count: { id: true },
      _sum: { cantidad_actual: true },
    }),
    prisma.kardex.findMany({
      where: { activo: true },
      select: { cantidad_actual: true, costo_unitario: true },
    }),
    prisma.kardex_movimiento.aggregate({
      where: { tipo: 'ENTRADA', fecha: { gte: inicioMes } },
      _sum: { cantidad: true },
      _count: { id: true },
    }),
    prisma.kardex_movimiento.aggregate({
      where: { tipo: 'SALIDA', fecha: { gte: inicioMes } },
      _sum: { cantidad: true },
      _count: { id: true },
    }),
    prisma.kardex_movimiento.aggregate({
      where: { tipo: 'BAJA', fecha: { gte: inicioMes } },
      _sum: { cantidad: true },
      _count: { id: true },
    }),
  ]);

  const valor = valorTotal.reduce(
    (acc, k) => acc + Number(k.cantidad_actual) * Number(k.costo_unitario ?? 0),
    0,
  );

  const categorias: Record<string, { cantidad: number; total: number }> = {};
  for (const c of porCategoria) {
    categorias[c.categoria] = {
      cantidad: c._count.id,
      total: Number(c._sum.cantidad_actual ?? 0),
    };
  }

  const origenes: Record<string, { cantidad: number; total: number }> = {};
  for (const o of porOrigen) {
    origenes[o.origen] = {
      cantidad: o._count.id,
      total: Number(o._sum.cantidad_actual ?? 0),
    };
  }

  return {
    total_items: totalItems,
    valor_total: Number(valor.toFixed(2)),
    kg_totales: Number(valorTotal.reduce((acc, k) => acc + Number(k.cantidad_actual), 0).toFixed(2)),
    por_categoria: categorias,
    por_origen: origenes,
    movimientos_mes: {
      entradas: { cantidad: entradasMes._count.id, total: Number(entradasMes._sum.cantidad ?? 0) },
      salidas: { cantidad: salidasMes._count.id, total: Number(salidasMes._sum.cantidad ?? 0) },
      bajas: { cantidad: bajasMes._count.id, total: Number(bajasMes._sum.cantidad ?? 0) },
    },
  };
};

// ==================== Dar de baja ====================
export const darDeBaja = async (
  kardexId: number,
  motivo: string,
  cantidad?: number,
  responsable?: string,
) => {
  const { darDeBaja: bajaInterna } = await import('./kardex-integracion.service');
  return bajaInterna(kardexId, motivo, cantidad, responsable);
};
