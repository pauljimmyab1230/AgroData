import { describe, it, expect } from 'vitest';
import {
  idParamSchema,
  idFamiliarParamSchema,
  idDocumentoParamSchema,
  idFotoParamSchema,
  codigoParamSchema,
} from '../validators/common.validator';

describe('validadores de parámetros de ruta', () => {
  describe('idParamSchema', () => {
    it('acepta un ID numérico positivo', () => {
      const { error, value } = idParamSchema.validate({ id: '5' });
      expect(error).toBeUndefined();
      expect(value.id).toBe(5);
    });

    it('rechaza un ID no numérico', () => {
      const { error } = idParamSchema.validate({ id: 'abc' });
      expect(error).toBeDefined();
    });

    it('rechaza un ID negativo', () => {
      const { error } = idParamSchema.validate({ id: '-1' });
      expect(error).toBeDefined();
    });
  });

  describe('idFamiliarParamSchema', () => {
    it('conserva AMBOS parámetros id y familiarId (regresión del bug de stripUnknown)', () => {
      const { error, value } = idFamiliarParamSchema.validate({
        id: '5',
        familiarId: '3',
      });
      expect(error).toBeUndefined();
      expect(value.id).toBe(5);
      expect(value.familiarId).toBe(3);
    });

    it('rechaza si falta familiarId', () => {
      const { error } = idFamiliarParamSchema.validate({ id: '5' });
      expect(error).toBeDefined();
    });

    it('rechaza si falta id', () => {
      const { error } = idFamiliarParamSchema.validate({ familiarId: '3' });
      expect(error).toBeDefined();
    });
  });

  describe('idDocumentoParamSchema', () => {
    it('conserva id y documentoId', () => {
      const { error, value } = idDocumentoParamSchema.validate({
        id: '10',
        documentoId: '7',
      });
      expect(error).toBeUndefined();
      expect(value.id).toBe(10);
      expect(value.documentoId).toBe(7);
    });
  });

  describe('idFotoParamSchema', () => {
    it('conserva id y fotoId', () => {
      const { error, value } = idFotoParamSchema.validate({
        id: '10',
        fotoId: '2',
      });
      expect(error).toBeUndefined();
      expect(value.id).toBe(10);
      expect(value.fotoId).toBe(2);
    });
  });

  describe('codigoParamSchema', () => {
    it('acepta un código válido', () => {
      const { error } = codigoParamSchema.validate({ codigo: 'RCP-2026-01' });
      expect(error).toBeUndefined();
    });

    it('rechaza un código vacío', () => {
      const { error } = codigoParamSchema.validate({ codigo: '' });
      expect(error).toBeDefined();
    });
  });

  describe('regresión: stripUnknown no debe eliminar params hermanos', () => {
    it('un validate encadenado con stripUnknown elimina params no declarados', () => {
      // Este test documenta el bug original: con stripUnknown, un schema que
      // solo declara `familiarId` elimina `id` del objeto de parámetros.
      const soloFamiliar = idFamiliarParamSchema; // ahora declara ambos
      const resultado = soloFamiliar.validate(
        { id: '5', familiarId: '3', extra: 'x' },
        { stripUnknown: true },
      );
      // El valor validado solo contiene los campos declarados.
      expect(resultado.value).toEqual({ id: 5, familiarId: 3 });
      // Pero ambos campos originales están presentes (no se perdió `id`).
      expect(resultado.value.id).toBeDefined();
      expect(resultado.value.familiarId).toBeDefined();
    });
  });
});
