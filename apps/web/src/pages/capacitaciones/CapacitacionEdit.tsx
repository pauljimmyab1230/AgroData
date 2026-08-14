import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Users, Search } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Textarea,
  Select,
  SectionHeader,
  LoadingSpinner,
} from "../../components/ui";
import { fetchCapacitacion, updateCapacitacion } from "../../services/capacitaciones";
import { fetchProductores, type Productor } from "../../services/productores";
import api from "../../services/api";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol_sic: string | null;
}

interface ParticipanteTemp {
  id: string;
  productorId?: string;
  usuarioId?: string;
  nombre: string;
  dni?: string;
  asistio: boolean;
  isExisting?: boolean;
}

export default function CapacitacionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productores, setProductores] = useState<Productor[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchProductor, setSearchProductor] = useState("");
  const [participantes, setParticipantes] = useState<ParticipanteTemp[]>([]);

  const [form, setForm] = useState({
    tipo: "PRODUCTORES",
    tema: "",
    descripcion: "",
    capacitador: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    duracionHoras: "",
    lugar: "",
    departamento: "",
    provincia: "",
    distrito: "",
    materialEntregado: "",
    observaciones: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [capData, prodResult, userResult] = await Promise.all([
          fetchCapacitacion(id!),
          fetchProductores({ limit: 200 }),
          api.get("/usuarios?limit=200"),
        ]);

        setForm({
          tipo: capData.tipo,
          tema: capData.tema,
          descripcion: capData.descripcion || "",
          capacitador: capData.capacitador,
          fecha: capData.fecha,
          horaInicio: capData.horaInicio || "",
          horaFin: capData.horaFin || "",
          duracionHoras: capData.duracionHoras?.toString() || "",
          lugar: capData.lugar,
          departamento: capData.departamento || "",
          provincia: capData.provincia || "",
          distrito: capData.distrito || "",
          materialEntregado: capData.materialEntregado || "",
          observaciones: capData.observaciones || "",
        });

        if (capData.participantes) {
          setParticipantes(
            capData.participantes.map((p) => ({
              id: p.id,
              productorId: p.productorId || undefined,
              usuarioId: p.usuarioId || undefined,
              nombre: p.productor
                ? `${p.productor.nombres} ${p.productor.apellido_paterno} ${p.productor.apellido_materno}`
                : p.usuario?.nombre || "Sin nombre",
              dni: p.productor?.dni,
              asistio: p.asistio,
              isExisting: true,
            }))
          );
        }

        setProductores(prodResult.data);
        setUsuarios(userResult.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addParticipanteProductor = (productor: Productor) => {
    if (participantes.some((p) => p.productorId === productor.id)) return;
    setParticipantes((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        productorId: productor.id,
        nombre: `${productor.nombres} ${productor.apellidoPaterno} ${productor.apellidoMaterno}`,
        dni: productor.dni,
        asistio: false,
      },
    ]);
    setSearchProductor("");
  };

  const addParticipanteUsuario = (usuario: Usuario) => {
    if (participantes.some((p) => p.usuarioId === usuario.id)) return;
    setParticipantes((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        usuarioId: usuario.id,
        nombre: usuario.nombre,
        asistio: false,
      },
    ]);
  };

  const removeParticipante = (id: string) => {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAsistencia = (id: string) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, asistio: !p.asistio } : p))
    );
  };

  const filteredProductores = productores.filter((p) => {
    const search = searchProductor.toLowerCase();
    return (
      p.nombres.toLowerCase().includes(search) ||
      p.apellidoPaterno.toLowerCase().includes(search) ||
      p.dni.includes(search) ||
      p.codigo.toLowerCase().includes(search)
    );
  });

  const handleSave = async () => {
    if (!form.tema || !form.capacitador || !form.fecha || !form.lugar) {
      alert("Por favor completa los campos obligatorios: Tema, Capacitador, Fecha y Lugar");
      return;
    }

    setSaving(true);
    try {
      await updateCapacitacion(id!, {
        ...form,
        duracionHoras: form.duracionHoras ? parseFloat(form.duracionHoras) : undefined,
      });
      navigate(`/capacitaciones/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la capacitación");
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
          { label: "Capacitaciones", to: "/capacitaciones" },
          { label: form.tema, to: `/capacitaciones/${id}` },
          { label: "Editar" },
        ]}
      />

      <div className="mb-8 flex items-center justify-between">
        <SectionHeader
          title="Editar Capacitación"
          description={`Editando: ${form.tema}`}
        />
        <Button variant="secondary" onClick={() => navigate(`/capacitaciones/${id}`)} iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información General</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Tipo *</label>
                <Select
                  options={[
                    { value: "PRODUCTORES", label: "Productores" },
                    { value: "PERSONAL_SIC", label: "Personal SIC" },
                  ]}
                  value={form.tipo}
                  onChange={(val) => handleChange("tipo", val)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Fecha *</label>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => handleChange("fecha", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-500">Tema *</label>
                <Input
                  placeholder="Ej: Capacitación en normas orgánicas de producción"
                  value={form.tema}
                  onChange={(e) => handleChange("tema", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-500">Descripción</label>
                <Textarea
                  rows={3}
                  placeholder="Descripción detallada de la capacitación..."
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Horario y Lugar</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Capacitador *</label>
                <Input
                  placeholder="Nombre del capacitador"
                  value={form.capacitador}
                  onChange={(e) => handleChange("capacitador", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Lugar *</label>
                <Input
                  placeholder="Lugar de la capacitación"
                  value={form.lugar}
                  onChange={(e) => handleChange("lugar", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Hora Inicio</label>
                <Input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => handleChange("horaInicio", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Hora Fin</label>
                <Input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => handleChange("horaFin", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Duración (horas)</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="Ej: 4"
                  value={form.duracionHoras}
                  onChange={(e) => handleChange("duracionHoras", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Departamento</label>
                <Input
                  placeholder="Departamento"
                  value={form.departamento}
                  onChange={(e) => handleChange("departamento", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Provincia</label>
                <Input
                  placeholder="Provincia"
                  value={form.provincia}
                  onChange={(e) => handleChange("provincia", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Distrito</label>
                <Input
                  placeholder="Distrito"
                  value={form.distrito}
                  onChange={(e) => handleChange("distrito", e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Material y Observaciones</h3>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Material Entregado</label>
                <Textarea
                  rows={3}
                  placeholder="Material entregado a los participantes..."
                  value={form.materialEntregado}
                  onChange={(e) => handleChange("materialEntregado", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Observaciones</label>
                <Textarea
                  rows={3}
                  placeholder="Observaciones adicionales..."
                  value={form.observaciones}
                  onChange={(e) => handleChange("observaciones", e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes ({participantes.length})
              </span>
            </h3>

            {form.tipo === "PRODUCTORES" && (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-gray-500">Agregar Productor</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o código..."
                    value={searchProductor}
                    onChange={(e) => setSearchProductor(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {searchProductor && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                    {filteredProductores.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addParticipanteProductor(p)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <span className="font-medium">{p.nombres} {p.apellidoPaterno}</span>
                        <span className="text-gray-400">({p.dni})</span>
                      </button>
                    ))}
                    {filteredProductores.length === 0 && (
                      <p className="px-3 py-2 text-sm text-gray-500">No se encontraron productores</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {form.tipo === "PERSONAL_SIC" && (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-gray-500">Agregar Personal SIC</label>
                <Select
                  options={usuarios.map((u) => ({
                    value: u.id,
                    label: `${u.nombre} (${u.rol_sic || "Sin rol SIC"})`,
                  }))}
                  placeholder="Seleccionar usuario..."
                  value=""
                  onChange={(val) => {
                    const usuario = usuarios.find((u) => u.id === val);
                    if (usuario) addParticipanteUsuario(usuario);
                  }}
                />
              </div>
            )}

            {participantes.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">
                No hay participantes agregados
              </p>
            ) : (
              <div className="space-y-2">
                {participantes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{p.nombre}</p>
                      {p.dni && <p className="text-xs text-gray-400">DNI: {p.dni}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAsistencia(p.id)}
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          p.asistio
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.asistio ? "Presente" : "Ausente"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeParticipante(p.id)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              iconLeft={<Save className="h-4 w-4" />}
              className="flex-1"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
