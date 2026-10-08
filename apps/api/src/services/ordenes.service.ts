import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import { ingresosPorOrden } from './kardex-integracion.service';

// Tolerancia del balance de masa: si la diferencia supera este % se bloquea la finalización.
const TOLERANCIA_BALANCE = Number(process.env.BALANCE_TOLERANCIA_PCT ?? 1);

export interface OrdenInput {
  planta: string;
  responsable: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  etapa: 'PRIMARIA' | 'SECUNDARIA' | 'EMPAQUE';
  formato_salida?: 'GRANO' | 'HARINA' | 'HOJUELA' | 'POP' | 'GRANEL' | 'OTRO';
  receta_id?: number | null;
  orden_origen_id?: number | null;
  producto_salida: string;
  peso_entrada?: number;
  humedad_final?: number | null;
  calidad?: string | null;
  observaciones?: string | null;
  operaciones?: { operacion_id: number; orden?: number }[];
  recepciones?: { recepcion_id: number; cantidad_asignada: number; observaciones?: string }[];
}

export interface SalidaInput {
  tipo_salida: 'PRODUCTO_BUENO' | 'MERMA' | 'PIEDRAS' | 'SAPONINA' | 'ENVASE' | 'OTRO';
  descripcion: string;
  cantidad: number;
  unidad?: 'KG' | 'UNIDAD' | 'LT';
  humedad?: number | null;
  destino?: 'KARDEX' | 'DESCARTE' | 'REPROCESO' | 'SUBPRODUCTO' | 'VENTA_DIRECTA';
  cuenta_en_balance?: boolean;
  observaciones?: string | null;
}

export interface OperacionEjecutadaInput {
  operacion_id: number;
  orden?: number;
  fecha?: string;
  operario?: string | null;
  peso_antes?: number | null;
  peso_despues?: number | null;
  humedad?: number | null;
  resultado?: string | null;
  observaciones?: string | null;
  completada?: boolean;
}

const ordenSelect = {
  id: true,
  codigo: true,
  planta: true,
  responsable: true,
  fecha_inicio: true,
  fecha_fin: true,
  estado: true,
  etapa: true,
  formato_salida: true,
  receta_id: true,
  orden_origen_id: true,
  producto_salida: true,
  peso_entrada: true,
  peso_salida_total: true,
  merma_total: true,
  rendimiento: true,
  humedad_final: true,
  calidad: true,
  balance_ok: true,
  observaciones: true,
  activo: true,
  created_at: true,
  updated_at: true,
} as const;

const ordenCompletaSelect = {
  ...ordenSelect,
  receta: {
    select: { id: true, codigo: true, nombre: true, producto_base: true, etapa: true, formato_salida: true },
  },
  orden_origen: {
    select: { id: true, codigo: true, producto_salida: true, etapa: true },
  },
  operaciones: {
    orderBy: { orden: 'asc' as const },
    select: {
      id: true,
      orden: true,
      fecha: true,
      operario: true,
      peso_antes: true,
      peso_despues: true,
      humedad: true,
      resultado: true,
      observaciones: true,
      completada: true,
      operacion: { select: { id: true, codigo: true, nombre: true } },
    },
  },
  salidas: {
    orderBy: { created_at: 'asc' as const },
    select: {
      id: true,
      tipo_salida: true,
      descripcion: true,
      cantidad: true,
      unidad: true,
      humedad: true,
      destino: true,
      cuenta_en_balance: true,
      observaciones: true,
    },
  },
  recepciones: {
    select: {
      id: true,
      cantidad_asignada: true,
      observaciones: true,
      recepcion: {
        select: { id: true, codigo: true, lote_productor: true, peso_neto: true },
      },
    },
  },
} as const;

// ==================== Generación de código ====================
const generarCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.orden_procesamiento.findFirst({
    where: { codigo: { startsWith: `OP-${year}-` } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });
  if (!last) return `OP-${year}-001`;
  const partes = last.codigo.split('-');
  const num = parseInt(partes[2] ?? '0', 10) + 1;
  return `OP-${year}-${String(num).padStart(3, '0')}`;
};

// ==================== CRUD ====================
export const getAll = async (filters: {
  search?: string;
  estado?: string;
  etapa?: string;
  formato_salida?: string;
  receta_id?: number;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };
  if (filters.estado) where.estado = filters.estado;
  if (filters.etapa) where.etapa = filters.etapa;
  if (filters.formato_salida) where.formato_salida = filters.formato_salida;
  if (filters.receta_id) where.receta_id = filters.receta_id;
  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { producto_salida: { contains: filters.search } },
      { planta: { contains: filters.search } },
      { responsable: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);

  const [data, total] = await Promise.all([
    prisma.orden_procesamiento.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: ordenSelect,
    }),
    prisma.orden_procesamiento.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: number) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id, activo: true },
    select: ordenCompletaSelect,
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);
  return orden;
};

export const create = async (input: OrdenInput) => {
  const codigo = await generarCodigo();

  // Si viene de una orden origen, el peso de entrada se toma de su salida PRODUCTO_BUENO.
  let pesoEntrada = input.peso_entrada ?? 0;
  if (input.orden_origen_id) {
    const origen = await prisma.orden_procesamiento.findFirst({
      where: { id: input.orden_origen_id, activo: true },
      include: { salidas: { where: { tipo_salida: 'PRODUCTO_BUENO', cuenta_en_balance: true } } },
    });
    if (!origen) throw createError('Orden de origen no encontrada', 404);
    const salidasOrigen = origen.salidas.reduce((acc, s) => acc + Number(s.cantidad), 0);
    if (salidasOrigen > 0) pesoEntrada = salidasOrigen;
  }

  // Si viene de recepciones asignadas, el peso de entrada es la suma de lo asignado.
  if (input.recepciones && input.recepciones.length > 0) {
    const sumaRecepciones = input.recepciones.reduce((acc, r) => acc + r.cantidad_asignada, 0);
    if (sumaRecepciones > 0 && !input.orden_origen_id) {
      pesoEntrada = sumaRecepciones;
    }
  }

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const orden = await tx.orden_procesamiento.create({
      data: {
        codigo,
        planta: input.planta,
        responsable: input.responsable,
        fecha_inicio: new Date(input.fecha_inicio),
        fecha_fin: input.fecha_fin ? new Date(input.fecha_fin) : null,
        estado: 'BORRADOR',
        etapa: input.etapa,
        formato_salida: input.formato_salida ?? 'GRANO',
        receta_id: input.receta_id ?? null,
        orden_origen_id: input.orden_origen_id ?? null,
        producto_salida: input.producto_salida,
        peso_entrada: pesoEntrada,
        humedad_final: input.humedad_final ?? null,
        calidad: (input.calidad as never) ?? null,
        observaciones: input.observaciones ?? null,
      },
    });

    // Operaciones: si se pasa receta y no hay lista explícita, usar las de la receta.
    let operacionesAcrear = input.operaciones;
    if (!operacionesAcrear && input.receta_id) {
      const recetaOps = await tx.receta_operacion.findMany({
        where: { receta_id: input.receta_id },
        orderBy: { orden: 'asc' },
      });
      operacionesAcrear = recetaOps.map((ro) => ({
        operacion_id: ro.operacion_id,
        orden: ro.orden,
      }));
    }
    if (operacionesAcrear && operacionesAcrear.length > 0) {
      await tx.orden_operacion.createMany({
        data: operacionesAcrear.map((op, i) => ({
          orden_id: orden.id,
          operacion_id: op.operacion_id,
          orden: op.orden ?? i + 1,
          completada: false,
        })),
      });
    }

    if (input.recepciones && input.recepciones.length > 0) {
      await tx.orden_recepcion.createMany({
        data: input.recepciones.map((r) => ({
          orden_id: orden.id,
          recepcion_id: r.recepcion_id,
          cantidad_asignada: r.cantidad_asignada,
          observaciones: r.observaciones ?? null,
        })),
      });
    }

    return tx.orden_procesamiento.findUnique({
      where: { id: orden.id },
      select: ordenCompletaSelect,
    });
  });
};

export const update = async (id: number, input: Partial<OrdenInput>) => {
  const existing = await prisma.orden_procesamiento.findFirst({
    where: { id, activo: true },
  });
  if (!existing) throw createError('Orden de procesamiento no encontrada', 404);
  if (existing.estado === 'FINALIZADO') {
    throw createError('No se puede modificar una orden finalizada', 409);
  }

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    await tx.orden_procesamiento.update({
      where: { id },
      data: {
        ...(input.planta !== undefined && { planta: input.planta }),
        ...(input.responsable !== undefined && { responsable: input.responsable }),
        ...(input.fecha_inicio !== undefined && { fecha_inicio: new Date(input.fecha_inicio) }),
        ...(input.fecha_fin !== undefined && {
          fecha_fin: input.fecha_fin ? new Date(input.fecha_fin) : null,
        }),
        ...(input.etapa !== undefined && { etapa: input.etapa }),
        ...(input.formato_salida !== undefined && { formato_salida: input.formato_salida }),
        ...(input.receta_id !== undefined && { receta_id: input.receta_id }),
        ...(input.producto_salida !== undefined && { producto_salida: input.producto_salida }),
        ...(input.peso_entrada !== undefined && { peso_entrada: input.peso_entrada }),
        ...(input.humedad_final !== undefined && { humedad_final: input.humedad_final }),
        ...(input.calidad !== undefined && { calidad: input.calidad as never }),
        ...(input.observaciones !== undefined && { observaciones: input.observaciones }),
      },
    });

    if (input.recepciones) {
      await tx.orden_recepcion.deleteMany({ where: { orden_id: id } });
      if (input.recepciones.length > 0) {
        await tx.orden_recepcion.createMany({
          data: input.recepciones.map((r) => ({
            orden_id: id,
            recepcion_id: r.recepcion_id,
            cantidad_asignada: r.cantidad_asignada,
            observaciones: r.observaciones ?? null,
          })),
        });
      }
    }

    return tx.orden_procesamiento.findUnique({
      where: { id },
      select: ordenCompletaSelect,
    });
  });
};

export const remove = async (id: number) => {
  const existing = await prisma.orden_procesamiento.findFirst({
    where: { id, activo: true },
  });
  if (!existing) throw createError('Orden de procesamiento no encontrada', 404);
  if (existing.estado === 'FINALIZADO') {
    throw createError('No se puede eliminar una orden finalizada', 409);
  }

  await prisma.orden_procesamiento.update({
    where: { id },
    data: { activo: false },
  });
  return { message: 'Orden de procesamiento eliminada exitosamente' };
};

// ==================== Operaciones ejecutadas ====================
export const addOperacion = async (ordenId: number, input: OperacionEjecutadaInput) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenId, activo: true },
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);
  if (orden.estado === 'FINALIZADO') {
    throw createError('No se puede modificar una orden finalizada', 409);
  }

  return prisma.orden_operacion.create({
    data: {
      orden_id: ordenId,
      operacion_id: input.operacion_id,
      orden: input.orden ?? 0,
      fecha: input.fecha ? new Date(input.fecha) : new Date(),
      operario: input.operario ?? null,
      peso_antes: input.peso_antes ?? null,
      peso_despues: input.peso_despues ?? null,
      humedad: input.humedad ?? null,
      resultado: input.resultado ?? null,
      observaciones: input.observaciones ?? null,
      completada: input.completada ?? true,
    },
  });
};

export const updateOperacion = async (
  ordenId: number,
  operacionOrdenId: number,
  input: Partial<OperacionEjecutadaInput>,
) => {
  const existing = await prisma.orden_operacion.findFirst({
    where: { id: operacionOrdenId, orden_id: ordenId },
  });
  if (!existing) throw createError('Operación de la orden no encontrada', 404);

  return prisma.orden_operacion.update({
    where: { id: operacionOrdenId },
    data: {
      ...(input.orden !== undefined && { orden: input.orden }),
      ...(input.fecha !== undefined && { fecha: new Date(input.fecha) }),
      ...(input.operario !== undefined && { operario: input.operario }),
      ...(input.peso_antes !== undefined && { peso_antes: input.peso_antes }),
      ...(input.peso_despues !== undefined && { peso_despues: input.peso_despues }),
      ...(input.humedad !== undefined && { humedad: input.humedad }),
      ...(input.resultado !== undefined && { resultado: input.resultado }),
      ...(input.observaciones !== undefined && { observaciones: input.observaciones }),
      ...(input.completada !== undefined && { completada: input.completada }),
    },
  });
};

export const removeOperacion = async (ordenId: number, operacionOrdenId: number) => {
  const existing = await prisma.orden_operacion.findFirst({
    where: { id: operacionOrdenId, orden_id: ordenId },
  });
  if (!existing) throw createError('Operación de la orden no encontrada', 404);

  await prisma.orden_operacion.delete({ where: { id: operacionOrdenId } });
  return { message: 'Operación eliminada exitosamente' };
};

// ==================== Salidas pesadas ====================
export const addSalida = async (ordenId: number, input: SalidaInput) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenId, activo: true },
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);
  if (orden.estado === 'FINALIZADO') {
    throw createError('No se puede modificar una orden finalizada', 409);
  }

  const salida = await prisma.orden_salida.create({
    data: {
      orden_id: ordenId,
      tipo_salida: input.tipo_salida,
      descripcion: input.descripcion,
      cantidad: input.cantidad,
      unidad: input.unidad ?? 'KG',
      humedad: input.humedad ?? null,
      destino: input.destino ?? 'SUBPRODUCTO',
      cuenta_en_balance: input.cuenta_en_balance ?? (input.unidad === 'KG' || input.unidad === undefined),
      observaciones: input.observaciones ?? null,
    },
  });

  await recalcularTotales(ordenId);
  return salida;
};

export const updateSalida = async (
  ordenId: number,
  salidaId: number,
  input: Partial<SalidaInput>,
) => {
  const existing = await prisma.orden_salida.findFirst({
    where: { id: salidaId, orden_id: ordenId },
  });
  if (!existing) throw createError('Salida no encontrada', 404);

  await prisma.orden_salida.update({
    where: { id: salidaId },
    data: {
      ...(input.tipo_salida !== undefined && { tipo_salida: input.tipo_salida }),
      ...(input.descripcion !== undefined && { descripcion: input.descripcion }),
      ...(input.cantidad !== undefined && { cantidad: input.cantidad }),
      ...(input.unidad !== undefined && { unidad: input.unidad }),
      ...(input.humedad !== undefined && { humedad: input.humedad }),
      ...(input.destino !== undefined && { destino: input.destino }),
      ...(input.cuenta_en_balance !== undefined && { cuenta_en_balance: input.cuenta_en_balance }),
      ...(input.observaciones !== undefined && { observaciones: input.observaciones }),
    },
  });

  await recalcularTotales(ordenId);
  return prisma.orden_salida.findUnique({ where: { id: salidaId } });
};

export const removeSalida = async (ordenId: number, salidaId: number) => {
  const existing = await prisma.orden_salida.findFirst({
    where: { id: salidaId, orden_id: ordenId },
  });
  if (!existing) throw createError('Salida no encontrada', 404);

  await prisma.orden_salida.delete({ where: { id: salidaId } });
  await recalcularTotales(ordenId);
  return { message: 'Salida eliminada exitosamente' };
};

// ==================== Balance ====================
// Recalcula peso_salida_total, merma_total y rendimiento.
// La merma es la suma de salidas que NO son PRODUCTO_BUENO.
export const recalcularTotales = async (ordenId: number) => {
  const orden = await prisma.orden_procesamiento.findUnique({
    where: { id: ordenId },
    include: { salidas: true },
  });
  if (!orden) return;

  const salidasBalance = orden.salidas.filter((s) => s.cuenta_en_balance);
  const pesoSalidaTotal = salidasBalance.reduce((acc, s) => acc + Number(s.cantidad), 0);
  const mermaTotal = salidasBalance
    .filter((s) => s.tipo_salida !== 'PRODUCTO_BUENO')
    .reduce((acc, s) => acc + Number(s.cantidad), 0);
  const pesoEntrada = Number(orden.peso_entrada);
  const rendimiento = pesoEntrada > 0 ? Number(((pesoSalidaTotal / pesoEntrada) * 100).toFixed(2)) : 0;

  await prisma.orden_procesamiento.update({
    where: { id: ordenId },
    data: {
      peso_salida_total: pesoSalidaTotal,
      merma_total: mermaTotal,
      rendimiento,
    },
  });
};

// Resumen del balance entrada vs salidas.
export const getBalance = async (ordenId: number) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenId, activo: true },
    include: { salidas: true, recepciones: true },
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);

  const salidasBalance = orden.salidas.filter((s) => s.cuenta_en_balance);
  const sumaSalidas = salidasBalance.reduce((acc, s) => acc + Number(s.cantidad), 0);
  const entrada = Number(orden.peso_entrada);
  const diferencia = Number((sumaSalidas - entrada).toFixed(2));
  const diferenciaPct = entrada > 0 ? Number(((Math.abs(diferencia) / entrada) * 100).toFixed(2)) : 0;

  const porTipo: Record<string, number> = {};
  for (const s of orden.salidas) {
    porTipo[s.tipo_salida] = Number(((porTipo[s.tipo_salida] ?? 0) + Number(s.cantidad)).toFixed(2));
  }

  return {
    orden_id: orden.id,
    codigo: orden.codigo,
    peso_entrada: entrada,
    suma_salidas: Number(sumaSalidas.toFixed(2)),
    diferencia,
    diferencia_pct: diferenciaPct,
    tolerancia_pct: TOLERANCIA_BALANCE,
    balance_ok: diferenciaPct <= TOLERANCIA_BALANCE,
    por_tipo: porTipo,
    salidas: orden.salidas,
    recepciones: orden.recepciones,
  };
};

// ==================== Finalización ====================
// Valida el balance y, si está OK, registra el producto bueno en kardex.
export const finalizar = async (ordenId: number, userId?: string) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenId, activo: true },
    include: { salidas: true },
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);
  if (orden.estado === 'FINALIZADO') {
    throw createError('La orden ya está finalizada', 409);
  }

  const salidasBalance = orden.salidas.filter((s) => s.cuenta_en_balance);
  const sumaSalidas = salidasBalance.reduce((acc, s) => acc + Number(s.cantidad), 0);
  const entrada = Number(orden.peso_entrada);
  const diferencia = sumaSalidas - entrada;
  const diferenciaPct = entrada > 0 ? (Math.abs(diferencia) / entrada) * 100 : 0;

  if (diferenciaPct > TOLERANCIA_BALANCE) {
    throw createError(
      `El balance de masa no cuadra: entrada ${entrada} kg vs salidas ${sumaSalidas.toFixed(2)} kg (diferencia ${diferencia.toFixed(2)} kg, ${diferenciaPct.toFixed(2)}%). Tolera hasta ${TOLERANCIA_BALANCE}%.`,
      422,
    );
  }

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    const actualizada = await tx.orden_procesamiento.update({
      where: { id: ordenId },
      data: {
        estado: 'FINALIZADO',
        fecha_fin: new Date(),
        balance_ok: true,
        peso_salida_total: sumaSalidas,
        updated_by: userId ?? null,
      },
    });

    // Entradas automáticas al kardex: productos, subproductos y envases
    const ingresos = await ingresosPorOrden(
      ordenId,
      {
        productoSalida: orden.producto_salida,
        etapa: orden.etapa as 'PRIMARIA' | 'SECUNDARIA' | 'EMPAQUE',
        planta: orden.planta,
        responsable: orden.responsable,
      },
      orden.salidas.map((s) => ({
        tipo_salida: s.tipo_salida,
        descripcion: s.descripcion,
        cantidad: Number(s.cantidad),
        unidad: s.unidad,
        destino: s.destino,
        cuenta_en_balance: s.cuenta_en_balance,
      })),
      tx,
    );

    return { ...actualizada, ingresos_kardex: ingresos };
  });
};

// ==================== Encadenamiento ====================
// Crea una orden de la etapa siguiente que consume la salida PRODUCTO_BUENO de una orden dada.
export const encadenar = async (ordenOrigenId: number, input: OrdenInput, userId?: string) => {
  const origen = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenOrigenId, activo: true },
    include: { salidas: { where: { tipo_salida: 'PRODUCTO_BUENO', cuenta_en_balance: true } } },
  });
  if (!origen) throw createError('Orden de origen no encontrada', 404);
  if (origen.estado !== 'FINALIZADO') {
    throw createError('Solo se puede encadenar desde una orden finalizada', 409);
  }

  const salidasOrigen = origen.salidas.reduce((acc, s) => acc + Number(s.cantidad), 0);
  if (salidasOrigen <= 0) {
    throw createError('La orden de origen no tiene producto bueno registrado', 422);
  }

  return create(
    {
      ...input,
      orden_origen_id: ordenOrigenId,
      peso_entrada: salidasOrigen,
      fecha_inicio: input.fecha_inicio || new Date().toISOString(),
    },
  );
};

// ==================== Trazabilidad ====================
// Cadena completa: orden → recepciones → acopio → productor
export const getTrazabilidad = async (ordenId: number) => {
  const orden = await prisma.orden_procesamiento.findFirst({
    where: { id: ordenId, activo: true },
    include: {
      orden_origen: {
        select: { id: true, codigo: true, producto_salida: true, etapa: true, fecha_inicio: true },
      },
      ordenes_siguientes: {
        select: { id: true, codigo: true, producto_salida: true, etapa: true, fecha_inicio: true },
      },
      recepciones: {
        include: {
          recepcion: {
            include: {
              acopio: {
                include: {
                  detalles: {
                    include: {
                      productor: {
                        select: {
                          id: true,
                          codigo: true,
                          nombres: true,
                          apellido_paterno: true,
                          apellido_materno: true,
                          dni: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      salidas: {
        where: { tipo_salida: 'PRODUCTO_BUENO' },
        select: { descripcion: true, cantidad: true, unidad: true, destino: true },
      },
    },
  });
  if (!orden) throw createError('Orden de procesamiento no encontrada', 404);
  return orden;
};

// ==================== Estadísticas ====================
export const getStats = async () => {
  const where = { activo: true };
  const [total, porEstado, porEtapa, kgProcesados, kgAKardex] = await Promise.all([
    prisma.orden_procesamiento.count({ where }),
    prisma.orden_procesamiento.groupBy({ by: ['estado'], where, _count: { id: true } }),
    prisma.orden_procesamiento.groupBy({ by: ['etapa'], where, _count: { id: true } }),
    prisma.orden_procesamiento.aggregate({ where, _sum: { peso_salida_total: true } }),
    prisma.orden_salida.aggregate({
      where: { destino: 'KARDEX', cuenta_en_balance: true },
      _sum: { cantidad: true },
    }),
  ]);

  const estados: Record<string, number> = {};
  for (const e of porEstado) estados[e.estado] = e._count.id;

  const etapas: Record<string, number> = {};
  for (const e of porEtapa) etapas[e.etapa] = e._count.id;

  return {
    total_ordenes: total,
    por_estado: estados,
    por_etapa: etapas,
    kg_procesados: Number(kgProcesados._sum.peso_salida_total ?? 0),
    kg_a_kardex: Number(kgAKardex._sum.cantidad ?? 0),
  };
};
