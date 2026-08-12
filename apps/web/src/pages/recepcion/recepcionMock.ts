export type EstadoRecepcion =
  | "Pendiente de Pesaje"
  | "En Control de Calidad"
  | "Disponible para Procesamiento"
  | "Rechazada";

export type EstadoProducto = "Excelente" | "Bueno" | "Regular" | "Rechazado";

export type Categoria = "Primera" | "Segunda" | "Industrial" | "Descarte";

export type Destino = "Procesamiento" | "Almacén Temporal" | "Rechazado";

export type ResultadoRecepcion = "Aceptado" | "Aceptado con Observaciones" | "Rechazado";

export type TipoEventoHistorial =
  | "lp"
  | "recepcion"
  | "pesaje"
  | "calidad"
  | "clasificacion"
  | "disponible"
  | "rechazo";

export type EvidenciaRecepcion = {
  id: number;
  nombre: string;
  descripcion: string;
  preview?: string;
};

export type EventoHistorial = {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEventoHistorial;
};

export type LoteProductor = {
  codigo: string;
  productor: string;
  parcela: string;
  cultivo: string;
  comunidad: string;
  sacos: number;
  pesoCampo: number;
};

export type Recepcion = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  responsable: string;
  planta: string;
  loteProductor: string;
  productor: string;
  parcela: string;
  cultivo: string;
  comunidad: string;
  sacos: number;
  pesoCampo: number;
  pesoBruto?: number;
  tara?: number;
  pesoNeto?: number;
  diferencia?: number;
  merma?: number;
  humedad?: number;
  impurezas?: number;
  materiaExtrana?: number;
  color?: string;
  olor?: string;
  presenciaInsectos?: string;
  estadoProducto?: EstadoProducto;
  categoria?: Categoria;
  destino?: Destino;
  resultado?: ResultadoRecepcion;
  motivo?: string;
  estado: EstadoRecepcion;
  observaciones: string;
  evidencias: EvidenciaRecepcion[];
  documentoRecepcion: boolean;
  firmaResponsable: boolean;
  historial: EventoHistorial[];
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

export const productoresOpciones = [
  "Apolinario Condori",
  "María Huamán",
  "Pedro Rojas",
  "Rosa Chávez",
  "Juan Gutiérrez",
  "Lucía Mendoza",
];

export const plantasOpciones = [
  "Planta Central - Andahuaylas",
  "Planta Secundaria - Talavera",
  "Planta de Procesamiento - San Jerónimo",
];

export const responsablesOpciones = [
  "Ing. Julio Paredes",
  "Ing. Carmen Flores",
  "Téc. Rolando Huaraca",
  "Ing. Silvia Medina",
];

export const estadosRecepcionOpciones: EstadoRecepcion[] = [
  "Pendiente de Pesaje",
  "En Control de Calidad",
  "Disponible para Procesamiento",
  "Rechazada",
];

export const estadosProductoOpciones: EstadoProducto[] = [
  "Excelente",
  "Bueno",
  "Regular",
  "Rechazado",
];

export const categoriasOpciones: Categoria[] = ["Primera", "Segunda", "Industrial", "Descarte"];

export const destinosOpciones: Destino[] = ["Procesamiento", "Almacén Temporal", "Rechazado"];

export const resultadosOpciones: ResultadoRecepcion[] = [
  "Aceptado",
  "Aceptado con Observaciones",
  "Rechazado",
];

export const coloresOpciones = ["Cremoso", "Blanco Perlado", "Rosado Claro", "Dorado", "Ámbar"];

export const oloresOpciones = [
  "Aroma característico",
  "Neutro",
  "Sin olor extraño",
  "Olor a humedad",
];

export const presenciaInsectosOpciones = ["Ausente", "Leve", "Moderado", "Alto"];

export const lotesProductorMock: LoteProductor[] = [
  {
    codigo: "LP-2025-001",
    productor: "Apolinario Condori",
    parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    comunidad: "Ñawpa Rumi",
    sacos: 4,
    pesoCampo: 188.2,
  },
  {
    codigo: "LP-2025-002",
    productor: "María Huamán",
    parcela: "PAR-002 · Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    comunidad: "Pampa Urku",
    sacos: 3,
    pesoCampo: 165.0,
  },
  {
    codigo: "LP-2025-003",
    productor: "Pedro Rojas",
    parcela: "PAR-003 · Parcela C - Qucha Pata",
    cultivo: "Cebada",
    comunidad: "Qucha Pata",
    sacos: 5,
    pesoCampo: 252.6,
  },
  {
    codigo: "LP-2025-004",
    productor: "Rosa Chávez",
    parcela: "PAR-004 · Parcela D - Puca Pampa",
    cultivo: "Maíz",
    comunidad: "Puca Pampa",
    sacos: 2,
    pesoCampo: 96.0,
  },
  {
    codigo: "LP-2025-005",
    productor: "Juan Gutiérrez",
    parcela: "PAR-005 · Parcela E - San Martín",
    cultivo: "Haba",
    comunidad: "Tiquihua Alta",
    sacos: 4,
    pesoCampo: 188.6,
  },
  {
    codigo: "LP-2025-006",
    productor: "Lucía Mendoza",
    parcela: "PAR-006 · Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    comunidad: "Rumi Pata",
    sacos: 3,
    pesoCampo: 141.9,
  },
  {
    codigo: "LP-2025-007",
    productor: "Apolinario Condori",
    parcela: "PAR-007 · Parcela G - Rumi Pata",
    cultivo: "Quinua",
    comunidad: "Inti Huasi",
    sacos: 3,
    pesoCampo: 136.1,
  },
  {
    codigo: "LP-2025-008",
    productor: "Rosa Chávez",
    parcela: "PAR-008 · Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    comunidad: "San Martín",
    sacos: 5,
    pesoCampo: 276.8,
  },
];

export function obtenerLoteProductor(codigo: string): LoteProductor | undefined {
  return lotesProductorMock.find((lote) => lote.codigo === codigo);
}

export const lpsOpciones = lotesProductorMock.map((lote) => lote.codigo);

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [year, month, day] = fecha.split("-");
  if (!year || !month || !day) return fecha;
  return `${day}/${month}/${year}`;
}

export function formatKg(peso: number | undefined): string {
  if (peso === undefined) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

export function formatPct(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(valor)}%`;
}

export const recepcionesMock: Recepcion[] = [
  {
    id: 1,
    codigo: "RCP-001",
    fecha: "2025-04-16",
    campania: "Campaña 2024-2025",
    responsable: "Ing. Julio Paredes",
    planta: "Planta Central - Andahuaylas",
    loteProductor: "LP-2025-001",
    productor: "Apolinario Condori",
    parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    comunidad: "Ñawpa Rumi",
    sacos: 4,
    pesoCampo: 188.2,
    pesoBruto: 3185.0,
    tara: 3000.0,
    pesoNeto: 185.0,
    diferencia: -3.2,
    merma: 1.7,
    humedad: 11.2,
    impurezas: 1.0,
    materiaExtrana: 0.3,
    color: "Cremoso",
    olor: "Aroma característico",
    presenciaInsectos: "Ausente",
    estadoProducto: "Excelente",
    categoria: "Primera",
    destino: "Procesamiento",
    resultado: "Aceptado",
    estado: "Disponible para Procesamiento",
    observaciones:
      "Materia prima recibida en óptimas condiciones. Grano limpio, seco y sin presencia de insectos. Lista para ingresar al proceso de transformación.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Descarga", descripcion: "Descarga de sacos en la plataforma de recepción" },
      { id: 2, nombre: "Fotografía 2 - Muestra", descripcion: "Muestra de quinua verificada en el control de calidad" },
    ],
    documentoRecepcion: true,
    firmaResponsable: true,
    historial: [
      { id: 1, fecha: "2025-04-15", titulo: "LP generado", descripcion: "El lote LP-2025-001 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-04-16", titulo: "Recepción registrada", descripcion: "La recepción RCP-001 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-04-16", titulo: "Pesaje realizado", descripcion: "Peso bruto 3 185 kg, tara 3 000 kg y peso neto 185 kg.", tipo: "pesaje" },
      { id: 4, fecha: "2025-04-16", titulo: "Control de calidad", descripcion: "Humedad 11.2%, impurezas 1.0% y estado general Excelente.", tipo: "calidad" },
      { id: 5, fecha: "2025-04-16", titulo: "Clasificación", descripcion: "Categoría Primera con destino Procesamiento.", tipo: "clasificacion" },
      { id: 6, fecha: "2025-04-16", titulo: "Disponible para procesamiento", descripcion: "Resultado Aceptado. La materia prima quedó lista para transformación.", tipo: "disponible" },
    ],
  },
  {
    id: 2,
    codigo: "RCP-002",
    fecha: "2025-04-11",
    campania: "Campaña 2024-2025",
    responsable: "Ing. Carmen Flores",
    planta: "Planta Central - Andahuaylas",
    loteProductor: "LP-2025-002",
    productor: "María Huamán",
    parcela: "PAR-002 · Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    comunidad: "Pampa Urku",
    sacos: 3,
    pesoCampo: 165.0,
    pesoBruto: 2955.0,
    tara: 2805.0,
    pesoNeto: 150.0,
    diferencia: -15.0,
    merma: 9.09,
    humedad: 14.0,
    impurezas: 2.2,
    materiaExtrana: 0.8,
    color: "Blanco Perlado",
    olor: "Neutro",
    presenciaInsectos: "Ausente",
    estadoProducto: "Bueno",
    categoria: "Segunda",
    destino: "Procesamiento",
    resultado: "Aceptado con Observaciones",
    motivo: "Humedad ligeramente elevada. Se recomienda secado previo en planta.",
    estado: "Disponible para Procesamiento",
    observaciones:
      "Tubérculo en buen estado general con leve presencia de tierra. Recepción aceptada con la observación de realizar secado antes del proceso.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Sacos", descripcion: "Sacos de papa nativa en la plataforma de recepción" },
    ],
    documentoRecepcion: true,
    firmaResponsable: true,
    historial: [
      { id: 1, fecha: "2025-04-10", titulo: "LP generado", descripcion: "El lote LP-2025-002 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-04-11", titulo: "Recepción registrada", descripcion: "La recepción RCP-002 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-04-11", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 150 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-04-11", titulo: "Control de calidad", descripcion: "Humedad 14.0%, impurezas 2.2% y estado general Bueno.", tipo: "calidad" },
      { id: 5, fecha: "2025-04-11", titulo: "Clasificación", descripcion: "Categoría Segunda con destino Procesamiento.", tipo: "clasificacion" },
      { id: 6, fecha: "2025-04-11", titulo: "Disponible para procesamiento", descripcion: "Resultado Aceptado con Observaciones.", tipo: "disponible" },
    ],
  },
  {
    id: 3,
    codigo: "RCP-003",
    fecha: "2025-04-06",
    campania: "Campaña 2024-2025",
    responsable: "Téc. Rolando Huaraca",
    planta: "Planta Secundaria - Talavera",
    loteProductor: "LP-2025-003",
    productor: "Pedro Rojas",
    parcela: "PAR-003 · Parcela C - Qucha Pata",
    cultivo: "Cebada",
    comunidad: "Qucha Pata",
    sacos: 5,
    pesoCampo: 252.6,
    pesoBruto: 4150.0,
    tara: 3905.0,
    pesoNeto: 245.0,
    diferencia: -7.6,
    merma: 3.01,
    humedad: 16.5,
    impurezas: 3.8,
    materiaExtrana: 1.2,
    color: "Dorado",
    olor: "Neutro",
    presenciaInsectos: "Leve",
    estadoProducto: "Regular",
    estado: "En Control de Calidad",
    observaciones:
      "Grano con humedad por encima del rango recomendado y presencia leve de insectos. Pendiente de definir clasificación y resultado final.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Muestra", descripcion: "Muestra de cebada con humedad elevada" },
    ],
    documentoRecepcion: true,
    firmaResponsable: false,
    historial: [
      { id: 1, fecha: "2025-04-05", titulo: "LP generado", descripcion: "El lote LP-2025-003 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-04-06", titulo: "Recepción registrada", descripcion: "La recepción RCP-003 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-04-06", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 245 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-04-06", titulo: "Control de calidad", descripcion: "Humedad 16.5%, impurezas 3.8% y estado general Regular.", tipo: "calidad" },
    ],
  },
  {
    id: 4,
    codigo: "RCP-004",
    fecha: "2025-04-16",
    campania: "Campaña 2024-2025",
    responsable: "Ing. Silvia Medina",
    planta: "Planta Central - Andahuaylas",
    loteProductor: "LP-2025-004",
    productor: "Rosa Chávez",
    parcela: "PAR-004 · Parcela D - Puca Pampa",
    cultivo: "Maíz",
    comunidad: "Puca Pampa",
    sacos: 2,
    pesoCampo: 96.0,
    estado: "Pendiente de Pesaje",
    observaciones:
      "Recepción registrada. A la espera del pesaje en la balanza de plataforma para continuar con el control de calidad.",
    evidencias: [],
    documentoRecepcion: false,
    firmaResponsable: false,
    historial: [
      { id: 1, fecha: "2025-03-28", titulo: "LP generado", descripcion: "El lote LP-2025-004 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-04-16", titulo: "Recepción registrada", descripcion: "La recepción RCP-004 fue registrada en la planta.", tipo: "recepcion" },
    ],
  },
  {
    id: 5,
    codigo: "RCP-005",
    fecha: "2025-03-21",
    campania: "Campaña 2024-2025",
    responsable: "Ing. Julio Paredes",
    planta: "Planta Central - Andahuaylas",
    loteProductor: "LP-2025-005",
    productor: "Juan Gutiérrez",
    parcela: "PAR-005 · Parcela E - San Martín",
    cultivo: "Haba",
    comunidad: "Tiquihua Alta",
    sacos: 4,
    pesoCampo: 188.6,
    pesoBruto: 3188.6,
    tara: 3000.0,
    pesoNeto: 188.6,
    diferencia: 0.0,
    merma: 0.0,
    humedad: 11.0,
    impurezas: 0.9,
    materiaExtrana: 0.2,
    color: "Cremoso",
    olor: "Aroma característico",
    presenciaInsectos: "Ausente",
    estadoProducto: "Excelente",
    categoria: "Primera",
    destino: "Procesamiento",
    resultado: "Aceptado",
    estado: "Disponible para Procesamiento",
    observaciones:
      "Haba sana y limpia. El peso de planta coincide exactamente con el peso registrado en campo. Lista para procesamiento.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Descarga", descripcion: "Descarga de sacos en la plataforma de recepción" },
      { id: 2, nombre: "Fotografía 2 - Muestra", descripcion: "Muestra de haba verificada" },
    ],
    documentoRecepcion: true,
    firmaResponsable: true,
    historial: [
      { id: 1, fecha: "2025-03-20", titulo: "LP generado", descripcion: "El lote LP-2025-005 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-03-21", titulo: "Recepción registrada", descripcion: "La recepción RCP-005 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-03-21", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 188.6 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-03-21", titulo: "Control de calidad", descripcion: "Humedad 11.0%, impurezas 0.9% y estado general Excelente.", tipo: "calidad" },
      { id: 5, fecha: "2025-03-21", titulo: "Clasificación", descripcion: "Categoría Primera con destino Procesamiento.", tipo: "clasificacion" },
      { id: 6, fecha: "2025-03-21", titulo: "Disponible para procesamiento", descripcion: "Resultado Aceptado. La materia prima quedó lista para transformación.", tipo: "disponible" },
    ],
  },
  {
    id: 6,
    codigo: "RCP-006",
    fecha: "2025-03-13",
    campania: "Campaña 2024-2025",
    responsable: "Ing. Carmen Flores",
    planta: "Planta Secundaria - Talavera",
    loteProductor: "LP-2025-006",
    productor: "Lucía Mendoza",
    parcela: "PAR-006 · Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    comunidad: "Rumi Pata",
    sacos: 3,
    pesoCampo: 141.9,
    pesoBruto: 2941.9,
    tara: 2810.0,
    pesoNeto: 131.9,
    diferencia: -10.0,
    merma: 7.05,
    humedad: 19.2,
    impurezas: 6.5,
    materiaExtrana: 3.1,
    color: "Dorado",
    olor: "Olor a humedad",
    presenciaInsectos: "Alto",
    estadoProducto: "Rechazado",
    categoria: "Descarte",
    destino: "Rechazado",
    resultado: "Rechazado",
    motivo: "Alto contenido de humedad y presencia significativa de insectos. Producto no apto para procesamiento.",
    estado: "Rechazada",
    observaciones:
      "El lote fue rechazado por superar los límites de humedad e impurezas permitidos. Se coordinó la devolución al productor.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Muestra", descripcion: "Muestra del grano con humedad elevada e insectos" },
    ],
    documentoRecepcion: true,
    firmaResponsable: true,
    historial: [
      { id: 1, fecha: "2025-03-12", titulo: "LP generado", descripcion: "El lote LP-2025-006 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-03-13", titulo: "Recepción registrada", descripcion: "La recepción RCP-006 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-03-13", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 131.9 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-03-13", titulo: "Control de calidad", descripcion: "Humedad 19.2%, presencia de insectos Alta. Estado Rechazado.", tipo: "calidad" },
      { id: 5, fecha: "2025-03-13", titulo: "Clasificación", descripcion: "Categoría Descarte con destino Rechazado.", tipo: "clasificacion" },
      { id: 6, fecha: "2025-03-13", titulo: "Rechazo del lote", descripcion: "Resultado Rechazado. Producto no apto para procesamiento.", tipo: "rechazo" },
    ],
  },
  {
    id: 7,
    codigo: "RCP-007",
    fecha: "2025-02-26",
    campania: "Campaña 2023-2024",
    responsable: "Téc. Rolando Huaraca",
    planta: "Planta Central - Andahuaylas",
    loteProductor: "LP-2025-007",
    productor: "Apolinario Condori",
    parcela: "PAR-007 · Parcela G - Rumi Pata",
    cultivo: "Quinua",
    comunidad: "Inti Huasi",
    sacos: 3,
    pesoCampo: 136.1,
    pesoBruto: 3136.1,
    tara: 3000.0,
    pesoNeto: 136.1,
    diferencia: 0.0,
    merma: 0.0,
    humedad: 12.0,
    impurezas: 1.5,
    materiaExtrana: 0.4,
    color: "Cremoso",
    olor: "Aroma característico",
    presenciaInsectos: "Ausente",
    estadoProducto: "Bueno",
    categoria: "Primera",
    destino: "Procesamiento",
    resultado: "Aceptado",
    estado: "Disponible para Procesamiento",
    observaciones:
      "Quinua en buen estado general. Recepción conforme y lista para el proceso de transformación.",
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Descarga", descripcion: "Descarga de sacos en la plataforma de recepción" },
    ],
    documentoRecepcion: true,
    firmaResponsable: true,
    historial: [
      { id: 1, fecha: "2025-02-25", titulo: "LP generado", descripcion: "El lote LP-2025-007 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-02-26", titulo: "Recepción registrada", descripcion: "La recepción RCP-007 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-02-26", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 136.1 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-02-26", titulo: "Control de calidad", descripcion: "Humedad 12.0%, impurezas 1.5% y estado general Bueno.", tipo: "calidad" },
      { id: 5, fecha: "2025-02-26", titulo: "Clasificación", descripcion: "Categoría Primera con destino Procesamiento.", tipo: "clasificacion" },
      { id: 6, fecha: "2025-02-26", titulo: "Disponible para procesamiento", descripcion: "Resultado Aceptado. La materia prima quedó lista para transformación.", tipo: "disponible" },
    ],
  },
  {
    id: 8,
    codigo: "RCP-008",
    fecha: "2025-02-19",
    campania: "Campaña 2023-2024",
    responsable: "Ing. Silvia Medina",
    planta: "Planta Secundaria - Talavera",
    loteProductor: "LP-2025-008",
    productor: "Rosa Chávez",
    parcela: "PAR-008 · Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    comunidad: "San Martín",
    sacos: 5,
    pesoCampo: 276.8,
    pesoBruto: 3976.8,
    tara: 3700.0,
    pesoNeto: 276.8,
    diferencia: 0.0,
    merma: 0.0,
    humedad: 13.5,
    impurezas: 2.0,
    materiaExtrana: 0.7,
    color: "Blanco Perlado",
    olor: "Neutro",
    presenciaInsectos: "Ausente",
    estadoProducto: "Bueno",
    estado: "En Control de Calidad",
    observaciones:
      "Pesaje realizado conforme. El control de calidad está en curso; se evalúa la muestra final para definir clasificación y resultado.",
    evidencias: [],
    documentoRecepcion: false,
    firmaResponsable: false,
    historial: [
      { id: 1, fecha: "2025-02-18", titulo: "LP generado", descripcion: "El lote LP-2025-008 fue generado en el módulo de Acopio.", tipo: "lp" },
      { id: 2, fecha: "2025-02-19", titulo: "Recepción registrada", descripcion: "La recepción RCP-008 fue registrada en la planta.", tipo: "recepcion" },
      { id: 3, fecha: "2025-02-19", titulo: "Pesaje realizado", descripcion: "Peso neto registrado de 276.8 kg en la balanza de planta.", tipo: "pesaje" },
      { id: 4, fecha: "2025-02-19", titulo: "Control de calidad", descripcion: "Humedad 13.5%, impurezas 2.0% y estado general Bueno.", tipo: "calidad" },
    ],
  },
];

export const siguienteCodigoRecepcion = `RCP-${String(recepcionesMock.length + 1).padStart(3, "0")}`;

export const mockRecepcion: Recepcion = recepcionesMock[0];
