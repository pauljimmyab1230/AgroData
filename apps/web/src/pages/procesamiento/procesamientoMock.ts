export type EstadoProcesamiento =
  | "Registrada"
  | "En Proceso"
  | "Completada"
  | "Pausada"
  | "Cancelada";

export type EstadoOperacion =
  | "Pendiente"
  | "En Curso"
  | "Completada"
  | "No Aplica";

export type CalidadProducto =
  | "Primera"
  | "Segunda"
  | "Tercera"
  | "Descarte";

export type LineaProcesamiento =
  | "Línea A - Granos"
  | "Línea B - Tubérculos"
  | "Línea C - Legumbres"
  | "Línea D - Semillas";

export type ProductoBase =
  | "Grano Limpio de Quinua"
  | "Papa Deshidratada"
  | "Cebada Perolada"
  | "Haba Pelada"
  | "Maíz Choclo"
  | "Tarwi Purificado";

export type TipoEventoHistorial =
  | "recepcion"
  | "inicio"
  | "operacion"
  | "control"
  | "producto_base"
  | "completada"
  | "disponible";

export type EvidenciaProcesamiento = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "fotografia" | "documento" | "reporte";
  preview?: string;
};

export type EventoHistorial = {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEventoHistorial;
};

export type LoteProductorProcesado = {
  loteProductor: string;
  productor: string;
  parcela: string;
  cultivo: string;
  pesoRecepcionado: number;
};

export type Operacion = {
  nombre: string;
  responsable: string;
  estado: EstadoOperacion;
  observaciones: string;
};

export type ResultadoProcesamiento = {
  pesoEntrada: number;
  pesoSalida: number;
  merma: number;
  rendimiento: number;
  productoBase: string;
  calidad: CalidadProducto;
  pesoFinal: number;
  humedadFinal: number;
};

export type OrdenProcesamiento = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  producto: string;
  responsable: string;
  planta: string;
  lineaProcesamiento: LineaProcesamiento;
  estado: EstadoProcesamiento;
  observaciones: string;
  lotesProductor: LoteProductorProcesado[];
  operaciones: Operacion[];
  resultado?: ResultadoProcesamiento;
  evidencias: EvidenciaProcesamiento[];
  historial: EventoHistorial[];
};

export const campaniasOpciones = ["Campaña 2024-2025", "Campaña 2023-2024", "Campaña 2022-2023"];

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
  "Oper. Mario Quispe",
  "Oper. Ana Ttito",
];

export const lineasProcesamientoOpciones: LineaProcesamiento[] = [
  "Línea A - Granos",
  "Línea B - Tubérculos",
  "Línea C - Legumbres",
  "Línea D - Semillas",
];

export const productosOpciones: ProductoBase[] = [
  "Grano Limpio de Quinua",
  "Papa Deshidratada",
  "Cebada Perolada",
  "Haba Pelada",
  "Maíz Choclo",
  "Tarwi Purificado",
];

export const estadosProcesamientoOpciones: EstadoProcesamiento[] = [
  "Registrada",
  "En Proceso",
  "Completada",
  "Pausada",
  "Cancelada",
];

export const calidadesOpciones: CalidadProducto[] = [
  "Primera",
  "Segunda",
  "Tercera",
  "Descarte",
];

export const operacionesDisponibles = [
  "Despedrado",
  "Escarificado",
  "Desaponificado",
  "Lavado",
  "Secado",
  "Clasificación",
  "Selección",
];

export const lotesProductorDisponibles = [
  {
    loteProductor: "LP-2025-001",
    productor: "Apolinario Condori",
    parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    pesoRecepcionado: 185.0,
  },
  {
    loteProductor: "LP-2025-002",
    productor: "María Huamán",
    parcela: "PAR-002 · Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    pesoRecepcionado: 150.0,
  },
  {
    loteProductor: "LP-2025-003",
    productor: "Pedro Rojas",
    parcela: "PAR-003 · Parcela C - Qucha Pata",
    cultivo: "Cebada",
    pesoRecepcionado: 245.0,
  },
  {
    loteProductor: "LP-2025-005",
    productor: "Juan Gutiérrez",
    parcela: "PAR-005 · Parcela E - San Martín",
    cultivo: "Haba",
    pesoRecepcionado: 188.6,
  },
  {
    loteProductor: "LP-2025-007",
    productor: "Apolinario Condori",
    parcela: "PAR-007 · Parcela G - Rumi Pata",
    cultivo: "Quinua",
    pesoRecepcionado: 136.1,
  },
];

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

export const procesamientoMock: OrdenProcesamiento[] = [
  {
    id: 1,
    codigo: "OP-001",
    fecha: "2025-04-20",
    campania: "Campaña 2024-2025",
    producto: "Quinua",
    responsable: "Ing. Julio Paredes",
    planta: "Planta Central - Andahuaylas",
    lineaProcesamiento: "Línea A - Granos",
    estado: "Completada",
    observaciones:
      "Proceso de desaponificado de quinua completado exitosamente. Se obtuvo grano limpio de primera calidad.",
    lotesProductor: [
      {
        loteProductor: "LP-2025-001",
        productor: "Apolinario Condori",
        parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
        cultivo: "Quinua",
        pesoRecepcionado: 185.0,
      },
      {
        loteProductor: "LP-2025-007",
        productor: "Apolinario Condori",
        parcela: "PAR-007 · Parcela G - Rumi Pata",
        cultivo: "Quinua",
        pesoRecepcionado: 136.1,
      },
    ],
    operaciones: [
      { nombre: "Despedrado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Despedrado sin novedad" },
      { nombre: "Escarificado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Escarificado estándar" },
      { nombre: "Desaponificado", responsable: "Oper. Ana Ttito", estado: "Completada", observaciones: "Saponinas eliminadas correctamente" },
      { nombre: "Lavado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Tres ciclos de lavado" },
      { nombre: "Secado", responsable: "Oper. Ana Ttito", estado: "Completada", observaciones: "Secado solar por 4 horas" },
      { nombre: "Clasificación", responsable: "Ing. Julio Paredes", estado: "Completada", observaciones: "Clasificación manual completada" },
      { nombre: "Selección", responsable: "Ing. Julio Paredes", estado: "Completada", observaciones: "Selección final OK" },
    ],
    resultado: {
      pesoEntrada: 321.1,
      pesoSalida: 263.3,
      merma: 57.8,
      rendimiento: 82.0,
      productoBase: "Grano Limpio de Quinua",
      calidad: "Primera",
      pesoFinal: 263.3,
      humedadFinal: 10.5,
    },
    evidencias: [
      { id: 1, nombre: "Foto Inicio Proceso", descripcion: "LP-001 y LP-007 ingresando a línea de procesamiento", tipo: "fotografia" },
      { id: 2, nombre: "Foto Producto Final", descripcion: "Grano limpio de quinua en tolva de salida", tipo: "fotografia" },
      { id: 3, nombre: "Reporte Técnico OP-001", descripcion: "Reporte técnico del procesamiento", tipo: "reporte" },
    ],
    historial: [
      { id: 1, fecha: "2025-04-16", titulo: "Recepción de Materia Prima", descripcion: "LP-2025-001 y LP-2025-007 recepcionados en planta.", tipo: "recepcion" },
      { id: 2, fecha: "2025-04-20", titulo: "Inicio del Procesamiento", descripcion: "OP-001 iniciada por Ing. Julio Paredes.", tipo: "inicio" },
      { id: 3, fecha: "2025-04-20", titulo: "Desaponificado", descripcion: "Operación de desaponificado completada.", tipo: "operacion" },
      { id: 4, fecha: "2025-04-20", titulo: "Secado", descripcion: "Secado solar completado. Humedad 10.5%.", tipo: "operacion" },
      { id: 5, fecha: "2025-04-20", titulo: "Clasificación", descripcion: "Grano clasificado como Primera calidad.", tipo: "control" },
      { id: 6, fecha: "2025-04-20", titulo: "Selección", descripcion: "Selección final completada.", tipo: "operacion" },
      { id: 7, fecha: "2025-04-20", titulo: "Producto Base Obtenido", descripcion: "Grano Limpio de Quinua - 263.3 kg, 82% rendimiento.", tipo: "producto_base" },
      { id: 8, fecha: "2025-04-20", titulo: "Procesamiento Completado", descripcion: "OP-001 finalizada exitosamente.", tipo: "completada" },
      { id: 9, fecha: "2025-04-20", titulo: "Disponible para Transformación", descripcion: "Producto base listo para el módulo de Transformación.", tipo: "disponible" },
    ],
  },
  {
    id: 2,
    codigo: "OP-002",
    fecha: "2025-04-18",
    campania: "Campaña 2024-2025",
    producto: "Papa Nativa",
    responsable: "Ing. Carmen Flores",
    planta: "Planta Central - Andahuaylas",
    lineaProcesamiento: "Línea B - Tubérculos",
    estado: "En Proceso",
    observaciones:
      "Proceso de deshidratación de papa nativa en curso. Pendiente secado y clasificación.",
    lotesProductor: [
      {
        loteProductor: "LP-2025-002",
        productor: "María Huamán",
        parcela: "PAR-002 · Parcela B - Pampa Urku",
        cultivo: "Papa Nativa",
        pesoRecepcionado: 150.0,
      },
    ],
    operaciones: [
      { nombre: "Despedrado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Despedrado OK" },
      { nombre: "Lavado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Lavado completo" },
      { nombre: "Secado", responsable: "Oper. Ana Ttito", estado: "En Curso", observaciones: "En secado artificial" },
      { nombre: "Clasificación", responsable: "Ing. Carmen Flores", estado: "Pendiente", observaciones: "" },
      { nombre: "Selección", responsable: "Ing. Carmen Flores", estado: "Pendiente", observaciones: "" },
    ],
    evidencias: [
      { id: 1, nombre: "Foto Inicio", descripcion: "Papa nativa ingresando a línea", tipo: "fotografia" },
    ],
    historial: [
      { id: 1, fecha: "2025-04-11", titulo: "Recepción de Materia Prima", descripcion: "LP-2025-002 recepcionado en planta.", tipo: "recepcion" },
      { id: 2, fecha: "2025-04-18", titulo: "Inicio del Procesamiento", descripcion: "OP-002 iniciada por Ing. Carmen Flores.", tipo: "inicio" },
      { id: 3, fecha: "2025-04-18", titulo: "Despedrado", descripcion: "Despedrado completado.", tipo: "operacion" },
      { id: 4, fecha: "2025-04-18", titulo: "Lavado", descripcion: "Lavado completado.", tipo: "operacion" },
      { id: 5, fecha: "2025-04-18", titulo: "Secado en curso", descripcion: "Secado artificial en progreso.", tipo: "operacion" },
    ],
  },
  {
    id: 3,
    codigo: "OP-003",
    fecha: "2025-04-15",
    campania: "Campaña 2024-2025",
    producto: "Cebada",
    responsable: "Téc. Rolando Huaraca",
    planta: "Planta Secundaria - Talavera",
    lineaProcesamiento: "Línea A - Granos",
    estado: "Registrada",
    observaciones:
      "Orden registrada pendiente de inicio. Se esperará disponibilidad de la Línea A.",
    lotesProductor: [
      {
        loteProductor: "LP-2025-003",
        productor: "Pedro Rojas",
        parcela: "PAR-003 · Parcela C - Qucha Pata",
        cultivo: "Cebada",
        pesoRecepcionado: 245.0,
      },
    ],
    operaciones: [
      { nombre: "Despedrado", responsable: "Oper. Mario Quispe", estado: "Pendiente", observaciones: "" },
      { nombre: "Lavado", responsable: "Oper. Mario Quispe", estado: "Pendiente", observaciones: "" },
      { nombre: "Secado", responsable: "Oper. Ana Ttito", estado: "Pendiente", observaciones: "" },
      { nombre: "Clasificación", responsable: "Téc. Rolando Huaraca", estado: "Pendiente", observaciones: "" },
      { nombre: "Selección", responsable: "Téc. Rolando Huaraca", estado: "Pendiente", observaciones: "" },
    ],
    evidencias: [],
    historial: [
      { id: 1, fecha: "2025-04-06", titulo: "Recepción de Materia Prima", descripcion: "LP-2025-003 recepcionado en planta.", tipo: "recepcion" },
      { id: 2, fecha: "2025-04-15", titulo: "Orden Registrada", descripcion: "OP-003 registrada por Téc. Rolando Huaraca.", tipo: "inicio" },
    ],
  },
  {
    id: 4,
    codigo: "OP-004",
    fecha: "2025-03-25",
    campania: "Campaña 2024-2025",
    producto: "Haba",
    responsable: "Ing. Silvia Medina",
    planta: "Planta Central - Andahuaylas",
    lineaProcesamiento: "Línea C - Legumbres",
    estado: "Completada",
    observaciones:
      "Haba pelada y clasificada. Producto base de primera calidad obtenido.",
    lotesProductor: [
      {
        loteProductor: "LP-2025-005",
        productor: "Juan Gutiérrez",
        parcela: "PAR-005 · Parcela E - San Martín",
        cultivo: "Haba",
        pesoRecepcionado: 188.6,
      },
    ],
    operaciones: [
      { nombre: "Despedrado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Despedrado manual" },
      { nombre: "Lavado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Lavado en tambor" },
      { nombre: "Secado", responsable: "Oper. Ana Ttito", estado: "Completada", observaciones: "" },
      { nombre: "Clasificación", responsable: "Ing. Silvia Medina", estado: "Completada", observaciones: "Primera calidad" },
      { nombre: "Selección", responsable: "Ing. Silvia Medina", estado: "Completada", observaciones: "Selección final OK" },
    ],
    resultado: {
      pesoEntrada: 188.6,
      pesoSalida: 156.2,
      merma: 32.4,
      rendimiento: 82.8,
      productoBase: "Haba Pelada",
      calidad: "Primera",
      pesoFinal: 156.2,
      humedadFinal: 11.2,
    },
    evidencias: [
      { id: 1, nombre: "Foto Haba Procesada", descripcion: "Haba pelada lista para envasado", tipo: "fotografia" },
      { id: 2, nombre: "Documento de Calidad", descripcion: "Certificado de calidad interna", tipo: "documento" },
    ],
    historial: [
      { id: 1, fecha: "2025-03-21", titulo: "Recepción de Materia Prima", descripcion: "LP-2025-005 recepcionado en planta.", tipo: "recepcion" },
      { id: 2, fecha: "2025-03-25", titulo: "Inicio del Procesamiento", descripcion: "OP-004 iniciada por Ing. Silvia Medina.", tipo: "inicio" },
      { id: 3, fecha: "2025-03-25", titulo: "Operaciones completadas", descripcion: "Todas las operaciones finalizadas.", tipo: "operacion" },
      { id: 4, fecha: "2025-03-25", titulo: "Clasificación", descripcion: "Haba clasificada como Primera.", tipo: "control" },
      { id: 5, fecha: "2025-03-25", titulo: "Producto Base Obtenido", descripcion: "Haba Pelada - 156.2 kg, 82.8% rendimiento.", tipo: "producto_base" },
      { id: 6, fecha: "2025-03-25", titulo: "Procesamiento Completado", descripcion: "OP-004 finalizada exitosamente.", tipo: "completada" },
      { id: 7, fecha: "2025-03-25", titulo: "Disponible para Transformación", descripcion: "Producto base listo.", tipo: "disponible" },
    ],
  },
  {
    id: 5,
    codigo: "OP-005",
    fecha: "2025-04-22",
    campania: "Campaña 2024-2025",
    producto: "Quinua",
    responsable: "Ing. Carmen Flores",
    planta: "Planta Central - Andahuaylas",
    lineaProcesamiento: "Línea A - Granos",
    estado: "Pausada",
    observaciones:
      "Proceso pausado por mantenimiento programado de la tolva de alimentación. Se reanudará mañana.",
    lotesProductor: [
      {
        loteProductor: "LP-2025-001",
        productor: "Apolinario Condori",
        parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
        cultivo: "Quinua",
        pesoRecepcionado: 185.0,
      },
    ],
    operaciones: [
      { nombre: "Despedrado", responsable: "Oper. Mario Quispe", estado: "Completada", observaciones: "Despedrado OK" },
      { nombre: "Escarificado", responsable: "Oper. Mario Quispe", estado: "En Curso", observaciones: "Pausado a la mitad" },
      { nombre: "Desaponificado", responsable: "Oper. Ana Ttito", estado: "Pendiente", observaciones: "" },
      { nombre: "Lavado", responsable: "Oper. Mario Quispe", estado: "Pendiente", observaciones: "" },
      { nombre: "Secado", responsable: "Oper. Ana Ttito", estado: "Pendiente", observaciones: "" },
      { nombre: "Clasificación", responsable: "Ing. Carmen Flores", estado: "Pendiente", observaciones: "" },
      { nombre: "Selección", responsable: "Ing. Carmen Flores", estado: "Pendiente", observaciones: "" },
    ],
    evidencias: [
      { id: 1, nombre: "Foto Tolva", descripcion: "Estado de la tolva antes del mantenimiento", tipo: "fotografia" },
    ],
    historial: [
      { id: 1, fecha: "2025-04-16", titulo: "Recepción de Materia Prima", descripcion: "LP-2025-001 recepcionado en planta.", tipo: "recepcion" },
      { id: 2, fecha: "2025-04-22", titulo: "Inicio del Procesamiento", descripcion: "OP-005 iniciada por Ing. Carmen Flores.", tipo: "inicio" },
      { id: 3, fecha: "2025-04-22", titulo: "Despedrado", descripcion: "Despedrado completado.", tipo: "operacion" },
      { id: 4, fecha: "2025-04-22", titulo: "Proceso Pausado", descripcion: "Mantenimiento programado de tolva.", tipo: "operacion" },
    ],
  },
];

export const siguienteCodigoOP = `OP-${String(procesamientoMock.length + 1).padStart(3, "0")}`;

export const mockOrdenProcesamiento: OrdenProcesamiento = procesamientoMock[0];
