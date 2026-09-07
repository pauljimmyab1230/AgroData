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

export const texturaOpciones = ["Fina", "Media", "Gruesa"];

export const pendienteOpciones = [
  "Plana (0-4%)",
  "Ligeramente Inclinada (4-8%)",
  "Moderada (8-15%)",
  "Fuerte (15-30%)",
];

export const disponibilidadAguaOpciones = ["Permanente", "Estacional", "Escasa", "No Dispone"];

export const toOptions = (items: string[]): ParcelaSelectOption[] =>
  items.map((item) => ({ value: item, label: item }));
