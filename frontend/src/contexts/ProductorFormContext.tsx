import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Productor } from "../services/productores";

type ProductorFormData = Partial<Productor>;

type ProductorFormContextType = {
  data: ProductorFormData;
  updateData: (patch: ProductorFormData) => void;
  resetData: (initial: ProductorFormData) => void;
};

const ProductorFormContext = createContext<ProductorFormContextType | null>(null);

export function ProductorFormProvider({
  initial = {},
  children,
}: {
  initial?: ProductorFormData;
  children: ReactNode;
}) {
  const [data, setData] = useState<ProductorFormData>(initial);

  const updateData = useCallback((patch: ProductorFormData) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetData = useCallback((initial: ProductorFormData) => {
    setData(initial);
  }, []);

  return (
    <ProductorFormContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </ProductorFormContext.Provider>
  );
}

export function useProductorForm() {
  const ctx = useContext(ProductorFormContext);
  if (!ctx) throw new Error("useProductorForm must be used within ProductorFormProvider");
  return ctx;
}
