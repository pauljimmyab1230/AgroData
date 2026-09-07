import { useState, useCallback } from "react";

const TOTAL_PASOS = 3;

export function useProductorStepper() {
  const [pasoActual, setPasoActual] = useState(1);
  const [pasoMaximoAlcanzado, setPasoMaximoAlcanzado] = useState(1);

  const handleNext = useCallback((validateFn?: () => boolean) => {
    if (validateFn && !validateFn()) return;
    setPasoActual((paso) => {
      const siguiente = Math.min(TOTAL_PASOS, paso + 1);
      setPasoMaximoAlcanzado((max) => Math.max(max, siguiente));
      return siguiente;
    });
  }, []);

  const handleBack = useCallback(() => {
    setPasoActual((paso) => Math.max(1, paso - 1));
  }, []);

  const handlePasoChange = useCallback((paso: number) => {
    setPasoActual(paso);
    setPasoMaximoAlcanzado((max) => Math.max(max, paso));
  }, []);

  return {
    pasoActual,
    pasoMaximoAlcanzado,
    totalPasos: TOTAL_PASOS,
    isFirstStep: pasoActual === 1,
    isLastStep: pasoActual === TOTAL_PASOS,
    handleNext,
    handleBack,
    handlePasoChange,
  };
}
