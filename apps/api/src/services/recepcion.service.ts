import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';
import type {
  RecepcionCreateInput,
  RecepcionUpdateInput,
  RecepcionFilters,
  RecepcionResponse,
} from '../types/recepciones.types';

// ─── Helpers ──────────────────────────────────────────────

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

const ensureAcopioExists = async (id: number): Promise<void> => {
  const exists = await prisma.acopio.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw createError(`Acopio con ID ${id} no encontrado`, 404);
};

const calcularPesoTotalSacos = (sacos: Array<{ peso: number }>): number => {
  return Math.round(sacos.reduce((sum, s) => sum + s.peso, 0) * 100) / 100;
};

const calcularPesoNeto = (pesoBruto: number | null, tara: number | null): number | null => {
  if (pesoBruto == null || tara == null) return null;
  return Math.round((pesoBruto - tara) * 100) / 100;
};

const calcularDiferencia = (pesoCampo: number | null, pesoNeto: number | null): number | null => {
  if (pesoCampo == null || pesoNeto == null) return null;
  return Math.round((pesoCampo - pesoNeto) * 100) / 100;
};

const calcularMerma = (diferencia: number | null, pesoCampo: number | null): number | null => {
  if (diferencia == null || pesoCampo == null || pesoCampo === 0) return null;
  return Math.round((diferencia / pesoCampo) * 100 * 100) / 100;
};

const RECEPCION_INCLUDE = {
  acopio: {
    select: { id: true, codigo: true },
  },
  sacos_detalle: {
    orderBy: { id: 'asc' as const },
    select: { id: true, codigo: true, peso: true, observaciones: true },
  },
} as const;

const buildSearchWhere = (search: string) => ({
  OR: [
    { codigo: { contains: search } },
    { lote_productor: { contains: search } },
    { responsable: { contains: search } },
    { planta: { contains: search } },
    { observaciones: { contains: search } },
  ],
});

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: RecepcionFilters) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.search) Object.assign(where, buildSearchWhere(filters.search));

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.recepcion.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: RECEPCION_INCLUDE,
    }),
    prisma.recepcion.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string): Promise<RecepcionResponse> => {
  const recepcion = await prisma.recepcion.findFirst({
    where: { id: Number(id), activo: true },
    include: RECEPCION_INCLUDE,
  });

  if (!recepcion) {
    throw createError('Recepción no encontrada', 404);
  }

  return recepcion as unknown as RecepcionResponse;
};

export const create = async (data: RecepcionCreateInput, userId?: string) => {
  // Validate acopio exists
  await ensureAcopioExists(data.acopio_id);

  // Generate or validate codigo
  let codigo = '';
  codigo = await ensureUniqueCodigo(await generateCodigo());

  const sacosData = data.sacos_detalle || [];
  const pesoTotalSacos = sacosData.length > 0 ? calcularPesoTotalSacos(sacosData) : null;

  // Auto-compute peso fields
  const pesoBruto = data.peso_bruto != null ? Number(data.peso_bruto) : null;
  const tara = data.tara != null ? Number(data.tara) : null;
  const pesoNeto = data.peso_neto ?? calcularPesoNeto(pesoBruto, tara);
  const pesoCampo = data.peso_campo != null ? Number(data.peso_campo) : null;
  const diferencia = data.diferencia ?? calcularDiferencia(pesoCampo, pesoNeto);
  const merma = data.merma ?? calcularMerma(diferencia, pesoCampo);

  return prisma.recepcion.create({
    data: {
      codigo,
      acopio_id: data.acopio_id,
      lote_productor: data.lote_productor || null,
      fecha: new Date(data.fecha),
      responsable: data.responsable,
      planta: data.planta,
      sacos: data.sacos ?? sacosData.length,
      peso_campo: pesoCampo,
      peso_bruto: pesoBruto,
      tara: tara,
      peso_neto: pesoNeto,
      diferencia,
      merma,
      humedad: data.humedad != null ? Number(data.humedad) : null,
      impurezas: data.impurezas != null ? Number(data.impurezas) : null,
      materia_extrana: data.materia_extrana != null ? Number(data.materia_extrana) : null,
      color: data.color || null,
      olor: data.olor || null,
      presencia_insectos: data.presencia_insectos || null,
      estado_producto: data.estado_producto || null,
      categoria: data.categoria || null,
      destino: data.destino || null,
      resultado: data.resultado || null,
      motivo: data.motivo || null,
      observaciones: data.observaciones || null,
      documento_firmado: data.documento_firmado ?? false,
      firma_responsable_url: data.firma_responsable_url || null,
      estado: data.estado || 'PENDIENTE_PESAJE',
      created_by: userId || null,
      sacos_detalle: sacosData.length > 0 ? {
        create: sacosData.map(s => ({
          codigo: s.codigo,
          peso: Number(s.peso),
          observaciones: s.observaciones || null,
        })),
      } : undefined,
    },
    include: RECEPCION_INCLUDE,
  });
};

export const update = async (id: string, data: RecepcionUpdateInput, userId?: string) => {
  const existing = await prisma.recepcion.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  // Validate acopio if changing
  if (data.acopio_id !== undefined && data.acopio_id !== null) {
    await ensureAcopioExists(data.acopio_id);
  }

  const updateData: Record<string, unknown> = {};

  if (data.acopio_id !== undefined) updateData.acopio_id = data.acopio_id;
  if (data.lote_productor !== undefined) updateData.lote_productor = data.lote_productor || null;
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha);
  if (data.responsable !== undefined) updateData.responsable = data.responsable;
  if (data.planta !== undefined) updateData.planta = data.planta;
  if (data.sacos !== undefined) updateData.sacos = data.sacos;

  // Auto-compute peso fields on update
  const pesoBruto = data.peso_bruto !== undefined ? (data.peso_bruto != null ? Number(data.peso_bruto) : null) : (existing.peso_bruto != null ? Number(existing.peso_bruto) : null);
  const tara = data.tara !== undefined ? (data.tara != null ? Number(data.tara) : null) : (existing.tara != null ? Number(existing.tara) : null);
  const pesoNeto = data.peso_neto ?? calcularPesoNeto(pesoBruto, tara);
  const pesoCampo = data.peso_campo !== undefined ? (data.peso_campo != null ? Number(data.peso_campo) : null) : (existing.peso_campo != null ? Number(existing.peso_campo) : null);
  const diferencia = data.diferencia ?? calcularDiferencia(pesoCampo, pesoNeto);
  const merma = data.merma ?? calcularMerma(diferencia, pesoCampo);

  if (data.peso_campo !== undefined) updateData.peso_campo = pesoCampo;
  if (data.peso_bruto !== undefined) updateData.peso_bruto = pesoBruto;
  if (data.tara !== undefined) updateData.tara = tara;
  if (data.peso_neto !== undefined) updateData.peso_neto = pesoNeto;
  if (data.diferencia !== undefined) updateData.diferencia = diferencia;
  if (data.merma !== undefined) updateData.merma = merma;

  if (data.humedad !== undefined) updateData.humedad = data.humedad != null ? Number(data.humedad) : null;
  if (data.impurezas !== undefined) updateData.impurezas = data.impurezas != null ? Number(data.impurezas) : null;
  if (data.materia_extrana !== undefined) updateData.materia_extrana = data.materia_extrana != null ? Number(data.materia_extrana) : null;
  if (data.color !== undefined) updateData.color = data.color || null;
  if (data.olor !== undefined) updateData.olor = data.olor || null;
  if (data.presencia_insectos !== undefined) updateData.presencia_insectos = data.presencia_insectos || null;
  if (data.estado_producto !== undefined) updateData.estado_producto = data.estado_producto || null;
  if (data.categoria !== undefined) updateData.categoria = data.categoria || null;
  if (data.destino !== undefined) updateData.destino = data.destino || null;
  if (data.resultado !== undefined) updateData.resultado = data.resultado || null;
  if (data.motivo !== undefined) updateData.motivo = data.motivo || null;
  if (data.observaciones !== undefined) updateData.observaciones = data.observaciones || null;
  if (data.documento_firmado !== undefined) updateData.documento_firmado = data.documento_firmado;
  if (data.firma_responsable_url !== undefined) updateData.firma_responsable_url = data.firma_responsable_url || null;
  if (data.estado !== undefined) updateData.estado = data.estado;

  if (userId) updateData.updated_by = userId;

  const sacosData = data.sacos_detalle;

  return prisma.$transaction(async (tx: PrismaTransaction) => {
    // Replace sacos if provided
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
      include: RECEPCION_INCLUDE,
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
