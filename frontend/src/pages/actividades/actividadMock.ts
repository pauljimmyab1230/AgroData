export type TipoActividad =
  | "Preparación del Terreno"
  | "Siembra"
  | "Resiembra"
  | "Fertilización"
  | "Compostaje"
  | "Aplicación de Bioles"
  | "Control Biológico"
  | "Manejo de Plagas"
  | "Manejo de Enfermedades"
  | "Deshierbo"
  | "Riego"
  | "Poda"
  | "Aporque"
  | "Cosecha"
  | "Otra";

export type Prioridad = "Alta" | "Media" | "Baja";

export type EstadoActividad = "Programada" | "En Proceso" | "Completada";

export type Insumo = {
  id: string;
  producto: string;
  categoria: string;
  fabricante: string;
  cantidad: string;
  unidad: string;
  lote: string;
  costoUnitario: string;
  costoTotal: string;
  observaciones: string;
};

export type Trabajador = {
  id: string;
  trabajador: string;
  funcion: string;
  jornales: string;
  horas: string;
  observaciones: string;
};

export type Equipo = {
  id: string;
  equipo: string;
  operador: string;
  horasUso: string;
  combustible: string;
  observaciones: string;
};

export type ActividadFoto = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha?: string;
  responsable?: string;
  preview?: string;
};

export type Actividad = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  productor: string;
  parcela: string;
  cultivo: string;
  responsableTecnico: string;
  tipoActividad: TipoActividad;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: string;
  prioridad: Prioridad;
  estado: EstadoActividad;
  jornales: string;
  insumos: Insumo[];
  manoObra: Trabajador[];
  maquinaria: Equipo[];
  fotos: ActividadFoto[];
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  observacionesTecnicas: string;
  recomendaciones: string;
  objetivo: string;
  resultado: string;
  proximaActividad: string;
  fechaRegistro: string;
};

export type ActividadFormData = Omit<Actividad, "id" | "fechaRegistro" | "tipoActividad"> & {
  tipoActividad: TipoActividad | "";
};

export type ParcelaOption = {
  id: number;
  codigo: string;
  nombre: string;
  productor: string;
  cultivoPrincipal: string;
};

export const tiposActividad: TipoActividad[] = [
  "Preparación del Terreno",
  "Siembra",
  "Resiembra",
  "Fertilización",
  "Compostaje",
  "Aplicación de Bioles",
  "Control Biológico",
  "Manejo de Plagas",
  "Manejo de Enfermedades",
  "Deshierbo",
  "Riego",
  "Poda",
  "Aporque",
  "Cosecha",
  "Otra",
];

export const campaniasOpciones = [
  "Campaña 2025-2026 Quinua Orgánica",
  "Campaña 2024-2025 Granos Andinos",
  "Campaña 2025-2026 Papa Nativa",
  "Campaña 2023-2024 Diversificación",
  "Campaña 2025-2026 Tarwi",
];

export const cultivosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Maíz", "Haba", "Tarwi"];

export const productoresOpciones = [
  "Apolinario Condori",
  "María Huamán",
  "Pedro Rojas",
  "Rosa Chávez",
  "Juan Gutiérrez",
  "Lucía Mendoza",
];

export const parcelasOpciones: ParcelaOption[] = [
  { id: 1, codigo: "PAR-001", nombre: "Parcela A - Ñawpa Rumi", productor: "Apolinario Condori", cultivoPrincipal: "Quinua" },
  { id: 2, codigo: "PAR-002", nombre: "Parcela B - Pampa Urku", productor: "María Huamán", cultivoPrincipal: "Papa Nativa" },
  { id: 3, codigo: "PAR-003", nombre: "Parcela C - Qucha Pata", productor: "Pedro Rojas", cultivoPrincipal: "Cebada" },
  { id: 4, codigo: "PAR-004", nombre: "Parcela D - Puca Pampa", productor: "Rosa Chávez", cultivoPrincipal: "Maíz" },
  { id: 5, codigo: "PAR-005", nombre: "Parcela E - San Martín", productor: "Juan Gutiérrez", cultivoPrincipal: "Haba" },
  { id: 6, codigo: "PAR-006", nombre: "Parcela F - Tiquihua Alta", productor: "Lucía Mendoza", cultivoPrincipal: "Tarwi" },
  { id: 7, codigo: "PAR-007", nombre: "Parcela G - Rumi Pata", productor: "Apolinario Condori", cultivoPrincipal: "Quinua" },
  { id: 8, codigo: "PAR-008", nombre: "Parcela H - Inti Huasi", productor: "Rosa Chávez", cultivoPrincipal: "Papa Nativa" },
];

export const tecnicosOpciones = [
  "Ing. Marco Salas",
  "Ing. Ana Paredes",
  "Téc. Jorge Quispe",
  "Ing. Carmen Villalobos",
];

export const prioridadesOpciones: Prioridad[] = ["Alta", "Media", "Baja"];

export const estadosActividadOpciones: EstadoActividad[] = ["Programada", "En Proceso", "Completada"];

export const productosInsumoOpciones = [
  "Guano de corral",
  "Compost",
  "Biol",
  "Cal agrícola",
  "Roca fosfórica",
  "Semilla de quinua",
  "Semilla de papa nativa",
  "Extracto de ají",
  "Aceite de neem",
  "Caldo bordelés",
  "Yeso agrícola",
  "Sulfato de potasio",
];

export const categoriasInsumoOpciones = [
  "Abonos orgánicos",
  "Fertilizantes",
  "Control biológico",
  "Semillas",
  "Insumos de labranza",
];

export const fabricantesOpciones = [
  "Cooperativa Frutos del Ande",
  "AgroAndes",
  "Biolab Perú",
  "Semillas Andinas SAC",
  "AgroFer S.A.C.",
];

export const unidadesOpciones = ["kg", "g", "L", "t", "sacos", "carretillas", "unid."];

export const lotesOpciones = ["L-001", "L-002", "L-003", "L-004", "L-005"];

export const trabajadoresOpciones = [
  "Santos Huamán",
  "Félix Condori",
  "Marcelina Rojas",
  "Gregorio Quispe",
  "Rufina Poma",
  "Teodosio Chávez",
];

export const funcionesOpciones = [
  "Siembra",
  "Riego",
  "Cosecha",
  "Deshierbo",
  "Aplicación de insumos",
  "Preparación de terreno",
  "Transporte de carga",
];

export const equiposOpciones = [
  "Tractor agrícola",
  "Arado de discos",
  "Rastra",
  "Motocultor",
  "Bomba pulverizadora",
  "Camión de acarreo",
  "Sembradora manual",
];

export const operadoresOpciones = [
  "Marcelo Huamaní",
  "Simón Ccahuana",
  "Elías Quispe",
  "Vidal Taipe",
];

export const combustibleOpciones = ["Petróleo D2", "Gasolina 90", "No aplica"];

export const responsablesFotoOpciones = [...tecnicosOpciones, ...productoresOpciones];

function crearFotos(fecha: string, responsable: string): ActividadFoto[] {
  return [
    {
      id: "f-general",
      titulo: "Vista General",
      descripcion: "Panorámica del área intervenida durante la actividad.",
      fecha,
      responsable,
    },
    {
      id: "f-detalle",
      titulo: "Detalle de la Labor",
      descripcion: "Acercamiento de la labor agrícola realizada en campo.",
      fecha,
      responsable,
    },
    {
      id: "f-evidencias",
      titulo: "Evidencias",
      descripcion: "Registro complementario del trabajo ejecutado.",
      fecha,
      responsable,
    },
  ];
}

export const emptyActividad: ActividadFormData = {
  codigo: "",
  fecha: "",
  campania: "",
  productor: "",
  parcela: "",
  cultivo: "",
  responsableTecnico: "",
  tipoActividad: "",
  descripcion: "",
  horaInicio: "",
  horaFin: "",
  duracionEstimada: "",
  prioridad: "Media",
  estado: "Programada",
  jornales: "",
  insumos: [],
  manoObra: [],
  maquinaria: [],
  fotos: crearFotos("", ""),
  latitud: "",
  longitud: "",
  altitud: "",
  precisionGps: "",
  observacionesTecnicas: "",
  recomendaciones: "",
  objetivo: "",
  resultado: "",
  proximaActividad: "",
};

export const actividadesMock: Actividad[] = [
  {
    id: 1,
    codigo: "ACT-2026-001",
    fecha: "2026-08-02",
    campania: "Campaña 2025-2026 Tarwi",
    productor: "Lucía Mendoza",
    parcela: "Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    responsableTecnico: "Ing. Marco Salas",
    tipoActividad: "Fertilización",
    descripcion:
      "Aplicación de fertilización orgánica de refuerzo en el cultivo de tarwi en etapa de floración. Se dosificó guano de corral compostado en las hileras.",
    horaInicio: "08:00",
    horaFin: "11:30",
    duracionEstimada: "3.5 horas",
    prioridad: "Alta",
    estado: "En Proceso",
    jornales: "8 jornales",
    insumos: [
      { id: "i-1", producto: "Guano de corral", categoria: "Abonos orgánicos", fabricante: "Cooperativa Frutos del Ande", cantidad: "150", unidad: "kg", lote: "L-001", costoUnitario: "S/ 0.80", costoTotal: "S/ 120.00", observaciones: "Compostado y tamizado" },
      { id: "i-2", producto: "Roca fosfórica", categoria: "Fertilizantes", fabricante: "AgroAndes", cantidad: "40", unidad: "kg", lote: "L-004", costoUnitario: "S/ 1.50", costoTotal: "S/ 60.00", observaciones: "" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Félix Condori", funcion: "Aplicación de insumos", jornales: "2", horas: "16", observaciones: "Aplicación en hileras" },
      { id: "m-2", trabajador: "Rufina Poma", funcion: "Aplicación de insumos", jornales: "2", horas: "16", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Motocultor", operador: "Marcelo Huamaní", horasUso: "3.5", combustible: "Petróleo D2", observaciones: "Para el volteo de la tierra" },
    ],
    fotos: crearFotos("2026-08-02", "Ing. Marco Salas"),
    latitud: "-13.6410",
    longitud: "-73.8890",
    altitud: "3,600 m.s.n.m.",
    precisionGps: "± 3 m",
    observacionesTecnicas:
      "La parcela presenta buen vigor vegetativo. Se observó presencia leve de pulgones en el tercio medio del cultivo.",
    recomendaciones:
      "Regar dentro de las 48 horas siguientes para facilitar la asimilación de nutrientes. Reforzar el monitoreo de pulgones.",
    objetivo: "Reforzar la nutrición del cultivo de tarwi en etapa de floración.",
    resultado: "Aplicación completada al 100% del área programada (2.05 ha).",
    proximaActividad: "Control Biológico",
    fechaRegistro: "2026-08-02",
  },
  {
    id: 2,
    codigo: "ACT-2026-002",
    fecha: "2026-08-01",
    campania: "Campaña 2025-2026 Quinua Orgánica",
    productor: "Apolinario Condori",
    parcela: "Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    responsableTecnico: "Ing. Ana Paredes",
    tipoActividad: "Control Biológico",
    descripcion:
      "Liberación de controladores biológicos para el manejo preventivo de plagas en el cultivo de quinua. Monitoreo de focos de infestación.",
    horaInicio: "07:30",
    horaFin: "10:00",
    duracionEstimada: "2.5 horas",
    prioridad: "Alta",
    estado: "Completada",
    jornales: "4 jornales",
    insumos: [
      { id: "i-1", producto: "Extracto de ají", categoria: "Control biológico", fabricante: "Biolab Perú", cantidad: "5", unidad: "L", lote: "L-002", costoUnitario: "S/ 18.00", costoTotal: "S/ 90.00", observaciones: "Diluido al 10%" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Santos Huamán", funcion: "Aplicación de insumos", jornales: "2", horas: "16", observaciones: "" },
      { id: "m-2", trabajador: "Marcelina Rojas", funcion: "Riego", jornales: "2", horas: "16", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Bomba pulverizadora", operador: "Simón Ccahuana", horasUso: "2.5", combustible: "Gasolina 90", observaciones: "" },
    ],
    fotos: crearFotos("2026-08-01", "Ing. Ana Paredes"),
    latitud: "-13.6532",
    longitud: "-73.8741",
    altitud: "3,450 m.s.n.m.",
    precisionGps: "± 2 m",
    observacionesTecnicas: "Se liberaron 200 parasitoides por hectárea en los focos detectados.",
    recomendaciones: "Revisar nuevamente la parcela en 7 días para evaluar la efectividad del control.",
    objetivo: "Prevenir el incremento poblacional de plagas en quinua.",
    resultado: "Control biológico aplicado sin afectar la flora benéfica.",
    proximaActividad: "Manejo de Plagas",
    fechaRegistro: "2026-08-01",
  },
  {
    id: 3,
    codigo: "ACT-2026-003",
    fecha: "2026-08-01",
    campania: "Campaña 2025-2026 Papa Nativa",
    productor: "María Huamán",
    parcela: "Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    responsableTecnico: "Téc. Jorge Quispe",
    tipoActividad: "Riego",
    descripcion:
      "Riego por gravedad del sector Pampa Urku. Se habilitaron los canales de conducción y se verificó la uniformidad de la humedad.",
    horaInicio: "09:00",
    horaFin: "13:00",
    duracionEstimada: "4 horas",
    prioridad: "Media",
    estado: "Completada",
    jornales: "6 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Gregorio Quispe", funcion: "Riego", jornales: "3", horas: "24", observaciones: "Turnos por sectores" },
      { id: "m-2", trabajador: "Teodosio Chávez", funcion: "Riego", jornales: "3", horas: "24", observaciones: "" },
    ],
    maquinaria: [],
    fotos: crearFotos("2026-08-01", "Téc. Jorge Quispe"),
    latitud: "-13.6290",
    longitud: "-74.1482",
    altitud: "3,210 m.s.n.m.",
    precisionGps: "± 5 m",
    observacionesTecnicas: "Uniformidad de riego aceptable, con ligeros encharcamientos en el sector sur.",
    recomendaciones: "Mantener el turno de riego cada 12 días y corregir el drenaje del sector sur.",
    objetivo: "Garantizar la disponibilidad hídrica del cultivo de papa nativa.",
    resultado: "Riego aplicado al 100% de la parcela.",
    proximaActividad: "Deshierbo",
    fechaRegistro: "2026-08-01",
  },
  {
    id: 4,
    codigo: "ACT-2026-004",
    fecha: "2026-07-28",
    campania: "Campaña 2025-2026 Quinua Orgánica",
    productor: "Rosa Chávez",
    parcela: "Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    responsableTecnico: "Ing. Carmen Villalobos",
    tipoActividad: "Manejo de Plagas",
    descripcion:
      "Evaluación fitosanitaria y aplicación de medidas de control ante la presencia de gusanos de tierra en bordes de la parcela.",
    horaInicio: "08:30",
    horaFin: "11:00",
    duracionEstimada: "2.5 horas",
    prioridad: "Alta",
    estado: "Completada",
    jornales: "3 jornales",
    insumos: [
      { id: "i-1", producto: "Caldo bordelés", categoria: "Control biológico", fabricante: "AgroFer S.A.C.", cantidad: "12", unidad: "L", lote: "L-003", costoUnitario: "S/ 6.50", costoTotal: "S/ 78.00", observaciones: "Aplicación localizada" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Marcelina Rojas", funcion: "Aplicación de insumos", jornales: "1.5", horas: "12", observaciones: "" },
      { id: "m-2", trabajador: "Santos Huamán", funcion: "Deshierbo", jornales: "1.5", horas: "12", observaciones: "" },
    ],
    maquinaria: [],
    fotos: crearFotos("2026-07-28", "Ing. Carmen Villalobos"),
    latitud: "-13.1960",
    longitud: "-74.2980",
    altitud: "3,400 m.s.n.m.",
    precisionGps: "± 3 m",
    observacionesTecnicas: "Se identificaron 3 focos de gusanos de tierra en los bordes este y norte.",
    recomendaciones: "Aumentar el monitoreo en el sector este de la parcela.",
    objetivo: "Reducir la población de gusanos de tierra en la parcela.",
    resultado: "Focos tratados; sin daño económico al cultivo.",
    proximaActividad: "Manejo de Enfermedades",
    fechaRegistro: "2026-07-28",
  },
  {
    id: 5,
    codigo: "ACT-2026-005",
    fecha: "2026-07-25",
    campania: "Campaña 2025-2026 Quinua Orgánica",
    productor: "Apolinario Condori",
    parcela: "Parcela G - Rumi Pata",
    cultivo: "Quinua",
    responsableTecnico: "Ing. Marco Salas",
    tipoActividad: "Siembra",
    descripcion:
      "Siembra directa en surcos de quinua orgánica variedad Blanca de Junín, con densidad de 12 kg/ha y distanciamiento de 0.70 m.",
    horaInicio: "07:00",
    horaFin: "12:00",
    duracionEstimada: "5 horas",
    prioridad: "Alta",
    estado: "Completada",
    jornales: "10 jornales",
    insumos: [
      { id: "i-1", producto: "Semilla de quinua", categoria: "Semillas", fabricante: "Semillas Andinas SAC", cantidad: "18", unidad: "kg", lote: "L-005", costoUnitario: "S/ 15.00", costoTotal: "S/ 270.00", observaciones: "Variedad Blanca de Junín" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Félix Condori", funcion: "Siembra", jornales: "3", horas: "24", observaciones: "" },
      { id: "m-2", trabajador: "Rufina Poma", funcion: "Siembra", jornales: "3", horas: "24", observaciones: "" },
      { id: "m-3", trabajador: "Gregorio Quispe", funcion: "Preparación de terreno", jornales: "2", horas: "16", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Tractor agrícola", operador: "Marcelo Huamaní", horasUso: "5", combustible: "Petróleo D2", observaciones: "Sembrado con arado" },
      { id: "e-2", equipo: "Arado de discos", operador: "Marcelo Huamaní", horasUso: "3", combustible: "No aplica", observaciones: "" },
    ],
    fotos: crearFotos("2026-07-25", "Ing. Marco Salas"),
    latitud: "-13.6490",
    longitud: "-73.8660",
    altitud: "3,470 m.s.n.m.",
    precisionGps: "± 2 m",
    observacionesTecnicas: "Emergencia esperada en 10 a 14 días. Densidad verificada en campo.",
    recomendaciones: "Primer riego de germinación dentro de los 8 días.",
    objetivo: "Establecer el cultivo de quinua orgánica en la parcela.",
    resultado: "Siembra completada en 1.10 ha programadas.",
    proximaActividad: "Riego",
    fechaRegistro: "2026-07-25",
  },
  {
    id: 6,
    codigo: "ACT-2026-006",
    fecha: "2026-06-30",
    campania: "Campaña 2025-2026 Tarwi",
    productor: "Lucía Mendoza",
    parcela: "Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    responsableTecnico: "Ing. Ana Paredes",
    tipoActividad: "Aplicación de Bioles",
    descripcion:
      "Aplicación foliar de biol enriquecido para estimular el desarrollo vegetativo del cultivo de tarwi en etapa de crecimiento.",
    horaInicio: "15:00",
    horaFin: "17:30",
    duracionEstimada: "2.5 horas",
    prioridad: "Media",
    estado: "Completada",
    jornales: "5 jornales",
    insumos: [
      { id: "i-1", producto: "Biol", categoria: "Abonos orgánicos", fabricante: "Cooperativa Frutos del Ande", cantidad: "60", unidad: "L", lote: "L-002", costoUnitario: "S/ 1.20", costoTotal: "S/ 72.00", observaciones: "Biol madurado 60 días" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Rufina Poma", funcion: "Aplicación de insumos", jornales: "2.5", horas: "20", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Bomba pulverizadora", operador: "Elías Quispe", horasUso: "2.5", combustible: "Gasolina 90", observaciones: "" },
    ],
    fotos: crearFotos("2026-06-30", "Ing. Ana Paredes"),
    latitud: "-13.6410",
    longitud: "-73.8890",
    altitud: "3,600 m.s.n.m.",
    precisionGps: "± 3 m",
    observacionesTecnicas: "Aplicación foliar uniforme sobre el dosel del cultivo.",
    recomendaciones: "Aplicar en horas de la tarde para evitar la evaporación.",
    objetivo: "Estimular el desarrollo vegetativo del tarwi.",
    resultado: "Aplicación realizada sobre 2.05 ha.",
    proximaActividad: "Fertilización",
    fechaRegistro: "2026-06-30",
  },
  {
    id: 7,
    codigo: "ACT-2026-007",
    fecha: "2026-06-18",
    campania: "Campaña 2024-2025 Granos Andinos",
    productor: "Pedro Rojas",
    parcela: "Parcela C - Qucha Pata",
    cultivo: "Cebada",
    responsableTecnico: "Téc. Jorge Quispe",
    tipoActividad: "Deshierbo",
    descripcion:
      "Deshierbo manual de malezas en la parcela C, con énfasis en los surcos de cebada. Jornada con 6 jornales.",
    horaInicio: "08:00",
    horaFin: "13:00",
    duracionEstimada: "5 horas",
    prioridad: "Media",
    estado: "Completada",
    jornales: "6 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Santos Huamán", funcion: "Deshierbo", jornales: "3", horas: "24", observaciones: "" },
      { id: "m-2", trabajador: "Teodosio Chávez", funcion: "Deshierbo", jornales: "3", horas: "24", observaciones: "" },
    ],
    maquinaria: [],
    fotos: crearFotos("2026-06-18", "Téc. Jorge Quispe"),
    latitud: "-13.2210",
    longitud: "-74.2140",
    altitud: "3,520 m.s.n.m.",
    precisionGps: "± 5 m",
    observacionesTecnicas: "La parcela presenta baja presión de malezas por la rotación de cultivos.",
    recomendaciones: "Programar una segunda pasada de deshierbo en 4 semanas.",
    objetivo: "Eliminar las malezas competidoras del cultivo de cebada.",
    resultado: "Deshierbo completado en 0.90 ha.",
    proximaActividad: "Riego",
    fechaRegistro: "2026-06-18",
  },
  {
    id: 8,
    codigo: "ACT-2026-008",
    fecha: "2026-05-20",
    campania: "Campaña 2025-2026 Quinua Orgánica",
    productor: "Apolinario Condori",
    parcela: "Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    responsableTecnico: "Ing. Carmen Villalobos",
    tipoActividad: "Poda",
    descripcion:
      "Eliminación de hojas basales senescentes y ramas improductivas para mejorar la aireación del cultivo de quinua.",
    horaInicio: "08:30",
    horaFin: "11:30",
    duracionEstimada: "3 horas",
    prioridad: "Baja",
    estado: "Completada",
    jornales: "3 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Marcelina Rojas", funcion: "Deshierbo", jornales: "1.5", horas: "12", observaciones: "" },
      { id: "m-2", trabajador: "Gregorio Quispe", funcion: "Deshierbo", jornales: "1.5", horas: "12", observaciones: "" },
    ],
    maquinaria: [],
    fotos: crearFotos("2026-05-20", "Ing. Carmen Villalobos"),
    latitud: "-13.6532",
    longitud: "-73.8741",
    altitud: "3,450 m.s.n.m.",
    precisionGps: "± 3 m",
    observacionesTecnicas: "Mejora visible en la aireación del dosel del cultivo.",
    recomendaciones: "Realizar la siguiente pasada en 3 semanas.",
    objetivo: "Mejorar la aireación y sanidad del cultivo de quinua.",
    resultado: "Poda ejecutada sin daños al cultivo.",
    proximaActividad: "Manejo de Enfermedades",
    fechaRegistro: "2026-05-20",
  },
  {
    id: 9,
    codigo: "ACT-2026-009",
    fecha: "2026-04-15",
    campania: "Campaña 2024-2025 Granos Andinos",
    productor: "Juan Gutiérrez",
    parcela: "Parcela E - San Martín",
    cultivo: "Haba",
    responsableTecnico: "Ing. Marco Salas",
    tipoActividad: "Cosecha",
    descripcion:
      "Cosecha manual de haba grano verde. Se acondicionó la producción en jabas para el traslado a la planta de acopio.",
    horaInicio: "07:00",
    horaFin: "14:00",
    duracionEstimada: "7 horas",
    prioridad: "Alta",
    estado: "Completada",
    jornales: "14 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Santos Huamán", funcion: "Cosecha", jornales: "4", horas: "32", observaciones: "" },
      { id: "m-2", trabajador: "Félix Condori", funcion: "Cosecha", jornales: "4", horas: "32", observaciones: "" },
      { id: "m-3", trabajador: "Rufina Poma", funcion: "Cosecha", jornales: "3", horas: "24", observaciones: "" },
      { id: "m-4", trabajador: "Teodosio Chávez", funcion: "Transporte de carga", jornales: "3", horas: "24", observaciones: "Traslado al acopio" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Camión de acarreo", operador: "Vidal Taipe", horasUso: "6", combustible: "Petróleo D2", observaciones: "Acarreo de jabas al acopio" },
    ],
    fotos: crearFotos("2026-04-15", "Ing. Marco Salas"),
    latitud: "-13.7040",
    longitud: "-74.0790",
    altitud: "3,290 m.s.n.m.",
    precisionGps: "± 4 m",
    observacionesTecnicas: "Grano en punto óptimo de cosecha, sin daños por heladas.",
    recomendaciones: "Coordinar el pesaje en el acopio de forma inmediata.",
    objetivo: "Cosechar el haba grano verde en su punto óptimo.",
    resultado: "Rendimiento estimado de 1.2 t/ha.",
    proximaActividad: "Acopio",
    fechaRegistro: "2026-04-15",
  },
  {
    id: 10,
    codigo: "ACT-2026-010",
    fecha: "2026-03-10",
    campania: "Campaña 2025-2026 Papa Nativa",
    productor: "Rosa Chávez",
    parcela: "Parcela D - Puca Pampa",
    cultivo: "Maíz",
    responsableTecnico: "Ing. Ana Paredes",
    tipoActividad: "Aporque",
    descripcion:
      "Aporque del maíz amiláceo para el anclaje de las plantas y el control de malezas en las calles del cultivo.",
    horaInicio: "08:00",
    horaFin: "12:30",
    duracionEstimada: "4.5 horas",
    prioridad: "Media",
    estado: "Completada",
    jornales: "9 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Gregorio Quispe", funcion: "Preparación de terreno", jornales: "3", horas: "24", observaciones: "" },
      { id: "m-2", trabajador: "Teodosio Chávez", funcion: "Preparación de terreno", jornales: "3", horas: "24", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Arado de discos", operador: "Simón Ccahuana", horasUso: "4.5", combustible: "No aplica", observaciones: "" },
    ],
    fotos: crearFotos("2026-03-10", "Ing. Ana Paredes"),
    latitud: "-13.1890",
    longitud: "-74.3100",
    altitud: "3,380 m.s.n.m.",
    precisionGps: "± 3 m",
    observacionesTecnicas: "Parcela en buen estado fitosanitario tras el aporque.",
    recomendaciones: "Evaluar la necesidad de un segundo aporque en 20 días.",
    objetivo: "Favorecer el anclaje y desarrollo radicular del maíz.",
    resultado: "Aporque completado en 3.15 ha.",
    proximaActividad: "Deshierbo",
    fechaRegistro: "2026-03-10",
  },
  {
    id: 11,
    codigo: "ACT-2026-011",
    fecha: "2026-02-14",
    campania: "Campaña 2025-2026 Quinua Orgánica",
    productor: "Lucía Mendoza",
    parcela: "Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    responsableTecnico: "Téc. Jorge Quispe",
    tipoActividad: "Compostaje",
    descripcion:
      "Volteo de la pila de compost y control de temperatura y humedad. Incorporación de residuos de cosecha de la campaña anterior.",
    horaInicio: "09:00",
    horaFin: "12:00",
    duracionEstimada: "3 horas",
    prioridad: "Baja",
    estado: "Completada",
    jornales: "6 jornales",
    insumos: [
      { id: "i-1", producto: "Compost", categoria: "Abonos orgánicos", fabricante: "Cooperativa Frutos del Ande", cantidad: "2", unidad: "t", lote: "L-001", costoUnitario: "S/ 35.00", costoTotal: "S/ 70.00", observaciones: "Pila en maduración" },
      { id: "i-2", producto: "Cal agrícola", categoria: "Insumos de labranza", fabricante: "AgroFer S.A.C.", cantidad: "25", unidad: "kg", lote: "L-003", costoUnitario: "S/ 0.90", costoTotal: "S/ 22.50", observaciones: "" },
    ],
    manoObra: [
      { id: "m-1", trabajador: "Santos Huamán", funcion: "Preparación de terreno", jornales: "3", horas: "24", observaciones: "Volteo manual de la pila" },
      { id: "m-2", trabajador: "Marcelina Rojas", funcion: "Preparación de terreno", jornales: "3", horas: "24", observaciones: "" },
    ],
    maquinaria: [],
    fotos: crearFotos("2026-02-14", "Téc. Jorge Quispe"),
    latitud: "-13.6410",
    longitud: "-73.8890",
    altitud: "3,600 m.s.n.m.",
    precisionGps: "± 5 m",
    observacionesTecnicas: "Temperatura de la pila estabilizada en 45 °C, humedad adecuada.",
    recomendaciones: "El compost estará listo para su aplicación en septiembre.",
    objetivo: "Producir compost para las siguientes actividades.",
    resultado: "Pila de compost volteada y en maduración.",
    proximaActividad: "Aplicación de Bioles",
    fechaRegistro: "2026-02-14",
  },
  {
    id: 12,
    codigo: "ACT-2026-012",
    fecha: "2026-01-22",
    campania: "Campaña 2024-2025 Granos Andinos",
    productor: "Apolinario Condori",
    parcela: "Parcela G - Rumi Pata",
    cultivo: "Quinua",
    responsableTecnico: "Ing. Marco Salas",
    tipoActividad: "Preparación del Terreno",
    descripcion:
      "Preparación del terreno con tracción animal: pase de arado y rastra para la eliminación de terrones y nivelación de surcos.",
    horaInicio: "08:00",
    horaFin: "12:00",
    duracionEstimada: "4 horas",
    prioridad: "Media",
    estado: "Completada",
    jornales: "8 jornales",
    insumos: [],
    manoObra: [
      { id: "m-1", trabajador: "Félix Condori", funcion: "Preparación de terreno", jornales: "4", horas: "32", observaciones: "" },
      { id: "m-2", trabajador: "Rufina Poma", funcion: "Preparación de terreno", jornales: "4", horas: "32", observaciones: "" },
    ],
    maquinaria: [
      { id: "e-1", equipo: "Rastra", operador: "Simón Ccahuana", horasUso: "4", combustible: "No aplica", observaciones: "Rastra de tiro animal" },
    ],
    fotos: crearFotos("2026-01-22", "Ing. Marco Salas"),
    latitud: "-13.6490",
    longitud: "-73.8660",
    altitud: "3,470 m.s.n.m.",
    precisionGps: "± 4 m",
    observacionesTecnicas: "Suelo con buena estructura y libre de terrones grandes.",
    recomendaciones: "Terreno listo para la siembra de la próxima campaña.",
    objetivo: "Dejar el terreno en condiciones óptimas para la siembra.",
    resultado: "Preparación completada en 1.10 ha.",
    proximaActividad: "Siembra",
    fechaRegistro: "2026-01-22",
  },
];

export const mockActividad: Actividad = actividadesMock[0];

export function actividadToFormData(actividad: Actividad): ActividadFormData {
  return {
    codigo: actividad.codigo,
    fecha: actividad.fecha,
    campania: actividad.campania,
    productor: actividad.productor,
    parcela: actividad.parcela,
    cultivo: actividad.cultivo,
    responsableTecnico: actividad.responsableTecnico,
    tipoActividad: actividad.tipoActividad,
    descripcion: actividad.descripcion,
    horaInicio: actividad.horaInicio,
    horaFin: actividad.horaFin,
    duracionEstimada: actividad.duracionEstimada,
    prioridad: actividad.prioridad,
    estado: actividad.estado,
    jornales: actividad.jornales,
    insumos: actividad.insumos,
    manoObra: actividad.manoObra,
    maquinaria: actividad.maquinaria,
    fotos: actividad.fotos,
    latitud: actividad.latitud,
    longitud: actividad.longitud,
    altitud: actividad.altitud,
    precisionGps: actividad.precisionGps,
    observacionesTecnicas: actividad.observacionesTecnicas,
    recomendaciones: actividad.recomendaciones,
    objetivo: actividad.objetivo,
    resultado: actividad.resultado,
    proximaActividad: actividad.proximaActividad,
  };
}

export function obtenerSiguienteCodigo(): string {
  return `ACT-2026-${String(actividadesMock.length + 1).padStart(3, "0")}`;
}

export function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
