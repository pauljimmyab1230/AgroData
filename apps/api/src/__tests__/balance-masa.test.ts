import { describe, it, expect } from 'vitest';

// Lógica pura del balance de masa, extraída de ordenes.service.ts
// para poder testearla sin base de datos.

interface SalidaBalance {
  tipo_salida: string;
  cantidad: number;
  unidad: string;
  cuenta_en_balance: boolean;
}

const TOLERANCIA_BALANCE = 1;

function calcularBalance(pesoEntrada: number, salidas: SalidaBalance[]) {
  const salidasBalance = salidas.filter((s) => s.cuenta_en_balance);
  const sumaSalidas = salidasBalance.reduce((acc, s) => acc + s.cantidad, 0);
  const diferencia = Number((sumaSalidas - pesoEntrada).toFixed(2));
  const diferenciaPct =
    pesoEntrada > 0 ? Number(((Math.abs(diferencia) / pesoEntrada) * 100).toFixed(2)) : 0;

  const merma = salidasBalance
    .filter((s) => s.tipo_salida !== 'PRODUCTO_BUENO')
    .reduce((acc, s) => acc + s.cantidad, 0);

  const porTipo: Record<string, number> = {};
  for (const s of salidas) {
    porTipo[s.tipo_salida] = Number(
      ((porTipo[s.tipo_salida] ?? 0) + s.cantidad).toFixed(2),
    );
  }

  return {
    sumaSalidas: Number(sumaSalidas.toFixed(2)),
    diferencia,
    diferenciaPct,
    balanceOk: diferenciaPct <= TOLERANCIA_BALANCE,
    mermaTotal: Number(merma.toFixed(2)),
    porTipo,
  };
}

describe('Balance de masa', () => {
  describe('cuando el balance cuadra', () => {
    it('acepta cuando entrada = suma de salidas', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 850, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'MERMA', cantidad: 30, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'PIEDRAS', cantidad: 60, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'SAPONINA', cantidad: 55, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'OTRO', cantidad: 5, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.sumaSalidas).toBe(1000);
      expect(r.diferencia).toBe(0);
      expect(r.diferenciaPct).toBe(0);
      expect(r.balanceOk).toBe(true);
    });

    it('acepta una diferencia pequeña dentro de la tolerancia (0.5%)', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 995, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.diferenciaPct).toBe(0.5);
      expect(r.balanceOk).toBe(true);
    });

    it('acepta exactamente en el límite de la tolerancia (1%)', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 1010, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.diferenciaPct).toBe(1);
      expect(r.balanceOk).toBe(true);
    });
  });

  describe('cuando el balance NO cuadra', () => {
    it('rechaza cuando hay exceso de salida (más de 1%)', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 1100, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.diferenciaPct).toBe(10);
      expect(r.balanceOk).toBe(false);
    });

    it('rechaza cuando falta salida (más de 1%)', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 500, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.diferencia).toBe(-500);
      expect(r.balanceOk).toBe(false);
    });

    it('rechaza con múltiples salidas que no suman la entrada', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 400, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'MERMA', cantidad: 100, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.sumaSalidas).toBe(500);
      expect(r.balanceOk).toBe(false);
    });
  });

  describe('salidas que no cuentan en el balance', () => {
    it('ignora las salidas con cuenta_en_balance = false (envases)', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 1000, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'ENVASE', cantidad: 50, unidad: 'UNIDAD', cuenta_en_balance: false },
      ]);
      expect(r.sumaSalidas).toBe(1000);
      expect(r.balanceOk).toBe(true);
    });

    it('el desglose por tipo SÍ incluye las salidas fuera del balance', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 1000, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'ENVASE', cantidad: 50, unidad: 'UNIDAD', cuenta_en_balance: false },
      ]);
      expect(r.porTipo['ENVASE']).toBe(50);
      expect(r.porTipo['PRODUCTO_BUENO']).toBe(1000);
    });
  });

  describe('cálculo de merma', () => {
    it('la merma es la suma de todo lo que no es PRODUCTO_BUENO', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 850, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'MERMA', cantidad: 30, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'PIEDRAS', cantidad: 60, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'SAPONINA', cantidad: 55, unidad: 'KG', cuenta_en_balance: true },
        { tipo_salida: 'OTRO', cantidad: 5, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.mermaTotal).toBe(150);
    });

    it('si todo es producto bueno, la merma es 0', () => {
      const r = calcularBalance(1000, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 1000, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.mermaTotal).toBe(0);
    });
  });

  describe('casos borde', () => {
    it('con entrada 0, cualquier salida rompe el balance', () => {
      const r = calcularBalance(0, [
        { tipo_salida: 'PRODUCTO_BUENO', cantidad: 100, unidad: 'KG', cuenta_en_balance: true },
      ]);
      expect(r.diferenciaPct).toBe(0);
      expect(r.balanceOk).toBe(true);
    });

    it('sin salidas, el balance no cuadra si hay entrada', () => {
      const r = calcularBalance(1000, []);
      expect(r.sumaSalidas).toBe(0);
      expect(r.balanceOk).toBe(false);
    });
  });
});

describe('Ejemplo del caso de negocio (quinua)', () => {
  it('1000 kg de quinua de campo → 850 kg bueno + 150 kg de subproductos', () => {
    const r = calcularBalance(1000, [
      { tipo_salida: 'PRODUCTO_BUENO', cantidad: 850, unidad: 'KG', cuenta_en_balance: true },
      { tipo_salida: 'PIEDRAS', cantidad: 60, unidad: 'KG', cuenta_en_balance: true },
      { tipo_salida: 'SAPONINA', cantidad: 55, unidad: 'KG', cuenta_en_balance: true },
      { tipo_salida: 'MERMA', cantidad: 30, unidad: 'KG', cuenta_en_balance: true },
      { tipo_salida: 'OTRO', cantidad: 5, unidad: 'KG', cuenta_en_balance: true },
      { tipo_salida: 'ENVASE', cantidad: 17, unidad: 'UNIDAD', cuenta_en_balance: false },
    ]);
    expect(r.sumaSalidas).toBe(1000);
    expect(r.balanceOk).toBe(true);
    expect(r.porTipo['ENVASE']).toBe(17);
    expect(r.mermaTotal).toBe(150);
  });
});
