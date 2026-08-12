import api from "./api";

export interface Productor {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: string;
  fechaNacimiento: string;
  estadoCivil: string;
  telefono: string;
  correo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  direccion: string;
  nivelEducativo: string;
  idiomaPrincipal: string;
  idiomaSecundario: string;
  estado: string;
  fechaIngreso: string;
  organizacion: string;
  cargo: string;
  fotoUrl: string | null;
  firmaUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { familiares: number; parcelas: number; documentos: number };
}

interface ProductorDTO {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: string;
  fecha_nacimiento: string;
  estado_civil: string;
  telefono: string;
  correo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  direccion: string;
  nivel_educativo: string;
  idioma_principal: string;
  idioma_secundario: string;
  estado: string;
  fecha_ingreso: string;
  organizacion: string;
  cargo: string;
  foto_url: string | null;
  firma_url: string | null;
  created_at: string;
  updated_at: string;
  _count?: { familiares: number; parcelas: number; documentos: number };
}

function toFrontend(dto: ProductorDTO): Productor {
  return {
    id: dto.id,
    codigo: dto.codigo,
    dni: dto.dni,
    nombres: dto.nombres,
    apellidoPaterno: dto.apellido_paterno,
    apellidoMaterno: dto.apellido_materno,
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
    fotoUrl: dto.foto_url,
    firmaUrl: dto.firma_url,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    _count: dto._count,
  };
}

function toBackend(data: Partial<Productor>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.dni !== undefined) out.dni = data.dni;
  if (data.nombres !== undefined) out.nombres = data.nombres;
  if (data.apellidoPaterno !== undefined) out.apellido_paterno = data.apellidoPaterno;
  if (data.apellidoMaterno !== undefined) out.apellido_materno = data.apellidoMaterno;
  if (data.sexo !== undefined) out.sexo = data.sexo;
  if (data.fechaNacimiento !== undefined) out.fecha_nacimiento = data.fechaNacimiento;
  if (data.estadoCivil !== undefined) out.estado_civil = data.estadoCivil;
  if (data.telefono !== undefined) out.telefono = data.telefono;
  if (data.correo !== undefined) out.correo = data.correo;
  if (data.departamento !== undefined) out.departamento = data.departamento;
  if (data.provincia !== undefined) out.provincia = data.provincia;
  if (data.distrito !== undefined) out.distrito = data.distrito;
  if (data.comunidad !== undefined) out.comunidad = data.comunidad;
  if (data.direccion !== undefined) out.direccion = data.direccion;
  if (data.nivelEducativo !== undefined) out.nivel_educativo = data.nivelEducativo;
  if (data.idiomaPrincipal !== undefined) out.idioma_principal = data.idiomaPrincipal;
  if (data.idiomaSecundario !== undefined) out.idioma_secundario = data.idiomaSecundario;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.fechaIngreso !== undefined) out.fecha_ingreso = data.fechaIngreso;
  if (data.organizacion !== undefined) out.organizacion = data.organizacion;
  if (data.cargo !== undefined) out.cargo = data.cargo;
  return out;
}

export async function fetchProductores(params?: {
  search?: string;
  estado?: string;
  cargo?: string;
  sexo?: string;
  comunidad?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Productor[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.estado) query.set('estado', params.estado);
  if (params?.cargo) query.set('cargo', params.cargo);
  if (params?.sexo) query.set('sexo', params.sexo);
  if (params?.comunidad) query.set('comunidad', params.comunidad);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const res = await api.get(`/productores${qs ? `?${qs}` : ''}`);
  return {
    data: res.data.data.map(toFrontend),
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
}

export async function fetchProductor(id: string): Promise<Productor> {
  const res = await api.get(`/productores/${id}`);
  return toFrontend(res.data.data);
}

export async function createProductor(data: Partial<Productor>): Promise<Productor> {
  const res = await api.post("/productores", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateProductor(id: string, data: Partial<Productor>): Promise<Productor> {
  const res = await api.put(`/productores/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteProductor(id: string): Promise<void> {
  await api.delete(`/productores/${id}`);
}

// ─── Familiares ─────────────────────────────────────────────

export interface Familiar {
  id: string;
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

interface FamiliarDTO {
  id: string;
  nombres: string;
  parentesco: string;
  dni: string | null;
  sexo: string;
  fecha_nacimiento: string;
  ocupacion: string | null;
  nivel_educativo: string | null;
  telefono: string | null;
  dependiente: boolean;
  vive_con_productor: boolean;
}

function familiarToFrontend(dto: FamiliarDTO): Familiar {
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

function familiarToBackend(data: Partial<Familiar>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.nombres !== undefined) out.nombres = data.nombres;
  if (data.parentesco !== undefined) out.parentesco = data.parentesco;
  if (data.dni !== undefined) out.dni = data.dni || null;
  if (data.sexo !== undefined) out.sexo = data.sexo;
  if (data.fechaNacimiento !== undefined) out.fecha_nacimiento = data.fechaNacimiento;
  if (data.ocupacion !== undefined) out.ocupacion = data.ocupacion || null;
  if (data.nivelEducativo !== undefined) out.nivel_educativo = data.nivelEducativo || null;
  if (data.telefono !== undefined) out.telefono = data.telefono || null;
  if (data.dependiente !== undefined) out.dependiente = data.dependiente;
  if (data.viveConProductor !== undefined) out.vive_con_productor = data.viveConProductor;
  return out;
}

export async function fetchFamiliares(productorId: string): Promise<Familiar[]> {
  const res = await api.get(`/productores/${productorId}/familiares`);
  return (res.data.data ?? []).map(familiarToFrontend);
}

export async function createFamiliar(productorId: string, data: Partial<Familiar>): Promise<Familiar> {
  const res = await api.post(`/productores/${productorId}/familiares`, familiarToBackend(data));
  return familiarToFrontend(res.data.data);
}

export async function updateFamiliar(
  productorId: string,
  familiarId: string,
  data: Partial<Familiar>,
): Promise<Familiar> {
  const res = await api.put(`/productores/${productorId}/familiares/${familiarId}`, familiarToBackend(data));
  return familiarToFrontend(res.data.data);
}

export async function deleteFamiliar(productorId: string, familiarId: string): Promise<void> {
  await api.delete(`/productores/${productorId}/familiares/${familiarId}`);
}

// ─── Parcelas ───────────────────────────────────────────────

export interface Parcela {
  id: string;
  codigo: string;
  nombre: string;
  cultivo: string;
  area: string;
  areaUnidad: string;
  ubicacion: string;
  certificacion: string;
  estado: string;
  productor_id?: string;
}

interface ParcelaDTO {
  id: string;
  codigo: string;
  nombre: string;
  cultivo: string;
  area: string;
  area_unidad: string;
  ubicacion: string;
  certificacion: string;
  estado: string;
  productor_id?: string;
}

function parcelaToFrontend(dto: ParcelaDTO): Parcela {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    cultivo: dto.cultivo,
    area: Number(dto.area) || 0,
    areaUnidad: dto.area_unidad,
    ubicacion: dto.ubicacion,
    certificacion: dto.certificacion,
    estado: dto.estado,
    productor_id: dto.productor_id,
  };
}

function parcelaToBackend(data: Partial<Parcela>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.cultivo !== undefined) out.cultivo = data.cultivo;
  if (data.area !== undefined) out.area = data.area;
  if (data.areaUnidad !== undefined) out.area_unidad = data.areaUnidad;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.productor_id !== undefined) out.productor_id = data.productor_id;
  return out;
}

export async function fetchParcelas(productorId: string): Promise<Parcela[]> {
  const res = await api.get(`/parcelas?productor_id=${productorId}`);
  return (res.data.data ?? []).map(parcelaToFrontend);
}

export async function createParcela(productorId: string, data: Partial<Parcela>): Promise<Parcela> {
  const payload = { ...parcelaToBackend(data), productor_id: productorId };
  const res = await api.post("/parcelas", payload);
  return parcelaToFrontend(res.data.data);
}

export async function updateParcela(
  parcelaId: string,
  data: Partial<Parcela>,
): Promise<Parcela> {
  const res = await api.put(`/parcelas/${parcelaId}`, parcelaToBackend(data));
  return parcelaToFrontend(res.data.data);
}

export async function deleteParcela(parcelaId: string): Promise<void> {
  await api.delete(`/parcelas/${parcelaId}`);
}

// ─── Documentos ─────────────────────────────────────────────

export interface Documento {
  id: string;
  tipo: string;
  categoria: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_bytes: number;
  mime_type: string;
  estado: string;
  created_at: string;
}

export async function fetchDocumentos(productorId: string): Promise<Documento[]> {
  const res = await api.get(`/productores/${productorId}/documentos`);
  return res.data.data ?? [];
}

export async function createDocumento(
  productorId: string,
  data: { tipo: string; categoria: string; nombre_archivo: string; ruta_archivo: string; tamano_bytes: number; mime_type: string }
): Promise<Documento> {
  const res = await api.post(`/productores/${productorId}/documentos`, data);
  return res.data.data;
}

export async function deleteDocumento(productorId: string, documentoId: string): Promise<void> {
  await api.delete(`/productores/${productorId}/documentos/${documentoId}`);
}

export async function uploadArchivo(
  tipo: 'documentos' | 'fotos' | 'firmas',
  file: File
): Promise<{ nombre_archivo: string; ruta_archivo: string; tamano_bytes: number; mime_type: string }> {
  const formData = new FormData();
  formData.append('archivo', file);
  const res = await api.post(`/upload/${tipo}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function fetchComunidades(): Promise<string[]> {
  const res = await api.get('/productores/comunidades');
  return res.data.data;
}
