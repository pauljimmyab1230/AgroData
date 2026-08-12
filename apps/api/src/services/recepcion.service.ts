import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.recepciones.findFirst({
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
    const exists = await prisma.recepciones.findUnique({ where: { codigo: current }, select: { id: true } });
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
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { lote_productor: { contains: filters.search } },
      { responsable: { contains: filters.search } },
      { planta: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
      { campania: { nombre: { contains: filters.search } } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.recepciones.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        campania: { select: { id: true, codigo: true, nombre: true } },
        acopio: { select: { id: true, codigo: true } },
        evidencias: true,
      },
    }),
    prisma.recepciones.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const recepcion = await prisma.recepciones.findFirst({
    where: { id, activo: true },
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      acopio: { select: { id: true, codigo: true } },
      evidencias: true,
      historial: { orderBy: { created_at: 'desc' } },
    },
  });

  if (!recepcion) {
    throw createError('Recepción no encontrada', 404);
  }

  return recepcion;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.recepciones.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const evidenciasData = (data.evidencias as Array<Record<string, unknown>>) || [];

  return prisma.recepciones.create({
    data: {
      codigo,
      campania_id: data.campania_id as string,
      acopio_id: (data.acopio_id as string) || null,
      lote_productor: data.lote_productor as string,
      fecha: new Date(data.fecha as string),
      responsable: data.responsable as string,
      planta: data.planta as string,
      sacos: (data.sacos as number) || 0,
      peso_campo: data.peso_campo != null ? Number(data.peso_campo) : null,
      peso_bruto: data.peso_bruto != null ? Number(data.peso_bruto) : null,
      tara: data.tara != null ? Number(data.tara) : null,
      peso_neto: data.peso_neto != null ? Number(data.peso_neto) : null,
      diferencia: data.diferencia != null ? Number(data.diferencia) : null,
      merma: data.merma != null ? Number(data.merma) : null,
      humedad: data.humedad != null ? Number(data.humedad) : null,
      impurezas: data.impurezas != null ? Number(data.impurezas) : null,
      materia_extrana: data.materia_extrana != null ? Number(data.materia_extrana) : null,
      color: (data.color as string) || null,
      olor: (data.olor as string) || null,
      presencia_insectos: (data.presencia_insectos as string) || null,
      estado_producto: (data.estado_producto as 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'RECHAZADO') || null,
      categoria: (data.categoria as 'PRIMERA' | 'SEGUNDA' | 'INDUSTRIAL' | 'DESCARTE') || null,
      destino: (data.destino as 'PROCESAMIENTO' | 'ALMACEN_TEMPORAL' | 'RECHAZADO') || null,
      resultado: (data.resultado as 'ACEPTADO' | 'ACEPTADO_CON_OBSERVACIONES' | 'RECHAZADO') || null,
      motivo: (data.motivo as string) || null,
      estado: (data.estado as 'PENDIENTE_PESAJE' | 'EN_CONTROL_CALIDAD' | 'DISPONIBLE' | 'RECHAZADA') || 'PENDIENTE_PESAJE',
      observaciones: (data.observaciones as string) || null,
      documento_firmado: (data.documento_firmado as boolean) || false,
      firma_responsable_url: (data.firma_responsable_url as string) || null,
      created_by: userId || null,
      evidencias: {
        create: evidenciasData.map(e => ({
          nombre: e.nombre as string,
          descripcion: (e.descripcion as string) || null,
          ruta_archivo: (e.ruta_archivo as string) || null,
        })),
      },
    },
    include: {
      evidencias: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.recepciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['lote_productor', 'responsable', 'planta', 'color', 'olor', 'presencia_insectos', 'motivo', 'observaciones', 'firma_responsable_url'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.campania_id !== undefined) updateData.campania_id = data.campania_id;
  if (data.acopio_id !== undefined) updateData.acopio_id = data.acopio_id || null;
  if (data.sacos !== undefined) updateData.sacos = data.sacos;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.estado_producto !== undefined) updateData.estado_producto = data.estado_producto || null;
  if (data.categoria !== undefined) updateData.categoria = data.categoria || null;
  if (data.destino !== undefined) updateData.destino = data.destino || null;
  if (data.resultado !== undefined) updateData.resultado = data.resultado || null;
  if (data.documento_firmado !== undefined) updateData.documento_firmado = data.documento_firmado;

  const decimalFields = ['peso_campo', 'peso_bruto', 'tara', 'peso_neto', 'diferencia', 'merma', 'humedad', 'impurezas', 'materia_extrana'];
  for (const field of decimalFields) {
    if (data[field] !== undefined) updateData[field] = data[field] != null ? Number(data[field]) : null;
  }

  if (userId) updateData.updated_by = userId;

  return prisma.recepciones.update({
    where: { id },
    data: updateData,
    include: {
      evidencias: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.recepciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  await prisma.recepciones.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Recepción eliminada exitosamente' };
};

export const addEvidencia = async (id: string, data: Record<string, unknown>) => {
  const existing = await prisma.recepciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  return prisma.recepcion_evidencias.create({
    data: {
      recepcion_id: id,
      nombre: data.nombre as string,
      descripcion: (data.descripcion as string) || null,
      ruta_archivo: (data.ruta_archivo as string) || null,
    },
  });
};

export const removeEvidencia = async (id: string, evidenciaId: string) => {
  const existing = await prisma.recepciones.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Recepción no encontrada', 404);
  }

  const evidencia = await prisma.recepcion_evidencias.findFirst({
    where: { id: evidenciaId, recepcion_id: id },
  });

  if (!evidencia) {
    throw createError('Evidencia no encontrada', 404);
  }

  await prisma.recepcion_evidencias.delete({
    where: { id: evidenciaId },
  });

  return { message: 'Evidencia eliminada exitosamente' };
};
