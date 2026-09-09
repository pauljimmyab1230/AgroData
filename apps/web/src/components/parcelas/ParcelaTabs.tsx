import { Info, MapPin, Hexagon } from "lucide-react";
import Stepper, { type StepperStep } from "../ui/Stepper";

interface ParcelaTabsProps {
  active: number;
  onChange: (id: number) => void;
}

const tabs: StepperStep[] = [
  { id: 1, label: "Información General", icon: Info },
  { id: 2, label: "Ubicación", icon: MapPin },
  { id: 3, label: "Polígono", icon: Hexagon },
];

export default function ParcelaTabs({ active, onChange }: ParcelaTabsProps) {
  return <Stepper steps={tabs} active={active} onChange={onChange} />;
}
