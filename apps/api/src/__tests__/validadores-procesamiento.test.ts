import { describe, it, expect } from 'vitest';
import {
  createOperacionSchema,
  createRecetaSchema,
  createOrdenSchema,
  createSalidaSchema,
  createOperacionEjecutadaSchema,
} from '../validators/ordenes.validator';

describe('validadores de procesamiento', () => {
  describe('createOperacionSchema', () => {
    it('acepta una operación válida', () => {
      const { error, value } = createOperacionSchema.validate({
        codigo: 'OP-LAV',
        nombre: 'Lavado',
        descripcion: 'Lavado del grano',
      });
      expect(error).toBeUndefined();
      expect(value.orden).toBe(0);
      expect(value.activo).toBe(true);
    });

    it('rechaza sin código', () => {
      const { error } = createOperacionSchema.validate({ nombre: 'Lavado' });
      expect(error).toBeDefined();
    });
  });

  describe('createRecetaSchema', () => {
    it('acepta una receta con operaciones', () => {
      const { error, value } = createRecetaSchema.validate({
        codigo: 'REC-QUI-PRI',
        nombre: 'Quinua primaria',
        producto_base: 'Quinua',
        etapa: 'PRIMARIA',
        formato_salida: 'GRANO',
        operaciones: [
          { operacion_id: 1, orden: 1, requerida: true },
          { operacion_id: 2, orden: 2, requerida: true },
        ],
      });
      expect(error).toBeUndefined();
      expect(value.operaciones).toHaveLength(2);
    });

    it('rechaza una etapa inválida', () => {
      const { error } = createRecetaSchema.validate({
        codigo: 'REC-X',
        nombre: 'X',
        producto_base: 'Y',
        etapa: 'INVALIDA',
      });
      expect(error).toBeDefined();
    });

    it('acepta receta sin operaciones (se crearán manualmente)', () => {
      const { error, value } = createRecetaSchema.validate({
        codigo: 'REC-TEST',
        nombre: 'Test',
        producto_base: 'Quinua',
        etapa: 'PRIMARIA',
      });
      expect(error).toBeUndefined();
      expect(value.operaciones).toEqual([]);
    });
  });

  describe('createOrdenSchema', () => {
    it('acepta una orden válida', () => {
      const { error } = createOrdenSchema.validate({
        planta: 'Planta San Juan',
        responsable: 'Ing. Carlos Mendoza',
        fecha_inicio: '2025-08-15',
        etapa: 'PRIMARIA',
        producto_salida: 'Quinua beneficiada',
        peso_entrada: 1000,
      });
      expect(error).toBeUndefined();
    });

    it('asigna formato GRANO por defecto', () => {
      const { value } = createOrdenSchema.validate({
        planta: 'Planta San Juan',
        responsable: 'Ing. Carlos Mendoza',
        fecha_inicio: '2025-08-15',
        etapa: 'PRIMARIA',
        producto_salida: 'Quinua beneficiada',
      });
      expect(value.formato_salida).toBe('GRANO');
    });

    it('rechaza sin producto de salida', () => {
      const { error } = createOrdenSchema.validate({
        planta: 'Planta San Juan',
        responsable: 'Ing. Carlos Mendoza',
        fecha_inicio: '2025-08-15',
        etapa: 'PRIMARIA',
      });
      expect(error).toBeDefined();
    });

    it('acepta recepciones de origen con cantidad asignada', () => {
      const { error, value } = createOrdenSchema.validate({
        planta: 'Planta San Juan',
        responsable: 'Ing. Carlos Mendoza',
        fecha_inicio: '2025-08-15',
        etapa: 'PRIMARIA',
        producto_salida: 'Quinua beneficiada',
        recepciones: [{ recepcion_id: 1, cantidad_asignada: 500 }],
      });
      expect(error).toBeUndefined();
      expect(value.recepciones).toHaveLength(1);
    });

    it('rechaza cantidad asignada negativa', () => {
      const { error } = createOrdenSchema.validate({
        planta: 'Planta San Juan',
        responsable: 'Ing. Carlos Mendoza',
        fecha_inicio: '2025-08-15',
        etapa: 'PRIMARIA',
        producto_salida: 'Quinua beneficiada',
        recepciones: [{ recepcion_id: 1, cantidad_asignada: -5 }],
      });
      expect(error).toBeDefined();
    });
  });

  describe('createSalidaSchema', () => {
    it('acepta una salida válida con unidad KG', () => {
      const { error, value } = createSalidaSchema.validate({
        tipo_salida: 'PRODUCTO_BUENO',
        descripcion: 'Quinua beneficiada',
        cantidad: 850,
        unidad: 'KG',
        destino: 'KARDEX',
      });
      expect(error).toBeUndefined();
      expect(value.unidad).toBe('KG');
      expect(value.destino).toBe('KARDEX');
    });

    it('asigna unidad KG y destino SUBPRODUCTO por defecto', () => {
      const { value } = createSalidaSchema.validate({
        tipo_salida: 'MERMA',
        descripcion: 'Merma del proceso',
        cantidad: 30,
      });
      expect(value.unidad).toBe('KG');
      expect(value.destino).toBe('SUBPRODUCTO');
    });

    it('acepta envases en unidades', () => {
      const { error, value } = createSalidaSchema.validate({
        tipo_salida: 'ENVASE',
        descripcion: 'Costales de 50 kg',
        cantidad: 17,
        unidad: 'UNIDAD',
      });
      expect(error).toBeUndefined();
      expect(value.unidad).toBe('UNIDAD');
    });

    it('rechaza cantidad negativa', () => {
      const { error } = createSalidaSchema.validate({
        tipo_salida: 'PRODUCTO_BUENO',
        descripcion: 'Producto',
        cantidad: -10,
      });
      expect(error).toBeDefined();
    });

    it('rechaza un tipo de salida inválido', () => {
      const { error } = createSalidaSchema.validate({
        tipo_salida: 'INVALIDO',
        descripcion: 'Salida',
        cantidad: 10,
      });
      expect(error).toBeDefined();
    });

    it('rechaza un destino inválido', () => {
      const { error } = createSalidaSchema.validate({
        tipo_salida: 'PRODUCTO_BUENO',
        descripcion: 'Salida',
        cantidad: 10,
        destino: 'INVALIDO',
      });
      expect(error).toBeDefined();
    });
  });

  describe('createOperacionEjecutadaSchema', () => {
    it('acepta una operación ejecutada con parámetros de control', () => {
      const { error, value } = createOperacionEjecutadaSchema.validate({
        operacion_id: 1,
        orden: 1,
        operario: 'Juan Mamani',
        peso_antes: 1000,
        peso_despues: 980,
        humedad: 12.5,
        resultado: 'OK',
        completada: true,
      });
      expect(error).toBeUndefined();
      expect(value.completada).toBe(true);
    });

    it('acepta una operación sin parámetros opcionales', () => {
      const { error, value } = createOperacionEjecutadaSchema.validate({
        operacion_id: 1,
      });
      expect(error).toBeUndefined();
      expect(value.completada).toBe(true);
    });

    it('rechaza sin operacion_id', () => {
      const { error } = createOperacionEjecutadaSchema.validate({ orden: 1 });
      expect(error).toBeDefined();
    });
  });
});

describe('Enums de procesamiento (regresión)', () => {
  it('las etapas válidas son PRIMARIA, SECUNDARIA, EMPAQUE', () => {
    for (const etapa of ['PRIMARIA', 'SECUNDARIA', 'EMPAQUE']) {
      const { error } = createOrdenSchema.validate({
        planta: 'Planta',
        responsable: 'Resp',
        fecha_inicio: '2025-01-01',
        etapa,
        producto_salida: 'Producto',
      });
      expect(error).toBeUndefined();
    }
  });

  it('los tipos de salida válidos son los 6 esperados', () => {
    const tipos = ['PRODUCTO_BUENO', 'MERMA', 'PIEDRAS', 'SAPONINA', 'ENVASE', 'OTRO'];
    for (const tipo of tipos) {
      const { error } = createSalidaSchema.validate({
        tipo_salida: tipo,
        descripcion: 'Salida',
        cantidad: 1,
      });
      expect(error).toBeUndefined();
    }
  });

  it('los formatos de salida válidos incluyen GRANO, HARINA, HOJUELA y POP', () => {
    for (const formato of ['GRANO', 'HARINA', 'HOJUELA', 'POP', 'GRANEL', 'OTRO']) {
      const { error } = createOrdenSchema.validate({
        planta: 'Planta',
        responsable: 'Resp',
        fecha_inicio: '2025-01-01',
        etapa: 'SECUNDARIA',
        formato_salida: formato,
        producto_salida: 'Producto',
      });
      expect(error).toBeUndefined();
    }
  });
});
