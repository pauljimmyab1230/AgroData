import api from "./api";

export interface Productor {
  id: number;
  codigo: string;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: string;
  fechaNacimiento: string;
  estadoCivil: string;
  telefono: string | null;
  correo: string | null;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  direccion: string | null;
  nivelEducativo: string;
  idiomaPrincipal: string;
  idiomaSecundario: string;
  estado: string;
  fechaIngreso: string;
  organizacion: string;
  cargo: string;
  nroHijos: number | null;
  nroFamiliares: number | null;
}

export interface ProductoresResponse {
  data: Productor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductorStats {
  total: number;
  activos: number;
  suspendidos: number;
  mujeres: number;
  varones: number;
}

function productorToFrontend(dto: any): Productor {
  return {
    id: dto.id,
    codigo: dto.codigo,
    dni: dto.dni,
    nombres: dto.nombres,
    apellidoPaterno: dto.apellido_paterno ?? "",
    apellidoMaterno: dto.apellido_materno ?? "",
    sexo: dto.sexo,
    fechaNacimiento: dto.fecha_nacimiento?.split("T")[0] ?? "",
    estadoCivil: dto.estado_civil,
    telefono: dto.telefono,
    correo: dto.correo,
    departamento: dto.departamento,
    provincia: dto.provincia,
    distrito: dto.distrito,
    comunidad: dto.comunidad,
    direccion: dto.direccion,
    nivelEducativo: dto.nivel_educativo,
    idiomaPrincipal: dto.idioma_principal,
    idiomaSecundario: dto.idioma_secundario,
    estado: dto.estado,
    fechaIngreso: dto.fecha_ingreso?.split("T")[0] ?? "",
    organizacion: dto.organizacion,
    cargo: dto.cargo,
    nroHijos: dto.nroHijos ?? null,
    nroFamiliares: dto.nroFamiliares ?? null,
  };
}

function formatDateToISO(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.includes('T')) return dateStr;
  return `${dateStr}T00:00:00.000Z`;
}

function toBackend(data: Partial<Productor>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.dni !== undefined) out.dni = data.dni;
  if (data.nombres !== undefined) out.nombres = data.nombres;
  if (data.apellidoPaterno !== undefined) out.apellido_paterno = data.apellidoPaterno;
  if (data.apellidoMaterno !== undefined) out.apellido_materno = data.apellidoMaterno;
  if (data.sexo !== undefined) out.sexo = data.sexo;
  if (data.fechaNacimiento !== undefined) out.fecha_nacimiento = formatDateToISO(data.fechaNacimiento);
  if (data.estadoCivil !== undefined) out.estado_civil = data.estadoCivil;
  if (data.telefono !== undefined) out.telefono = data.telefono || null;
  if (data.correo !== undefined) out.correo = data.correo || null;
  if (data.departamento !== undefined) out.departamento = data.departamento;
  if (data.provincia !== undefined) out.provincia = data.provincia;
  if (data.distrito !== undefined) out.distrito = data.distrito;
  if (data.comunidad !== undefined) out.comunidad = data.comunidad;
  if (data.direccion !== undefined) out.direccion = data.direccion || null;
  if (data.nivelEducativo !== undefined) out.nivel_educativo = data.nivelEducativo;
  if (data.idiomaPrincipal !== undefined) out.idioma_principal = data.idiomaPrincipal;
  if (data.idiomaSecundario !== undefined) out.idioma_secundario = data.idiomaSecundario || 'NINGUNO';
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.fechaIngreso !== undefined) out.fecha_ingreso = formatDateToISO(data.fechaIngreso);
  if (data.organizacion !== undefined) out.organizacion = data.organizacion;
  if (data.cargo !== undefined) out.cargo = data.cargo;
  return out;
}

export async function fetchProductores(filters?: {
  search?: string;
  estado?: string;
  cargo?: string;
  sexo?: string;
  comunidad?: string;
  page?: number;
  limit?: number;
}): Promise<ProductoresResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.cargo) params.append("cargo", filters.cargo);
  if (filters?.sexo) params.append("sexo", filters.sexo);
  if (filters?.comunidad) params.append("comunidad", filters.comunidad);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const { data } = await api.get(`/productores?${params.toString()}`);
  return {
    ...data,
    data: (data.data ?? []).map(productorToFrontend),
  };
}

export async function fetchProductor(id: number): Promise<Productor> {
  const { data } = await api.get(`/productores/${id}`);
  return productorToFrontend(data.data ?? data);
}

export async function fetchProductorStats(): Promise<ProductorStats> {
  const { data } = await api.get("/productores/stats");
  return data.data ?? data;
}

export async function fetchComunidades(): Promise<string[]> {
  const { data } = await api.get("/productores/comunidades");
  return data.data ?? data;
}

export async function createProductor(data: Partial<Productor>): Promise<Productor> {
  const { data: res } = await api.post("/productores", toBackend(data));
  return productorToFrontend(res.data ?? res);
}

export async function updateProductor(id: number, data: Partial<Productor>): Promise<Productor> {
  const { data: res } = await api.put(`/productores/${id}`, toBackend(data));
  return productorToFrontend(res.data ?? res);
}

export async function deleteProductor(id: number): Promise<void> {
  await api.delete(`/productores/${id}`);
}

// ─── Familiares ─────────────────────────────────────────────

export interface Familiar {
  id: number;
  nombres: string;
  parentesco: string;
  dni: string | null;
  sexo: string;
  fechaNacimiento: string;
  ocupacion: string | null;
  nivelEducativo: string | null;
  telefono: string | null;
  dependiente: boolean;
  viveConProductor: boolean;
}

function familiarToBackend(data: Partial<Familiar>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.nombres !== undefined) out.nombres = data.nombres;
  if (data.parentesco !== undefined) out.parentesco = data.parentesco;
  if (data.dni !== undefined) out.dni = data.dni || null;
  if (data.sexo !== undefined) out.sexo = data.sexo;
  if (data.fechaNacimiento !== undefined) out.fecha_nacimiento = formatDateToISO(data.fechaNacimiento);
  if (data.ocupacion !== undefined) out.ocupacion = data.ocupacion || null;
  if (data.nivelEducativo !== undefined) out.nivel_educativo = data.nivelEducativo || null;
  if (data.telefono !== undefined) out.telefono = data.telefono || null;
  if (data.dependiente !== undefined) out.dependiente = data.dependiente;
  if (data.viveConProductor !== undefined) out.vive_con_productor = data.viveConProductor;
  return out;
}

function familiarToFrontend(dto: any): Familiar {
  return {
    id: dto.id,
    nombres: dto.nombres,
    parentesco: dto.parentesco,
    dni: dto.dni,
    sexo: dto.sexo,
    fechaNacimiento: dto.fecha_nacimiento?.split("T")[0] ?? "",
    ocupacion: dto.ocupacion,
    nivelEducativo: dto.nivel_educativo,
    telefono: dto.telefono,
    dependiente: dto.dependiente,
    viveConProductor: dto.vive_con_productor,
  };
}

export async function fetchFamiliares(productorId: number): Promise<Familiar[]> {
  const { data } = await api.get(`/productores/${productorId}/familiares`);
  return (data.data ?? []).map(familiarToFrontend);
}

export async function createFamiliar(productorId: number, data: Partial<Familiar>): Promise<Familiar> {
  const { data: res } = await api.post(`/productores/${productorId}/familiares`, familiarToBackend(data));
  return familiarToFrontend(res.data ?? res);
}

export async function updateFamiliar(productorId: number, familiarId: number, data: Partial<Familiar>): Promise<Familiar> {
  const { data: res } = await api.put(`/productores/${productorId}/familiares/${familiarId}`, familiarToBackend(data));
  return familiarToFrontend(res.data ?? res);
}

export async function deleteFamiliar(productorId: number, familiarId: number): Promise<void> {
  await api.delete(`/productores/${productorId}/familiares/${familiarId}`);
}
