export interface ParcelaSelectOption {
  value: string;
  label: string;
}

export const comunidadesOpciones = [
  "Collpaccasa",
  "Pampa Cangallo",
  "Chaupimayo",
  "Pampas",
  "Moyobamba",
  "Tiquihua",
];

export const cultivosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Maíz", "Haba", "Tarwi"];

export const sectoresOpciones = ["Ñawpa Rumi", "Pampa Urku", "Qucha Pata", "Chaupimayo", "Pucapampa"];

export const estadosOpciones: ParcelaSelectOption[] = [
  { value: "ACTIVA", label: "Activa" },
  { value: "INACTIVA", label: "Inactiva" },
];

export const certificacionOpciones: ParcelaSelectOption[] = [
  { value: "ORGANICA", label: "Orgánica" },
  { value: "EN_TRANSICION", label: "En Transición" },
  { value: "CONVENCIONAL", label: "Convencional" },
];

export const tipoSueloOpciones = [
  "Franco",
  "Franco Arenoso",
  "Franco Arcilloso",
  "Arcilloso",
  "Arenoso",
  "Limoso",
];

export const texturaOpciones = ["Fina", "Media", "Gruesa"];

export const pendienteOpciones = [
  "Plana (0-4%)",
  "Ligeramente Inclinada (4-8%)",
  "Moderada (8-15%)",
  "Fuerte (15-30%)",
];

export const fuenteAguaOpciones = ["Río", "Manantial", "Laguna", "Canal de Riego", "Precipitación (Lluvia)"];

export const sistemaRiegoOpciones = ["Secano", "Gravedad", "Aspersión", "Goteo", "Inundación"];

export const zonaAgroecologicaOpciones = ["Quechua", "Suni", "Puna", "Yunga"];

export const disponibilidadAguaOpciones = ["Permanente", "Estacional", "Escasa", "No Dispone"];

export const toOptions = (items: string[]): ParcelaSelectOption[] =>
  items.map((item) => ({ value: item, label: item }));
