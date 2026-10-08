import { describe, it, expect } from 'vitest';
import {
  nombreProductoCampo,
  nombreProductoProcesado,
  generoDeCultivo,
  resolverNombreSalida,
  categoriaDeSalida,
} from '../services/kardex-integracion.service';

describe('Nomenclatura de productos del kardex', () => {
  describe('generoDeCultivo', () => {
    it('femeninos: quinua, kiwicha, chia, avena, lenteja', () => {
      expect(generoDeCultivo('Quinua')).toBe('f');
      expect(generoDeCultivo('Kiwicha')).toBe('f');
      expect(generoDeCultivo('Chía')).toBe('f');
      expect(generoDeCultivo('Avena')).toBe('f');
      expect(generoDeCultivo('Lenteja')).toBe('f');
    });

    it('masculinos: fréjol, trigo, centeno, garbanzo', () => {
      expect(generoDeCultivo('Fréjol rojo')).toBe('m');
      expect(generoDeCultivo('Trigo')).toBe('m');
      expect(generoDeCultivo('Centeno')).toBe('m');
      expect(generoDeCultivo('Garbanzo')).toBe('m');
    });

    it('es case-insensitive y tolera espacios', () => {
      expect(generoDeCultivo('  QUINUA  ')).toBe('f');
      expect(generoDeCultivo('frejol negro')).toBe('m');
    });
  });

  describe('nombreProductoCampo (trillados)', () => {
    it('femeninos usan "trillada"', () => {
      expect(nombreProductoCampo('Quinua', 'f')).toBe('Quinua trillada');
      expect(nombreProductoCampo('Chía', 'f')).toBe('Chía trillada');
      expect(nombreProductoCampo('Avena', 'f')).toBe('Avena trillada');
    });

    it('masculinos usan "trillado"', () => {
      expect(nombreProductoCampo('Fréjol rojo', 'm')).toBe('Fréjol rojo trillado');
      expect(nombreProductoCampo('Trigo', 'm')).toBe('Trigo trillado');
      expect(nombreProductoCampo('Garbanzo', 'm')).toBe('Garbanzo trillado');
    });

    it('los 12 cultivos del sistema generan nombres correctos', () => {
      const cultivos: Array<[string, 'f' | 'm', string]> = [
        ['Quinua', 'f', 'Quinua trillada'],
        ['Kiwicha', 'f', 'Kiwicha trillada'],
        ['Chía', 'f', 'Chía trillada'],
        ['Fréjol rojo', 'm', 'Fréjol rojo trillado'],
        ['Fréjol negro', 'm', 'Fréjol negro trillado'],
        ['Fréjol panamito', 'm', 'Fréjol panamito trillado'],
        ['Fréjol canario', 'm', 'Fréjol canario trillado'],
        ['Avena', 'f', 'Avena trillada'],
        ['Trigo', 'm', 'Trigo trillado'],
        ['Centeno', 'm', 'Centeno trillado'],
        ['Garbanzo', 'm', 'Garbanzo trillado'],
        ['Lenteja', 'f', 'Lenteja trillada'],
      ];
      for (const [cultivo, genero, esperado] of cultivos) {
        expect(nombreProductoCampo(cultivo, genero)).toBe(esperado);
      }
    });
  });

  describe('nombreProductoProcesado', () => {
    it('femeninos usan "procesada"', () => {
      expect(nombreProductoProcesado('Quinua', 'f')).toBe('Quinua procesada');
      expect(nombreProductoProcesado('Avena', 'f')).toBe('Avena procesada');
    });

    it('masculinos usan "procesado"', () => {
      expect(nombreProductoProcesado('Fréjol rojo', 'm')).toBe('Fréjol rojo procesado');
      expect(nombreProductoProcesado('Trigo', 'm')).toBe('Trigo procesado');
    });
  });

  describe('resolverNombreSalida', () => {
    it('PRODUCTO_BUENO en etapa PRIMARIA usa el nombre del cultivo procesado', () => {
      const nombre = resolverNombreSalida(
        'PRODUCTO_BUENO',
        'Quinua beneficiada',
        'Quinua procesada',
        'PRIMARIA',
        'Quinua',
      );
      expect(nombre).toBe('Quinua procesada');
    });

    it('PRODUCTO_BUENO en etapa SECUNDARIA usa el nombre de la orden (ej. Harina de quinua)', () => {
      const nombre = resolverNombreSalida(
        'PRODUCTO_BUENO',
        'Harina de quinua',
        'Harina de quinua',
        'SECUNDARIA',
        'Quinua',
      );
      expect(nombre).toBe('Harina de quinua');
    });

    it('MERMA siempre se llama "Merma de procesamiento"', () => {
      expect(resolverNombreSalida('MERMA', 'Merma', 'X', 'PRIMARIA')).toBe('Merma de procesamiento');
      expect(resolverNombreSalida('MERMA', 'cualquier cosa', 'X', 'SECUNDARIA')).toBe('Merma de procesamiento');
    });

    it('PIEDRAS siempre se llama "Piedras (despedrado)"', () => {
      expect(resolverNombreSalida('PIEDRAS', 'Piedras', 'X', 'PRIMARIA')).toBe('Piedras (despedrado)');
    });

    it('SAPONINA siempre se llama "Saponina (desaponificado)"', () => {
      expect(resolverNombreSalida('SAPONINA', 'Saponina', 'X', 'PRIMARIA')).toBe('Saponina (desaponificado)');
    });

    it('ENVASE usa el nombre de la descripción', () => {
      expect(resolverNombreSalida('ENVASE', 'Costal de 50 kg', 'X', 'PRIMARIA')).toBe('Costal de 50 kg');
    });

    it('sin cultivoBase en PRIMARIA, usa productoSalidaOrden como fallback', () => {
      const nombre = resolverNombreSalida('PRODUCTO_BUENO', 'desc', 'Quinua procesada', 'PRIMARIA');
      expect(nombre).toBe('Quinua procesada');
    });
  });

  describe('categoriaDeSalida', () => {
    it('PRODUCTO_BUENO -> PRODUCTO_PROCESADO', () => {
      expect(categoriaDeSalida('PRODUCTO_BUENO')).toBe('PRODUCTO_PROCESADO');
    });

    it('MERMA, PIEDRAS, SAPONINA, OTRO -> SUBPRODUCTO', () => {
      expect(categoriaDeSalida('MERMA')).toBe('SUBPRODUCTO');
      expect(categoriaDeSalida('PIEDRAS')).toBe('SUBPRODUCTO');
      expect(categoriaDeSalida('SAPONINA')).toBe('SUBPRODUCTO');
      expect(categoriaDeSalida('OTRO')).toBe('SUBPRODUCTO');
    });

    it('ENVASE -> ENVASE', () => {
      expect(categoriaDeSalida('ENVASE')).toBe('ENVASE');
    });

    it('tipo desconocido -> SUBPRODUCTO por defecto', () => {
      expect(categoriaDeSalida('DESCONOCIDO')).toBe('SUBPRODUCTO');
    });
  });

  describe('Flujo completo del caso de negocio (quinua)', () => {
    it('quinua de campo -> procesada -> harina, con nombres correctos en cada etapa', () => {
      // Etapa 1: recepción
      const campo = nombreProductoCampo('Quinua', generoDeCultivo('Quinua'));
      expect(campo).toBe('Quinua trillada');

      // Etapa 2: proceso primario
      const procesada = resolverNombreSalida('PRODUCTO_BUENO', '', 'Quinua procesada', 'PRIMARIA', 'Quinua');
      expect(procesada).toBe('Quinua procesada');

      // Etapa 3: proceso secundario (molienda)
      const harina = resolverNombreSalida('PRODUCTO_BUENO', 'Harina de quinua', 'Harina de quinua', 'SECUNDARIA', 'Quinua');
      expect(harina).toBe('Harina de quinua');

      // Subproductos del proceso primario
      const merma = resolverNombreSalida('MERMA', '', '', 'PRIMARIA');
      expect(merma).toBe('Merma de procesamiento');
      const piedras = resolverNombreSalida('PIEDRAS', '', '', 'PRIMARIA');
      expect(piedras).toBe('Piedras (despedrado)');
      const saponina = resolverNombreSalida('SAPONINA', '', '', 'PRIMARIA');
      expect(saponina).toBe('Saponina (desaponificado)');
    });
  });
});
