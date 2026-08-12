export interface CatalogoItem {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
}

export interface CatalogoConfig {
  titulo: string;
  descripcion: string;
  items: CatalogoItem[];
}

// ─── Departamentos ──────────────────────────────────────────
const departamentos: CatalogoItem[] = [
  { id: "d1", nombre: "Ayacucho", descripcion: "Región Ayacucho", activo: true, created_at: "2026-01-01" },
  { id: "d2", nombre: "Cusco", descripcion: "Región Cusco", activo: true, created_at: "2026-01-01" },
  { id: "d3", nombre: "Puno", descripcion: "Región Puno", activo: true, created_at: "2026-01-01" },
  { id: "d4", nombre: "Huancavelica", descripcion: "Región Huancavelica", activo: true, created_at: "2026-01-01" },
  { id: "d5", nombre: "Apurímac", descripcion: "Región Apurímac", activo: false, created_at: "2026-01-01" },
];

// ─── Tipos de Cultivo ───────────────────────────────────────
const tiposCultivo: CatalogoItem[] = [
  { id: "tc1", nombre: "Quinua", descripcion: "Chenopodium quinoa - Cultivo andino principal", activo: true, created_at: "2026-01-01" },
  { id: "tc2", nombre: "Papa Nativa", descripcion: "Solanum tuberosum - Variedades nativas andinas", activo: true, created_at: "2026-01-01" },
  { id: "tc3", nombre: "Cebada", descripcion: "Hordeum vulgare - Cereal adaptado a altitud", activo: true, created_at: "2026-01-01" },
  { id: "tc4", nombre: "Maíz", descripcion: "Zea mays - Cultivo de valles", activo: true, created_at: "2026-01-01" },
  { id: "tc5", nombre: "Frijol", descripcion: "Phaseolus vulgaris - Leguminosa proteinica", activo: true, created_at: "2026-01-01" },
  { id: "tc6", nombre: "Tarwi", descripcion: "Lupinus mutabilis - Leguminosa andina", activo: true, created_at: "2026-01-01" },
  { id: "tc7", nombre: "Oca", descripcion: "Oxalis tuberosa - Tubérculo andino", activo: false, created_at: "2026-01-01" },
  { id: "tc8", nombre: "Mashua", descripcion: "Tropaeolum tuberosum - Tubérculo andino", activo: false, created_at: "2026-01-01" },
];

// ─── Tipos de Suelo ─────────────────────────────────────────
const tiposSuelo: CatalogoItem[] = [
  { id: "ts1", nombre: "Franco arcilloso", descripcion: "Mezcla equilibrada con predominio de arcilla", activo: true, created_at: "2026-01-01" },
  { id: "ts2", nombre: "Franco arenoso", descripcion: "Mezcla equilibrada con predominio de arena", activo: true, created_at: "2026-01-01" },
  { id: "ts3", nombre: "Franco limoso", descripcion: "Mezcla equilibrada con predominio de limo", activo: true, created_at: "2026-01-01" },
  { id: "ts4", nombre: "Arcilloso", descripcion: "Predominio de partículas de arcilla", activo: true, created_at: "2026-01-01" },
  { id: "ts5", nombre: "Arenoso", descripcion: "Predominio de partículas de arena", activo: true, created_at: "2026-01-01" },
  { id: "ts6", nombre: "Limoso", descripcion: "Predominio de partículas de limo", activo: true, created_at: "2026-01-01" },
];

// ─── Fuentes de Agua ────────────────────────────────────────
const fuentesAgua: CatalogoItem[] = [
  { id: "fa1", nombre: "Río", descripcion: "Fuente de agua superficial continua", activo: true, created_at: "2026-01-01" },
  { id: "fa2", nombre: "Manantial", descripcion: "Fuente de agua subterránea natural", activo: true, created_at: "2026-01-01" },
  { id: "fa3", nombre: "Lluvia", descripcion: "Precipitación directa sobre el cultivo", activo: true, created_at: "2026-01-01" },
  { id: "fa4", nombre: "Laguna", descripcion: "Cuerpo de agua estancada natural", activo: true, created_at: "2026-01-01" },
  { id: "fa5", nombre: "Naciente", descripcion: "Punto de surgencia de agua subterránea", activo: false, created_at: "2026-01-01" },
];

// ─── Sistemas de Riego ──────────────────────────────────────
const sistemasRiego: CatalogoItem[] = [
  { id: "sr1", nombre: "A gravedad", descripcion: "Riego por canal con pendiente natural", activo: true, created_at: "2026-01-01" },
  { id: "sr2", nombre: "A presión", descripcion: "Riego por aspersión o goteo con bomba", activo: true, created_at: "2026-01-01" },
  { id: "sr3", nombre: "Sequía", descripcion: "Cultivo de panasco sin riego artificial", activo: true, created_at: "2026-01-01" },
  { id: "sr4", nombre: "Minga", descripcion: "Riego comunitario por turnos", activo: true, created_at: "2026-01-01" },
  { id: "sr5", nombre: "A gota a gota", descripcion: "Riego por goteo con tuberías", activo: false, created_at: "2026-01-01" },
];

// ─── Zonas Agroecológicas ───────────────────────────────────
const zonasAgroecologicas: CatalogoItem[] = [
  { id: "za1", nombre: "Yunga", descripcion: "3,500 - 3,800 msnm - Zona templada", activo: true, created_at: "2026-01-01" },
  { id: "za2", nombre: "Quechua", descripcion: "3,300 - 3,500 msnm - Zona templada fría", activo: true, created_at: "2026-01-01" },
  { id: "za3", nombre: "Suní", descripcion: "3,800 - 4,000 msnm - Zona fría", activo: true, created_at: "2026-01-01" },
  { id: "za4", nombre: "Puna", descripcion: "4,000 - 4,500 msnm - Zona muy fría", activo: true, created_at: "2026-01-01" },
  { id: "za5", nombre: "Janca", descripcion: "Más de 4,500 msnm - Zona de nieves perpetuas", activo: false, created_at: "2026-01-01" },
];

// ─── Tipos de Actividad ─────────────────────────────────────
const tiposActividad: CatalogoItem[] = [
  { id: "ta1", nombre: "Fertilización", descripcion: "Aplicación de fertilizantes orgánicos o minerales", activo: true, created_at: "2026-01-01" },
  { id: "ta2", nombre: "Compostaje", descripcion: "Producción de compost orgánico", activo: true, created_at: "2026-01-01" },
  { id: "ta3", nombre: "Control Biológico", descripcion: "Control de plagas con organismos benéficos", activo: true, created_at: "2026-01-01" },
  { id: "ta4", nombre: "Manejo de Plagas", descripcion: "Monitoreo y control integrado de plagas", activo: true, created_at: "2026-01-01" },
  { id: "ta5", nombre: "Siembra", descripcion: "Plantación y establecimiento del cultivo", activo: true, created_at: "2026-01-01" },
  { id: "ta6", nombre: "Cosecha", descripcion: "Recolección del producto maduro", activo: true, created_at: "2026-01-01" },
  { id: "ta7", nombre: "Aplicación de Bioles", descripcion: "Aplicación de preparados biológicos líquidos", activo: true, created_at: "2026-01-01" },
  { id: "ta8", nombre: "Control de Malezas", descripcion: "Manejo de plantas adventicias", activo: true, created_at: "2026-01-01" },
  { id: "ta9", nombre: "Rastreo", descripcion: "Preparación mecánica del suelo", activo: false, created_at: "2026-01-01" },
];

// ─── Tipos de Documento ─────────────────────────────────────
const tiposDocumento: CatalogoItem[] = [
  { id: "td1", nombre: "DNI", descripcion: "Documento Nacional de Identidad", activo: true, created_at: "2026-01-01" },
  { id: "td2", nombre: "Certificado de Nacimiento", descripcion: "Partida de nacimiento", activo: true, created_at: "2026-01-01" },
  { id: "td3", nombre: "Certificado Orgánico", descripcion: "Certificación de producción orgánica", activo: true, created_at: "2026-01-01" },
  { id: "td4", nombre: "Contrato", descripcion: "Contrato de asociación con la cooperativa", activo: true, created_at: "2026-01-01" },
  { id: "td5", nombre: "Acta de Asamblea", descripcion: "Acta de reunión de socios", activo: true, created_at: "2026-01-01" },
  { id: "td6", nombre: "Plano de Parcela", descripcion: "Mapa de ubicación y límites de la parcela", activo: true, created_at: "2026-01-01" },
  { id: "td7", nombre: "Foto", descripcion: "Registro fotográfico", activo: true, created_at: "2026-01-01" },
  { id: "td8", nombre: "Otro", descripcion: "Documentos varios no clasificados", activo: true, created_at: "2026-01-01" },
];

// ─── Parentescos ────────────────────────────────────────────
const parentescos: CatalogoItem[] = [
  { id: "p1", nombre: "Esposo/a", descripcion: "Cónyuge o pareja", activo: true, created_at: "2026-01-01" },
  { id: "p2", nombre: "Hijo/a", descripcion: "Descendiente directo", activo: true, created_at: "2026-01-01" },
  { id: "p3", nombre: "Padre", descripcion: "Padre del productor", activo: true, created_at: "2026-01-01" },
  { id: "p4", nombre: "Madre", descripcion: "Madre del productor", activo: true, created_at: "2026-01-01" },
  { id: "p5", nombre: "Hermano/a", descripcion: "Hermano o hermana", activo: true, created_at: "2026-01-01" },
  { id: "p6", nombre: "Sobrino/a", descripcion: "Hijo/a de hermano/a", activo: true, created_at: "2026-01-01" },
  { id: "p7", nombre: "Nieto/a", descripcion: "Descendiente de segundo grado", activo: false, created_at: "2026-01-01" },
  { id: "p8", nombre: "Otro", descripcion: "Otra relación familiar", activo: true, created_at: "2026-01-01" },
];

// ─── Configuración de catálogos ─────────────────────────────
export const catalogoConfigs: Record<string, CatalogoConfig> = {
  departamentos: {
    titulo: "Departamentos",
    descripcion: "Catálogo de departamentos del Perú",
    items: departamentos,
  },
  "tipos-cultivo": {
    titulo: "Tipos de Cultivo",
    descripcion: "Catálogo de especies y tipos de cultivo",
    items: tiposCultivo,
  },
  "tipos-suelo": {
    titulo: "Tipos de Suelo",
    descripcion: "Clasificación de suelos para agricultura",
    items: tiposSuelo,
  },
  "fuentes-agua": {
    titulo: "Fuentes de Agua",
    descripcion: "Fuentes disponibles para riego",
    items: fuentesAgua,
  },
  "sistemas-riego": {
    titulo: "Sistemas de Riego",
    descripcion: "Métodos de riego utilizados",
    items: sistemasRiego,
  },
  "zonas-agroecologicas": {
    titulo: "Zonas Agroecológicas",
    descripcion: "Zonas de producción según altitud",
    items: zonasAgroecologicas,
  },
  "tipos-actividad": {
    titulo: "Tipos de Actividad",
    descripcion: "Clasificación de actividades agrícolas",
    items: tiposActividad,
  },
  "tipos-documento": {
    titulo: "Tipos de Documento",
    descripcion: "Tipos de documentos que pueden registrarse",
    items: tiposDocumento,
  },
  parentescos: {
    titulo: "Parentescos",
    descripcion: "Tipos de relación familiar",
    items: parentescos,
  },
};
