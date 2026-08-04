export type Productor = {
  id: number;
  codigo: string;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: string;
  fechaNacimiento: string;
  estadoCivil: string;
  telefono: string;
  correo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  direccion: string;
  nivelEducativo: string;
  idiomaPrincipal: string;
  idiomaSecundario: string;
  estado: string;
  fechaIngreso: string;
  organizacion: string;
  cargo: string;
};

export type Familiar = {
  id: number;
  nombres: string;
  parentesco: string;
  dni: string;
  fechaNacimiento: string;
  ocupacion: string;
  dependiente: boolean;
  sexo: string;
  nivelEducativo: string;
  telefono: string;
  viveConProductor: boolean;
};

export type Parcela = {
  id: number;
  codigo: string;
  nombre: string;
  cultivo: string;
  area: string;
  ubicacion: string;
  certificacion: string;
  estado: string;
};

export type Documento = {
  id: number;
  tipo: string;
  categoria: "Personal" | "Institucional" | "Otros";
  nombre: string;
  tamano: string;
  fecha: string;
  estado: string;
};

export const productoresMock: Productor[] = [
  {
    id: 1,
    codigo: "SOC-001",
    dni: "44789632",
    nombres: "Apolinario",
    apellidoPaterno: "Condori",
    apellidoMaterno: "Quispe",
    sexo: "Masculino",
    fechaNacimiento: "1978-04-12",
    estadoCivil: "Casado",
    telefono: "987 654 321",
    correo: "apolinario.condori@gmail.com",
    departamento: "Ayacucho",
    provincia: "Vilcas Huamán",
    distrito: "Vilcas Huamán",
    comunidad: "Collpaccasa",
    direccion: "Av. Los Andes s/n, anexo Collpaccasa",
    nivelEducativo: "Secundaria",
    idiomaPrincipal: "Quechua",
    idiomaSecundario: "Español",
    estado: "Activo",
    fechaIngreso: "2019-03-15",
    organizacion: "Asociación Virgen de Fátima",
    cargo: "Socio",
  },
  {
    id: 2,
    codigo: "SOC-002",
    dni: "45879654",
    nombres: "María",
    apellidoPaterno: "Huamán",
    apellidoMaterno: "Ccorahua",
    sexo: "Femenino",
    fechaNacimiento: "1985-09-23",
    estadoCivil: "Conviviente",
    telefono: "976 543 210",
    correo: "maria.huaman@outlook.com",
    departamento: "Ayacucho",
    provincia: "Cangallo",
    distrito: "Cangallo",
    comunidad: "Pampa Cangallo",
    direccion: "Jr. Los Andes 125",
    nivelEducativo: "Técnico",
    idiomaPrincipal: "Quechua",
    idiomaSecundario: "Español",
    estado: "Activo",
    fechaIngreso: "2020-08-02",
    organizacion: "Asociación San Isidro Labrador",
    cargo: "Secretaria",
  },
  {
    id: 3,
    codigo: "SOC-003",
    dni: "47896521",
    nombres: "Pedro",
    apellidoPaterno: "Rojas",
    apellidoMaterno: "Palomino",
    sexo: "Masculino",
    fechaNacimiento: "1972-01-30",
    estadoCivil: "Casado",
    telefono: "965 432 109",
    correo: "pedro.rojas@gmail.com",
    departamento: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Chiara",
    comunidad: "Chaupimayo",
    direccion: "Cas. Chaupimayo s/n",
    nivelEducativo: "Primaria",
    idiomaPrincipal: "Quechua",
    idiomaSecundario: "Ninguno",
    estado: "Inactivo",
    fechaIngreso: "2018-11-20",
    organizacion: "Asociación San Antonio de Padua",
    cargo: "Socio",
  },
  {
    id: 4,
    codigo: "SOC-004",
    dni: "41235687",
    nombres: "Rosa",
    apellidoPaterno: "Chávez",
    apellidoMaterno: "Quispe",
    sexo: "Femenino",
    fechaNacimiento: "1990-06-14",
    estadoCivil: "Soltera",
    telefono: "954 321 098",
    correo: "rosa.chavez@gmail.com",
    departamento: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Vinchos",
    comunidad: "Pampas",
    direccion: "Av. Centenario s/n",
    nivelEducativo: "Universitario",
    idiomaPrincipal: "Español",
    idiomaSecundario: "Quechua",
    estado: "Activo",
    fechaIngreso: "2021-05-10",
    organizacion: "Asociación Agroecológica Los Andes",
    cargo: "Tesorera",
  },
  {
    id: 5,
    codigo: "SOC-005",
    dni: "46587412",
    nombres: "Juan",
    apellidoPaterno: "Gutiérrez",
    apellidoMaterno: "Ramos",
    sexo: "Masculino",
    fechaNacimiento: "1968-12-05",
    estadoCivil: "Viudo",
    telefono: "943 210 987",
    correo: "juan.gutierrez@gmail.com",
    departamento: "Ayacucho",
    provincia: "Fajardo",
    distrito: "Huancapi",
    comunidad: "Moyobamba",
    direccion: "Calle San Martín 45",
    nivelEducativo: "Primaria",
    idiomaPrincipal: "Quechua",
    idiomaSecundario: "Español",
    estado: "Suspendido",
    fechaIngreso: "2017-02-25",
    organizacion: "Asociación Santa Rosa",
    cargo: "Socio",
  },
  {
    id: 6,
    codigo: "SOC-006",
    dni: "48965214",
    nombres: "Lucía",
    apellidoPaterno: "Mendoza",
    apellidoMaterno: "Rojas",
    sexo: "Femenino",
    fechaNacimiento: "1988-07-19",
    estadoCivil: "Casada",
    telefono: "932 109 876",
    correo: "lucia.mendoza@gmail.com",
    departamento: "Ayacucho",
    provincia: "Vilcas Huamán",
    distrito: "Vilcas Huamán",
    comunidad: "Tiquihua",
    direccion: "Com. Tiquihua s/n",
    nivelEducativo: "Secundaria",
    idiomaPrincipal: "Quechua",
    idiomaSecundario: "Español",
    estado: "Activo",
    fechaIngreso: "2020-01-12",
    organizacion: "Asociación Virgen de Fátima",
    cargo: "Vocal",
  },
];

export const mockProductor: Productor = productoresMock[0];

export const familiaresMock: Familiar[] = [
  {
    id: 1,
    nombres: "Julia Condori Quispe",
    parentesco: "Esposa",
    dni: "44876321",
    fechaNacimiento: "1980-08-21",
    ocupacion: "Agricultora",
    dependiente: false,
    sexo: "Femenino",
    nivelEducativo: "Primaria",
    telefono: "987 654 322",
    viveConProductor: true,
  },
  {
    id: 2,
    nombres: "Mateo Condori Huamán",
    parentesco: "Hijo",
    dni: "74215698",
    fechaNacimiento: "2005-03-11",
    ocupacion: "Estudiante",
    dependiente: true,
    sexo: "Masculino",
    nivelEducativo: "Secundaria",
    telefono: "987 654 323",
    viveConProductor: true,
  },
  {
    id: 3,
    nombres: "Luz Condori Huamán",
    parentesco: "Hija",
    dni: "75896321",
    fechaNacimiento: "2008-11-02",
    ocupacion: "Estudiante",
    dependiente: true,
    sexo: "Femenino",
    nivelEducativo: "Primaria",
    telefono: "987 654 324",
    viveConProductor: true,
  },
];

export const parcelasMock: Parcela[] = [
  {
    id: 1,
    codigo: "PAR-001",
    nombre: "Parcela A - Ñawpa Rumi",
    cultivo: "Quinua",
    area: "2.40 ha",
    ubicacion: "Collpaccasa",
    certificacion: "Orgánica",
    estado: "Activa",
  },
  {
    id: 2,
    codigo: "PAR-002",
    nombre: "Parcela B - Pampa Urku",
    cultivo: "Papa Nativa",
    area: "1.85 ha",
    ubicacion: "Collpaccasa",
    certificacion: "En Transición",
    estado: "Activa",
  },
  {
    id: 3,
    codigo: "PAR-003",
    nombre: "Parcela C - Qucha Pata",
    cultivo: "Cebada",
    area: "0.90 ha",
    ubicacion: "Tiquihua",
    certificacion: "Orgánica",
    estado: "Inactiva",
  },
];

export const documentosMock: Documento[] = [
  {
    id: 1,
    tipo: "DNI",
    categoria: "Personal",
    nombre: "dni_44789632.pdf",
    tamano: "240 KB",
    fecha: "2024-05-12",
    estado: "Verificado",
  },
  {
    id: 2,
    tipo: "Fotografía",
    categoria: "Personal",
    nombre: "fotografia_productor.jpg",
    tamano: "1.8 MB",
    fecha: "2024-03-02",
    estado: "Verificado",
  },
  {
    id: 3,
    tipo: "Firma",
    categoria: "Personal",
    nombre: "firma_productor.png",
    tamano: "120 KB",
    fecha: "2024-03-02",
    estado: "Verificado",
  },
  {
    id: 4,
    tipo: "Solicitud de ingreso",
    categoria: "Institucional",
    nombre: "solicitud_ingreso_2019.pdf",
    tamano: "350 KB",
    fecha: "2019-03-10",
    estado: "Verificado",
  },
  {
    id: 5,
    tipo: "Contrato",
    categoria: "Institucional",
    nombre: "contrato_social_2024.pdf",
    tamano: "860 KB",
    fecha: "2024-02-20",
    estado: "Pendiente",
  },
  {
    id: 6,
    tipo: "Acta",
    categoria: "Institucional",
    nombre: "acta_asamblea_2024.pdf",
    tamano: "1.1 MB",
    fecha: "2024-11-15",
    estado: "Verificado",
  },
  {
    id: 7,
    tipo: "Certificados",
    categoria: "Otros",
    nombre: "certificado_organico_2025.pdf",
    tamano: "1.2 MB",
    fecha: "2025-01-08",
    estado: "Verificado",
  },
  {
    id: 8,
    tipo: "Anexos",
    categoria: "Otros",
    nombre: "croquis_parcela_a.jpg",
    tamano: "520 KB",
    fecha: "2024-06-30",
    estado: "Pendiente",
  },
];

export type HistorialItem = {
  id: number;
  tipo: "ingreso" | "parcela" | "campania" | "inspeccion";
  titulo: string;
  descripcion: string;
  fecha: string;
};

export const historialMock: HistorialItem[] = [
  {
    id: 1,
    tipo: "ingreso",
    titulo: "Ingreso a la cooperativa",
    descripcion: "Registro como socio productor de la Asociación Virgen de Fátima.",
    fecha: "2019-03-15",
  },
  {
    id: 2,
    tipo: "parcela",
    titulo: "Registro de parcela",
    descripcion: "Alta de la parcela A - Ñawpa Rumi (2.40 ha) con cultivo de quinua.",
    fecha: "2019-04-20",
  },
  {
    id: 3,
    tipo: "campania",
    titulo: "Participación en campaña",
    descripcion: "Participación en la campaña de siembra de quinua 2023-2024.",
    fecha: "2023-11-05",
  },
  {
    id: 4,
    tipo: "inspeccion",
    titulo: "Última inspección",
    descripcion: "Inspección interna de certificación orgánica con resultado aprobado.",
    fecha: "2025-01-20",
  },
];
