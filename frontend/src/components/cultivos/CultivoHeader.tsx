import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../ui";

export interface Crumb {
  label: string;
  to?: string;
}

interface CultivoHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  backTo?: string;
  actions?: ReactNode;
}

export default function CultivoHeader({ title, description, crumbs = [], backTo, actions }: CultivoHeaderProps) {
  return (
    <div>
      <Breadcrumb items={crumbs} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {backTo && (
            <Button variant="ghost" as="link" to={backTo} iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
          )}
          <SectionHeader title={title} description={description} />
        </div>
        {actions}
      </div>
    </div>
  );
}
