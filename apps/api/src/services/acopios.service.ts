import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import type { EstadoAcopio } from '@agrodata/types';

// ─── Types ──────────────────────────────────────────────────

interface AcopioFilters {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

interface AcopioDetalleInput {
  productor_id: number;
  cultivo_id: number;
  parcela_id?: number | null;
  observaciones?: string | null;
  sacos: Array<{
    codigo: string;
    peso: number;
    observaciones?: string | null;
  }>;
}

interface AcopioCreateInput {
  codigo?: string;
  fecha: string;
  acopiador: string;
  vehiculo?: string | null;
  ruta_acopio?: string | null;
  peso_bruto?: number;
  tara?: number;
  estado?: EstadoAcopio;
  observaciones?: string | null;
  detalles: AcopioDetalleInput[];
}

interface AcopioUpdateInput {
  codigo?: string;
  fecha?: string;
  acopiador?: string;
  vehiculo?: string | null;
  ruta_acopio?: string | null;
  peso_bruto?: number;
  tara?: number;
  estado?: EstadoAcopio;
  observaciones?: string | null;
  detalles?: AcopioDetalleInput[];
}

// ─── Helpers ────────────────────────────────────────────────

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

const ensureEntitiesExist = async (detalles: AcopioDetalleInput[]): Promise<void> => {
  const productorIds = [...new Set(detalles.map((d) => d.productor_id))];
  const cultivoIds = [...new Set(detalles.map((d) => d.cultivo_id))];
  const parcelaIds = [...new Set(detalles.map((d) => d.parcela_id).filter((id): id is number => id != null))];

  const [productores, cultivos, parcelas] = await Promise.all([
    prisma.productor.findMany({ where: { id: { in: productorIds } }, select: { id: true } }),
    prisma.cultivo.findMany({ where: { id: { in: cultivoIds } }, select: { id: true } }),
    parcelaIds.length > 0
      ? prisma.parcela.findMany({ where: { id: { in: parcelaIds } }, select: { id: true } })
      : Promise.resolve([]),
  ]);

  const foundProductores = new Set(productores.map((p) => p.id));
  const foundCultivos = new Set(cultivos.map((c) => c.id));
  const foundParcelas = new Set(parcelas.map((p) => p.id));

  for (const id of productorIds) {
    if (!foundProductores.has(id)) throw createError(`Productor con ID ${id} no encontrado`, 404);
  }
  for (const id of cultivoIds) {
    if (!foundCultivos.has(id)) throw createError(`Cultivo con ID ${id} no encontrado`, 404);
  }
  for (const id of parcelaIds) {
    if (!foundParcelas.has(id)) throw createError(`Parcela con ID ${id} no encontrada`, 404);
  }
};

const calcularResumenDetalles = (detalles: AcopioDetalleInput[]) => {
  let total_sacos = 0;
  let peso_total = 0;

  for (const detalle of detalles) {
    for (const saco of detalle.sacos) {
      total_sacos++;
      peso_total += saco.peso;
    }
  }

  return { total_sacos, peso_total: Math.round(peso_total * 100) / 100 };
};

const calcularPesoNeto = (pesoBruto: number, tara: number): number => {
  return Math.round((pesoBruto - tara) * 100) / 100;
};

const buildSearchWhere = (search: string) => ({
  OR: [
    { codigo: { contains: search } },
    { acopiador: { contains: search } },
    { observaciones: { contains: search } },
  ],
});

const ACOPIO_INCLUDE = {
  detalles: {
    include: {
      productor: {
        select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true },
      },
      cultivo: {
        select: { id: true, codigo: true, cultivo: true, variedad: true },
      },
      parcela: {
        select: { id: true, nombre: true, codigo: true, area: true },
      },
      sacos: {
        orderBy: { codigo: 'asc' as const },
      },
    },
    orderBy: { id: 'asc' as const },
  },
} as const;

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: AcopioFilters) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.search) Object.assign(where, buildSearchWhere(filters.search));

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.acopio.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: ACOPIO_INCLUDE,
    }),
    prisma.acopio.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const acopio = await prisma.acopio.findFirst({
    where: { id: Number(id), activo: true },
    include: ACOPIO_INCLUDE,
  });

  if (!acopio) {
    throw createError('Acopio no encontrado', 404);
  }

  return acopio;
};

export const getByCodigo = async (codigo: string) => {
  const acopio = await prisma.acopio.findFirst({
    where: { codigo, activo: true },
    include: ACOPIO_INCLUDE,
  });

  if (!acopio) {
    throw createError('Acopio no encontrado', 404);
  }

  return acopio;
};

export const create = async (data: AcopioCreateInput, userId?: string) => {
  let codigo = data.codigo || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.acopio.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  await ensureEntitiesExist(data.detalles);

  const resumen = calcularResumenDetalles(data.detalles);
  const pesoBruto = data.peso_bruto ?? resumen.peso_total;
  const tara = data.tara ?? 0;
  const pesoNeto = calcularPesoNeto(pesoBruto, tara);

  return prisma.acopio.create({
    data: {
      codigo,
      fecha: new Date(data.fecha),
      acopiador: data.acopiador,
      vehiculo: data.vehiculo || null,
      ruta_acopio: data.ruta_acopio || null,
      total_sacos: resumen.total_sacos,
      peso_total: resumen.peso_total,
      peso_bruto: pesoBruto,
      tara,
      peso_neto: pesoNeto,
      estado: (data.estado || 'EN_CAMPO') as EstadoAcopio,
      observaciones: data.observaciones || null,
      created_by: userId || null,
      detalles: {
        create: data.detalles.map((d) => ({
          productor_id: d.productor_id,
          cultivo_id: d.cultivo_id,
          parcela_id: d.parcela_id ?? null,
          observaciones: d.observaciones || null,
          total_sacos: d.sacos.length,
          peso_total: Math.round(d.sacos.reduce((sum, s) => sum + s.peso, 0) * 100) / 100,
          sacos: {
            create: d.sacos.map((s) => ({
              codigo: s.codigo,
              peso: s.peso,
              observaciones: s.observaciones || null,
            })),
          },
        })),
      },
    },
    include: ACOPIO_INCLUDE,
  });
};

export const update = async (id: string, data: AcopioUpdateInput, userId?: string) => {
  const existing = await prisma.acopio.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Acopio no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.codigo !== undefined) {
    if (data.codigo.trim()) {
      const existingCodigo = await prisma.acopio.findFirst({
        where: { codigo: data.codigo, id: { not: Number(id) } },
        select: { id: true },
      });
      if (existingCodigo) {
        throw createError(`El código ${data.codigo} ya está en uso`, 409);
      }
      updateData.codigo = data.codigo;
    }
  }
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha);
  if (data.acopiador !== undefined) updateData.acopiador = data.acopiador;
  if (data.vehiculo !== undefined) updateData.vehiculo = data.vehiculo || null;
  if (data.ruta_acopio !== undefined) updateData.ruta_acopio = data.ruta_acopio || null;
  if (data.peso_bruto !== undefined) updateData.peso_bruto = data.peso_bruto;
  if (data.tara !== undefined) updateData.tara = data.tara;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.observaciones !== undefined) updateData.observaciones = data.observaciones || null;
  if (userId) updateData.updated_by = userId;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    if (data.detalles !== undefined) {
      await ensureEntitiesExist(data.detalles);

      const resumen = calcularResumenDetalles(data.detalles);
      updateData.total_sacos = resumen.total_sacos;
      updateData.peso_total = resumen.peso_total;

      const pesoBruto = data.peso_bruto ?? existing.peso_bruto;
      const tara = data.tara ?? existing.tara;
      updateData.peso_bruto = pesoBruto;
      updateData.tara = tara;
      updateData.peso_neto = calcularPesoNeto(Number(pesoBruto), Number(tara));

      await tx.saco.deleteMany({ where: { acopio_detalle: { acopio_id: Number(id) } } });
      await tx.acopio_detalle.deleteMany({ where: { acopio_id: Number(id) } });

      if (data.detalles.length > 0) {
        for (const d of data.detalles) {
          const detalle = await tx.acopio_detalle.create({
            data: {
              acopio_id: Number(id),
              productor_id: d.productor_id,
              cultivo_id: d.cultivo_id,
              parcela_id: d.parcela_id ?? null,
              observaciones: d.observaciones || null,
              total_sacos: d.sacos.length,
              peso_total: Math.round(d.sacos.reduce((sum, s) => sum + s.peso, 0) * 100) / 100,
            },
          });

          if (d.sacos.length > 0) {
            await tx.saco.createMany({
              data: d.sacos.map((s) => ({
                acopio_detalle_id: detalle.id,
                codigo: s.codigo,
                peso: s.peso,
                observaciones: s.observaciones || null,
              })),
            });
          }
        }
      }
    } else if (data.peso_bruto !== undefined || data.tara !== undefined) {
      const pesoBruto = data.peso_bruto ?? existing.peso_bruto;
      const tara = data.tara ?? existing.tara;
      updateData.peso_bruto = pesoBruto;
      updateData.tara = tara;
      updateData.peso_neto = calcularPesoNeto(Number(pesoBruto), Number(tara));
    }

    return tx.acopio.update({
      where: { id: Number(id) },
      data: updateData,
      include: ACOPIO_INCLUDE,
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

  const [totalAcopios, totalSacos, pesoTotalResult, pesoNetoResult, porEstado] = await Promise.all([
    prisma.acopio.count({ where }),
    prisma.acopio.aggregate({ where, _sum: { total_sacos: true } }),
    prisma.acopio.aggregate({ where, _sum: { peso_total: true } }),
    prisma.acopio.aggregate({ where, _sum: { peso_neto: true } }),
    prisma.acopio.groupBy({
      by: ['estado'],
      where,
      _count: { id: true },
    }),
  ]);

  const estados: Record<EstadoAcopio, number> = {
    EN_CAMPO: 0,
    EN_TRANSITO: 0,
    RECIBIDO: 0,
  };
  for (const item of porEstado) {
    estados[item.estado as EstadoAcopio] = item._count.id;
  }

  return {
    total_acopios: totalAcopios,
    sacos_recibidos: Number(totalSacos._sum.total_sacos || 0),
    kilogramos_acopiados: Number(pesoTotalResult._sum.peso_total || 0),
    kilogramos_neto: Number(pesoNetoResult._sum.peso_neto || 0),
    por_estado: estados,
  };
};
