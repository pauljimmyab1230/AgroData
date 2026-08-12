import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, SectionHeader } from "../ui";

type CampaniaHeaderProps = {
  title: string;
  description?: string;
  backTo?: string;
  actions?: ReactNode;
};

export function CampaniaHeader({ title, description, backTo, actions }: CampaniaHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        {backTo && (
          <Button variant="ghost" as="link" to={backTo} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Volver
          </Button>
        )}
        <SectionHeader title={title} description={description} />
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
