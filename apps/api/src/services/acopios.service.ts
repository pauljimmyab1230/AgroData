import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.acopio.findFirst({
    where: { codigo: { startsWith: `ACO-${year}-` } },
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `ACO-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `ACO-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.acopio.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const parts = current.split('-');
    const num = parseInt(parts.pop() || '0', 10) + 1;
    current = `${parts.join('-')}-${String(num).padStart(2, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const calcularResumenDetalles = (detalles: Array<{ sacos: Array<{ peso: number }> }>) => {
  let total_sacos = 0;
  let peso_total = 0;

  for (const detalle of detalles) {
    for (const saco of detalle.sacos) {
      total_sacos++;
      peso_total += saco.peso;
    }
  }

  return { total_sacos, peso_total };
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
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { acopiador: { contains: filters.search, mode: 'insensitive' } },
      { observaciones: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.acopio.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        detalles: {
          include: {
            productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
            cultivo: { select: { id: true, codigo: true, cultivo: true } },
            sacos: true,
          },
        },
      },
    }),
    prisma.acopio.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const acopio = await prisma.acopio.findFirst({
    where: { id: Number(id), activo: true },
    include: {
      detalles: {
        include: {
          productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true } },
          cultivo: { select: { id: true, codigo: true, cultivo: true, variedad: true } },
          sacos: { orderBy: { codigo: 'asc' } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!acopio) {
    throw createError('Acopio no encontrado', 404);
  }

  return acopio;
};

export const getByCodigo = async (codigo: string) => {
  const acopio = await prisma.acopio.findFirst({
    where: { codigo, activo: true },
    include: {
      detalles: {
        include: {
          productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true } },
          cultivo: { select: { id: true, codigo: true, cultivo: true, variedad: true } },
          sacos: { orderBy: { codigo: 'asc' } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!acopio) {
    throw createError('Acopio no encontrado', 404);
  }

  return acopio;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.acopio.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const detallesData = (data.detalles as Array<Record<string, unknown>>) || [];
  const resumen = calcularResumenDetalles(detallesData as any);

  return prisma.acopio.create({
    data: {
      codigo,
      fecha: new Date(data.fecha as string),
      acopiador: data.acopiador as string,
      vehiculo: (data.vehiculo as string) || null,
      ruta_acopio: (data.ruta_acopio as string) || null,
      total_sacos: resumen.total_sacos,
      peso_total: resumen.peso_total,
      estado: (data.estado as 'EN_PROCESO' | 'COMPLETADO' | 'EN_PLANTA') || 'EN_PROCESO',
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      detalles: {
        create: detallesData.map((d: any) => ({
          productor_id: Number(d.productor_id),
          cultivo_id: Number(d.cultivo_id),
          observaciones: d.observaciones || null,
          total_sacos: d.sacos?.length || 0,
          peso_total: d.sacos?.reduce((sum: number, s: any) => sum + Number(s.peso), 0) || 0,
          sacos: {
            create: (d.sacos || []).map((s: any) => ({
              codigo: s.codigo as string,
              peso: Number(s.peso),
              observaciones: s.observaciones || null,
            })),
          },
        })),
      },
    },
    include: {
      detalles: {
        include: {
          productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
          cultivo: { select: { id: true, codigo: true, cultivo: true } },
          sacos: true,
        },
      },
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.acopio.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Acopio no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.codigo !== undefined) updateData.codigo = data.codigo;
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.acopiador !== undefined) updateData.acopiador = data.acopiador;
  if (data.vehiculo !== undefined) updateData.vehiculo = (data.vehiculo as string) || null;
  if (data.ruta_acopio !== undefined) updateData.ruta_acopio = (data.ruta_acopio as string) || null;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;
  if (userId) updateData.updated_by = userId;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    if (data.detalles !== undefined) {
      const detallesData = (data.detalles as Array<Record<string, unknown>>) || [];
      const resumen = calcularResumenDetalles(detallesData as any);
      updateData.total_sacos = resumen.total_sacos;
      updateData.peso_total = resumen.peso_total;

      // Delete existing detalles and their sacos
      await tx.saco.deleteMany({ where: { acopio_detalle: { acopio_id: Number(id) } } });
      await tx.acopio_detalle.deleteMany({ where: { acopio_id: Number(id) } });

      // Create new detalles with sacos
      if (detallesData.length > 0) {
        await tx.acopio_detalle.createMany({
          data: detallesData.map((d: any) => ({
            acopio_id: Number(id),
            productor_id: Number(d.productor_id),
            cultivo_id: Number(d.cultivo_id),
            observaciones: d.observaciones || null,
            total_sacos: d.sacos?.length || 0,
            peso_total: d.sacos?.reduce((sum: number, s: any) => sum + Number(s.peso), 0) || 0,
          })),
        });

        // Get the created detalles to link sacos
        const createdDetalles = await tx.acopio_detalle.findMany({
          where: { acopio_id: Number(id) },
          select: { id: true, productor_id: true, cultivo_id: true },
        });

        // Create sacos for each detalle
        for (const d of detallesData) {
          const sacosArray = d.sacos as Array<Record<string, unknown>> | undefined;
          const detalle = createdDetalles.find(
            (cd) => cd.productor_id === Number(d.productor_id) && cd.cultivo_id === Number(d.cultivo_id)
          );
          if (detalle && sacosArray && sacosArray.length > 0) {
            await tx.saco.createMany({
              data: sacosArray.map((s: any) => ({
                acopio_detalle_id: detalle.id,
                codigo: s.codigo as string,
                peso: Number(s.peso),
                observaciones: s.observaciones || null,
              })),
            });
          }
        }
      }
    }

    return tx.acopio.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        detalles: {
          include: {
            productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
            cultivo: { select: { id: true, codigo: true, cultivo: true } },
            sacos: true,
          },
        },
      },
    });
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.acopio.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Acopio no encontrado', 404);
  }

  await prisma.acopio.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Acopio eliminado exitosamente' };
};

export const getStats = async () => {
  const where: Record<string, unknown> = { activo: true };

  const [totalAcopios, totalSacos, pesoTotalResult] = await Promise.all([
    prisma.acopio.count({ where }),
    prisma.acopio.aggregate({ where, _sum: { total_sacos: true } }),
    prisma.acopio.aggregate({ where, _sum: { peso_total: true } }),
  ]);

  return {
    total_acopios: totalAcopios,
    sacos_recibidos: Number(totalSacos._sum.total_sacos || 0),
    kilogramos_acopiados: Number(pesoTotalResult._sum.peso_total || 0),
  };
};
