import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, DataTable } from "../ui";
import { familiaresMock, type Familiar } from "../../pages/productores/productorMock";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";

type FamiliarTableProps = {
  mode: FormMode;
};

export function FamiliarTable({ mode }: FamiliarTableProps) {
  const readOnly = mode === "view";

  const columns = [
    {
      key: "nombres",
      label: "Nombres",
      render: (familiar: Familiar) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-sm font-semibold text-forest-700">
            {familiar.nombres.charAt(0)}
          </div>
          <span className="font-medium text-[#111827]">{familiar.nombres}</span>
        </div>
      ),
    },
    { key: "parentesco", label: "Parentesco" },
    { key: "dni", label: "DNI" },
    { key: "sexo", label: "Sexo" },
    { key: "fechaNacimiento", label: "Fecha Nacimiento" },
    { key: "ocupacion", label: "Ocupación" },
    { key: "nivelEducativo", label: "Nivel Educativo" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "dependiente",
      label: "Dependiente",
      render: (familiar: Familiar) =>
        familiar.dependiente ? (
          <Badge variant="green">Sí</Badge>
        ) : (
          <Badge variant="gray">No</Badge>
        ),
    },
    {
      key: "viveConProductor",
      label: "Vive con el productor",
      render: (familiar: Familiar) =>
        familiar.viveConProductor ? (
          <Badge variant="forest">Sí</Badge>
        ) : (
          <Badge variant="gray">No</Badge>
        ),
    },
    ...(!readOnly
      ? [
          {
            key: "acciones",
            label: "",
            className: "text-right",
            render: (familiar: Familiar) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label={`Editar ${familiar.nombres}`}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${familiar.nombres}`}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Users size={20} />}
        title="Información Familiar"
        description="Registro de familiares dependientes y miembros del núcleo familiar"
        actions={
          !readOnly ? (
            <Button variant="secondary" size="sm" iconLeft={<UserPlus className="h-4 w-4" />}>
              Agregar Familiar
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        data={familiaresMock}
        keyField="id"
        emptyTitle="Sin familiares registrados"
        emptyDescription="Agrega los familiares del productor para completar la información."
      />
    </CardShell>
  );
}
