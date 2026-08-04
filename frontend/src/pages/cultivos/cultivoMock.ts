import { cultivosOpciones, parcelasMock, productoresOpciones } from "../parcelas/parcelaMock";

export type Cultivo = {
  id: number;
  codigo: string;
  campania: string;
  productor: string;
  parcela: string;
  cultivo: string;
  variedad: string;
  areaSembrada: number;
  fechaSiembra: string;
  metodoSiembra: string;
  sistemaProductivo: string;
  tipoAgricultura: string;
  certificacion: string;
  procedenciaSemilla: string;
  cantidadSemilla: number;
  unidadSemilla: string;
  fechaEmergencia: string;
  fechaFloracion: string;
  fechaCosecha: string;
  estado: string;
  observaciones: string;
  estadoFenologico: string;
  rendimientoEsperado: number;
  produccionEstimada: number;
  destinoProduccion: string;
  distanciamientoSurcos: string;
  distanciamientoPlantas: string;
  densidadSiembra: string;
  tipoSemilla: string;
  loteSemilla: string;
  proveedorSemilla: string;
  edadCultivoDias: number;
  actividadesRegistradas: number;
  inspecciones: number;
};

export type CultivoFoto = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha?: string;
  responsable?: string;
};

export type CultivoDocumento = {
  id: number;
  tipo: string;
  nombre: string;
  tamano: string;
  fecha: string;
  estado: string;
  categoria: "Técnicos" | "Análisis" | "Otros";
};

export type CultivoHistorialEvento = {
  id: number;
  titulo: string;
  fecha?: string;
  descripcion?: string;
  tipo: "registro" | "siembra" | "emergencia" | "actividad" | "inspeccion" | "floracion" | "cosecha";
  completado: boolean;
};

export const campanasOpciones = ["Campaña 2025-2026", "Campaña 2024-2025"];

export const parcelasOpciones = parcelasMock.map((p) => p.nombre);

export const variedadesOpciones = [
  "Negra Collana",
  "Blanca Junín",
  "Huamantanga",
  "Peruanita",
  "Bordaleza",
  "Blanco Gigante",
  "Común",
  "Andino",
];

export const estadosOpciones = ["Activo", "En Desarrollo", "Cosechado", "Finalizado"];

export const metodosSiembraOpciones = ["Directa", "Trasplante", "Almácigo", "Otro"];

export const sistemasProductivosOpciones = ["Agroecológico", "Orgánica", "Convencional", "En Transición"];

export const tiposAgriculturaOpciones = ["Tradicional", "Tecnificada", "Mixta"];

export const certificacionesOpciones = ["Orgánica", "En Transición", "Sin certificar"];

export const procedenciasSemillaOpciones = [
  "Semilla Certificada",
  "Semilla Común",
  "Producida en campo",
  "Conservada por el agricultor",
];

export const unidadesSemillaOpciones = ["kg", "lb", "qq", "t"];

export const fenologicoOpciones = [
  "Preparación del terreno",
  "Siembra",
  "Emergencia",
  "Desarrollo vegetativo",
  "Floración",
  "Fructificación",
  "Maduración",
  "Cosecha",
];

export const destinosProduccionOpciones = [
  "Venta a la cooperativa",
  "Comercialización local",
  "Autoconsumo",
  "Semilla",
];

export const tiposSemillaOpciones = ["Certificada", "Común", "Conservada", "Híbrida"];

export const cultivosMock: Cultivo[] = [
  {
    id: 1,
    codigo: "CUL-001",
    campania: "Campaña 2025-2026",
    productor: "Apolinario Condori",
    parcela: "Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    variedad: "Negra Collana",
    areaSembrada: 2.4,
    fechaSiembra: "2025-10-15",
    metodoSiembra: "Directa",
    sistemaProductivo: "Agroecológico",
    tipoAgricultura: "Tradicional",
    certificacion: "Orgánica",
    procedenciaSemilla: "Semilla Certificada",
    cantidadSemilla: 9.6,
    unidadSemilla: "kg",
    fechaEmergencia: "2025-10-30",
    fechaFloracion: "2026-01-10",
    fechaCosecha: "2026-04-20",
    estado: "Activo",
    observaciones:
      "Cultivo instalado con abonamiento orgánico de compost. Aplicación de biol foliar en fase de crecimiento vegetativo.",
    estadoFenologico: "Floración",
    rendimientoEsperado: 1800,
    produccionEstimada: 4320,
    destinoProduccion: "Venta a la cooperativa",
    distanciamientoSurcos: "0.80 m",
    distanciamientoPlantas: "0.15 m",
    densidadSiembra: "12 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-Q-2025-01",
    proveedorSemilla: "Semillas del Perú S.A.C.",
    edadCultivoDias: 120,
    actividadesRegistradas: 6,
    inspecciones: 2,
  },
  {
    id: 2,
    codigo: "CUL-002",
    campania: "Campaña 2025-2026",
    productor: "María Huamán",
    parcela: "Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    variedad: "Huamantanga",
    areaSembrada: 1.85,
    fechaSiembra: "2025-11-05",
    metodoSiembra: "Directa",
    sistemaProductivo: "Orgánica",
    tipoAgricultura: "Tradicional",
    certificacion: "En Transición",
    procedenciaSemilla: "Producida en campo",
    cantidadSemilla: 500,
    unidadSemilla: "kg",
    fechaEmergencia: "2025-11-25",
    fechaFloracion: "2026-02-01",
    fechaCosecha: "2026-05-10",
    estado: "Activo",
    observaciones: "Papa variedad nativa con buena adaptación a la zona. Riego complementario en emergencia.",
    estadoFenologico: "Desarrollo vegetativo",
    rendimientoEsperado: 12000,
    produccionEstimada: 22200,
    destinoProduccion: "Autoconsumo",
    distanciamientoSurcos: "0.90 m",
    distanciamientoPlantas: "0.30 m",
    densidadSiembra: "2 800 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-P-2025-02",
    proveedorSemilla: "INIA - Estación Santa Ana",
    edadCultivoDias: 90,
    actividadesRegistradas: 4,
    inspecciones: 1,
  },
  {
    id: 3,
    codigo: "CUL-003",
    campania: "Campaña 2024-2025",
    productor: "Pedro Rojas",
    parcela: "Parcela C - Qucha Pata",
    cultivo: "Cebada",
    variedad: "Bordaleza",
    areaSembrada: 0.9,
    fechaSiembra: "2024-09-20",
    metodoSiembra: "Almácigo",
    sistemaProductivo: "Convencional",
    tipoAgricultura: "Mixta",
    certificacion: "Sin certificar",
    procedenciaSemilla: "Semilla Común",
    cantidadSemilla: 45,
    unidadSemilla: "kg",
    fechaEmergencia: "2024-10-05",
    fechaFloracion: "2025-01-02",
    fechaCosecha: "2025-04-05",
    estado: "Cosechado",
    observaciones: "Campaña cerrada con cosecha de grano para forraje.",
    estadoFenologico: "Cosecha",
    rendimientoEsperado: 2500,
    produccionEstimada: 2250,
    destinoProduccion: "Comercialización local",
    distanciamientoSurcos: "0.20 m",
    distanciamientoPlantas: "0.10 m",
    densidadSiembra: "50 kg/ha",
    tipoSemilla: "Común",
    loteSemilla: "LOTE-C-2024-03",
    proveedorSemilla: "Comercio local",
    edadCultivoDias: 200,
    actividadesRegistradas: 8,
    inspecciones: 3,
  },
  {
    id: 4,
    codigo: "CUL-004",
    campania: "Campaña 2025-2026",
    productor: "Rosa Chávez",
    parcela: "Parcela D - Puca Pampa",
    cultivo: "Maíz",
    variedad: "Blanco Gigante",
    areaSembrada: 3.15,
    fechaSiembra: "2025-11-20",
    metodoSiembra: "Directa",
    sistemaProductivo: "Agroecológico",
    tipoAgricultura: "Tradicional",
    certificacion: "Orgánica",
    procedenciaSemilla: "Semilla Certificada",
    cantidadSemilla: 63,
    unidadSemilla: "kg",
    fechaEmergencia: "2025-12-05",
    fechaFloracion: "2026-03-05",
    fechaCosecha: "2026-06-20",
    estado: "En Desarrollo",
    observaciones: "",
    estadoFenologico: "Desarrollo vegetativo",
    rendimientoEsperado: 4000,
    produccionEstimada: 12600,
    destinoProduccion: "Venta a la cooperativa",
    distanciamientoSurcos: "0.75 m",
    distanciamientoPlantas: "0.25 m",
    densidadSiembra: "20 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-M-2025-04",
    proveedorSemilla: "AgroAndina",
    edadCultivoDias: 75,
    actividadesRegistradas: 3,
    inspecciones: 1,
  },
  {
    id: 5,
    codigo: "CUL-005",
    campania: "Campaña 2024-2025",
    productor: "Juan Gutiérrez",
    parcela: "Parcela E - San Martín",
    cultivo: "Haba",
    variedad: "Común",
    areaSembrada: 1.6,
    fechaSiembra: "2024-09-15",
    metodoSiembra: "Trasplante",
    sistemaProductivo: "Orgánica",
    tipoAgricultura: "Tradicional",
    certificacion: "En Transición",
    procedenciaSemilla: "Conservada por el agricultor",
    cantidadSemilla: 80,
    unidadSemilla: "kg",
    fechaEmergencia: "2024-10-01",
    fechaFloracion: "2024-12-20",
    fechaCosecha: "2025-03-30",
    estado: "Cosechado",
    observaciones: "Haba en asocio con maíz. Rendimiento aceptable.",
    estadoFenologico: "Cosecha",
    rendimientoEsperado: 3000,
    produccionEstimada: 4800,
    destinoProduccion: "Autoconsumo",
    distanciamientoSurcos: "0.60 m",
    distanciamientoPlantas: "0.20 m",
    densidadSiembra: "50 kg/ha",
    tipoSemilla: "Conservada",
    loteSemilla: "LOTE-H-2024-01",
    proveedorSemilla: "Semillas del agricultor",
    edadCultivoDias: 180,
    actividadesRegistradas: 5,
    inspecciones: 2,
  },
  {
    id: 6,
    codigo: "CUL-006",
    campania: "Campaña 2025-2026",
    productor: "Lucía Mendoza",
    parcela: "Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    variedad: "Andino",
    areaSembrada: 2.05,
    fechaSiembra: "2025-10-01",
    metodoSiembra: "Directa",
    sistemaProductivo: "Agroecológico",
    tipoAgricultura: "Tradicional",
    certificacion: "Orgánica",
    procedenciaSemilla: "Semilla Certificada",
    cantidadSemilla: 41,
    unidadSemilla: "kg",
    fechaEmergencia: "2025-10-18",
    fechaFloracion: "2026-01-25",
    fechaCosecha: "2026-05-05",
    estado: "Activo",
    observaciones: "Tarwi como cultivo mejorador del suelo, se incorpora la biomasa al final de campaña.",
    estadoFenologico: "Floración",
    rendimientoEsperado: 1500,
    produccionEstimada: 3075,
    destinoProduccion: "Semilla",
    distanciamientoSurcos: "0.80 m",
    distanciamientoPlantas: "0.15 m",
    densidadSiembra: "20 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-T-2025-01",
    proveedorSemilla: "AgroAndina",
    edadCultivoDias: 130,
    actividadesRegistradas: 7,
    inspecciones: 2,
  },
  {
    id: 7,
    codigo: "CUL-007",
    campania: "Campaña 2024-2025",
    productor: "Apolinario Condori",
    parcela: "Parcela G - Rumi Pata",
    cultivo: "Quinua",
    variedad: "Blanca Junín",
    areaSembrada: 1.1,
    fechaSiembra: "2024-10-10",
    metodoSiembra: "Directa",
    sistemaProductivo: "Orgánica",
    tipoAgricultura: "Tecnificada",
    certificacion: "Orgánica",
    procedenciaSemilla: "Semilla Certificada",
    cantidadSemilla: 4.4,
    unidadSemilla: "kg",
    fechaEmergencia: "2024-10-28",
    fechaFloracion: "2025-01-15",
    fechaCosecha: "2025-04-10",
    estado: "Finalizado",
    observaciones: "",
    estadoFenologico: "Cosecha",
    rendimientoEsperado: 1600,
    produccionEstimada: 1760,
    destinoProduccion: "Venta a la cooperativa",
    distanciamientoSurcos: "0.80 m",
    distanciamientoPlantas: "0.15 m",
    densidadSiembra: "4 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-Q-2024-02",
    proveedorSemilla: "Semillas del Perú S.A.C.",
    edadCultivoDias: 190,
    actividadesRegistradas: 9,
    inspecciones: 3,
  },
  {
    id: 8,
    codigo: "CUL-008",
    campania: "Campaña 2025-2026",
    productor: "Rosa Chávez",
    parcela: "Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    variedad: "Peruanita",
    areaSembrada: 2.75,
    fechaSiembra: "2025-11-25",
    metodoSiembra: "Directa",
    sistemaProductivo: "Orgánica",
    tipoAgricultura: "Tradicional",
    certificacion: "Orgánica",
    procedenciaSemilla: "Producida en campo",
    cantidadSemilla: 700,
    unidadSemilla: "kg",
    fechaEmergencia: "2025-12-15",
    fechaFloracion: "2026-02-20",
    fechaCosecha: "2026-06-10",
    estado: "En Desarrollo",
    observaciones: "",
    estadoFenologico: "Emergencia",
    rendimientoEsperado: 11000,
    produccionEstimada: 30250,
    destinoProduccion: "Venta a la cooperativa",
    distanciamientoSurcos: "0.90 m",
    distanciamientoPlantas: "0.30 m",
    densidadSiembra: "250 kg/ha",
    tipoSemilla: "Certificada",
    loteSemilla: "LOTE-P-2025-05",
    proveedorSemilla: "INIA - Estación Santa Ana",
    edadCultivoDias: 60,
    actividadesRegistradas: 2,
    inspecciones: 0,
  },
];

export const mockCultivo: Cultivo = cultivosMock[0];

export const cultivoFotosMock: CultivoFoto[] = [
  {
    id: "siembra",
    titulo: "Siembra",
    descripcion: "Instalación del cultivo mediante siembra directa.",
    fecha: "2025-10-15",
    responsable: "Apolinario Condori",
  },
  {
    id: "desarrollo",
    titulo: "Desarrollo",
    descripcion: "Crecimiento vegetativo a los 45 días de la siembra.",
    fecha: "2025-12-01",
    responsable: "Técnico de campo",
  },
  {
    id: "floracion",
    titulo: "Floración",
    descripcion: "Inicio de floración uniforme en la parcela.",
    fecha: "2026-01-12",
    responsable: "Técnico de campo",
  },
  {
    id: "cosecha",
    titulo: "Cosecha",
    descripcion: "Cosecha y selección manual de grano.",
    fecha: "2026-04-20",
    responsable: "Apolinario Condori",
  },
];

export const cultivoDocumentosMock: CultivoDocumento[] = [
  { id: 1, tipo: "Acta", nombre: "acta_siembra_cultivo_001.pdf", tamano: "680 KB", fecha: "2025-10-15", estado: "Adjunto", categoria: "Técnicos" },
  { id: 2, tipo: "Informe Técnico", nombre: "informe_tecnico_quinua.pdf", tamano: "1.2 MB", fecha: "2025-12-20", estado: "Adjunto", categoria: "Técnicos" },
  { id: 3, tipo: "Certificado de Semilla", nombre: "certificado_semilla_negra_collana.pdf", tamano: "940 KB", fecha: "2025-09-30", estado: "Adjunto", categoria: "Técnicos" },
  { id: 4, tipo: "Análisis de suelo", nombre: "analisis_suelo_parcela_a.pdf", tamano: "820 KB", fecha: "2025-08-22", estado: "Adjunto", categoria: "Análisis" },
  { id: 5, tipo: "Análisis foliar", nombre: "analisis_foliar_quinua.pdf", tamano: "760 KB", fecha: "2026-01-05", estado: "Pendiente", categoria: "Análisis" },
];

export const buildCultivoHistorial = (cultivo: Cultivo): CultivoHistorialEvento[] => [
  {
    id: 1,
    titulo: "Registro del cultivo",
    fecha: cultivo.fechaSiembra,
    descripcion: `${cultivo.cultivo} registrado en el sistema bajo el código ${cultivo.codigo}.`,
    tipo: "registro",
    completado: true,
  },
  {
    id: 2,
    titulo: "Inicio de siembra",
    fecha: cultivo.fechaSiembra,
    descripcion: `Siembra ${cultivo.metodoSiembra.toLowerCase()} de ${cultivo.variedad} en ${cultivo.parcela}.`,
    tipo: "siembra",
    completado: true,
  },
  {
    id: 3,
    titulo: "Emergencia",
    fecha: cultivo.fechaEmergencia,
    descripcion: "Emergencia de plántulas observada en campo.",
    tipo: "emergencia",
    completado: true,
  },
  {
    id: 4,
    titulo: "Primera actividad agrícola",
    descripcion: "Aplicación de biol foliar y control manual de malezas.",
    tipo: "actividad",
    completado: true,
  },
  {
    id: 5,
    titulo: "Primera inspección",
    descripcion: "Inspección interna de campo realizada por el técnico.",
    tipo: "inspeccion",
    completado: true,
  },
  {
    id: 6,
    titulo: "Inicio de floración",
    fecha: cultivo.fechaFloracion,
    descripcion: "Inicio de la etapa de floración del cultivo.",
    tipo: "floracion",
    completado: true,
  },
  {
    id: 7,
    titulo: "Cosecha estimada",
    fecha: cultivo.fechaCosecha,
    descripcion: "Fecha estimada para el inicio de la cosecha.",
    tipo: "cosecha",
    completado: false,
  },
];

export { cultivosOpciones, productoresOpciones };
