export type Cumplimiento = "Cumple" | "No Cumple" | "No Aplica";
export type Severidad = "Leve" | "Moderada" | "Crítica";
export type Riesgo = "Bajo" | "Medio" | "Alto";
export type EstadoInspeccion = "Pendiente" | "Aprobada" | "No Conforme";
export type ResultadoInspeccion = "Conforme" | "Conforme con Observaciones" | "No Conforme";
export type EstadoNoConformidad = "Pendiente" | "En Proceso" | "Corregida" | "Verificada";
export type EstadoAccionCorrectiva = "Pendiente" | "En Proceso" | "Completada" | "Verificada";
export type TipoEvento =
  | "programada"
  | "realizada"
  | "evidencias"
  | "observaciones"
  | "correctivas"
  | "verificacion"
  | "cierre";

export type CriterioChecklist = {
  id: number;
  criterio: string;
  cumplimiento: Cumplimiento | null;
  riesgo: Riesgo;
  observacion: string;
  evidencia: string;
};

export type NoConformidad = {
  id: number;
  codigo: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  severidad: Severidad;
  responsable: string;
  fechaCompromiso: string;
  estado: EstadoNoConformidad;
  accionCorrectiva: string;
};

export type AccionCorrectiva = {
  id: number;
  accion: string;
  responsable: string;
  fechaInicio: string;
  fechaLimite: string;
  estado: EstadoAccionCorrectiva;
  observaciones: string;
};

export type Evidencia = {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  responsable: string;
  tipo: string;
  preview?: string;
};

export type EventoHistorial = {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEvento;
};

export type Inspeccion = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  productor: string;
  parcela: string;
  cultivo: string;
  inspector: string;
  estado: EstadoInspeccion;
  resultado: ResultadoInspeccion;
  checklist: CriterioChecklist[];
  noConformidades: NoConformidad[];
  accionesCorrectivas: AccionCorrectiva[];
  evidencias: Evidencia[];
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  observaciones: string;
  comentariosProductor: string;
  recomendaciones: string;
  prioridadRecomendacion: string;
  responsableRecomendacion: string;
  fechaRecomendacion: string;
  riesgoGeneral: Riesgo;
  resumenEjecutivo: string;
  fechaProximaInspeccion: string;
  nivelCumplimiento: string;
  historial: EventoHistorial[];
};

export const campaniasOpciones = ["Campaña 2024-2025", "Campaña 2023-2024", "Campaña 2022-2023"];

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

export const inspectoresOpciones = [
  "Ing. Carlos Ramos",
  "Ing. Ana Quispe",
  "Téc. Luis Huamán",
  "Ing. Martha Sucapuca",
];

export const estadosOpciones: EstadoInspeccion[] = ["Pendiente", "Aprobada", "No Conforme"];

export const resultadosOpciones: ResultadoInspeccion[] = [
  "Conforme",
  "Conforme con Observaciones",
  "No Conforme",
];

export const severidadesOpciones: Severidad[] = ["Leve", "Moderada", "Crítica"];

export const riesgosOpciones: Riesgo[] = ["Bajo", "Medio", "Alto"];

export const prioridadesOpciones = ["Alta", "Media", "Baja"];

export const estadosNoConformidadOpciones: EstadoNoConformidad[] = [
  "Pendiente",
  "En Proceso",
  "Corregida",
  "Verificada",
];

export const estadosAccionCorrectivaOpciones: EstadoAccionCorrectiva[] = [
  "Pendiente",
  "En Proceso",
  "Completada",
  "Verificada",
];

export const responsablesOpciones = [
  "Ing. Carlos Ramos",
  "Ing. Ana Quispe",
  "Téc. Luis Huamán",
  "Ing. Martha Sucapuca",
  "Apolinario Condori",
  "María Huamán",
  "Pedro Rojas",
  "Rosa Chávez",
  "Juan Gutiérrez",
  "Lucía Mendoza",
];

export const tiposNoConformidadOpciones = [
  "Uso de insumo no permitido",
  "Falta de registro",
  "Manejo de residuos",
  "Señalización",
  "Almacenamiento",
  "Barreras de protección",
  "Otro",
];

export const categoriasNoConformidadOpciones = [
  "Manejo de insumos",
  "Registros",
  "Infraestructura",
  "Manejo de residuos",
  "Sanidad vegetal",
  "Prácticas culturales",
  "Otro",
];

export const tiposEvidenciaOpciones = ["Fotografía", "Video", "Documento", "Georreferencia"];

export const criteriosChecklistOpciones = [
  "Uso de insumos permitidos",
  "Barreras de protección",
  "Manejo de residuos",
  "Registros actualizados",
  "Señalización",
  "Almacenamiento",
  "Control de plagas y enfermedades",
  "Prácticas de conservación de suelos",
];

export function crearChecklist(): CriterioChecklist[] {
  return criteriosChecklistOpciones.map((criterio, index) => ({
    id: index + 1,
    criterio,
    cumplimiento: null,
    riesgo: "Bajo",
    observacion: "",
    evidencia: "",
  }));
}

const detallesConformes: Partial<CriterioChecklist>[] = [
  { riesgo: "Bajo", observacion: "Insumos autorizados según listado de certificación", evidencia: "Registro fotográfico" },
  { riesgo: "Bajo", observacion: "Franjas de protección en buen estado", evidencia: "Registro fotográfico" },
  { riesgo: "Bajo" },
  { riesgo: "Bajo", observacion: "Registros de campo al día" },
  { riesgo: "Bajo" },
  { riesgo: "Bajo", observacion: "Almacén ordenado y rotulado" },
  { riesgo: "Bajo" },
  { riesgo: "Bajo" },
];

function conDetalles(cambios: Record<number, Partial<CriterioChecklist>>): Partial<CriterioChecklist>[] {
  return detallesConformes.map((detalle, index) =>
    cambios[index] ? { ...detalle, ...cambios[index] } : detalle,
  );
}

function buildChecklist(
  cumplimientos: Cumplimiento[],
  detalles: Partial<CriterioChecklist>[] = [],
): CriterioChecklist[] {
  return criteriosChecklistOpciones.map((criterio, index) => ({
    id: index + 1,
    criterio,
    cumplimiento: cumplimientos[index] ?? "Cumple",
    riesgo: detalles[index]?.riesgo ?? "Bajo",
    observacion: detalles[index]?.observacion ?? "",
    evidencia: detalles[index]?.evidencia ?? "",
  }));
}

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [year, month, day] = fecha.split("-");
  if (!year || !month || !day) return fecha;
  return `${day}/${month}/${year}`;
}

type DatosHistorial = Pick<
  Inspeccion,
  | "codigo"
  | "fecha"
  | "productor"
  | "fechaProximaInspeccion"
  | "evidencias"
  | "noConformidades"
  | "estado"
>;

const plantillasHistorial: Record<TipoEvento, (d: DatosHistorial) => { titulo: string; descripcion: string }> = {
  programada: (d) => ({
    titulo: "Inspección programada",
    descripcion: `La inspección ${d.codigo} fue programada para la parcela de ${d.productor}.`,
  }),
  realizada: () => ({
    titulo: "Inspección realizada",
    descripcion: "Levantamiento de información en campo y aplicación del checklist.",
  }),
  evidencias: (d) => ({
    titulo: "Registro de evidencias",
    descripcion: `Se registraron ${d.evidencias.length} evidencias de campo para el expediente.`,
  }),
  observaciones: () => ({
    titulo: "Emisión de observaciones",
    descripcion: "Se emitieron las observaciones y recomendaciones técnicas del expediente.",
  }),
  correctivas: (d) => ({
    titulo: "Registro de acciones correctivas",
    descripcion: `Se registraron ${d.noConformidades.length} acciones correctivas para su seguimiento.`,
  }),
  verificacion: () => ({
    titulo: "Verificación",
    descripcion: "Verificación de las acciones correctivas realizadas.",
  }),
  cierre: (d) => ({
    titulo: "Cierre de la inspección",
    descripcion: `Cierre del expediente ${d.codigo}.`,
  }),
};

export function crearHistorial(d: DatosHistorial): EventoHistorial[] {
  const eventos: { tipo: TipoEvento; fecha: string }[] = [
    { tipo: "programada", fecha: d.fecha },
    { tipo: "realizada", fecha: d.fecha },
    { tipo: "evidencias", fecha: d.fecha },
    { tipo: "observaciones", fecha: d.fecha },
  ];
  if (d.noConformidades.length > 0) {
    eventos.push({ tipo: "correctivas", fecha: d.fecha });
  }
  if (d.estado !== "Pendiente") {
    eventos.push({ tipo: "verificacion", fecha: d.fecha });
    eventos.push({ tipo: "cierre", fecha: d.fechaProximaInspeccion });
  }
  return eventos.map((evento, index) => {
    const plantilla = plantillasHistorial[evento.tipo](d);
    return { id: index + 1, tipo: evento.tipo, fecha: evento.fecha, ...plantilla };
  });
}

const baseInspecciones: Omit<Inspeccion, "historial">[] = [
  {
    id: 1,
    codigo: "INS-001",
    fecha: "2025-03-10",
    campania: "Campaña 2024-2025",
    productor: "Apolinario Condori",
    parcela: "PAR-001 · Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    inspector: "Ing. Carlos Ramos",
    estado: "Pendiente",
    resultado: "Conforme",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple"],
      conDetalles({
        0: { observacion: "Se verificaron las guías de compra de insumos orgánicos." },
        1: { observacion: "Franjas de protección correctamente delimitadas." },
        5: { observacion: "Almacén limpio y con insumos rotulados." },
      }),
    ),
    noConformidades: [],
    accionesCorrectivas: [],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Vista general", descripcion: "Vista general de la parcela inspeccionada", fecha: "2025-03-10", responsable: "Ing. Carlos Ramos", tipo: "Fotografía" },
      { id: 2, nombre: "Fotografía 2 - Almacén", descripcion: "Almacén de insumos y herramientas", fecha: "2025-03-10", responsable: "Ing. Carlos Ramos", tipo: "Fotografía" },
      { id: 3, nombre: "Fotografía 3 - Letrero", descripcion: "Señalización de parcela orgánica", fecha: "2025-03-10", responsable: "Ing. Carlos Ramos", tipo: "Fotografía" },
    ],
    latitud: "-13.6532",
    longitud: "-73.8741",
    altitud: "3850",
    precisionGps: "±5 m",
    observaciones:
      "Se verificó el correcto estado de los cultivos y el cumplimiento de las prácticas orgánicas. Todas las áreas evaluadas presentan condiciones adecuadas.",
    comentariosProductor:
      "El productor manifestó satisfacción con el acompañamiento técnico de la cooperativa.",
    recomendaciones:
      "Mantener el nivel actual de buenas prácticas y reforzar la señalización del ingreso principal de la parcela.",
    prioridadRecomendacion: "Media",
    responsableRecomendacion: "Ing. Carlos Ramos",
    fechaRecomendacion: "2025-05-10",
    riesgoGeneral: "Bajo",
    resumenEjecutivo:
      "La parcela cumple con los criterios de certificación orgánica. No se detectaron no conformidades.",
    fechaProximaInspeccion: "2025-06-10",
    nivelCumplimiento: "100%",
  },
  {
    id: 2,
    codigo: "INS-002",
    fecha: "2025-02-18",
    campania: "Campaña 2024-2025",
    productor: "María Huamán",
    parcela: "PAR-002 · Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    inspector: "Ing. Ana Quispe",
    estado: "Aprobada",
    resultado: "Conforme con Observaciones",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "No Aplica", "No Cumple", "Cumple", "Cumple", "Cumple", "No Aplica"],
      conDetalles({
        3: { riesgo: "Medio", observacion: "El registro de aplicaciones foliares no cuenta con las firmas de enero.", evidencia: "Fotografía 2 - Registros" },
        0: { observacion: "Insumos dentro de la lista permitida." },
        1: { observacion: "Barreras de protección verificadas." },
      }),
    ),
    noConformidades: [
      {
        id: 1,
        codigo: "NC-001",
        tipo: "Falta de registro",
        categoria: "Registros",
        descripcion: "El registro de aplicaciones foliares no cuenta con las firmas del mes de enero.",
        severidad: "Leve",
        responsable: "María Huamán",
        fechaCompromiso: "2025-03-05",
        estado: "En Proceso",
        accionCorrectiva: "Completar y firmar el registro de aplicaciones correspondiente.",
      },
    ],
    accionesCorrectivas: [
      {
        id: 1,
        accion: "Completar y firmar los registros de aplicaciones foliares",
        responsable: "María Huamán",
        fechaInicio: "2025-02-20",
        fechaLimite: "2025-03-10",
        estado: "En Proceso",
        observaciones: "Se solicitó el apoyo del técnico de campo para la regularización.",
      },
    ],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Vista general", descripcion: "Vista general de la parcela", fecha: "2025-02-18", responsable: "Ing. Ana Quispe", tipo: "Fotografía" },
      { id: 2, nombre: "Fotografía 2 - Registros", descripcion: "Cuaderno de registros de campo", fecha: "2025-02-18", responsable: "Ing. Ana Quispe", tipo: "Documento" },
    ],
    latitud: "-13.6290",
    longitud: "-74.1482",
    altitud: "3790",
    precisionGps: "±3 m",
    observaciones:
      "La parcela cumple con la mayoría de los criterios. Se observó una observación menor relacionada con los registros de aplicaciones.",
    comentariosProductor:
      "La productora se comprometió a mantener los registros al día y firmados.",
    recomendaciones:
      "Actualizar y firmar los registros de campo de manera periódica para facilitar la trazabilidad.",
    prioridadRecomendacion: "Media",
    responsableRecomendacion: "Téc. Luis Huamán",
    fechaRecomendacion: "2025-04-18",
    riesgoGeneral: "Medio",
    resumenEjecutivo:
      "La parcela cumple la normativa orgánica con una observación menor en la gestión de registros.",
    fechaProximaInspeccion: "2025-05-20",
    nivelCumplimiento: "75%",
  },
  {
    id: 3,
    codigo: "INS-003",
    fecha: "2025-01-28",
    campania: "Campaña 2024-2025",
    productor: "Pedro Rojas",
    parcela: "PAR-003 · Parcela C - Qucha Pata",
    cultivo: "Cebada",
    inspector: "Téc. Luis Huamán",
    estado: "No Conforme",
    resultado: "No Conforme",
    checklist: buildChecklist(
      ["No Cumple", "No Cumple", "Cumple", "No Cumple", "No Cumple", "Cumple", "Cumple", "Cumple"],
      conDetalles({
        0: { riesgo: "Alto", observacion: "Envases de agroquímico sintético detectados en el área de cultivo.", evidencia: "Fotografía 1 - Envases" },
        1: { riesgo: "Alto", observacion: "No se delimitaron las franjas de protección.", evidencia: "Fotografía 2 - Límites" },
        3: { riesgo: "Medio", observacion: "Registros de campo desactualizados.", evidencia: "Fotografía 2 - Registros" },
        4: { riesgo: "Medio", observacion: "Señalética incompleta en accesos." },
      }),
    ),
    noConformidades: [
      {
        id: 1,
        codigo: "NC-001",
        tipo: "Uso de insumo no permitido",
        categoria: "Manejo de insumos",
        descripcion: "Se detectaron envases de agroquímico sintético cerca del área de cultivo.",
        severidad: "Crítica",
        responsable: "Pedro Rojas",
        fechaCompromiso: "2025-02-12",
        estado: "Pendiente",
        accionCorrectiva: "Retirar los envases y presentar un plan de corrección en un plazo de 15 días.",
      },
      {
        id: 2,
        codigo: "NC-002",
        tipo: "Barreras de protección",
        categoria: "Prácticas culturales",
        descripcion: "Las franjas de protección entre parcelas convencionales no están definidas.",
        severidad: "Moderada",
        responsable: "Pedro Rojas",
        fechaCompromiso: "2025-03-15",
        estado: "Pendiente",
        accionCorrectiva: "Delimitar las barreras de protección antes de la siguiente siembra.",
      },
    ],
    accionesCorrectivas: [
      {
        id: 1,
        accion: "Retirar envases de agroquímicos y presentar plan de corrección",
        responsable: "Pedro Rojas",
        fechaInicio: "2025-02-01",
        fechaLimite: "2025-02-15",
        estado: "Pendiente",
        observaciones: "Se programará una verificación al finalizar el plazo.",
      },
      {
        id: 2,
        accion: "Delimitar las barreras de protección de la parcela",
        responsable: "Pedro Rojas",
        fechaInicio: "2025-02-10",
        fechaLimite: "2025-03-15",
        estado: "En Proceso",
        observaciones: "Se coordina con el técnico de la cooperativa la delimitación.",
      },
    ],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Envases", descripcion: "Envases encontrados en la parcela", fecha: "2025-01-28", responsable: "Téc. Luis Huamán", tipo: "Fotografía" },
      { id: 2, nombre: "Fotografía 2 - Límites", descripcion: "Zona sin barrera de protección", fecha: "2025-01-28", responsable: "Téc. Luis Huamán", tipo: "Fotografía" },
    ],
    latitud: "-13.2210",
    longitud: "-74.2140",
    altitud: "3610",
    precisionGps: "±8 m",
    observaciones:
      "Se detectaron incumplimientos críticos que comprometen la certificación orgánica de la parcela. Se requiere intervención inmediata.",
    comentariosProductor:
      "El productor se comprometió a ejecutar las acciones correctivas dentro del plazo establecido.",
    recomendaciones:
      "Ejecutar las acciones correctivas indicadas y solicitar una reinspección al finalizar el plazo establecido.",
    prioridadRecomendacion: "Alta",
    responsableRecomendacion: "Téc. Luis Huamán",
    fechaRecomendacion: "2025-03-01",
    riesgoGeneral: "Alto",
    resumenEjecutivo:
      "Hallazgos críticos detectados que comprometen la certificación. Se requiere plan de corrección inmediato.",
    fechaProximaInspeccion: "2025-03-15",
    nivelCumplimiento: "50%",
  },
  {
    id: 4,
    codigo: "INS-004",
    fecha: "2024-12-05",
    campania: "Campaña 2024-2025",
    productor: "Rosa Chávez",
    parcela: "PAR-004 · Parcela D - Puca Pampa",
    cultivo: "Maíz",
    inspector: "Ing. Martha Sucapuca",
    estado: "Aprobada",
    resultado: "Conforme",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple"],
      conDetalles({
        0: { observacion: "Solo insumos autorizados en almacén." },
        2: { observacion: "Punto de acopio de residuos operativo." },
        5: { observacion: "Almacén ordenado." },
      }),
    ),
    noConformidades: [],
    accionesCorrectivas: [],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Vista general", descripcion: "Vista general de la parcela", fecha: "2024-12-05", responsable: "Ing. Martha Sucapuca", tipo: "Fotografía" },
      { id: 2, nombre: "Video 1 - Recorrido", descripcion: "Recorrido por los límites de la parcela", fecha: "2024-12-05", responsable: "Ing. Martha Sucapuca", tipo: "Video" },
      { id: 3, nombre: "Fotografía 3 - Señalización", descripcion: "Letreros de parcela orgánica", fecha: "2024-12-05", responsable: "Ing. Martha Sucapuca", tipo: "Fotografía" },
    ],
    latitud: "-13.1890",
    longitud: "-74.3100",
    altitud: "3420",
    precisionGps: "±4 m",
    observaciones: "Sin observaciones. La parcela cumple todos los criterios de la lista de verificación.",
    comentariosProductor: "La productora no registró comentarios adicionales.",
    recomendaciones: "Continuar con las buenas prácticas agrícolas implementadas.",
    prioridadRecomendacion: "Baja",
    responsableRecomendacion: "Ing. Martha Sucapuca",
    fechaRecomendacion: "2025-05-05",
    riesgoGeneral: "Bajo",
    resumenEjecutivo:
      "La parcela cumple la totalidad de los criterios evaluados. Sin no conformidades registradas.",
    fechaProximaInspeccion: "2025-06-05",
    nivelCumplimiento: "100%",
  },
  {
    id: 5,
    codigo: "INS-005",
    fecha: "2024-11-12",
    campania: "Campaña 2024-2025",
    productor: "Juan Gutiérrez",
    parcela: "PAR-005 · Parcela E - San Martín",
    cultivo: "Haba",
    inspector: "Ing. Carlos Ramos",
    estado: "Pendiente",
    resultado: "Conforme con Observaciones",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "No Cumple", "Cumple", "Cumple"],
      conDetalles({
        5: { riesgo: "Medio", observacion: "El almacén comparte espacio con productos de uso doméstico.", evidencia: "Fotografía 1 - Almacén" },
        0: { observacion: "Insumos permitidos." },
      }),
    ),
    noConformidades: [
      {
        id: 1,
        codigo: "NC-001",
        tipo: "Almacenamiento",
        categoria: "Infraestructura",
        descripcion: "El almacén de herramientas comparte espacio con productos de uso doméstico.",
        severidad: "Leve",
        responsable: "Juan Gutiérrez",
        fechaCompromiso: "2025-01-15",
        estado: "Verificada",
        accionCorrectiva: "Separar los productos domésticos del área de almacenamiento agrícola.",
      },
    ],
    accionesCorrectivas: [
      {
        id: 1,
        accion: "Separar los productos domésticos del almacén agrícola",
        responsable: "Juan Gutiérrez",
        fechaInicio: "2024-11-20",
        fechaLimite: "2024-12-10",
        estado: "Verificada",
        observaciones: "Almacén reorganizado y verificado por el inspector.",
      },
    ],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Almacén", descripcion: "Almacén de herramientas", fecha: "2024-11-12", responsable: "Ing. Carlos Ramos", tipo: "Fotografía" },
      { id: 2, nombre: "Documento - Registros", descripcion: "Bitácora de labores culturales", fecha: "2024-11-12", responsable: "Ing. Carlos Ramos", tipo: "Documento" },
    ],
    latitud: "-13.7040",
    longitud: "-74.0790",
    altitud: "3550",
    precisionGps: "±6 m",
    observaciones:
      "La parcela presenta buen manejo general. Se registró una observación sobre el ordenamiento del almacén.",
    comentariosProductor:
      "El productor señaló que reorganizará el almacén antes de la próxima siembra.",
    recomendaciones: "Reorganizar el almacén y evitar la mezcla de productos agrícolas con domésticos.",
    prioridadRecomendacion: "Media",
    responsableRecomendacion: "Juan Gutiérrez",
    fechaRecomendacion: "2025-02-12",
    riesgoGeneral: "Medio",
    resumenEjecutivo:
      "Buen manejo general con una observación de ordenamiento en el almacén, ya corregida y verificada.",
    fechaProximaInspeccion: "2025-04-12",
    nivelCumplimiento: "88%",
  },
  {
    id: 6,
    codigo: "INS-006",
    fecha: "2024-10-21",
    campania: "Campaña 2024-2025",
    productor: "Lucía Mendoza",
    parcela: "PAR-006 · Parcela F - Tiquihua Alta",
    cultivo: "Tarwi",
    inspector: "Ing. Ana Quispe",
    estado: "Aprobada",
    resultado: "Conforme",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple", "Cumple"],
      conDetalles({
        4: { observacion: "Letreros legibles en los accesos." },
        6: { observacion: "Monitoreo de plagas documentado." },
      }),
    ),
    noConformidades: [],
    accionesCorrectivas: [],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Vista general", descripcion: "Vista general de la parcela", fecha: "2024-10-21", responsable: "Ing. Ana Quispe", tipo: "Fotografía" },
      { id: 2, nombre: "Documento - Monitoreo", descripcion: "Registros de monitoreo de plagas", fecha: "2024-10-21", responsable: "Ing. Ana Quispe", tipo: "Documento" },
    ],
    latitud: "-13.6410",
    longitud: "-73.8890",
    altitud: "3910",
    precisionGps: "±3 m",
    observaciones: "Sin observaciones. Todos los criterios fueron evaluados de manera satisfactoria.",
    comentariosProductor: "La productora agradeció el acompañamiento técnico de la cooperativa.",
    recomendaciones: "Mantener la frecuencia de riego y monitoreo de plagas.",
    prioridadRecomendacion: "Baja",
    responsableRecomendacion: "Ing. Ana Quispe",
    fechaRecomendacion: "2025-03-21",
    riesgoGeneral: "Bajo",
    resumenEjecutivo:
      "Cumplimiento total de los criterios evaluados. Sin observaciones relevantes.",
    fechaProximaInspeccion: "2025-05-21",
    nivelCumplimiento: "100%",
  },
  {
    id: 7,
    codigo: "INS-007",
    fecha: "2024-09-15",
    campania: "Campaña 2023-2024",
    productor: "Apolinario Condori",
    parcela: "PAR-007 · Parcela G - Rumi Pata",
    cultivo: "Quinua",
    inspector: "Téc. Luis Huamán",
    estado: "No Conforme",
    resultado: "No Conforme",
    checklist: buildChecklist(
      ["No Cumple", "Cumple", "No Cumple", "No Cumple", "Cumple", "No Cumple", "No Cumple", "Cumple"],
      conDetalles({
        0: { riesgo: "Medio", observacion: "Insumos almacenados sin rotular." },
        2: { riesgo: "Alto", observacion: "Acumulación de residuos plásticos en el borde de la parcela.", evidencia: "Fotografía 1 - Residuos" },
        3: { riesgo: "Alto", observacion: "No se presentaron registros de los últimos dos meses.", evidencia: "Fotografía 2 - Registros" },
        5: { riesgo: "Medio", observacion: "Acopio temporal sin rotular." },
        6: { riesgo: "Medio", observacion: "Monitoreo de plagas no documentado." },
      }),
    ),
    noConformidades: [
      {
        id: 1,
        codigo: "NC-001",
        tipo: "Manejo de residuos",
        categoria: "Manejo de residuos",
        descripcion: "Acumulación de residuos plásticos en el borde de la parcela.",
        severidad: "Moderada",
        responsable: "Apolinario Condori",
        fechaCompromiso: "2024-10-15",
        estado: "Corregida",
        accionCorrectiva: "Implementar un punto de acopio de residuos y coordinar su recojo.",
      },
      {
        id: 2,
        codigo: "NC-002",
        tipo: "Falta de registro",
        categoria: "Registros",
        descripcion: "No se presentaron registros de labores culturales de los últimos dos meses.",
        severidad: "Moderada",
        responsable: "Apolinario Condori",
        fechaCompromiso: "2024-10-20",
        estado: "En Proceso",
        accionCorrectiva: "Regularizar la bitácora de campo con el apoyo del técnico.",
      },
    ],
    accionesCorrectivas: [
      {
        id: 1,
        accion: "Implementar un punto de acopio de residuos",
        responsable: "Apolinario Condori",
        fechaInicio: "2024-09-20",
        fechaLimite: "2024-10-20",
        estado: "Completada",
        observaciones: "Punto de acopio implementado y operativo.",
      },
      {
        id: 2,
        accion: "Regularizar la bitácora de campo",
        responsable: "Apolinario Condori",
        fechaInicio: "2024-09-20",
        fechaLimite: "2024-11-15",
        estado: "En Proceso",
        observaciones: "Se trabaja con el apoyo del técnico de campo.",
      },
    ],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Residuos", descripcion: "Residuos acumulados en el borde", fecha: "2024-09-15", responsable: "Téc. Luis Huamán", tipo: "Fotografía" },
      { id: 2, nombre: "Fotografía 2 - Registros", descripcion: "Bitácora de campo", fecha: "2024-09-15", responsable: "Téc. Luis Huamán", tipo: "Documento" },
    ],
    latitud: "-13.6490",
    longitud: "-73.8660",
    altitud: "3880",
    precisionGps: "±7 m",
    observaciones:
      "Se identificaron no conformidades moderadas en manejo de residuos y registros de campo que requieren corrección.",
    comentariosProductor:
      "El productor aceptó las observaciones y comprometió su regularización con apoyo técnico.",
    recomendaciones:
      "Implementar un plan de manejo de residuos y establecer un calendario de actualización de registros.",
    prioridadRecomendacion: "Alta",
    responsableRecomendacion: "Téc. Luis Huamán",
    fechaRecomendacion: "2024-11-15",
    riesgoGeneral: "Alto",
    resumenEjecutivo:
      "No conformidades moderadas en residuos y registros. Se implementó plan de acciones correctivas.",
    fechaProximaInspeccion: "2024-11-15",
    nivelCumplimiento: "38%",
  },
  {
    id: 8,
    codigo: "INS-008",
    fecha: "2024-08-30",
    campania: "Campaña 2023-2024",
    productor: "Rosa Chávez",
    parcela: "PAR-008 · Parcela H - Inti Huasi",
    cultivo: "Papa Nativa",
    inspector: "Ing. Martha Sucapuca",
    estado: "Aprobada",
    resultado: "Conforme con Observaciones",
    checklist: buildChecklist(
      ["Cumple", "Cumple", "Cumple", "Cumple", "No Cumple", "Cumple", "Cumple", "Cumple"],
      conDetalles({
        4: { riesgo: "Medio", observacion: "El letrero de identificación orgánica está deteriorado.", evidencia: "Fotografía 1 - Letrero" },
        0: { observacion: "Insumos autorizados." },
      }),
    ),
    noConformidades: [
      {
        id: 1,
        codigo: "NC-001",
        tipo: "Señalización",
        categoria: "Infraestructura",
        descripcion: "El letrero de identificación orgánica está deteriorado y no es legible.",
        severidad: "Leve",
        responsable: "Rosa Chávez",
        fechaCompromiso: "2025-01-10",
        estado: "Verificada",
        accionCorrectiva: "Reemplazar el letrero de identificación de la parcela.",
      },
    ],
    accionesCorrectivas: [
      {
        id: 1,
        accion: "Reemplazar el letrero de identificación de la parcela",
        responsable: "Rosa Chávez",
        fechaInicio: "2025-01-05",
        fechaLimite: "2025-02-15",
        estado: "Verificada",
        observaciones: "Nuevo letrero instalado y verificado por el inspector.",
      },
    ],
    evidencias: [
      { id: 1, nombre: "Fotografía 1 - Letrero", descripcion: "Letrero deteriorado", fecha: "2024-08-30", responsable: "Ing. Martha Sucapuca", tipo: "Fotografía" },
      { id: 2, nombre: "Fotografía 2 - Vista general", descripcion: "Vista general de la parcela", fecha: "2024-08-30", responsable: "Ing. Martha Sucapuca", tipo: "Fotografía" },
    ],
    latitud: "-13.1960",
    longitud: "-74.2980",
    altitud: "3480",
    precisionGps: "±5 m",
    observaciones: "Buen manejo general de la parcela con una observación menor de señalización.",
    comentariosProductor:
      "La productora indicó que renovará la señalización antes de la siguiente campaña.",
    recomendaciones: "Renovar la señalización de identificación antes de la siguiente inspección.",
    prioridadRecomendacion: "Media",
    responsableRecomendacion: "Rosa Chávez",
    fechaRecomendacion: "2024-12-30",
    riesgoGeneral: "Medio",
    resumenEjecutivo:
      "Cumplimiento general con una observación menor de señalización, corregida y verificada.",
    fechaProximaInspeccion: "2025-02-28",
    nivelCumplimiento: "75%",
  },
];

export const inspeccionesMock: Inspeccion[] = baseInspecciones.map((inspeccion) => ({
  ...inspeccion,
  historial: crearHistorial(inspeccion),
}));

export const mockInspeccion: Inspeccion = inspeccionesMock[0];
