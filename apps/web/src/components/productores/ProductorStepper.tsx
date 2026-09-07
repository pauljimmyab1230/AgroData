import { User, Users, FileText } from "lucide-react";
import { Stepper, type StepperStep } from "../ui/Stepper";

export type ProductorStepperProps = {
  pasoActual: number;
  pasoMaximoAlcanzado?: number;
  onPasoChange?: (paso: number) => void;
  isViewMode?: boolean;
};

const pasos: StepperStep[] = [
  { id: 1, label: "Información General", icon: User },
  { id: 2, label: "Información Familiar", icon: Users },
  { id: 3, label: "Documentos", icon: FileText },
];

export function ProductorStepper({ pasoActual, pasoMaximoAlcanzado, onPasoChange, isViewMode }: ProductorStepperProps) {
  return <Stepper steps={pasos} active={isViewMode ? 3 : pasoActual} maxReached={isViewMode ? 3 : pasoMaximoAlcanzado} onChange={onPasoChange} />;
}
