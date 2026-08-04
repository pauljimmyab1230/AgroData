export type CampaniaEstado = "Planificada" | "Activa" | "Finalizada" | "Cancelada";

export type Campania = {
  id: number;
  codigo: string;
  nombre: string;
  anioAgricola: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  estado: CampaniaEstado;
  responsable: string;
  tecnicoCoordinador: string;
  objetivo: string;
  permitirCultivos: boolean;
  permitirActividades: boolean;
  permitirCosechas: boolean;
  permitirInspecciones: boolean;
  permitirAcopio: boolean;
  permitirProcesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string;
  fechaRegistro: string;
};

export type CampaniaFormData = Omit<Campania, "id" | "fechaRegistro">;

export const campaniaEstados: CampaniaEstado[] = ["Planificada", "Activa", "Finalizada", "Cancelada"];

export const estadosOpciones = campaniaEstados;

export const aniosAgricolas = [
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

export const tecnicosOpciones = [
  "Ing. Luis Paredes",
  "Ing. Carmen Quispe",
  "Téc. Jorge Salas",
  "Téc. Miguel Torres",
];

export const emptyCampania: CampaniaFormData = {
  codigo: "",
  nombre: "",
  anioAgricola: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
  estado: "Planificada",
  responsable: "",
  tecnicoCoordinador: "",
  objetivo: "",
  permitirCultivos: true,
  permitirActividades: true,
  permitirCosechas: true,
  permitirInspecciones: true,
  permitirAcopio: true,
  permitirProcesamiento: true,
  visible: true,
  activa: false,
  observaciones: "",
};

export const campaniasMock: Campania[] = [
  {
    id: 1,
    codigo: "CAM-2025-01",
    nombre: "Campaña 2025-2026 Quinua Orgánica",
    anioAgricola: "2025-2026",
    fechaInicio: "2025-10-01",
    fechaFin: "2026-04-30",
    descripcion:
      "Siembra y manejo de quinua orgánica en parcelas certificadas de Collpaccasa, Pampa Cangallo y Tiquihua.",
    estado: "Activa",
    responsable: "Apolinario Condori",
    tecnicoCoordinador: "Ing. Luis Paredes",
    objetivo:
      "Producir quinua orgánica certificada de exportación, garantizando trazabilidad desde la siembra hasta el acopio.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: true,
    visible: true,
    activa: true,
    observaciones:
      "Campaña principal de la cooperativa. Se prioriza el abonamiento orgánico y el control fitosanitario preventivo.",
    fechaRegistro: "2025-08-15",
  },
  {
    id: 2,
    codigo: "CAM-2024-01",
    nombre: "Campaña 2024-2025 Granos Andinos",
    anioAgricola: "2024-2025",
    fechaInicio: "2024-10-01",
    fechaFin: "2025-04-30",
    descripcion:
      "Producción de granos andinos (quinua, tarwi y haba) orientada a la venta en el mercado nacional e internacional.",
    estado: "Finalizada",
    responsable: "María Huamán",
    tecnicoCoordinador: "Ing. Carmen Quispe",
    objetivo:
      "Consolidar la producción de granos andinos orgánicos y fortalecer la cadena de acopio de la cooperativa.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: true,
    visible: true,
    activa: false,
    observaciones: "Cosecha concluida con un rendimiento promedio de 2.8 t/ha en quinua orgánica.",
    fechaRegistro: "2024-07-20",
  },
  {
    id: 3,
    codigo: "CAM-2025-02",
    nombre: "Campaña 2025-2026 Papa Nativa",
    anioAgricola: "2025-2026",
    fechaInicio: "2025-09-15",
    fechaFin: "2026-03-31",
    descripcion: "Manejo de variedades de papa nativa en las comunidades de Pampas y Chaupimayo.",
    estado: "Planificada",
    responsable: "Rosa Chávez",
    tecnicoCoordinador: "Ing. Luis Paredes",
    objetivo: "Recuperar y valorizar variedades nativas de papa con manejo orgánico certificado.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: false,
    visible: true,
    activa: false,
    observaciones: "Pendiente de aprobación del plan de abonamiento por parte del comité técnico.",
    fechaRegistro: "2025-08-02",
  },
  {
    id: 4,
    codigo: "CAM-2024-02",
    nombre: "Campaña 2024-2025 Hortalizas",
    anioAgricola: "2024-2025",
    fechaInicio: "2024-11-01",
    fechaFin: "2025-02-28",
    descripcion: "Producción de hortalizas en invernaderos para el autoconsumo de los socios.",
    estado: "Cancelada",
    responsable: "Pedro Rojas",
    tecnicoCoordinador: "Téc. Jorge Salas",
    objetivo: "Abastecer de hortalizas frescas a las familias socias de la cooperativa.",
    permitirCultivos: true,
    permitirActividades: false,
    permitirCosechas: false,
    permitirInspecciones: false,
    permitirAcopio: false,
    permitirProcesamiento: false,
    visible: false,
    activa: false,
    observaciones: "Cancelada por heladas tempranas y falta de disponibilidad hídrica en la zona.",
    fechaRegistro: "2024-10-05",
  },
  {
    id: 5,
    codigo: "CAM-2023-01",
    nombre: "Campaña 2023-2024 Diversificación",
    anioAgricola: "2023-2024",
    fechaInicio: "2023-10-01",
    fechaFin: "2024-04-30",
    descripcion: "Campaña de diversificación productiva con cebada, tarwi y maíz amiláceo.",
    estado: "Finalizada",
    responsable: "Juan Gutiérrez",
    tecnicoCoordinador: "Ing. Carmen Quispe",
    objetivo: "Diversificar la producción y mejorar la rotación de cultivos en las parcelas.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: true,
    visible: true,
    activa: false,
    observaciones: "Resultados positivos en la rotación de cultivos y recuperación de suelos.",
    fechaRegistro: "2023-07-12",
  },
  {
    id: 6,
    codigo: "CAM-2025-03",
    nombre: "Campaña 2025-2026 Tarwi",
    anioAgricola: "2025-2026",
    fechaInicio: "2025-12-01",
    fechaFin: "2026-06-30",
    descripcion: "Establecimiento de tarwi como cultivo de rotación y fijación de nitrógeno.",
    estado: "Planificada",
    responsable: "Lucía Mendoza",
    tecnicoCoordinador: "Téc. Jorge Salas",
    objetivo: "Incorporar el tarwi como cultivo de rotación que fije nitrógeno y diversifique ingresos.",
    permitirCultivos: true,
    permitirActividades: false,
    permitirCosechas: false,
    permitirInspecciones: true,
    permitirAcopio: false,
    permitirProcesamiento: false,
    visible: true,
    activa: false,
    observaciones: "En espera de la disponibilidad de semilla certificada de tarwi.",
    fechaRegistro: "2025-09-01",
  },
  {
    id: 7,
    codigo: "CAM-2022-01",
    nombre: "Campaña 2022-2023 Cebada",
    anioAgricola: "2022-2023",
    fechaInicio: "2022-10-15",
    fechaFin: "2023-04-15",
    descripcion: "Producción de cebada forrajera y de grano para los programas de alimentación.",
    estado: "Finalizada",
    responsable: "María Huamán",
    tecnicoCoordinador: "Ing. Luis Paredes",
    objetivo: "Producir cebada forrajera y de grano para los programas sociales de la cooperativa.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: false,
    visible: true,
    activa: false,
    observaciones: "",
    fechaRegistro: "2022-08-30",
  },
  {
    id: 8,
    codigo: "CAM-2021-01",
    nombre: "Campaña 2021-2022 Quinua Orgánica",
    anioAgricola: "2021-2022",
    fechaInicio: "2021-10-01",
    fechaFin: "2022-04-30",
    descripcion: "Primera campaña de quinua orgánica certificada de la cooperativa.",
    estado: "Finalizada",
    responsable: "Apolinario Condori",
    tecnicoCoordinador: "Ing. Carmen Quispe",
    objetivo: "Certificar la primera campaña de quinua orgánica de la cooperativa.",
    permitirCultivos: true,
    permitirActividades: true,
    permitirCosechas: true,
    permitirInspecciones: true,
    permitirAcopio: true,
    permitirProcesamiento: false,
    visible: true,
    activa: false,
    observaciones: "Hito fundacional del programa orgánico de la cooperativa.",
    fechaRegistro: "2021-07-18",
  },
];

export const mockCampania: Campania = campaniasMock[0];

export function campaniaToFormData(campania: Campania): CampaniaFormData {
  return {
    codigo: campania.codigo,
    nombre: campania.nombre,
    anioAgricola: campania.anioAgricola,
    fechaInicio: campania.fechaInicio,
    fechaFin: campania.fechaFin,
    descripcion: campania.descripcion,
    estado: campania.estado,
    responsable: campania.responsable,
    tecnicoCoordinador: campania.tecnicoCoordinador,
    objetivo: campania.objetivo,
    permitirCultivos: campania.permitirCultivos,
    permitirActividades: campania.permitirActividades,
    permitirCosechas: campania.permitirCosechas,
    permitirInspecciones: campania.permitirInspecciones,
    permitirAcopio: campania.permitirAcopio,
    permitirProcesamiento: campania.permitirProcesamiento,
    visible: campania.visible,
    activa: campania.activa,
    observaciones: campania.observaciones,
  };
}

export function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export type CampaniaKPIResumen = {
  label: string;
  value: string;
  hint: string;
};

export const campaniaKPIsResumenMock: CampaniaKPIResumen[] = [
  { label: "Productores Inscritos", value: "142", hint: "socios participantes" },
  { label: "Parcelas Registradas", value: "96", hint: "unidades productivas" },
  { label: "Cultivos Registrados", value: "18", hint: "especies y variedades" },
  { label: "Área Sembrada", value: "218.4 ha", hint: "superficie total" },
  { label: "Actividades Agrícolas", value: "486", hint: "labores registradas" },
  { label: "Inspecciones Realizadas", value: "124", hint: "visitas en campo" },
  { label: "Acopios Registrados", value: "63", hint: "operaciones de acopio" },
];

export type CampaniaResumenProductivo = {
  cultivosPrincipales: string[];
  comunidades: string[];
  tecnicos: string[];
  areaPromedioProductor: string;
};

export const campaniaResumenProductivoMock: CampaniaResumenProductivo = {
  cultivosPrincipales: ["Quinua Orgánica", "Papa Nativa", "Tarwi", "Cebada"],
  comunidades: ["Collpaccasa", "Pampa Cangallo", "Chaupimayo", "Tiquihua"],
  tecnicos: ["Luis Paredes", "Carmen Quispe", "Jorge Salas"],
  areaPromedioProductor: "1.84 ha",
};

export type CampaniaEventoTipo =
  | "creacion"
  | "registros"
  | "cultivos"
  | "actividad"
  | "inspeccion"
  | "acopio"
  | "cierre";

export type CampaniaEvento = {
  id: number;
  tipo: CampaniaEventoTipo;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: "Completado" | "En curso" | "Pendiente";
};

export const campaniaHistorialMock: CampaniaEvento[] = [
  {
    id: 1,
    tipo: "creacion",
    titulo: "Campaña creada",
    descripcion: "Registro inicial de la campaña en el sistema de la cooperativa.",
    fecha: "15/08/2025",
    estado: "Completado",
  },
  {
    id: 2,
    tipo: "registros",
    titulo: "Inicio de registros",
    descripcion: "Apertura de registros de parcelas y productores participantes.",
    fecha: "01/09/2025",
    estado: "Completado",
  },
  {
    id: 3,
    tipo: "cultivos",
    titulo: "Inicio de cultivos",
    descripcion: "Primera siembra de quinua orgánica en Collpaccasa.",
    fecha: "01/10/2025",
    estado: "Completado",
  },
  {
    id: 4,
    tipo: "actividad",
    titulo: "Primera actividad agrícola",
    descripcion: "Abonamiento orgánico en las parcelas de Pampa Cangallo.",
    fecha: "15/10/2025",
    estado: "Completado",
  },
  {
    id: 5,
    tipo: "inspeccion",
    titulo: "Primera inspección",
    descripcion: "Inspección de campo para la verificación de certificación orgánica.",
    fecha: "20/11/2025",
    estado: "En curso",
  },
  {
    id: 6,
    tipo: "acopio",
    titulo: "Inicio de acopio",
    descripcion: "Apertura programada de las operaciones de acopio.",
    fecha: "—",
    estado: "Pendiente",
  },
  {
    id: 7,
    tipo: "cierre",
    titulo: "Cierre de campaña",
    descripcion: "Cierre programado de la campaña y evaluación de resultados.",
    fecha: "30/04/2026",
    estado: "Pendiente",
  },
];

export type CampaniaFaseEstado = "Completada" | "Actual" | "Pendiente";

export type CampaniaFase = {
  id: number;
  nombre: string;
  periodo: string;
  estado: CampaniaFaseEstado;
};

export const campaniaCalendarioMock: CampaniaFase[] = [
  { id: 1, nombre: "Preparación del terreno", periodo: "Sep - Oct", estado: "Completada" },
  { id: 2, nombre: "Siembra", periodo: "Oct - Nov", estado: "Completada" },
  { id: 3, nombre: "Manejo del cultivo", periodo: "Nov - Feb", estado: "Actual" },
  { id: 4, nombre: "Inspecciones", periodo: "Ene - Mar", estado: "Pendiente" },
  { id: 5, nombre: "Acopio", periodo: "Mar - Abr", estado: "Pendiente" },
  { id: 6, nombre: "Procesamiento", periodo: "Abr - Jun", estado: "Pendiente" },
];
