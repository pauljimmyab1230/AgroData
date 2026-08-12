import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.acopios.findFirst({
    where: { codigo: { startsWith: `ACO-${year}-` } },
    orderBy: { created_at: 'desc' },
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
    const exists = await prisma.acopios.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const parts = current.split('-');
    const num = parseInt(parts.pop() || '0', 10) + 1;
    current = `${parts.join('-')}-${String(num).padStart(2, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const calcularResumenSacos = (sacos: Array<{ peso: number }>) => {
  if (sacos.length === 0) {
    return { total_sacos: 0, peso_total: 0, peso_promedio: 0, peso_maximo: 0, peso_minimo: 0 };
  }
  const pesos = sacos.map(s => s.peso);
  const peso_total = pesos.reduce((a, b) => a + b, 0);
  return {
    total_sacos: sacos.length,
    peso_total,
    peso_promedio: peso_total / sacos.length,
    peso_maximo: Math.max(...pesos),
    peso_minimo: Math.min(...pesos),
  };
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  campania_id?: string;
  productor_id?: string;
  comunidad?: string;
  acopiador?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.campania_id) where.campania_id = filters.campania_id;
  if (filters.productor_id) where.productor_id = filters.productor_id;
  if (filters.acopiador) where.acopiador = { contains: filters.acopiador };

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { acopiador: { contains: filters.search } },
      { lote_productor: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
      { productor: { nombres: { contains: filters.search } } },
      { productor: { apellido_paterno: { contains: filters.search } } },
      { parcela: { comunidad: { contains: filters.search } } },
    ];
  }

  if (filters.comunidad) {
    where.parcela = { comunidad: { contains: filters.comunidad } };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.acopios.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        campania: { select: { id: true, codigo: true, nombre: true } },
        productor: { select: { id: true, codigo: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
        parcela: { select: { id: true, codigo: true, nombre: true, comunidad: true } },
        cultivo: { select: { id: true, codigo: true, cultivo: true, variedad: true } },
        sacos: true,
        fotos: true,
      },
    }),
    prisma.acopios.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const acopio = await prisma.acopios.findFirst({
    where: { id, activo: true },
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      productor: { select: { id: true, codigo: true, nombres: true, apellido_paterno: true, apellido_materno: true, comunidad: true } },
      parcela: { select: { id: true, codigo: true, nombre: true, comunidad: true, sector: true } },
      cultivo: { select: { id: true, codigo: true, cultivo: true, variedad: true } },
      sacos: { orderBy: { codigo: 'asc' } },
      fotos: true,
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
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.acopios.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const sacosData = (data.sacos as Array<Record<string, unknown>>) || [];
  const fotosData = (data.fotos as Array<Record<string, unknown>>) || [];

  const resumen = calcularResumenSacos(sacosData.map(s => ({ peso: Number(s.peso) })));

  return prisma.acopios.create({
    data: {
      codigo,
      campania_id: data.campania_id as string,
      productor_id: data.productor_id as string,
      parcela_id: data.parcela_id as string,
      cultivo_id: (data.cultivo_id as string) || null,
      fecha: new Date(data.fecha as string),
      acopiador: data.acopiador as string,
      vehiculo: (data.vehiculo as string) || null,
      ruta_acopio: (data.ruta_acopio as string) || null,
      lote_productor: (data.lote_productor as string) || null,
      total_sacos: resumen.total_sacos,
      peso_total: resumen.peso_total,
      peso_promedio: resumen.peso_promedio,
      peso_maximo: resumen.peso_maximo,
      peso_minimo: resumen.peso_minimo,
      estado: (data.estado as 'EN_PROCESO' | 'COMPLETADO' | 'EN_PLANTA') || 'EN_PROCESO',
      estado_producto: (data.estado_producto as 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'RECHAZADO') || null,
      humedad: data.humedad != null ? Number(data.humedad) : null,
      impurezas: data.impurezas != null ? Number(data.impurezas) : null,
      observaciones_calidad: (data.observaciones_calidad as string) || null,
      firma_productor_url: (data.firma_productor_url as string) || null,
      firma_acopiador_url: (data.firma_acopiador_url as string) || null,
      observaciones: (data.observaciones as string) || null,
      created_by: userId || null,
      sacos: {
        create: sacosData.map(s => ({
          codigo: s.codigo as string,
          peso: Number(s.peso),
          observaciones: (s.observaciones as string) || null,
        })),
      },
      fotos: {
        create: fotosData.map(f => ({
          nombre: f.nombre as string,
          descripcion: (f.descripcion as string) || null,
          ruta_archivo: (f.ruta_archivo as string) || null,
        })),
      },
    },
    include: {
      sacos: true,
      fotos: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.acopios.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Acopio no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'acopiador', 'vehiculo', 'ruta_acopio', 'lote_productor'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const nullableFields = ['cultivo_id', 'observaciones_calidad', 'firma_productor_url', 'firma_acopiador_url', 'observaciones'];
  for (const field of nullableFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.campania_id !== undefined) updateData.campania_id = data.campania_id;
  if (data.productor_id !== undefined) updateData.productor_id = data.productor_id;
  if (data.parcela_id !== undefined) updateData.parcela_id = data.parcela_id;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.estado_producto !== undefined) updateData.estado_producto = data.estado_producto;
  if (data.humedad !== undefined) updateData.humedad = data.humedad != null ? Number(data.humedad) : null;
  if (data.impurezas !== undefined) updateData.impurezas = data.impurezas != null ? Number(data.impurezas) : null;

  if (userId) updateData.updated_by = userId;

  // Si vienen sacos, recalcular resumen
  if (data.sacos !== undefined) {
    const sacosData = data.sacos as Array<Record<string, unknown>>;
    const resumen = calcularResumenSacos(sacosData.map(s => ({ peso: Number(s.peso) })));
    updateData.total_sacos = resumen.total_sacos;
    updateData.peso_total = resumen.peso_total;
    updateData.peso_promedio = resumen.peso_promedio;
    updateData.peso_maximo = resumen.peso_maximo;
    updateData.peso_minimo = resumen.peso_minimo;

    // Eliminar sacos existentes y crear nuevos
    await prisma.acopio_sacos.deleteMany({ where: { acopio_id: id } });
    if (sacosData.length > 0) {
      await prisma.acopio_sacos.createMany({
        data: sacosData.map(s => ({
          acopio_id: id,
          codigo: s.codigo as string,
          peso: Number(s.peso),
          observaciones: (s.observaciones as string) || null,
        })),
      });
    }
  }

  // Si vienen fotos, reemplazar
  if (data.fotos !== undefined) {
    const fotosData = data.fotos as Array<Record<string, unknown>>;
    await prisma.acopio_fotos.deleteMany({ where: { acopio_id: id } });
    if (fotosData.length > 0) {
      await prisma.acopio_fotos.createMany({
        data: fotosData.map(f => ({
          acopio_id: id,
          nombre: f.nombre as string,
          descripcion: (f.descripcion as string) || null,
          ruta_archivo: (f.ruta_archivo as string) || null,
        })),
      });
    }
  }

  return prisma.acopios.update({
    where: { id },
    data: updateData,
    include: {
      sacos: true,
      fotos: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.acopios.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Acopio no encontrado', 404);
  }

  await prisma.acopios.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Acopio eliminado exitosamente' };
};

export const getStats = async (campania_id?: string) => {
  const where: Record<string, unknown> = { activo: true };
  if (campania_id) where.campania_id = campania_id;

  const [totalAcopios, totalProductores, totalSacos, pesoTotalResult] = await Promise.all([
    prisma.acopios.count({ where }),
    prisma.acopios.findMany({
      where,
      select: { productor_id: true },
      distinct: ['productor_id'],
    }),
    prisma.acopios.aggregate({ where, _sum: { total_sacos: true } }),
    prisma.acopios.aggregate({ where, _sum: { peso_total: true } }),
  ]);

  return {
    total_acopios: totalAcopios,
    productores_atendidos: totalProductores.length,
    sacos_recibidos: Number(totalSacos._sum.total_sacos || 0),
    kilogramos_acopiados: Number(pesoTotalResult._sum.peso_total || 0),
  };
};
