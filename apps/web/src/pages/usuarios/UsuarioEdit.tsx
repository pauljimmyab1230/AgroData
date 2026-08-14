import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Select,
  SectionHeader,
  LoadingSpinner,
} from "../../components/ui";
import { fetchUsuario, updateUsuario } from "../../services/usuarios";

export default function UsuarioEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "USER",
    rolSic: "",
    activo: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const usuario = await fetchUsuario(id!);
        setForm({
          nombre: usuario.nombre,
          email: usuario.email,
          password: "",
          confirmPassword: "",
          rol: usuario.rol,
          rolSic: usuario.rolSic || "",
          activo: usuario.activo,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.nombre || !form.email) {
      alert("Por favor completa los campos obligatorios: Nombre y Email");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (form.password && form.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: form.nombre,
        email: form.email,
        rol: form.rol,
        rolSic: form.rolSic || null,
        activo: form.activo,
      };
      if (form.password) {
        payload.password = form.password;
      }
      await updateUsuario(id!, payload);
      navigate(`/usuarios/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el usuario");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Usuarios", to: "/usuarios" },
          { label: form.nombre, to: `/usuarios/${id}` },
          { label: "Editar" },
        ]}
      />

      <div className="mb-8 flex items-center justify-between">
        <SectionHeader
          title="Editar Usuario"
          description={`Editando: ${form.nombre}`}
        />
        <Button variant="secondary" onClick={() => navigate(`/usuarios/${id}`)} iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información del Usuario</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">Nombre completo *</label>
              <Input
                placeholder="Ej: Juan Pérez"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">Email *</label>
              <Input
                type="email"
                placeholder="Ej: juan@agrodata.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Nueva contraseña (opcional)</label>
              <Input
                type="password"
                placeholder="Dejar vacío para no cambiar"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Confirmar contraseña</label>
              <Input
                type="password"
                placeholder="Repetir contraseña"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Roles y Permisos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Rol del sistema</label>
              <Select
                options={[
                  { value: "USER", label: "Usuario" },
                  { value: "ADMIN", label: "Administrador" },
                ]}
                value={form.rol}
                onChange={(val) => handleChange("rol", val)}
              />
              <p className="mt-1 text-xs text-gray-400">
                ADMIN tiene acceso total. USER tiene acceso restringido.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Rol SIC</label>
              <Select
                options={[
                  { value: "", label: "Ninguno" },
                  { value: "RESPONSABLE_SIC", label: "Responsable SIC" },
                  { value: "INSPECTOR", label: "Inspector" },
                  { value: "COMITE_DECISION", label: "Comité de Decisión" },
                  { value: "TECNICO_CAMPO", label: "Técnico de Campo" },
                  { value: "ACOPIADOR", label: "Acopiador" },
                  { value: "CAPACITADOR", label: "Capacitador" },
                ]}
                value={form.rolSic}
                onChange={(val) => handleChange("rolSic", val)}
              />
              <p className="mt-1 text-xs text-gray-400">
                Rol operativo dentro del Sistema Interno de Control.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Estado</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
              />
              <span className="text-sm font-medium text-gray-700">Usuario activo</span>
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Los usuarios inactivos no pueden iniciar sesión en el sistema.
          </p>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate(`/usuarios/${id}`)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
