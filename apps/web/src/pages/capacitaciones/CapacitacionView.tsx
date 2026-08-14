import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Users, Calendar, MapPin, Clock, BookOpen } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  LoadingSpinner,
  SectionHeader,
} from "../../components/ui";
import { fetchCapacitacion, deleteCapacitacion, type Capacitacion } from "../../services/capacitaciones";

const tipoBadge = (tipo: string) => {
  switch (tipo) {
    case "PRODUCTORES":
      return <Badge variant="green">Productores</Badge>;
    case "PERSONAL_SIC":
      return <Badge variant="forest">Personal SIC</Badge>;
    default:
      return <Badge>{tipo}</Badge>;
  }
};

export default function CapacitacionView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [capacitacion, setCapacitacion] = useState<Capacitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCapacitacion(id!);
        setCapacitacion(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCapacitacion(id);
      navigate("/capacitaciones");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!capacitacion) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Capacitación no encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Capacitaciones", to: "/capacitaciones" },
          { label: capacitacion.tema },
        ]}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionHeader title={capacitacion.tema} description={`Código: ${capacitacion.codigo}`} />
          <div className="mt-2 flex items-center gap-2">
            {tipoBadge(capacitacion.tipo)}
            <span className="text-sm text-gray-500">{capacitacion.fecha}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/capacitaciones")} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Volver
          </Button>
          <Button as="link" to={`/capacitaciones/${id}/editar`} variant="secondary" iconLeft={<Pencil className="h-4 w-4" />}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setDeleteConfirm(true)} iconLeft={<Trash2 className="h-4 w-4" />}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información General</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="text-sm font-medium">{capacitacion.fecha}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Horario</p>
                  <p className="text-sm font-medium">
                    {capacitacion.horaInicio || "—"} - {capacitacion.horaFin || "—"}
                    {capacitacion.duracionHoras && ` (${capacitacion.duracionHoras}h)`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Lugar</p>
                  <p className="text-sm font-medium">{capacitacion.lugar}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Capacitador</p>
                  <p className="text-sm font-medium">{capacitacion.capacitador}</p>
                </div>
              </div>
            </div>
            {capacitacion.descripcion && (
              <div className="mt-4">
                <p className="text-xs text-gray-500">Descripción</p>
                <p className="mt-1 text-sm">{capacitacion.descripcion}</p>
              </div>
            )}
          </Card>

          {capacitacion.materialEntregado && (
            <Card padding="lg">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Material Entregado</h3>
              <p className="text-sm whitespace-pre-wrap">{capacitacion.materialEntregado}</p>
            </Card>
          )}

          {capacitacion.observaciones && (
            <Card padding="lg">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Observaciones</h3>
              <p className="text-sm whitespace-pre-wrap">{capacitacion.observaciones}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes ({capacitacion._count?.participantes || 0})
              </span>
            </h3>
            {capacitacion.participantes && capacitacion.participantes.length > 0 ? (
              <div className="space-y-2">
                {capacitacion.participantes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {p.productor
                          ? `${p.productor.nombres} ${p.productor.apellido_paterno} ${p.productor.apellido_materno}`
                          : p.usuario?.nombre || "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.productor ? `DNI: ${p.productor.dni}` : p.usuario?.email}
                      </p>
                    </div>
                    <Badge variant={p.asistio ? "green" : "gray"}>
                      {p.asistio ? "Presente" : "Ausente"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">No hay participantes registrados</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Capacitación"
        message="¿Estás seguro de eliminar esta capacitación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
