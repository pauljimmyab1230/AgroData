import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Select,
  SectionHeader,
} from "../../components/ui";
import { createUsuario } from "../../services/usuarios";

export default function UsuarioCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "USER",
    rolSic: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.nombre || !form.email || !form.password) {
      alert("Por favor completa los campos obligatorios: Nombre, Email y Contraseña");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      await createUsuario({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: form.rol,
        rolSic: form.rolSic || null,
      });
      navigate("/usuarios");
    } catch (err) {
      console.error(err);
      alert("Error al crear el usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Usuarios", to: "/usuarios" },
          { label: "Nuevo Usuario" },
        ]}
      />

      <div className="mb-8 flex items-center justify-between">
        <SectionHeader
          title="Nuevo Usuario"
          description="Crear un nuevo usuario del sistema"
        />
        <Button variant="secondary" onClick={() => navigate("/usuarios")} iconLeft={<ArrowLeft className="h-4 w-4" />}>
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
              <label className="mb-1 block text-xs font-medium text-gray-500">Contraseña *</label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Confirmar contraseña *</label>
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
              <label className="mb-1 block text-xs font-medium text-gray-500">Rol SIC (opcional)</label>
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

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/usuarios")}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {saving ? "Creando..." : "Crear Usuario"}
          </Button>
        </div>
      </div>
    </div>
  );
}
