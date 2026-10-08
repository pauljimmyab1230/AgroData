import prisma, { type PrismaTransaction } from '../config/database';
import { createError } from '../middleware/error.middleware';

// ==================== Tipos ====================
export type OrigenKardex = 'CAMPO' | 'PROCESAMIENTO' | 'AJUSTE' | 'OTRO';
export type CategoriaKardex = 'PRODUCTO_CAMPO' | 'PRODUCTO_PROCESADO' | 'SUBPRODUCTO' | 'ENVASE';
export type TipoMovimiento = 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE' | 'BAJA';
export type EtapaProceso = 'PRIMARIA' | 'SECUNDARIA' | 'EMPAQUE';

export interface EntradaKardexInput {
  producto: string;
  categoria: CategoriaKardex;
  origen: OrigenKardex;
  etapa?: EtapaProceso | null;
  unidad?: string;
  cantidad: number;
  ubicacion?: string | null;
  costo_unitario?: number | null;
  proveedor?: string | null;
  responsable?: string | null;
  referenciaTipo: string;
  referenciaId?: number | null;
  observaciones?: string | null;
  fecha?: Date;
}

export interface SalidaKardexInput {
  kardexId: number;
  cantidad: number;
  tipo?: 'SALIDA' | 'BAJA' | 'TRANSFERENCIA';
  destino?: string | null;
  responsable?: string | null;
  referenciaTipo: string;
  referenciaId?: number | null;
  observaciones?: string | null;
  fecha?: Date;
}

// ==================== Helpers de nomenclatura ====================
/**
 * Devuelve el nombre del producto de campo para un cultivo.
 * Ej: 'Quinua' + 'f' -> 'Quinua trillada', 'Fréjol rojo' + 'm' -> 'Fréjol rojo trillado'
 */
export function nombreProductoCampo(cultivo: string, genero: 'f' | 'm'): string {
  return `${cultivo} ${genero === 'f' ? 'trillada' : 'trillado'}`;
}

/**
 * Devuelve el nombre del producto procesado para un cultivo.
 * Ej: 'Quinua' + 'f' -> 'Quinua procesada'
 */
export function nombreProductoProcesado(cultivo: string, genero: 'f' | 'm'): string {
  return `${cultivo} ${genero === 'f' ? 'procesada' : 'procesado'}`;
}

// Género gramatical de cada cultivo del sistema (para la nomenclatura)
const GENERO_CULTIVO: Record<string, 'f' | 'm'> = {
  'quinua': 'f',
  'kiwicha': 'f',
  'chia': 'f',
  'chía': 'f',
  'frejol rojo': 'm',
  'frejol negro': 'm',
  'frejol panamito': 'm',
  'frejol canario': 'm',
  'frejol': 'm',
  'avena': 'f',
  'trigo': 'm',
  'centeno': 'm',
  'garbanzo': 'm',
  'lenteja': 'f',
};

export function generoDeCultivo(cultivo: string): 'f' | 'm' {
  const clave = cultivo.toLowerCase().trim();
  return GENERO_CULTIVO[clave] ?? 'm';
}

// ==================== Nomenclatura de productos de salida ====================
/**
 * Determina el nombre del item de kardex a partir de la descripción de salida
 * de una orden de procesamiento y su tipo.
 *
 * - PRODUCTO_BUENO + etapa PRIMARIA -> '{Cultivo} procesada/o'
 * - PRODUCTO_BUENO + etapa SECUNDARIA -> el nombre ya viene en producto_salida (ej. 'Harina de quinua')
 * - MERMA -> 'Merma de procesamiento'
 * - PIEDRAS -> 'Piedras (despedrado)'
 * - SAPONINA -> 'Saponina (desaponificado)'
 * - ENVASE -> el nombre ya viene en descripcion
 * - OTRO -> el nombre ya viene en descripcion
 */
export function resolverNombreSalida(
  tipoSalida: string,
  descripcion: string,
  productoSalidaOrden: string,
  etapa: EtapaProceso,
  cultivoBase?: string,
): string {
  switch (tipoSalida) {
    case 'PRODUCTO_BUENO': {
      if (etapa === 'PRIMARIA' && cultivoBase) {
        return nombreProductoProcesado(cultivoBase, generoDeCultivo(cultivoBase));
      }
      return productoSalidaOrden || descripcion;
    }
    case 'MERMA':
      return 'Merma de procesamiento';
    case 'PIEDRAS':
      return 'Piedras (despedrado)';
    case 'SAPONINA':
      return 'Saponina (desaponificado)';
    default:
      return descripcion;
  }
}

export function categoriaDeSalida(tipoSalida: string): CategoriaKardex {
  switch (tipoSalida) {
    case 'PRODUCTO_BUENO':
      return 'PRODUCTO_PROCESADO';
    case 'MERMA':
    case 'PIEDRAS':
    case 'SAPONINA':
    case 'OTRO':
      return 'SUBPRODUCTO';
    case 'ENVASE':
      return 'ENVASE';
    default:
      return 'SUBPRODUCTO';
  }
}

// ==================== Operaciones core ====================

/**
 * Crea o actualiza un item de kardex y registra un movimiento ENTRADA.
 * Si el producto ya existe (por nombre), incrementa su saldo.
 */
export async function registrarEntrada(
  input: EntradaKardexInput,
  tx?: PrismaTransaction,
): Promise<{ kardexId: number; saldoAnterior: number; saldoPosterior: number }> {
  const db = tx ?? prisma;

  // Buscar item existente por nombre de producto
  let item = await db.kardex.findFirst({
    where: { producto: input.producto, activo: true },
    orderBy: { created_at: 'desc' },
  });

  if (item) {
    // Incrementar saldo del item existente
    const saldoAnterior = Number(item.cantidad_actual);
    const saldoPosterior = saldoAnterior + input.cantidad;
    await db.kardex.update({
      where: { id: item.id },
      data: {
        cantidad_actual: saldoPosterior,
        estado: saldoPosterior > 0 ? 'DISPONIBLE' : item.estado,
      },
    });
    await db.kardex_movimiento.create({
      data: {
        kardex_id: item.id,
        tipo: 'ENTRADA',
        cantidad: input.cantidad,
        saldo_anterior: saldoAnterior,
        saldo_posterior: saldoPosterior,
        origen: input.origen,
        referencia_tipo: input.referenciaTipo,
        referencia_id: input.referenciaId ?? null,
        responsable: input.responsable ?? null,
        observaciones: input.observaciones ?? null,
        fecha: input.fecha ?? new Date(),
      },
    });
    return { kardexId: item.id, saldoAnterior, saldoPosterior };
  }

  // Crear item nuevo
  const codigo = await generarCodigoKardex(db);
  item = await db.kardex.create({
    data: {
      codigo,
      producto: input.producto,
      categoria: input.categoria,
      origen: input.origen,
      etapa: input.etapa ?? null,
      unidad: input.unidad ?? 'KG',
      cantidad_actual: input.cantidad,
      ubicacion: input.ubicacion ?? 'Almacén de producto',
      costo_unitario: input.costo_unitario ?? null,
      proveedor: input.proveedor ?? null,
      estado: input.cantidad > 0 ? 'DISPONIBLE' : 'CONSUMIDO',
      fecha_ingreso: input.fecha ?? new Date(),
      observaciones: input.observaciones ?? null,
    },
  });

  await db.kardex_movimiento.create({
    data: {
      kardex_id: item.id,
      tipo: 'ENTRADA',
      cantidad: input.cantidad,
      saldo_anterior: 0,
      saldo_posterior: input.cantidad,
      origen: input.origen,
      referencia_tipo: input.referenciaTipo,
      referencia_id: input.referenciaId ?? null,
      responsable: input.responsable ?? null,
      observaciones: input.observaciones ?? null,
      fecha: input.fecha ?? new Date(),
    },
  });

  return { kardexId: item.id, saldoAnterior: 0, saldoPosterior: input.cantidad };
}

/**
 * Registra una SALIDA o BAJA en un item de kardex existente.
 * Valida que el saldo sea suficiente (excepto en BAJA, que puede dejar el saldo en 0).
 */
export async function registrarSalida(
  input: SalidaKardexInput,
  tx?: PrismaTransaction,
): Promise<{ kardexId: number; saldoAnterior: number; saldoPosterior: number }> {
  const db = tx ?? prisma;

  const item = await db.kardex.findFirst({
    where: { id: input.kardexId, activo: true },
  });
  if (!item) throw createError('Item de kardex no encontrado', 404);

  const saldoAnterior = Number(item.cantidad_actual);
  const tipo = input.tipo ?? 'SALIDA';

  // En SALIDA/TRANSFERENCIA el saldo no puede quedar negativo
  if (tipo !== 'BAJA' && saldoAnterior < input.cantidad) {
    throw createError(
      `Saldo insuficiente para ${item.producto}: disponible ${saldoAnterior}, solicitado ${input.cantidad}`,
      422,
    );
  }

  const saldoPosterior = tipo === 'BAJA'
    ? Math.max(0, saldoAnterior - input.cantidad)
    : saldoAnterior - input.cantidad;

  await db.kardex.update({
    where: { id: item.id },
    data: {
      cantidad_actual: saldoPosterior,
      estado: saldoPosterior <= 0 ? 'CONSUMIDO' : item.estado,
    },
  });

  await db.kardex_movimiento.create({
    data: {
      kardex_id: item.id,
      tipo,
      cantidad: input.cantidad,
      saldo_anterior: saldoAnterior,
      saldo_posterior: saldoPosterior,
      origen: item.origen,
      destino: input.destino ?? null,
      referencia_tipo: input.referenciaTipo,
      referencia_id: input.referenciaId ?? null,
      responsable: input.responsable ?? null,
      observaciones: input.observaciones ?? null,
      fecha: input.fecha ?? new Date(),
    },
  });

  return { kardexId: item.id, saldoAnterior, saldoPosterior };
}

/**
 * Da de baja un item de kardex (merma, sacos dañados, producto vencido).
 * El saldo se reduce a la cantidad indicada (o a 0 si no se indica).
 */
export async function darDeBaja(
  kardexId: number,
  motivo: string,
  cantidad?: number,
  responsable?: string,
  tx?: PrismaTransaction,
): Promise<{ kardexId: number; saldoAnterior: number; saldoPosterior: number }> {
  const db = tx ?? prisma;

  const item = await db.kardex.findFirst({
    where: { id: kardexId, activo: true },
  });
  if (!item) throw createError('Item de kardex no encontrado', 404);

  const saldoAnterior = Number(item.cantidad_actual);
  const aBajar = cantidad ?? saldoAnterior; // si no se indica cantidad, se da de baja todo

  if (aBajar > saldoAnterior) {
    throw createError(
      `No se puede dar de baja más de lo disponible: ${saldoAnterior} ${item.unidad}`,
      422,
    );
  }

  const saldoPosterior = saldoAnterior - aBajar;

  await db.kardex.update({
    where: { id: item.id },
    data: {
      cantidad_actual: saldoPosterior,
      estado: saldoPosterior <= 0 ? 'CONSUMIDO' : item.estado,
    },
  });

  await db.kardex_movimiento.create({
    data: {
      kardex_id: item.id,
      tipo: 'BAJA',
      cantidad: aBajar,
      saldo_anterior: saldoAnterior,
      saldo_posterior: saldoPosterior,
      origen: item.origen,
      destino: 'BAJA',
      referencia_tipo: 'BAJA',
      responsable: responsable ?? null,
      observaciones: motivo,
      fecha: new Date(),
    },
  });

  return { kardexId: item.id, saldoAnterior, saldoPosterior };
}

// ==================== Integración: Recepción → Kardex ====================

/**
 * Al registrar o aceptar una recepción, el producto de campo entra al kardex.
 * El nombre se deriva del cultivo: '{Cultivo} trillada/o'
 */
export async function ingresoPorRecepcion(
  recepcionId: number,
  datos: {
    cultivo: string;
    pesoNeto: number;
    loteProductor?: string | null;
    planta?: string;
    responsable?: string;
  },
  tx?: PrismaTransaction,
): Promise<{ kardexId: number; saldoAnterior: number; saldoPosterior: number }> {
  const genero = generoDeCultivo(datos.cultivo);
  const producto = nombreProductoCampo(datos.cultivo, genero);

  return registrarEntrada(
    {
      producto,
      categoria: 'PRODUCTO_CAMPO',
      origen: 'CAMPO',
      etapa: 'PRIMARIA',
      unidad: 'KG',
      cantidad: datos.pesoNeto,
      ubicacion: datos.planta ?? 'Almacén de producto',
      responsable: datos.responsable ?? null,
      referenciaTipo: 'RECEPCION',
      referenciaId: recepcionId,
      observaciones: datos.loteProductor
        ? `Ingreso de ${producto} (lote ${datos.loteProductor})`
        : `Ingreso de ${producto} por recepción`,
    },
    tx,
  );
}

// ==================== Integración: Orden finalizada → Kardex ====================

/**
 * Al finalizar una orden de procesamiento, cada salida pesada entra al kardex.
 * - PRODUCTO_BUENO → categoría PRODUCTO_PROCESADO
 * - MERMA/PIEDRAS/SAPONINA/OTRO → categoría SUBPRODUCTO
 * - ENVASE → categoría ENVASE
 */
export async function ingresosPorOrden(
  ordenId: number,
  datos: {
    productoSalida: string;
    etapa: EtapaProceso;
    cultivoBase?: string;
    planta?: string;
    responsable?: string;
  },
  salidas: Array<{
    tipo_salida: string;
    descripcion: string;
    cantidad: number;
    unidad?: string;
    destino?: string;
    cuenta_en_balance?: boolean;
  }>,
  tx?: PrismaTransaction,
): Promise<Array<{ kardexId: number; producto: string; cantidad: number; saldoPosterior: number }>> {
  const resultados: Array<{ kardexId: number; producto: string; cantidad: number; saldoPosterior: number }> = [];

  for (const salida of salidas) {
    // Solo entran al kardex las salidas con destino KARDEX o SUBPRODUCTO
    if (salida.destino && salida.destino !== 'KARDEX' && salida.destino !== 'SUBPRODUCTO') continue;

    const nombre = resolverNombreSalida(
      salida.tipo_salida,
      salida.descripcion,
      datos.productoSalida,
      datos.etapa,
      datos.cultivoBase,
    );
    const categoria = categoriaDeSalida(salida.tipo_salida);

    const resultado = await registrarEntrada(
      {
        producto: nombre,
        categoria,
        origen: 'PROCESAMIENTO',
        etapa: datos.etapa,
        unidad: salida.unidad ?? 'KG',
        cantidad: salida.cantidad,
        ubicacion: datos.planta ?? 'Almacén de producto',
        responsable: datos.responsable ?? null,
        referenciaTipo: 'ORDEN_PROCESAMIENTO',
        referenciaId: ordenId,
        observaciones: `Salida de orden de procesamiento (${salida.tipo_salida})`,
      },
      tx,
    );

    resultados.push({
      kardexId: resultado.kardexId,
      producto: nombre,
      cantidad: salida.cantidad,
      saldoPosterior: resultado.saldoPosterior,
    });
  }

  return resultados;
}

// ==================== Utilidades ====================

async function generarCodigoKardex(db: PrismaTransaction | typeof prisma): Promise<string> {
  const year = new Date().getFullYear();
  const last = await db.kardex.findFirst({
    where: { codigo: { startsWith: 'KAR-' } },
    orderBy: { created_at: 'desc' },
    select: { codigo: true },
  });
  if (!last) return 'KAR-0001';
  const num = parseInt(last.codigo.replace('KAR-', ''), 10) + 1;
  return `KAR-${String(num).padStart(4, '0')}`;
}
