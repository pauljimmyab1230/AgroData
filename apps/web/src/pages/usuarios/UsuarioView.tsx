import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Settings, Shield, UserCheck, Calendar } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  LoadingSpinner,
  SectionHeader,
} from "../../components/ui";
import { fetchUsuario, deleteUsuario, type Usuario } from "../../services/usuarios";

const rolBadge = (rol: string) => {
  switch (rol) {
    case "ADMIN":
      return <Badge variant="purple">Administrador</Badge>;
    case "USER":
      return <Badge variant="forest">Usuario</Badge>;
    default:
      return <Badge>{rol}</Badge>;
  }
};

const rolSicLabel = (rolSic: string | null) => {
  if (!rolSic) return "No asignado";
  const labels: Record<string, string> = {
    RESPONSABLE_SIC: "Responsable SIC",
    INSPECTOR: "Inspector",
    COMITE_DECISION: "Comité de Decisión",
    TECNICO_CAMPO: "Técnico de Campo",
    ACOPIADOR: "Acopiador",
    CAPACITADOR: "Capacitador",
  };
  return labels[rolSic] || rolSic;
};

export default function UsuarioView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsuario(id!);
        setUsuario(data);
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
      await deleteUsuario(id);
      navigate("/usuarios");
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

  if (!usuario) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Usuarios", to: "/usuarios" },
          { label: usuario.nombre },
        ]}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionHeader title={usuario.nombre} description={usuario.email} />
          <div className="mt-2 flex items-center gap-2">
            {rolBadge(usuario.rol)}
            <Badge variant={usuario.activo ? "green" : "red"}>
              {usuario.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/usuarios")} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Volver
          </Button>
          <Button as="link" to={`/usuarios/${id}/editar`} variant="secondary" iconLeft={<Pencil className="h-4 w-4" />}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setDeleteConfirm(true)} iconLeft={<Trash2 className="h-4 w-4" />}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información del Usuario</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-sm font-medium">{usuario.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{usuario.email}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Roles y Permisos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Rol del sistema</p>
                <div className="mt-1">{rolBadge(usuario.rol)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserCheck className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Rol SIC</p>
                <p className="text-sm font-medium">{rolSicLabel(usuario.rolSic)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Fechas</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Fecha de creación</p>
                <p className="text-sm font-medium">{usuario.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Última actualización</p>
                <p className="text-sm font-medium">{usuario.updatedAt}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
