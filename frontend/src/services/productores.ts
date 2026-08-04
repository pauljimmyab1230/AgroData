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

export async function fetchProductores(): Promise<{ data: Productor[]; total: number }> {
  const res = await api.get("/productores");
  return {
    data: res.data.data.map(toFrontend),
    total: res.data.total,
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
