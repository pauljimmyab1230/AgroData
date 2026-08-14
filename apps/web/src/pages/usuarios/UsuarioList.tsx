import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Trash2, Settings, UserCheck, UserX } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  LoadingSpinner,
  SearchInput,
  SectionHeader,
  Select,
} from "../../components/ui";
import { fetchUsuarios, deleteUsuario, type Usuario } from "../../services/usuarios";

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

const rolSicBadge = (rolSic: string | null) => {
  if (!rolSic) return <Badge variant="gray">—</Badge>;
  const labels: Record<string, string> = {
    RESPONSABLE_SIC: "Responsable SIC",
    INSPECTOR: "Inspector",
    COMITE_DECISION: "Comité",
    TECNICO_CAMPO: "Técnico",
    ACOPIADOR: "Acopiador",
    CAPACITADOR: "Capacitador",
  };
  return <Badge variant="purple">{labels[rolSic] || rolSic}</Badge>;
};

export default function UsuarioList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [rolSicFilter, setRolSicFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchUsuarios({
        search: debouncedSearch || undefined,
        rol: rolFilter || undefined,
        rol_sic: rolSicFilter || undefined,
        page,
        limit: 10,
      });
      setUsuarios(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch, rolFilter, rolSicFilter, page]);

  const kpis = [
    {
      label: "Total Usuarios",
      value: String(total),
      hint: "registrados",
      icon: Settings,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      label: "Administradores",
      value: String(usuarios.filter((u) => u.rol === "ADMIN").length),
      hint: "en la página actual",
      icon: UserCheck,
      iconClass: "bg-purple-100 text-purple-700",
    },
    {
      label: "Usuarios",
      value: String(usuarios.filter((u) => u.rol === "USER").length),
      hint: "en la página actual",
      icon: UserCheck,
      iconClass: "bg-blue-100 text-blue-700",
    },
    {
      label: "Inactivos",
      value: String(usuarios.filter((u) => !u.activo).length),
      hint: "en la página actual",
      icon: UserX,
      iconClass: "bg-red-100 text-red-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const handleResetFilters = () => {
    setSearch("");
    setRolFilter("");
    setRolSicFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || rolFilter || rolSicFilter;

  const columns = [
    {
      key: "nombre",
      label: "Usuario",
      sortable: true,
      render: (usuario: Usuario) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-600/10 text-sm font-semibold text-slate-700">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-[#111827]">{usuario.nombre}</p>
            <p className="text-xs text-gray-500">{usuario.email}</p>
          </div>
        </div>
      ),
    },
    { key: "rol", label: "Rol", render: (usuario: Usuario) => rolBadge(usuario.rol) },
    { key: "rolSic", label: "Rol SIC", render: (usuario: Usuario) => rolSicBadge(usuario.rolSic) },
    {
      key: "activo",
      label: "Estado",
      render: (usuario: Usuario) => (
        <Badge variant={usuario.activo ? "green" : "red"}>
          {usuario.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    { key: "createdAt", label: "Creado" },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (usuario: Usuario) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${usuario.nombre}`}
            onClick={() => navigate(`/usuarios/${usuario.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-slate-600/10 hover:text-slate-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${usuario.nombre}`}
            onClick={() => navigate(`/usuarios/${usuario.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-slate-600/10 hover:text-slate-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${usuario.nombre}`}
            onClick={() => setDeleteId(usuario.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Usuarios" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Usuarios"
          description="Gestión de usuarios del sistema"
        />
        <Button as="link" to="/usuarios/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
          Nuevo Usuario
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
                <p className="mt-1 text-xs text-gray-400">{kpi.hint}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-xs font-medium text-gray-500">Rol</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "ADMIN", label: "Administrador" },
              { value: "USER", label: "Usuario" },
            ]}
            placeholder="Todos"
            value={rolFilter}
            onChange={(val) => { setRolFilter(val); setPage(1); }}
          />
        </div>
        <div className="w-44">
          <label className="mb-1 block text-xs font-medium text-gray-500">Rol SIC</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "RESPONSABLE_SIC", label: "Responsable SIC" },
              { value: "INSPECTOR", label: "Inspector" },
              { value: "COMITE_DECISION", label: "Comité" },
              { value: "TECNICO_CAMPO", label: "Técnico Campo" },
              { value: "ACOPIADOR", label: "Acopiador" },
              { value: "CAPACITADOR", label: "Capacitador" },
            ]}
            placeholder="Todos"
            value={rolSicFilter}
            onChange={(val) => { setRolSicFilter(val); setPage(1); }}
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="mb-0.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        keyField="id"
        emptyTitle="No hay usuarios registrados"
        emptyDescription="Comienza registrando el primer usuario del sistema."
        emptyActionLabel="Crear Usuario"
        emptyActionTo="/usuarios/nuevo"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteUsuario(deleteId);
            setUsuarios(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null);
          } catch (err) {
            console.error(err);
          }
        }}
        title="Eliminar Usuario"
        message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
