export type Parcela = {
  id: number;
  codigo: string;
  nombre: string;
  productorId: number;
  productor: string;
  comunidad: string;
  sector: string;
  altitud: string;
  areaTotal: string;
  areaCertificada: string;
  estado: string;
  certificacion: string;
  cultivoPrincipal: string;
  departamento: string;
  provincia: string;
  distrito: string;
  centroPoblado: string;
  ubigeo: string;
  latitud: string;
  longitud: string;
  precisionGps: string;
  tipoSuelo: string;
  textura: string;
  pendiente: string;
  fuenteAgua: string;
  sistemaRiego: string;
  zonaAgroecologica: string;
  disponibilidadAgua: string;
  observaciones: string;
  areaCalculada: string;
  perimetro: string;
  vertices: number;
  fechaLevantamiento: string;
  responsable: string;
  fechaRegistro: string;
};

export type ParcelaDocumento = {
  id: number;
  tipo: string;
  nombre: string;
  tamano: string;
  fecha: string;
  estado: string;
};

export type ParcelaFoto = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  autor: string;
  observaciones: string;
};

export type ParcelaHistorialItem = {
  id: number;
  tipo: "registro" | "documento" | "cultivo" | "campania" | "inspeccion";
  titulo: string;
  descripcion: string;
  fecha: string;
};

export const productoresOpciones = [
  "Apolinario Condori",
  "María Huamán",
  "Pedro Rojas",
  "Rosa Chávez",
  "Juan Gutiérrez",
  "Lucía Mendoza",
];

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

export const estadosOpciones = ["Activa", "Inactiva"];

export const certificacionOpciones = ["Orgánica", "En Transición"];

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

export const parcelasMock: Parcela[] = [
  {
    id: 1,
    codigo: "PAR-001",
    nombre: "Parcela A - Ñawpa Rumi",
    productorId: 1,
    productor: "Apolinario Condori",
    comunidad: "Collpaccasa",
    sector: "Ñawpa Rumi",
    altitud: "3,450 m.s.n.m.",
    areaTotal: "2.40 ha",
    areaCertificada: "2.40 ha",
    estado: "Activa",
    certificacion: "Orgánica",
    cultivoPrincipal: "Quinua",
    departamento: "Ayacucho",
    provincia: "Vilcas Huamán",
    distrito: "Vilcas Huamán",
    centroPoblado: "Collpaccasa",
    ubigeo: "050903",
    latitud: "-13.6532",
    longitud: "-73.8741",
    precisionGps: "± 3 m",
    tipoSuelo: "Franco Arenoso",
    textura: "Media",
    pendiente: "Moderada (8-15%)",
    fuenteAgua: "Manantial",
    sistemaRiego: "Gravedad",
    zonaAgroecologica: "Suni",
    disponibilidadAgua: "Estacional",
    observaciones: "Suelo con buena capacidad de drenaje, apto para quinua orgánica.",
    areaCalculada: "2.40 ha",
    perimetro: "720 m",
    vertices: 5,
    fechaLevantamiento: "2019-04-18",
    responsable: "Ing. Carmen Poma",
    fechaRegistro: "2019-04-20",
  },
  {
    id: 2,
    codigo: "PAR-002",
    nombre: "Parcela B - Pampa Urku",
    productorId: 2,
    productor: "María Huamán",
    comunidad: "Pampa Cangallo",
    sector: "Pampa Urku",
    altitud: "3,210 m.s.n.m.",
    areaTotal: "1.85 ha",
    areaCertificada: "1.20 ha",
    estado: "Activa",
    certificacion: "En Transición",
    cultivoPrincipal: "Papa Nativa",
    departamento: "Ayacucho",
    provincia: "Cangallo",
    distrito: "Cangallo",
    centroPoblado: "Pampa Cangallo",
    ubigeo: "050201",
    latitud: "-13.6290",
    longitud: "-74.1482",
    precisionGps: "± 5 m",
    tipoSuelo: "Franco Arcilloso",
    textura: "Fina",
    pendiente: "Ligeramente Inclinada (4-8%)",
    fuenteAgua: "Río",
    sistemaRiego: "Aspersión",
    zonaAgroecologica: "Quechua",
    disponibilidadAgua: "Permanente",
    observaciones: "Suelo con alta retención de humedad, apto para papa nativa.",
    areaCalculada: "1.85 ha",
    perimetro: "560 m",
    vertices: 5,
    fechaLevantamiento: "2020-09-10",
    responsable: "Ing. Luis Palomino",
    fechaRegistro: "2020-09-14",
  },
  {
    id: 3,
    codigo: "PAR-003",
    nombre: "Parcela C - Qucha Pata",
    productorId: 3,
    productor: "Pedro Rojas",
    comunidad: "Chaupimayo",
    sector: "Qucha Pata",
    altitud: "3,520 m.s.n.m.",
    areaTotal: "0.90 ha",
    areaCertificada: "0.00 ha",
    estado: "Inactiva",
    certificacion: "En Transición",
    cultivoPrincipal: "Cebada",
    departamento: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Chiara",
    centroPoblado: "Chaupimayo",
    ubigeo: "050103",
    latitud: "-13.2210",
    longitud: "-74.2140",
    precisionGps: "± 4 m",
    tipoSuelo: "Franco",
    textura: "Media",
    pendiente: "Fuerte (15-30%)",
    fuenteAgua: "Precipitación (Lluvia)",
    sistemaRiego: "Secano",
    zonaAgroecologica: "Puna",
    disponibilidadAgua: "Escasa",
    observaciones: "Terreno con pendiente pronunciada, requiere prácticas de conservación.",
    areaCalculada: "0.90 ha",
    perimetro: "420 m",
    vertices: 4,
    fechaLevantamiento: "2018-11-25",
    responsable: "Ing. Carmen Poma",
    fechaRegistro: "2018-12-01",
  },
  {
    id: 4,
    codigo: "PAR-004",
    nombre: "Parcela D - Puca Pampa",
    productorId: 4,
    productor: "Rosa Chávez",
    comunidad: "Pampas",
    sector: "Pucapampa",
    altitud: "3,380 m.s.n.m.",
    areaTotal: "3.15 ha",
    areaCertificada: "3.15 ha",
    estado: "Activa",
    certificacion: "Orgánica",
    cultivoPrincipal: "Maíz",
    departamento: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Vinchos",
    centroPoblado: "Pampas",
    ubigeo: "050109",
    latitud: "-13.1890",
    longitud: "-74.3100",
    precisionGps: "± 3 m",
    tipoSuelo: "Franco Arcilloso",
    textura: "Fina",
    pendiente: "Plana (0-4%)",
    fuenteAgua: "Canal de Riego",
    sistemaRiego: "Gravedad",
    zonaAgroecologica: "Quechua",
    disponibilidadAgua: "Permanente",
    observaciones: "Suelo profundo con buen contenido de materia orgánica.",
    areaCalculada: "3.15 ha",
    perimetro: "880 m",
    vertices: 6,
    fechaLevantamiento: "2021-06-05",
    responsable: "Ing. Luis Palomino",
    fechaRegistro: "2021-06-08",
  },
  {
    id: 5,
    codigo: "PAR-005",
    nombre: "Parcela E - San Martín",
    productorId: 5,
    productor: "Juan Gutiérrez",
    comunidad: "Moyobamba",
    sector: "San Martín",
    altitud: "3,290 m.s.n.m.",
    areaTotal: "1.60 ha",
    areaCertificada: "0.80 ha",
    estado: "Activa",
    certificacion: "En Transición",
    cultivoPrincipal: "Haba",
    departamento: "Ayacucho",
    provincia: "Fajardo",
    distrito: "Huancapi",
    centroPoblado: "Moyobamba",
    ubigeo: "050403",
    latitud: "-13.7040",
    longitud: "-74.0790",
    precisionGps: "± 6 m",
    tipoSuelo: "Arenoso",
    textura: "Gruesa",
    pendiente: "Ligeramente Inclinada (4-8%)",
    fuenteAgua: "Manantial",
    sistemaRiego: "Secano",
    zonaAgroecologica: "Quechua",
    disponibilidadAgua: "Estacional",
    observaciones: "Suelo arenoso con baja retención de nutrientes.",
    areaCalculada: "1.60 ha",
    perimetro: "510 m",
    vertices: 5,
    fechaLevantamiento: "2017-03-18",
    responsable: "Ing. Carmen Poma",
    fechaRegistro: "2017-03-22",
  },
  {
    id: 6,
    codigo: "PAR-006",
    nombre: "Parcela F - Tiquihua Alta",
    productorId: 6,
    productor: "Lucía Mendoza",
    comunidad: "Tiquihua",
    sector: "Tiquihua",
    altitud: "3,600 m.s.n.m.",
    areaTotal: "2.05 ha",
    areaCertificada: "2.05 ha",
    estado: "Activa",
    certificacion: "Orgánica",
    cultivoPrincipal: "Tarwi",
    departamento: "Ayacucho",
    provincia: "Vilcas Huamán",
    distrito: "Vilcas Huamán",
    centroPoblado: "Tiquihua",
    ubigeo: "050903",
    latitud: "-13.6410",
    longitud: "-73.8890",
    precisionGps: "± 3 m",
    tipoSuelo: "Franco",
    textura: "Media",
    pendiente: "Moderada (8-15%)",
    fuenteAgua: "Laguna",
    sistemaRiego: "Goteo",
    zonaAgroecologica: "Suni",
    disponibilidadAgua: "Permanente",
    observaciones: "Suelo fértil, ideal para tarwi y leguminosas.",
    areaCalculada: "2.05 ha",
    perimetro: "640 m",
    vertices: 5,
    fechaLevantamiento: "2020-02-12",
    responsable: "Ing. Luis Palomino",
    fechaRegistro: "2020-02-17",
  },
  {
    id: 7,
    codigo: "PAR-007",
    nombre: "Parcela G - Rumi Pata",
    productorId: 1,
    productor: "Apolinario Condori",
    comunidad: "Collpaccasa",
    sector: "Rumi Pata",
    altitud: "3,470 m.s.n.m.",
    areaTotal: "1.10 ha",
    areaCertificada: "0.00 ha",
    estado: "Inactiva",
    certificacion: "En Transición",
    cultivoPrincipal: "Quinua",
    departamento: "Ayacucho",
    provincia: "Vilcas Huamán",
    distrito: "Vilcas Huamán",
    centroPoblado: "Collpaccasa",
    ubigeo: "050903",
    latitud: "-13.6490",
    longitud: "-73.8660",
    precisionGps: "± 4 m",
    tipoSuelo: "Franco",
    textura: "Media",
    pendiente: "Moderada (8-15%)",
    fuenteAgua: "Manantial",
    sistemaRiego: "Gravedad",
    zonaAgroecologica: "Suni",
    disponibilidadAgua: "Estacional",
    observaciones: "Parcela en proceso de transición a producción orgánica.",
    areaCalculada: "1.10 ha",
    perimetro: "460 m",
    vertices: 5,
    fechaLevantamiento: "2019-10-30",
    responsable: "Ing. Carmen Poma",
    fechaRegistro: "2019-11-05",
  },
  {
    id: 8,
    codigo: "PAR-008",
    nombre: "Parcela H - Inti Huasi",
    productorId: 4,
    productor: "Rosa Chávez",
    comunidad: "Pampas",
    sector: "Inti Huasi",
    altitud: "3,400 m.s.n.m.",
    areaTotal: "2.75 ha",
    areaCertificada: "1.90 ha",
    estado: "Activa",
    certificacion: "Orgánica",
    cultivoPrincipal: "Papa Nativa",
    departamento: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Vinchos",
    centroPoblado: "Pampas",
    ubigeo: "050109",
    latitud: "-13.1960",
    longitud: "-74.2980",
    precisionGps: "± 3 m",
    tipoSuelo: "Franco Arcilloso",
    textura: "Fina",
    pendiente: "Ligeramente Inclinada (4-8%)",
    fuenteAgua: "Canal de Riego",
    sistemaRiego: "Aspersión",
    zonaAgroecologica: "Quechua",
    disponibilidadAgua: "Permanente",
    observaciones: "Suelo con óptimas condiciones para papa nativa orgánica.",
    areaCalculada: "2.75 ha",
    perimetro: "720 m",
    vertices: 6,
    fechaLevantamiento: "2021-10-25",
    responsable: "Ing. Luis Palomino",
    fechaRegistro: "2021-10-30",
  },
];

export const mockParcela: Parcela = parcelasMock[0];

export const parcelaFotosMock: ParcelaFoto[] = [
  {
    id: "general",
    titulo: "Vista General",
    descripcion: "Vista general de la parcela",
    fecha: "2024-08-15",
    autor: "Técnico de campo",
    observaciones: "Vista panorámica del área total cultivada.",
  },
  {
    id: "norte",
    titulo: "Límite Norte",
    descripcion: "Vista desde el límite norte",
    fecha: "2024-08-15",
    autor: "Técnico de campo",
    observaciones: "Límite con la parcela del productor vecino.",
  },
  {
    id: "sur",
    titulo: "Límite Sur",
    descripcion: "Vista desde el límite sur",
    fecha: "2024-08-16",
    autor: "Técnico de campo",
    observaciones: "Acceso principal por camino de herradura.",
  },
  {
    id: "este",
    titulo: "Límite Este",
    descripcion: "Vista desde el límite este",
    fecha: "2024-08-16",
    autor: "Técnico de campo",
    observaciones: "Zona de riego por gravedad.",
  },
  {
    id: "oeste",
    titulo: "Límite Oeste",
    descripcion: "Vista desde el límite oeste",
    fecha: "2024-08-17",
    autor: "Técnico de campo",
    observaciones: "Zona con vegetación nativa de protección.",
  },
];

export const parcelaDocumentosMock: ParcelaDocumento[] = [
  { id: 1, tipo: "Croquis", nombre: "croquis_parcela_a.jpg", tamano: "520 KB", fecha: "2024-06-30", estado: "Verificado" },
  { id: 2, tipo: "Plano", nombre: "plano_georreferenciado.pdf", tamano: "1.4 MB", fecha: "2025-02-10", estado: "Verificado" },
  { id: 3, tipo: "Título", nombre: "titulo_de_propiedad.pdf", tamano: "1.8 MB", fecha: "2019-01-25", estado: "Pendiente" },
  { id: 4, tipo: "Contrato", nombre: "contrato_parcela_2025.pdf", tamano: "860 KB", fecha: "2025-01-08", estado: "Pendiente" },
];

export const parcelaHistorialMock: ParcelaHistorialItem[] = [
  {
    id: 1,
    tipo: "registro",
    titulo: "Registro de la parcela",
    descripcion: "Alta de la parcela en el sistema de la cooperativa.",
    fecha: "2019-04-20",
  },
  {
    id: 2,
    tipo: "documento",
    titulo: "Título de propiedad",
    descripcion: "Registro del título de propiedad de la parcela.",
    fecha: "2019-05-12",
  },
  {
    id: 3,
    tipo: "cultivo",
    titulo: "Campaña de siembra",
    descripcion: "Siembra de quinua orgánica en el sector Ñawpa Rumi.",
    fecha: "2023-11-05",
  },
  {
    id: 4,
    tipo: "campania",
    titulo: "Participación en campaña",
    descripcion: "Campaña de cultivos andinos 2023-2024.",
    fecha: "2024-03-18",
  },
  {
    id: 5,
    tipo: "inspeccion",
    titulo: "Inspección interna",
    descripcion: "Inspección interna de certificación orgánica aprobada.",
    fecha: "2025-01-20",
  },
];

export const parcelaCultivosMock = ["Quinua", "Haba", "Cebada"];

export const parcelaCampaniasMock = [
  { id: 1, nombre: "Campaña 2022-2023" },
  { id: 2, nombre: "Campaña 2023-2024" },
];

export const parcelaInspeccionesMock = [
  { id: 1, fecha: "2024-08-14", resultado: "Aprobado" },
  { id: 2, fecha: "2025-01-20", resultado: "Aprobado" },
];
