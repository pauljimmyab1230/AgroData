import { User, Users, Map, FileText } from "lucide-react";
import { Stepper, type StepperStep } from "../ui/Stepper";

export type ProductorStepperProps = {
  pasoActual: number;
  onPasoChange?: (paso: number) => void;
};

const pasos: StepperStep[] = [
  { id: 1, label: "Información General", icon: User },
  { id: 2, label: "Información Familiar", icon: Users },
  { id: 3, label: "Parcelas", icon: Map },
  { id: 4, label: "Documentos", icon: FileText },
];

export function ProductorStepper({ pasoActual, onPasoChange }: ProductorStepperProps) {
  return <Stepper steps={pasos} active={pasoActual} onChange={onPasoChange} />;
}
