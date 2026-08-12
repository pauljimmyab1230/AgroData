export type EstadoAcopio = "En Proceso" | "Completado" | "En Planta";
export type EstadoProducto = "Excelente" | "Bueno" | "Regular" | "Rechazado";

export type Saco = {
  id: number;
  codigo: string;
  peso: number;
  observaciones: string;
};

export type FotoAcopio = {
  id: number;
  nombre: string;
  descripcion: string;
  preview?: string;
};

export type Acopio = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  comunidad: string;
  acopiador: string;
  vehiculo: string;
  ruta: string;
  productor: string;
  parcela: string;
  cultivo: string;
  loteProductor: string;
  totalSacos: number;
  pesoTotal: number;
  pesoPromedio: number;
  pesoMaximo: number;
  pesoMinimo: number;
  estado: EstadoAcopio;
  sacos: Saco[];
  estadoProducto: EstadoProducto;
  humedad: number;
  impurezas: number;
  observacionesCalidad: string;
  fotos: FotoAcopio[];
  firmaProductor: boolean;
  firmaAcopiador: boolean;
  observaciones: string;
};

export const campaniasOpciones = ["Campaña 2024-2025", "Campaña 2023-2024", "Campaña 2022-2023"];

export const comunidadesOpciones = [
  "Ñawpa Rumi",
  "Pampa Urku",
  "Qucha Pata",
  "Puca Pampa",
  "Tiquihua Alta",
  "Rumi Pata",
  "Inti Huasi",
  "San Martín",
];

export const acopiadoresOpciones = [
  "Carlos Ramos",
  "Ana Quispe",
  "Luis Huamán",
  "Martha Sucapuca",
  "Pedro Vilca",
];

export const vehiculosOpciones = [
  "Camión Volvo · PLK-845",
  "Camión Isuzu · AHU-123",
  "Camión Hino · BPC-456",
  "Furgón Toyota · A4Z-789",
  "Camión Mercedes · CAS-321",
];

export const rutasOpciones = [
  "Ruta Andahuaylas - San Miguel",
  "Ruta Chincheros - Pampachiri",
  "Ruta Talavera - Huancarama",
  "Ruta Ayacucho - Huancaray",
];

export const productoresOpciones = [
  "Apolinario Condori",
  "María Huamán",
  "Pedro Rojas",
  "Rosa Chávez",
  "Juan Gutiérrez",
  "Lucía Mendoza",
];

export const parcelasOpciones = [
  "PAR-001 · Parcela A - Ñawpa Rumi",
  "PAR-002 · Parcela B - Pampa Urku",
  "PAR-003 · Parcela C - Qucha Pata",
  "PAR-004 · Parcela D - Puca Pampa",
  "PAR-005 · Parcela E - San Martín",
  "PAR-006 · Parcela F - Tiquihua Alta",
  "PAR-007 · Parcela G - Rumi Pata",
  "PAR-008 · Parcela H - Inti Huasi",
];

export const cultivosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Maíz", "Haba", "Tarwi"];

export const lpsOpciones = [
  "LP-2025-001",
  "LP-2025-002",
  "LP-2025-003",
  "LP-2025-004",
  "LP-2025-005",
  "LP-2025-006",
  "LP-2025-007",
  "LP-2025-008",
];

export const estadosAcopioOpciones: EstadoAcopio[] = ["En Proceso", "Completado", "En Planta"];

export const estadosProductoOpciones: EstadoProducto[] = [
  "Excelente",
  "Bueno",
  "Regular",
  "Rechazado",
];

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [year, month, day] = fecha.split("-");
  if (!year || !month || !day) return fecha;
  return `${day}/${month}/${year}`;
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

export const acopiosMock: Acopio[] = [
  {
    id: 1,
    codigo: "ACP-001",
    fecha: "2025-04-15",
    campania: "Campaña 2024-2025",
    comunidad: "Ñawpa Rumi",
    acopiador: "Carlos Ramos",
    vehiculo: "Camión Volvo · PLK-845",
    ruta: "Ruta Andahuaylas - San Miguel",
    productor: "Apolinario Condori",
    parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    loteProductor: "LP-2025-001",
    totalSacos: 4,
    pesoTotal: 188.2,
    pesoPromedio: 47.05,
    pesoMaximo: 48.3,
    pesoMinimo: 45.7,
    estado: "Completado",
    sacos: [
      { id: 1, codigo: "SAC-001", peso: 47.4, observaciones: "Grano limpio y seco" },
      { id: 2, codigo: "SAC-002", peso: 46.8, observaciones: "" },
      { id: 3, codigo: "SAC-003", peso: 48.3, observaciones: "Peso verificado en balanza" },
      { id: 4, codigo: "SAC-004", peso: 45.7, observaciones: "Saco en buen estado" },
    ],
    estadoProducto: "Excelente",
    humedad: 11.5,
    impurezas: 1.2,
    observacionesCalidad: "Grano limpio y uniforme, sin presencia de impurezas ni humedad excesiva.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Punto de acopio", descripcion: "Vista del punto de acopio en Ñawpa Rumi" },
      { id: 2, nombre: "Fotografía 2 - Sacos", descripcion: "Sacos de quinua apilados y pesados" },
      { id: 3, nombre: "Fotografía 3 - Balanza", descripcion: "Registro del peso en la balanza" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "Acopio realizado en el centro poblado de Ñawpa Rumi. La producción llegó en óptimas condiciones de limpieza y secado.",
  },
  {
    id: 2,
    codigo: "ACP-002",
    fecha: "2025-04-10",
    campania: "Campaña 2024-2025",
    comunidad: "Pampa Urku",
    acopiador: "Ana Quispe",
    vehiculo: "Camión Isuzu · AHU-123",
    ruta: "Ruta Chincheros - Pampachiri",
    productor: "María Huamán",
    parcela: "PAR-002 · Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    loteProductor: "LP-2025-002",
    totalSacos: 3,
    pesoTotal: 165.0,
    pesoPromedio: 55.0,
    pesoMaximo: 56.0,
    pesoMinimo: 53.8,
    estado: "Completado",
    sacos: [
      { id: 5, codigo: "SAC-005", peso: 55.2, observaciones: "Papa seleccionada" },
      { id: 6, codigo: "SAC-006", peso: 53.8, observaciones: "" },
      { id: 7, codigo: "SAC-007", peso: 56.0, observaciones: "Calidad regular" },
    ],
    estadoProducto: "Bueno",
    humedad: 14.2,
    impurezas: 2.5,
    observacionesCalidad: "Tuberculo con leve presencia de tierra. Se recomienda limpieza en planta.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Sacos", descripcion: "Sacos de papa nativa en el punto de acopio" },
      { id: 2, nombre: "Fotografía 2 - Muestra", descripcion: "Muestra del tubérculo recepcionado" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "Acopio de papa nativa en Pampa Urku. La productora indicó que la cosecha corresponde a la campaña vigente.",
  },
  {
    id: 3,
    codigo: "ACP-003",
    fecha: "2025-04-05",
    campania: "Campaña 2024-2025",
    comunidad: "Qucha Pata",
    acopiador: "Luis Huamán",
    vehiculo: "Camión Hino · BPC-456",
    ruta: "Ruta Talavera - Huancarama",
    productor: "Pedro Rojas",
    parcela: "PAR-003 · Parcela C - Qucha Pata",
    cultivo: "Cebada",
    loteProductor: "LP-2025-003",
    totalSacos: 5,
    pesoTotal: 252.6,
    pesoPromedio: 50.52,
    pesoMaximo: 52.1,
    pesoMinimo: 48.9,
    estado: "En Planta",
    sacos: [
      { id: 8, codigo: "SAC-008", peso: 50.6, observaciones: "Presencia leve de impurezas" },
      { id: 9, codigo: "SAC-009", peso: 49.2, observaciones: "" },
      { id: 10, codigo: "SAC-010", peso: 51.8, observaciones: "Grano con humedad elevada" },
      { id: 11, codigo: "SAC-011", peso: 48.9, observaciones: "" },
      { id: 12, codigo: "SAC-012", peso: 52.1, observaciones: "" },
    ],
    estadoProducto: "Regular",
    humedad: 16.8,
    impurezas: 4.1,
    observacionesCalidad: "Grano con humedad por encima del rango recomendado. Pendiente de verificación en planta.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Sacos", descripcion: "Sacos de cebada en el camión" },
    ],
    firmaProductor: true,
    firmaAcopiador: false,
    observaciones:
      "El producto fue trasladado a planta para su verificación de humedad. La firma del acopiador quedó pendiente.",
  },
  {
    id: 4,
    codigo: "ACP-004",
    fecha: "2025-03-28",
    campania: "Campaña 2024-2025",
    comunidad: "Puca Pampa",
    acopiador: "Martha Sucapuca",
    vehiculo: "Furgón Toyota · A4Z-789",
    ruta: "Ruta Ayacucho - Huancaray",
    productor: "Rosa Chávez",
    parcela: "PAR-004 · Parcela D - Puca Pampa",
    cultivo: "Maíz",
    loteProductor: "LP-2025-004",
    totalSacos: 2,
    pesoTotal: 96.0,
    pesoPromedio: 48.0,
    pesoMaximo: 48.6,
    pesoMinimo: 47.4,
    estado: "En Proceso",
    sacos: [
      { id: 13, codigo: "SAC-013", peso: 48.6, observaciones: "" },
      { id: 14, codigo: "SAC-014", peso: 47.4, observaciones: "Segundo saco del lote" },
    ],
    estadoProducto: "Bueno",
    humedad: 13.0,
    impurezas: 2.0,
    observacionesCalidad: "Grano en buen estado general. Se espera la muestra final de calidad.",
    fotos: [],
    firmaProductor: false,
    firmaAcopiador: false,
    observaciones: "Acopio en proceso. A la espera del cierre del registro y de las firmas.",
  },
  {
    id: 5,
    codigo: "ACP-005",
    fecha: "2025-03-20",
    campania: "Campaña 2024-2025",
    comunidad: "Tiquihua Alta",
    acopiador: "Carlos Ramos",
    vehiculo: "Camión Mercedes · CAS-321",
    ruta: "Ruta Andahuaylas - San Miguel",
    productor: "Juan Gutiérrez",
    parcela: "PAR-005 · Parcela E - San Martín",
    cultivo: "Haba",
    loteProductor: "LP-2025-005",
    totalSacos: 4,
    pesoTotal: 188.6,
    pesoPromedio: 47.15,
    pesoMaximo: 48.1,
    pesoMinimo: 46.2,
    estado: "Completado",
    sacos: [
      { id: 15, codigo: "SAC-015", peso: 47.3, observaciones: "" },
      { id: 16, codigo: "SAC-016", peso: 46.2, observaciones: "" },
      { id: 17, codigo: "SAC-017", peso: 48.1, observaciones: "" },
      { id: 18, codigo: "SAC-018", peso: 47.0, observaciones: "Último saco del día" },
    ],
    estadoProducto: "Excelente",
    humedad: 11.0,
    impurezas: 0.9,
    observacionesCalidad: "Haba sana y limpia, sin daños por insectos.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Punto de acopio", descripcion: "Vista del punto de acopio en Tiquihua Alta" },
      { id: 2, nombre: "Fotografía 2 - Sacos", descripcion: "Sacos de haba recibidos" },
      { id: 3, nombre: "Fotografía 3 - Balanza", descripcion: "Registro del peso" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "Acopio completado en Tiquihua Alta. Producto en excelente estado y listo para su envío a planta.",
  },
  {
    id: 6,
    codigo: "ACP-006",
    fecha: "2025-03-12",
    campania: "Campaña 2024-2025",
    comunidad: "Rumi Pata",
    acopiador: "Ana Quispe",
    vehiculo: "Camión Volvo · PLK-845",
    ruta: "Ruta Chincheros - Pampachiri",
    productor: "Lucía Mendoza",
    parcela: "PAR-006 · Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    loteProductor: "LP-2025-006",
    totalSacos: 3,
    pesoTotal: 141.9,
    pesoPromedio: 47.3,
    pesoMaximo: 48.0,
    pesoMinimo: 46.5,
    estado: "En Planta",
    sacos: [
      { id: 19, codigo: "SAC-019", peso: 47.4, observaciones: "" },
      { id: 20, codigo: "SAC-020", peso: 46.5, observaciones: "" },
      { id: 21, codigo: "SAC-021", peso: 48.0, observaciones: "Peso verificado" },
    ],
    estadoProducto: "Bueno",
    humedad: 12.4,
    impurezas: 1.8,
    observacionesCalidad: "Grano de tarwi sin impurezas considerables. Buenas condiciones.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Sacos", descripcion: "Sacos de tarwi en el furgón" },
      { id: 2, nombre: "Fotografía 2 - Muestra", descripcion: "Muestra del grano" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "Acopio de tarwi recibido y trasladado a planta. La documentación fue firmada por ambas partes.",
  },
  {
    id: 7,
    codigo: "ACP-007",
    fecha: "2025-02-25",
    campania: "Campaña 2023-2024",
    comunidad: "Inti Huasi",
    acopiador: "Luis Huamán",
    vehiculo: "Camión Isuzu · AHU-123",
    ruta: "Ruta Talavera - Huancarama",
    productor: "Apolinario Condori",
    parcela: "PAR-007 · Parcela G - Rumi Pata",
    cultivo: "Quinua",
    loteProductor: "LP-2025-007",
    totalSacos: 3,
    pesoTotal: 136.1,
    pesoPromedio: 45.37,
    pesoMaximo: 46.1,
    pesoMinimo: 44.8,
    estado: "Completado",
    sacos: [
      { id: 22, codigo: "SAC-022", peso: 45.2, observaciones: "Humedad superior al permitido" },
      { id: 23, codigo: "SAC-023", peso: 46.1, observaciones: "" },
      { id: 24, codigo: "SAC-024", peso: 44.8, observaciones: "" },
    ],
    estadoProducto: "Rechazado",
    humedad: 18.5,
    impurezas: 7.2,
    observacionesCalidad: "Alto contenido de humedad y presencia de impurezas. Producto derivado a evaluación.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Muestra", descripcion: "Muestra del grano con humedad elevada" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "El lote fue observado por exceso de humedad. Se coordinó la devolución parcial del producto al productor.",
  },
  {
    id: 8,
    codigo: "ACP-008",
    fecha: "2025-02-18",
    campania: "Campaña 2023-2024",
    comunidad: "San Martín",
    acopiador: "Martha Sucapuca",
    vehiculo: "Furgón Toyota · A4Z-789",
    ruta: "Ruta Ayacucho - Huancaray",
    productor: "Rosa Chávez",
    parcela: "PAR-008 · Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    loteProductor: "LP-2025-008",
    totalSacos: 5,
    pesoTotal: 276.8,
    pesoPromedio: 55.36,
    pesoMaximo: 57.2,
    pesoMinimo: 53.4,
    estado: "Completado",
    sacos: [
      { id: 25, codigo: "SAC-025", peso: 55.1, observaciones: "" },
      { id: 26, codigo: "SAC-026", peso: 56.3, observaciones: "" },
      { id: 27, codigo: "SAC-027", peso: 54.8, observaciones: "" },
      { id: 28, codigo: "SAC-028", peso: 57.2, observaciones: "Saco con mayor peso" },
      { id: 29, codigo: "SAC-029", peso: 53.4, observaciones: "" },
    ],
    estadoProducto: "Bueno",
    humedad: 13.8,
    impurezas: 2.2,
    observacionesCalidad: "Tuberculo en buen estado, con leve presencia de tierra.",
    fotos: [
      { id: 1, nombre: "Fotografía 1 - Sacos", descripcion: "Sacos de papa nativa en el punto de acopio" },
      { id: 2, nombre: "Fotografía 2 - Punto de acopio", descripcion: "Vista general del acopio" },
    ],
    firmaProductor: true,
    firmaAcopiador: true,
    observaciones:
      "Acopio completado en San Martín. Se recibieron 5 sacos de papa nativa en buen estado general.",
  },
];

export const siguienteCodigoAcopio = `ACP-${String(acopiosMock.length + 1).padStart(3, "0")}`;

export const mockAcopio: Acopio = acopiosMock[0];
