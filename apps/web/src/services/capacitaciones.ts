import api from "./api";

export interface Capacitacion {
  id: string;
  codigo: string;
  tipo: string;
  tema: string;
  descripcion: string | null;
  capacitador: string;
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  duracionHoras: number | null;
  lugar: string;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  materialEntregado: string | null;
  observaciones: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { participantes: number };
  participantes?: Participante[];
}

interface CapacitacionDTO {
  id: string;
  codigo: string;
  tipo: string;
  tema: string;
  descripcion: string | null;
  capacitador: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  duracion_horas: number | null;
  lugar: string;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  material_entregado: string | null;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  _count?: { participantes: number };
  participantes?: ParticipanteDTO[];
}

export interface Participante {
  id: string;
  capacitacionId: string;
  productorId: string | null;
  usuarioId: string | null;
  asistio: boolean;
  firmaUrl: string | null;
  observaciones: string | null;
  createdAt: string;
  productor?: {
    id: string;
    codigo?: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni?: string;
    comunidad?: string;
  } | null;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    rol_sic?: string;
  } | null;
}

interface ParticipanteDTO {
  id: string;
  capacitacion_id: string;
  productor_id: string | null;
  usuario_id: string | null;
  asistio: boolean;
  firma_url: string | null;
  observaciones: string | null;
  created_at: string;
  productor?: {
    id: string;
    codigo?: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni?: string;
    comunidad?: string;
  } | null;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    rol_sic?: string;
  } | null;
}

function toFrontend(dto: CapacitacionDTO): Capacitacion {
  return {
    id: dto.id,
    codigo: dto.codigo,
    tipo: dto.tipo,
    tema: dto.tema,
    descripcion: dto.descripcion,
    capacitador: dto.capacitador,
    fecha: dto.fecha?.split("T")[0] ?? "",
    horaInicio: dto.hora_inicio,
    horaFin: dto.hora_fin,
    duracionHoras: dto.duracion_horas ? Number(dto.duracion_horas) : null,
    lugar: dto.lugar,
    departamento: dto.departamento,
    provincia: dto.provincia,
    distrito: dto.distrito,
    materialEntregado: dto.material_entregado,
    observaciones: dto.observaciones,
    activo: dto.activo,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    _count: dto._count,
    participantes: dto.participantes?.map(participanteToFrontend),
  };
}

function toBackend(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.tipo !== undefined) out.tipo = data.tipo;
  if (data.tema !== undefined) out.tema = data.tema;
  if (data.descripcion !== undefined) out.descripcion = data.descripcion || null;
  if (data.capacitador !== undefined) out.capacitador = data.capacitador;
  if (data.fecha !== undefined) out.fecha = data.fecha;
  if (data.horaInicio !== undefined) out.hora_inicio = data.horaInicio || null;
  if (data.horaFin !== undefined) out.hora_fin = data.horaFin || null;
  if (data.duracionHoras !== undefined) out.duracion_horas = data.duracionHoras;
  if (data.lugar !== undefined) out.lugar = data.lugar;
  if (data.departamento !== undefined) out.departamento = data.departamento || null;
  if (data.provincia !== undefined) out.provincia = data.provincia || null;
  if (data.distrito !== undefined) out.distrito = data.distrito || null;
  if (data.materialEntregado !== undefined) out.material_entregado = data.materialEntregado || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

function participanteToFrontend(dto: ParticipanteDTO): Participante {
  return {
    id: dto.id,
    capacitacionId: dto.capacitacion_id,
    productorId: dto.productor_id,
    usuarioId: dto.usuario_id,
    asistio: dto.asistio,
    firmaUrl: dto.firma_url,
    observaciones: dto.observaciones,
    createdAt: dto.created_at,
    productor: dto.productor,
    usuario: dto.usuario,
  };
}

export async function fetchCapacitaciones(params?: {
  search?: string;
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Capacitacion[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.tipo) query.set('tipo', params.tipo);
  if (params?.fecha_inicio) query.set('fecha_inicio', params.fecha_inicio);
  if (params?.fecha_fin) query.set('fecha_fin', params.fecha_fin);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const res = await api.get(`/capacitaciones${qs ? `?${qs}` : ''}`);
  return {
    data: res.data.data.map(toFrontend),
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
}

export async function fetchCapacitacion(id: string): Promise<Capacitacion> {
  const res = await api.get(`/capacitaciones/${id}`);
  return toFrontend(res.data.data);
}

export async function createCapacitacion(data: {
  tipo?: string;
  tema?: string;
  descripcion?: string;
  capacitador?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  duracionHoras?: number;
  lugar?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  materialEntregado?: string;
  observaciones?: string;
  participantes?: Array<{ productorId?: string; usuarioId?: string; asistio?: boolean }>;
}): Promise<Capacitacion> {
  const payload = toBackend(data);
  if (data.participantes) {
    payload.participantes = data.participantes.map((p) => ({
      productor_id: p.productorId || null,
      usuario_id: p.usuarioId || null,
      asistio: p.asistio ?? false,
    }));
  }
  const res = await api.post("/capacitaciones", payload);
  return toFrontend(res.data.data);
}

export async function updateCapacitacion(id: string, data: Record<string, unknown>): Promise<Capacitacion> {
  const res = await api.put(`/capacitaciones/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteCapacitacion(id: string): Promise<void> {
  await api.delete(`/capacitaciones/${id}`);
}

// ─── Participantes ───────────────────────────────────────────

export async function addParticipante(
  capacitacionId: string,
  data: { productorId?: string; usuarioId?: string; asistio?: boolean; firmaUrl?: string; observaciones?: string }
): Promise<Participante> {
  const res = await api.post(`/capacitaciones/${capacitacionId}/participantes`, {
    productor_id: data.productorId || null,
    usuario_id: data.usuarioId || null,
    asistio: data.asistio ?? false,
    firma_url: data.firmaUrl || null,
    observaciones: data.observaciones || null,
  });
  return participanteToFrontend(res.data.data);
}

export async function updateParticipante(
  capacitacionId: string,
  participanteId: string,
  data: { asistio?: boolean; firmaUrl?: string; observaciones?: string }
): Promise<Participante> {
  const res = await api.put(`/capacitaciones/${capacitacionId}/participantes/${participanteId}`, {
    asistio: data.asistio,
    firma_url: data.firmaUrl || null,
    observaciones: data.observaciones || null,
  });
  return participanteToFrontend(res.data.data);
}

export async function deleteParticipante(capacitacionId: string, participanteId: string): Promise<void> {
  await api.delete(`/capacitaciones/${capacitacionId}/participantes/${participanteId}`);
}
