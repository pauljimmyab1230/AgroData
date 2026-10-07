import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ==================== Ubigeo ====================
async function importarUbigeos(): Promise<void> {
  console.log('Importando ubigeos de Perú...');

  const sqlPath = path.resolve(__dirname, 'data', 'ubigeo.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  const insertRegex = /INSERT INTO `ubigeo` \([^)]+\) VALUES\s*/;
  const insertMatch = sqlContent.match(insertRegex);
  if (!insertMatch) {
    console.error('No se encontraron INSERT statements en ubigeo.sql');
    process.exit(1);
  }

  const dataStart = sqlContent.indexOf(insertMatch[0]) + insertMatch[0].length;
  const dataSection = sqlContent.substring(dataStart);

  const rowRegex = /\('(\d{6})',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'(\d{6})',\s*'(\d)'\)/g;
  const rows: { ubigeo: string; dpto: string; prov: string; distrito: string }[] = [];

  let match;
  while ((match = rowRegex.exec(dataSection)) !== null) {
    rows.push({ ubigeo: match[1], dpto: match[2], prov: match[3], distrito: match[4] });
  }

  console.log(`  Total filas parseadas: ${rows.length}`);
  if (rows.length === 0) {
    console.error('No se pudieron parsear filas del SQL');
    process.exit(1);
  }

  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    await prisma.ubigeo.createMany({ data: rows.slice(i, i + BATCH), skipDuplicates: true });
  }
  console.log(`  Ubigeos: ${await prisma.ubigeo.count()}`);
}

// ==================== Usuarios ====================
async function crearUsuarios() {
  console.log('Creando usuarios de prueba...');
  const hash = (p: string) => bcrypt.hash(p, 12);

  const usuarios = [
    { nombre: 'Administrador AgroData', email: 'admin@agrodata.com', password: 'Admin123!', rol: 'ADMIN' as const, rol_sic: 'RESPONSABLE_SIC' as const },
    { nombre: 'Carlos Mendoza Quispe', email: 'carlos.mendoza@agrodata.com', password: 'Demo123!', rol: 'USER' as const, rol_sic: 'TECNICO_CAMPO' as const },
    { nombre: 'María García Huamán', email: 'maria.garcia@agrodata.com', password: 'Demo123!', rol: 'USER' as const, rol_sic: 'INSPECTOR' as const },
    { nombre: 'Juan Pérez Ccahuana', email: 'juan.perez@agrodata.com', password: 'Demo123!', rol: 'USER' as const, rol_sic: 'ACOPIADOR' as const },
    { nombre: 'Rosa Mamani Ttito', email: 'rosa.mamani@agrodata.com', password: 'Demo123!', rol: 'USER' as const, rol_sic: 'CAPACITADOR' as const },
  ];

  for (const u of usuarios) {
    const existe = await prisma.usuarios.findUnique({ where: { email: u.email } });
    if (existe) continue;
    await prisma.usuarios.create({
      data: { ...u, password: await hash(u.password) },
    });
  }
  console.log(`  Usuarios: ${await prisma.usuarios.count()}`);
}

// ==================== Catálogos ====================
const CATALOGOS: Record<string, string[]> = {
  'departamentos': ['Cusco', 'Puno', 'Junín', 'Ayacucho', 'Apurímac', 'Huancavelica'],
  'tipos-cultivo': ['Quinua', 'Papa', 'Maíz', 'Frijol', 'Cacao', 'Café', 'Oca', 'Olluco'],
  'tipos-suelo': ['Franco', 'Franco-arcilloso', 'Franco-limoso', 'Arenoso', 'Arcilloso', 'Limoso'],
  'fuentes-agua': ['Río', 'Manantial', 'Pozo', 'Laguna', 'Agua de lluvia', 'Acequia'],
  'sistemas-riego': ['Gravedad', 'Aspersión', 'Goteo', 'Semisumergido', 'Secano'],
  'zonas-agroecologicas': ['Quechua', 'Suni', 'Puna', 'Ceja de selva', 'Costa', 'Yunga'],
  'tipos-actividad': ['Preparación de terreno', 'Siembra', 'Resiembra', 'Fertilización', 'Compostaje', 'Control biológico', 'Manejo de plagas', 'Deshierbie', 'Riego', 'Poda', 'Cosecha'],
  'tipos-documento': ['DNI', 'Certificado de posesión', 'Contrato', 'Recibo', 'Certificado de producto orgánico', 'Acta de asamblea'],
  'parentescos': ['Cónyuge', 'Hijo/a', 'Padre', 'Madre', 'Hermano/a', 'Abuelo/a', 'Nieto/a', 'Otro'],
  'criterios-checklist': ['Estado general del cultivo', 'Presencia de plagas', 'Presencia de enfermedades', 'Humedad del suelo', 'Malezas', 'Estado de riego', 'Aplicación de insumos', 'Trazabilidad documental'],
};

async function crearCatalogos() {
  console.log('Creando catálogos...');
  let total = 0;
  for (const [tipo, items] of Object.entries(CATALOGOS)) {
    for (let i = 0; i < items.length; i++) {
      const existe = await prisma.catalogos.findFirst({ where: { tipo, nombre: items[i] } });
      if (existe) continue;
      await prisma.catalogos.create({
        data: { tipo, nombre: items[i], orden: i + 1, activo: true },
      });
      total++;
    }
  }
  console.log(`  Items de catálogo creados: ${total}`);
}

// ==================== Operaciones de proceso ====================
const OPERACIONES = [
  { cod: 'OP-LAV', nom: 'Lavado', desc: 'Lavado del grano para remover polvo e impurezas superficiales', ord: 1 },
  { cod: 'OP-DESP', nom: 'Despedrado', desc: 'Remoción de piedras, terrones y materiales pesados', ord: 2 },
  { cod: 'OP-DESAP', nom: 'Desaponificado', desc: 'Remoción de saponinas (corteza amarga del grano)', ord: 3 },
  { cod: 'OP-ESC', nom: 'Escarificado', desc: 'Abraspado de la superficie del grano', ord: 4 },
  { cod: 'OP-SEC', nom: 'Secado', desc: 'Reducción de humedad hasta el nivel óptimo de almacenamiento', ord: 5 },
  { cod: 'OP-SEL', nom: 'Selección', desc: 'Clasificación manual o mecánica del grano por tamaño y calidad', ord: 6 },
  { cod: 'OP-CLA', nom: 'Clasificación', desc: 'Separación por calidades (primera, segunda, descarte)', ord: 7 },
  { cod: 'OP-PUL', nom: 'Pulido', desc: 'Pulido superficial del grano para mejorar apariencia', ord: 8 },
  { cod: 'OP-MOL', nom: 'Molienda', desc: 'Molienda del grano para obtener harina', ord: 9 },
  { cod: 'OP-TAM', nom: 'Tamizado', desc: 'Tamizado de la harina para obtener la malla deseada', ord: 10 },
  { cod: 'OP-HUM', nom: 'Humectación', desc: 'Ajuste de humedad previo a laminado o expansión', ord: 11 },
  { cod: 'OP-LAM', nom: 'Laminado', desc: 'Laminado del grano para obtener hojuelas', ord: 12 },
  { cod: 'OP-REV', nom: 'Reventado', desc: 'Expansión térmica del grano (pop)', ord: 13 },
  { cod: 'OP-TOS', nom: 'Tostado', desc: 'Tostado del grano para productos tostados', ord: 14 },
  { cod: 'OP-EMP', nom: 'Empaque', desc: 'Envasado y etiquetado del producto terminado', ord: 15 },
];

async function crearOperaciones() {
  console.log('Creando operaciones de proceso...');
  let total = 0;
  for (const op of OPERACIONES) {
    const existe = await prisma.operacion_proceso.findUnique({ where: { codigo: op.cod } });
    if (existe) continue;
    await prisma.operacion_proceso.create({
      data: { codigo: op.cod, nombre: op.nom, descripcion: op.desc, orden: op.ord, activo: true },
    });
    total++;
  }
  console.log(`  Operaciones: ${total}`);
}

// ==================== Recetas ====================
const RECETAS = [
  {
    cod: 'REC-QUI-PRI', nom: 'Quinua primaria', base: 'Quinua', etapa: 'PRIMARIA' as const,
    formato: 'GRANO' as const,
    desc: 'Proceso primario de la quinua de campo: lavado, despedrado, desaponificado, escarificado, secado y selección. Produce quinua beneficiada lista para consumo o transformación.',
    ops: ['OP-LAV', 'OP-DESP', 'OP-DESAP', 'OP-ESC', 'OP-SEC', 'OP-SEL'],
  },
  {
    cod: 'REC-QUI-HAR', nom: 'Quinua - harina', base: 'Quinua', etapa: 'SECUNDARIA' as const,
    formato: 'HARINA' as const,
    desc: 'Transformación de quinua beneficiada en harina fina mediante molienda y tamizado.',
    ops: ['OP-MOL', 'OP-TAM'],
  },
  {
    cod: 'REC-QUI-HOJ', nom: 'Quinua - hojuelas', base: 'Quinua', etapa: 'SECUNDARIA' as const,
    formato: 'HOJUELA' as const,
    desc: 'Transformación de quinua beneficiada en hojuelas mediante humectación, laminado y secado.',
    ops: ['OP-HUM', 'OP-LAM', 'OP-SEC'],
  },
  {
    cod: 'REC-QUI-POP', nom: 'Quinua - pop', base: 'Quinua', etapa: 'SECUNDARIA' as const,
    formato: 'POP' as const,
    desc: 'Transformación de quinua beneficiada en pop (expansión térmica) con selección posterior.',
    ops: ['OP-HUM', 'OP-REV', 'OP-SEL'],
  },
  {
    cod: 'REC-QUI-EMP', nom: 'Quinua - empaque', base: 'Quinua', etapa: 'EMPAQUE' as const,
    formato: 'GRANO' as const,
    desc: 'Clasificación final y empaque del producto terminado para venta.',
    ops: ['OP-CLA', 'OP-EMP'],
  },
  {
    cod: 'REC-CHI-PRI', nom: 'Chía primaria', base: 'Chía', etapa: 'PRIMARIA' as const,
    formato: 'GRANO' as const,
    desc: 'Proceso primario de la chía: lavado, secado y selección. Menos etapas que la quinua.',
    ops: ['OP-LAV', 'OP-SEC', 'OP-SEL'],
  },
  {
    cod: 'REC-FRE-SEL', nom: 'Fréjol - selección', base: 'Fréjol', etapa: 'PRIMARIA' as const,
    formato: 'GRANO' as const,
    desc: 'Proceso del fréjol: únicamente selección y clasificación, sin transformación.',
    ops: ['OP-SEL', 'OP-CLA'],
  },
  {
    cod: 'REC-MAI-PRI', nom: 'Maíz primario', base: 'Maíz', etapa: 'PRIMARIA' as const,
    formato: 'GRANO' as const,
    desc: 'Proceso primario del maíz: secado, selección y clasificación.',
    ops: ['OP-SEC', 'OP-SEL', 'OP-CLA'],
  },
];

async function crearRecetas() {
  console.log('Creando recetas...');
  let totalRecetas = 0, totalOps = 0;
  for (const r of RECETAS) {
    let receta = await prisma.receta.findUnique({ where: { codigo: r.cod } });
    if (!receta) {
      receta = await prisma.receta.create({
        data: {
          codigo: r.cod,
          nombre: r.nom,
          producto_base: r.base,
          etapa: r.etapa,
          formato_salida: r.formato,
          descripcion: r.desc,
          activo: true,
        },
      });
      totalRecetas++;
    }
    for (let i = 0; i < r.ops.length; i++) {
      const op = await prisma.operacion_proceso.findUnique({ where: { codigo: r.ops[i] } });
      if (!op) continue;
      const existe = await prisma.receta_operacion.findFirst({
        where: { receta_id: receta.id, operacion_id: op.id },
      });
      if (existe) continue;
      await prisma.receta_operacion.create({
        data: {
          receta_id: receta.id,
          operacion_id: op.id,
          orden: i + 1,
          requerida: true,
        },
      });
      totalOps++;
    }
  }
  console.log(`  Recetas: ${totalRecetas} · Operaciones de receta: ${totalOps}`);
}

// ==================== Productores ====================
const PRODUCTORES = [
  { codigo: 'PRO-0001', dni: '45678901', nombres: 'Juan Carlos', apellido_paterno: 'Mamani', apellido_materno: 'Quispe', sexo: 'MASCULINO' as const, nac: '1975-03-15', estado_civil: 'CASADO' as const, dep: 'Cusco', prov: 'Chumbivilcas', dist: 'Santo Tomás', comunidad: 'Comunidad de Huancarani', nivel: 'PRIMARIA' as const, idioma: 'QUECHUA' as const, org: 'Cooperativa Agropecuaria Qosqo', cargo: 'SOCIO' as const, tel: '984512367', correo: 'juan.mamani@correo.com' },
  { codigo: 'PRO-0002', dni: '45678902', nombres: 'María Elena', apellido_paterno: 'Flores', apellido_materno: 'Ccayo', sexo: 'FEMENINO' as const, nac: '1982-07-22', estado_civil: 'CONVIVIENTE' as const, dep: 'Cusco', prov: 'Chumbivilcas', dist: 'Santo Tomás', comunidad: 'Comunidad de Huancarani', nivel: 'SECUNDARIA' as const, idioma: 'QUECHUA' as const, org: 'Cooperativa Agropecuaria Qosqo', cargo: 'SOCIO' as const, tel: '984512368', correo: 'maria.flores@correo.com' },
  { codigo: 'PRO-0003', dni: '45678903', nombres: 'Pedro Antonio', apellido_paterno: 'Ccota', apellido_materno: 'Mamani', sexo: 'MASCULINO' as const, nac: '1968-11-03', estado_civil: 'CASADO' as const, dep: 'Cusco', prov: 'Canchis', dist: 'San Pedro', comunidad: 'Comunidad de Checacupe', nivel: 'SIN_ESTUDIOS' as const, idioma: 'QUECHUA' as const, org: 'Cooperativa Agropecuaria Qosqo', cargo: 'DIRECTIVO' as const, tel: '984512369', correo: '' },
  { codigo: 'PRO-0004', dni: '45678904', nombres: 'Rosa Julia', apellido_paterno: 'Ttito', apellido_materno: 'Huamán', sexo: 'FEMENINO' as const, nac: '1990-01-30', estado_civil: 'SOLTERO' as const, dep: 'Cusco', prov: 'Canchis', dist: 'San Pedro', comunidad: 'Comunidad de Checacupe', nivel: 'UNIVERSITARIO' as const, idioma: 'ESPANOL' as const, org: 'Cooperativa Agropecuaria Qosqo', cargo: 'SECRETARIO' as const, tel: '984512370', correo: 'rosa.ttito@correo.com' },
  { codigo: 'PRO-0005', dni: '45678905', nombres: 'Luis Fernando', apellido_paterno: 'Huanca', apellido_materno: 'Sarmiento', sexo: 'MASCULINO' as const, nac: '1985-05-18', estado_civil: 'CASADO' as const, dep: 'Puno', prov: 'Melgar', dist: 'Ayaviri', comunidad: 'Comunidad de Huayrapata', nivel: 'TECNICO' as const, idioma: 'QUECHUA' as const, org: 'Asociación de Productores Qollana', cargo: 'PRESIDENTE' as const, tel: '951234567', correo: 'luis.huanca@correo.com' },
  { codigo: 'PRO-0006', dni: '45678906', nombres: 'Ana Sofía', apellido_paterno: 'Chura', apellido_materno: 'López', sexo: 'FEMENINO' as const, nac: '1988-09-12', estado_civil: 'CONVIVIENTE' as const, dep: 'Puno', prov: 'Melgar', dist: 'Ayaviri', comunidad: 'Comunidad de Huayrapata', nivel: 'SECUNDARIA' as const, idioma: 'QUECHUA' as const, org: 'Asociación de Productores Qollana', cargo: 'TESORERO' as const, tel: '951234568', correo: 'ana.chura@correo.com' },
  { codigo: 'PRO-0007', dni: '45678907', nombres: 'Miguel Ángel', apellido_paterno: 'Paredes', apellido_materno: 'Choque', sexo: 'MASCULINO' as const, nac: '1979-12-25', estado_civil: 'VIUDO' as const, dep: 'Puno', prov: 'San Román', dist: 'Juliaca', comunidad: 'Comunidad de Caracoto', nivel: 'PRIMARIA' as const, idioma: 'QUECHUA' as const, org: 'Asociación de Productores Qollana', cargo: 'VOCAL' as const, tel: '951234569', correo: '' },
  { codigo: 'PRO-0008', dni: '45678908', nombres: 'Lucía Mercedes', apellido_paterno: 'Vargas', apellido_materno: 'Ríos', sexo: 'FEMENINO' as const, nac: '1993-04-08', estado_civil: 'SOLTERO' as const, dep: 'Junín', prov: 'Satipo', dist: 'Mazamari', comunidad: 'Comunidad de Pangoa', nivel: 'UNIVERSITARIO' as const, idioma: 'ESPANOL' as const, org: 'Cooperativa Cacaotera del Vraem', cargo: 'PRESIDENTE' as const, tel: '965432109', correo: 'lucia.vargas@correo.com' },
  { codigo: 'PRO-0009', dni: '45678909', nombres: 'Roberto Carlos', apellido_paterno: 'Neyra', apellido_materno: 'Salazar', sexo: 'MASCULINO' as const, nac: '1981-06-14', estado_civil: 'CASADO' as const, dep: 'Junín', prov: 'Satipo', dist: 'Mazamari', comunidad: 'Comunidad de Pangoa', nivel: 'TECNICO' as const, idioma: 'ESPANOL' as const, org: 'Cooperativa Cacaotera del Vraem', cargo: 'SOCIO' as const, tel: '965432110', correo: 'roberto.neyra@correo.com' },
  { codigo: 'PRO-0010', dni: '45678910', nombres: 'Elena Beatriz', apellido_paterno: 'Yana', apellido_materno: 'Huayta', sexo: 'FEMENINO' as const, nac: '1987-02-27', estado_civil: 'CASADO' as const, dep: 'Ayacucho', prov: 'La Mar', dist: 'Santos', comunidad: 'Comunidad de Santa Rosa', nivel: 'SECUNDARIA' as const, idioma: 'QUECHUA' as const, org: 'Cooperativa Cafetalera Ayacucho', cargo: 'SOCIO' as const, tel: '966789012', correo: 'elena.yana@correo.com' },
];

async function crearProductores() {
  console.log('Creando productores...');
  const ubigeos = await prisma.ubigeo.findMany({ take: 10, orderBy: { id: 'asc' } });
  const creados = [];
  for (let i = 0; i < PRODUCTORES.length; i++) {
    const p = PRODUCTORES[i];
    const existe = await prisma.productor.findUnique({ where: { dni: p.dni } });
    if (existe) { creados.push(existe); continue; }
    const prod = await prisma.productor.create({
      data: {
        codigo: p.codigo,
        dni: p.dni,
        nombres: p.nombres,
        apellido_paterno: p.apellido_paterno,
        apellido_materno: p.apellido_materno,
        sexo: p.sexo,
        fecha_nacimiento: new Date(p.nac),
        estado_civil: p.estado_civil,
        telefono: p.tel || null,
        correo: p.correo || null,
        departamento: p.dep,
        provincia: p.prov,
        distrito: p.dist,
        comunidad: p.comunidad,
        nivel_educativo: p.nivel,
        idioma_principal: p.idioma,
        estado: 'ACTIVO',
        fecha_ingreso: new Date('2023-01-15'),
        organizacion: p.org,
        cargo: p.cargo,
        ubigeo_id: ubigeos[i]?.id ?? null,
      },
    });
    creados.push(prod);
  }
  console.log(`  Productores: ${creados.length}`);
  return creados;
}

// ==================== Familiares y Documentos ====================
const FAMILIARES_POR_PRODUCTOR = [
  [{ nombres: 'Ana Quispe Ccahuana', parentesco: 'Cónyuge', dni: '41234567', sexo: 'FEMENINO' as const, nac: '1978-08-10', ocupacion: 'Agricultora', dep: true }],
  [
    { nombres: 'José Flores Ccayo', parentesco: 'Hijo/a', dni: '70123456', sexo: 'MASCULINO' as const, nac: '2005-03-22', ocupacion: 'Estudiante', dep: true },
    { nombres: 'Lucía Flores Ccayo', parentesco: 'Hijo/a', dni: '70123457', sexo: 'FEMENINO' as const, nac: '2008-11-15', ocupacion: 'Estudiante', dep: true },
  ],
  [{ nombres: 'Rosa Mamani Ccota', parentesco: 'Cónyuge', dni: '42345678', sexo: 'FEMENINO' as const, nac: '1972-04-05', ocupacion: 'Agricultora', dep: true }],
  [{ nombres: 'Pedro Ttito Huamán', parentesco: 'Padre', dni: '30456789', sexo: 'MASCULINO' as const, nac: '1955-01-20', ocupacion: 'Agricultor', dep: false }],
  [
    { nombres: 'Carla Huanca Sarmiento', parentesco: 'Cónyuge', dni: '43456789', sexo: 'FEMENINO' as const, nac: '1987-06-30', ocupacion: 'Comerciante', dep: true },
    { nombres: 'Diego Huanca Chura', parentesco: 'Hijo/a', dni: '71234567', sexo: 'MASCULINO' as const, nac: '2010-02-14', ocupacion: 'Estudiante', dep: true },
  ],
  [{ nombres: 'Miguel Chura López', parentesco: 'Hermano/a', dni: '44567890', sexo: 'MASCULINO' as const, nac: '1990-10-11', ocupacion: 'Agricultor', dep: false }],
  [{ nombres: 'María Choque Paredes', parentesco: 'Madre', dni: '29567890', sexo: 'FEMENINO' as const, nac: '1952-07-19', ocupacion: 'Agricultora', dep: true }],
  [{ nombres: 'Carlos Vargas Ríos', parentesco: 'Cónyuge', dni: '45678901', sexo: 'MASCULINO' as const, nac: '1991-05-25', ocupacion: 'Ingeniero', dep: true }],
  [{ nombres: 'Sofía Neyra Salazar', parentesco: 'Cónyuge', dni: '46789012', sexo: 'FEMENINO' as const, nac: '1984-12-03', ocupacion: 'Docente', dep: true }],
  [{ nombres: 'Luis Yana Huayta', parentesco: 'Hijo/a', dni: '72345678', sexo: 'MASCULINO' as const, nac: '2012-09-08', ocupacion: 'Estudiante', dep: true }],
];

async function crearFamiliaresYDocumentos(productores: { id: number }[]) {
  console.log('Creando familiares y documentos...');
  let totalFam = 0, totalDoc = 0;
  for (let i = 0; i < productores.length; i++) {
    const prod = productores[i];
    for (const f of FAMILIARES_POR_PRODUCTOR[i] ?? []) {
      await prisma.familiar.create({
        data: {
          nombres: f.nombres,
          parentesco: f.parentesco,
          dni: f.dni,
          sexo: f.sexo,
          fecha_nacimiento: new Date(f.nac),
          ocupacion: f.ocupacion,
          dependiente: f.dep,
          vive_con_productor: true,
          productor_id: prod.id,
        },
      });
      totalFam++;
    }
    const docs = [
      { tipo: 'DNI', categoria: 'PERSONAL' as const, nombre: 'dni_escaneado.pdf', mime: 'application/pdf', tam: 245000 },
      { tipo: 'Certificado de posesión', categoria: 'INSTITUCIONAL' as const, nombre: 'certificado_posesion.pdf', mime: 'application/pdf', tam: 512000 },
    ];
    for (const d of docs) {
      await prisma.documentos.create({
        data: {
          tipo: d.tipo,
          categoria: d.categoria,
          nombre_archivo: d.nombre,
          ruta_archivo: `/uploads/documentos/${d.nombre}`,
          tamano_bytes: d.tam,
          mime_type: d.mime,
          productor_id: prod.id,
        },
      });
      totalDoc++;
    }
  }
  console.log(`  Familiares: ${totalFam} · Documentos: ${totalDoc}`);
}

// ==================== Parcelas ====================
const PARCELAS = [
  { cod: 'PAR-0001', nom: 'Parcela Churupampa', cultivo: 'Quinua', area: 2.5, cert: 'ORGANICA' as const, lat: '-13.6112', lng: '-71.9785', alt: '3400 msnm', tipoSuelo: 'Franco', zona: 'Puna', prod: 0 },
  { cod: 'PAR-0002', nom: 'Parcela Sacha Yaku', cultivo: 'Papa', area: 1.8, cert: 'EN_TRANSICION' as const, lat: '-13.6201', lng: '-71.9650', alt: '3350 msnm', tipoSuelo: 'Franco-arcilloso', zona: 'Puna', prod: 0 },
  { cod: 'PAR-0003', nom: 'Parcela Kellu Rumi', cultivo: 'Quinua', area: 3.2, cert: 'ORGANICA' as const, lat: '-13.6050', lng: '-71.9900', alt: '3450 msnm', tipoSuelo: 'Franco-limoso', zona: 'Puna', prod: 1 },
  { cod: 'PAR-0004', nom: 'Parcela Hatun Mayu', cultivo: 'Maíz', area: 4.1, cert: 'CONVENCIONAL' as const, lat: '-13.6300', lng: '-71.9500', alt: '3200 msnm', tipoSuelo: 'Franco', zona: 'Quechua', prod: 1 },
  { cod: 'PAR-0005', nom: 'Parcela Qori Wayna', cultivo: 'Oca', area: 1.2, cert: 'ORGANICA' as const, lat: '-13.6150', lng: '-71.9700', alt: '3420 msnm', tipoSuelo: 'Franco', zona: 'Puna', prod: 2 },
  { cod: 'PAR-0006', nom: 'Parcela Lluskha Pata', cultivo: 'Papa', area: 2.0, cert: 'EN_TRANSICION' as const, lat: '-13.6080', lng: '-71.9820', alt: '3380 msnm', tipoSuelo: 'Arcilloso', zona: 'Puna', prod: 2 },
  { cod: 'PAR-0007', nom: 'Parcela Chunta Pampa', cultivo: 'Quinua', area: 5.5, cert: 'ORGANICA' as const, lat: '-13.6220', lng: '-71.9550', alt: '3480 msnm', tipoSuelo: 'Franco-limoso', zona: 'Puna', prod: 3 },
  { cod: 'PAR-0008', nom: 'Parcela Sayaq Kancha', cultivo: 'Frijol', area: 1.5, cert: 'CONVENCIONAL' as const, lat: '-13.6350', lng: '-71.9400', alt: '3150 msnm', tipoSuelo: 'Franco', zona: 'Quechua', prod: 3 },
  { cod: 'PAR-0009', nom: 'Parcela Qocha Pata', cultivo: 'Papa', area: 2.8, cert: 'ORGANICA' as const, lat: '-13.6180', lng: '-71.9680', alt: '3410 msnm', tipoSuelo: 'Franco-arcilloso', zona: 'Puna', prod: 4 },
  { cod: 'PAR-0010', nom: 'Parcela Wiñay Wayna', cultivo: 'Quinua', area: 3.7, cert: 'EN_TRANSICION' as const, lat: '-13.6100', lng: '-71.9850', alt: '3460 msnm', tipoSuelo: 'Franco', zona: 'Puna', prod: 4 },
  { cod: 'PAR-0011', nom: 'Parcela Tampu Urqu', cultivo: 'Olluco', area: 1.1, cert: 'ORGANICA' as const, lat: '-13.6250', lng: '-71.9600', alt: '3390 msnm', tipoSuelo: 'Franco-limoso', zona: 'Puna', prod: 5 },
  { cod: 'PAR-0012', nom: 'Parcela Kinsa Cruz', cultivo: 'Café', area: 6.0, cert: 'ORGANICA' as const, lat: '-11.3000', lng: '-74.6000', alt: '1200 msnm', tipoSuelo: 'Franco', zona: 'Ceja de selva', prod: 6 },
  { cod: 'PAR-0013', nom: 'Parcela Alto Selva', cultivo: 'Cacao', area: 8.5, cert: 'ORGANICA' as const, lat: '-11.2800', lng: '-74.5800', alt: '1150 msnm', tipoSuelo: 'Franco-limoso', zona: 'Ceja de selva', prod: 7 },
  { cod: 'PAR-0014', nom: 'Parcela Valle Alto', cultivo: 'Café', area: 4.3, cert: 'EN_TRANSICION' as const, lat: '-13.1500', lng: '-74.2000', alt: '2650 msnm', tipoSuelo: 'Franco', zona: 'Yunga', prod: 8 },
];

async function crearParcelas(productores: { id: number }[]) {
  console.log('Creando parcelas...');
  const ubigeos = await prisma.ubigeo.findMany({ take: 10, orderBy: { id: 'asc' } });
  let total = 0;
  for (let i = 0; i < PARCELAS.length; i++) {
    const p = PARCELAS[i];
    const existe = await prisma.parcela.findUnique({ where: { codigo: p.cod } });
    if (existe) continue;
    await prisma.parcela.create({
      data: {
        codigo: p.cod,
        nombre: p.nom,
        cultivo: p.cultivo,
        area: p.area,
        area_unidad: 'ha',
        certificacion: p.cert,
        estado: 'ACTIVA',
        latitud: p.lat,
        longitud: p.lng,
        altitud: p.alt,
        tipo_suelo: p.tipoSuelo,
        zona_agroecologica: p.zona,
        productores_id: productores[p.prod]?.id ?? productores[0].id,
        ubigeo_id: ubigeos[i]?.id ?? null,
        fecha_levantamiento: new Date('2024-03-10'),
        responsable: 'Ing. Carlos Mendoza',
      },
    });
    total++;
  }
  console.log(`  Parcelas: ${total}`);
}

// ==================== Campañas ====================
const CAMPANIAS = [
  { cod: 'CAM-2024-25', nom: 'Campaña Quinua Orgánica 2024-2025', anio: '2024-2025', inicio: '2024-08-01', fin: '2025-07-31', estado: 'FINALIZADA' as const, resp: 'Ing. Carlos Mendoza', tec: 'Tec. María García', activa: false },
  { cod: 'CAM-2025-26', nom: 'Campaña Papa Nativa 2025-2026', anio: '2025-2026', inicio: '2025-08-01', fin: '2026-07-31', estado: 'ACTIVA' as const, resp: 'Ing. Carlos Mendoza', tec: 'Tec. María García', activa: true },
  { cod: 'CAM-2026-27', nom: 'Campaña Cacao Vraem 2026-2027', anio: '2026-2027', inicio: '2026-08-01', fin: '2027-07-31', estado: 'PLANIFICADA' as const, resp: 'Ing. Roberto Neyra', tec: 'Tec. Lucía Vargas', activa: false },
  { cod: 'CAM-2023-24', nom: 'Campaña Café Ayacucho 2023-2024', anio: '2023-2024', inicio: '2023-08-01', fin: '2024-07-31', estado: 'FINALIZADA' as const, resp: 'Ing. Elena Yana', tec: 'Tec. Carlos Mendoza', activa: false },
];

async function crearCampanias() {
  console.log('Creando campañas...');
  const creadas: { id: number; estado: string }[] = [];
  for (const c of CAMPANIAS) {
    const existe = await prisma.campanias.findUnique({ where: { codigo: c.cod } });
    if (existe) { creadas.push(existe); continue; }
    const camp = await prisma.campanias.create({
      data: {
        codigo: c.cod,
        nombre: c.nom,
        anio_agricola: c.anio,
        fecha_inicio: new Date(c.inicio),
        fecha_fin: new Date(c.fin),
        estado: c.estado,
        responsable: c.resp,
        tecnico_coordinador: c.tec,
        activa: c.activa,
        objetivo: 'Fortalecer la producción agroecológica y la trazabilidad de los productos de la cooperativa.',
        descripcion: 'Campaña agrícola con acompañamiento técnico, control de calidad y comercialización conjunta.',
      },
    });
    creadas.push(camp);
  }
  console.log(`  Campañas: ${creadas.length}`);
  return creadas;
}

// ==================== Cultivos ====================
const CULTIVOS = [
  { cod: 'CUL-0001', cultivo: 'Quinua', variedad: 'Pasankalla', area: 2.5, siembra: '2025-08-15', cosecha: '2026-04-20', estado: 'EN_CRECIMIENTO' as const, parcela: 0, campania: 1, cert: 'ORGANICA' as const, rend: 1800 },
  { cod: 'CUL-0002', cultivo: 'Papa', variedad: 'Yungay', area: 1.8, siembra: '2025-09-01', cosecha: '2026-03-15', estado: 'EN_CRECIMIENTO' as const, parcela: 1, campania: 1, cert: 'EN_TRANSICION' as const, rend: 22000 },
  { cod: 'CUL-0003', cultivo: 'Quinua', variedad: 'Real', area: 3.2, siembra: '2025-08-20', cosecha: '2026-05-10', estado: 'EN_CRECIMIENTO' as const, parcela: 2, campania: 1, cert: 'ORGANICA' as const, rend: 1600 },
  { cod: 'CUL-0004', cultivo: 'Maíz', variedad: 'Chuspillu', area: 4.1, siembra: '2025-10-05', cosecha: '2026-06-01', estado: 'EN_CRECIMIENTO' as const, parcela: 3, campania: 1, cert: 'SIN_CERTIFICAR' as const, rend: 5200 },
  { cod: 'CUL-0005', cultivo: 'Oca', variedad: 'Rumicucho', area: 1.2, siembra: '2025-09-10', cosecha: '2026-04-01', estado: 'EN_CRECIMIENTO' as const, parcela: 4, campania: 1, cert: 'ORGANICA' as const, rend: 8500 },
  { cod: 'CUL-0006', cultivo: 'Papa', variedad: 'Huayro', area: 2.0, siembra: '2025-09-20', cosecha: '2026-03-25', estado: 'EN_CRECIMIENTO' as const, parcela: 5, campania: 1, cert: 'EN_TRANSICION' as const, rend: 19500 },
  { cod: 'CUL-0007', cultivo: 'Quinua', variedad: 'Sajama', area: 5.5, siembra: '2025-08-10', cosecha: '2026-04-15', estado: 'EN_CRECIMIENTO' as const, parcela: 6, campania: 1, cert: 'ORGANICA' as const, rend: 1750 },
  { cod: 'CUL-0008', cultivo: 'Frijol', variedad: 'Canario', area: 1.5, siembra: '2025-11-01', cosecha: '2026-05-20', estado: 'EN_CRECIMIENTO' as const, parcela: 7, campania: 1, cert: 'SIN_CERTIFICAR' as const, rend: 1200 },
  { cod: 'CUL-0009', cultivo: 'Papa', variedad: 'Ccompis', area: 2.8, siembra: '2025-09-05', cosecha: '2026-03-10', estado: 'EN_CRECIMIENTO' as const, parcela: 8, campania: 1, cert: 'ORGANICA' as const, rend: 21000 },
  { cod: 'CUL-0010', cultivo: 'Quinua', variedad: 'Kellu', area: 3.7, siembra: '2025-08-25', cosecha: '2026-05-05', estado: 'EN_CRECIMIENTO' as const, parcela: 9, campania: 1, cert: 'EN_TRANSICION' as const, rend: 1550 },
  { cod: 'CUL-0011', cultivo: 'Olluco', variedad: 'Rojo', area: 1.1, siembra: '2025-09-15', cosecha: '2026-03-30', estado: 'EN_CRECIMIENTO' as const, parcela: 10, campania: 1, cert: 'ORGANICA' as const, rend: 9200 },
  { cod: 'CUL-0012', cultivo: 'Café', variedad: 'Typica', area: 6.0, siembra: '2024-11-20', cosecha: '2026-06-15', estado: 'EN_CRECIMIENTO' as const, parcela: 11, campania: 1, cert: 'ORGANICA' as const, rend: 1400 },
];

async function crearCultivos(campanias: { id: number; estado: string }[]) {
  console.log('Creando cultivos...');
  const parcelas = await prisma.parcela.findMany({ orderBy: { id: 'asc' } });
  const campActiva = campanias.find((c) => c.estado === 'ACTIVA') ?? campanias[1] ?? campanias[0];
  let total = 0;
  for (const c of CULTIVOS) {
    const existe = await prisma.cultivo.findUnique({ where: { codigo: c.cod } });
    if (existe) continue;
    await prisma.cultivo.create({
      data: {
        codigo: c.cod,
        cultivo: c.cultivo,
        variedad: c.variedad,
        area_sembrada: c.area,
        fecha_siembra: new Date(c.siembra),
        fecha_cosecha: new Date(c.cosecha),
        estado: c.estado,
        certificacion: c.cert,
        rendimiento_esperado: c.rend,
        produccion_estimada: Math.round(c.area * c.rend),
        destino_produccion: 'VENTA_COOPERATIVA',
        metodo_siembra: 'DIRECTA',
        sistema_productivo: c.cert === 'ORGANICA' ? 'ORGANICO' : c.cert === 'EN_TRANSICION' ? 'EN_TRANSICION' : 'CONVENCIONAL',
        tipo_agricultura: 'TRADICIONAL',
        parcela_id: parcelas[c.parcela]?.id ?? parcelas[0].id,
        campania_id: campActiva.id,
      },
    });
    total++;
  }
  console.log(`  Cultivos: ${total}`);
}

// ==================== Actividades ====================
const ACTIVIDADES = [
  { cod: 'ACT-0001', fecha: '2025-08-15', tipo: 'PREPARACION_TERRENO' as const, desc: 'Arado y rastrillado de la parcela Churupampa', resp: 'Juan Mamani', prioridad: 'ALTA' as const, estado: 'COMPLETADA' as const, jornales: 4, cultivo: 0 },
  { cod: 'ACT-0002', fecha: '2025-08-20', tipo: 'SIEMBRA' as const, desc: 'Siembra de quinua Pasankalla con densidad de 8 kg/ha', resp: 'Juan Mamani', prioridad: 'ALTA' as const, estado: 'COMPLETADA' as const, jornales: 6, cultivo: 0 },
  { cod: 'ACT-0003', fecha: '2025-09-01', tipo: 'SIEMBRA' as const, desc: 'Siembra de papa Yungay en Sacha Yaku', resp: 'María Flores', prioridad: 'ALTA' as const, estado: 'COMPLETADA' as const, jornales: 8, cultivo: 1 },
  { cod: 'ACT-0004', fecha: '2025-09-10', tipo: 'FERTILIZACION' as const, desc: 'Aplicación de compost y guano de isla', resp: 'Pedro Ccota', prioridad: 'MEDIA' as const, estado: 'COMPLETADA' as const, jornales: 3, cultivo: 2 },
  { cod: 'ACT-0005', fecha: '2025-09-15', tipo: 'DESHIERBIE' as const, desc: 'Deshierbie manual de parcela Kellu Rumi', resp: 'Rosa Ttito', prioridad: 'MEDIA' as const, estado: 'COMPLETADA' as const, jornales: 5, cultivo: 2 },
  { cod: 'ACT-0006', fecha: '2025-10-05', tipo: 'SIEMBRA' as const, desc: 'Siembra de maíz Chuspillu en Hatun Mayu', resp: 'María Flores', prioridad: 'ALTA' as const, estado: 'COMPLETADA' as const, jornales: 7, cultivo: 3 },
  { cod: 'ACT-0007', fecha: '2025-10-12', tipo: 'COMPOSTAJE' as const, desc: 'Elaboración de compost en parcela Qori Wayna', resp: 'Rosa Ttito', prioridad: 'BAJA' as const, estado: 'COMPLETADA' as const, jornales: 2, cultivo: 4 },
  { cod: 'ACT-0008', fecha: '2025-10-20', tipo: 'RIEGO' as const, desc: 'Riego por gravedad en Lluskha Pata', resp: 'Pedro Ccota', prioridad: 'MEDIA' as const, estado: 'COMPLETADA' as const, jornales: 3, cultivo: 5 },
  { cod: 'ACT-0009', fecha: '2025-11-01', tipo: 'MANEJO_PLAGAS' as const, desc: 'Control biológico de polilla de la papa', resp: 'Tec. María García', prioridad: 'ALTA' as const, estado: 'EN_PROCESO' as const, jornales: 4, cultivo: 1 },
  { cod: 'ACT-0010', fecha: '2025-11-08', tipo: 'CONTROL_BIOLOGICO' as const, desc: 'Liberación de Coccidoxenoides perminutus', resp: 'Tec. María García', prioridad: 'ALTA' as const, estado: 'EN_PROCESO' as const, jornales: 2, cultivo: 5 },
  { cod: 'ACT-0011', fecha: '2025-11-15', tipo: 'RIEGO' as const, desc: 'Riego de mantenimiento en Chunta Pampa', resp: 'Pedro Ccota', prioridad: 'MEDIA' as const, estado: 'EN_PROCESO' as const, jornales: 3, cultivo: 6 },
  { cod: 'ACT-0012', fecha: '2025-11-22', tipo: 'DESHIERBIE' as const, desc: 'Deshierbie de Sayaq Kancha', resp: 'Rosa Ttito', prioridad: 'BAJA' as const, estado: 'PROGRAMADA' as const, jornales: 4, cultivo: 7 },
  { cod: 'ACT-0013', fecha: '2025-12-01', tipo: 'FERTILIZACION' as const, desc: 'Segunda fertilización con bioles', resp: 'Juan Mamani', prioridad: 'MEDIA' as const, estado: 'PROGRAMADA' as const, jornales: 3, cultivo: 0 },
  { cod: 'ACT-0014', fecha: '2025-12-10', tipo: 'APLICACION_BIOLES' as const, desc: 'Aplicación de bioles de estiércol', resp: 'Tec. María García', prioridad: 'MEDIA' as const, estado: 'PROGRAMADA' as const, jornales: 2, cultivo: 8 },
  { cod: 'ACT-0015', fecha: '2025-12-18', tipo: 'PODA' as const, desc: 'Poda de café en Kinsa Cruz', resp: 'Luis Huanca', prioridad: 'BAJA' as const, estado: 'PROGRAMADA' as const, jornales: 5, cultivo: 11 },
  { cod: 'ACT-0016', fecha: '2026-01-10', tipo: 'COSECHA' as const, desc: 'Cosecha de oca en Qori Wayna', resp: 'Rosa Ttito', prioridad: 'ALTA' as const, estado: 'PROGRAMADA' as const, jornales: 6, cultivo: 4 },
  { cod: 'ACT-0017', fecha: '2025-09-25', tipo: 'MANEJO_ENFERMEDADES' as const, desc: 'Control de tizón tardío en papa', resp: 'Tec. María García', prioridad: 'ALTA' as const, estado: 'COMPLETADA' as const, jornales: 4, cultivo: 5 },
  { cod: 'ACT-0018', fecha: '2025-10-30', tipo: 'RESIEMBRA' as const, desc: 'Resiembra de espacios vacíos en Maíz', resp: 'María Flores', prioridad: 'BAJA' as const, estado: 'COMPLETADA' as const, jornales: 2, cultivo: 3 },
];

async function crearActividades() {
  console.log('Creando actividades...');
  const cultivos = await prisma.cultivo.findMany({ orderBy: { id: 'asc' } });
  let total = 0;
  for (const a of ACTIVIDADES) {
    const existe = await prisma.actividades.findUnique({ where: { codigo: a.cod } });
    if (existe) continue;
    await prisma.actividades.create({
      data: {
        codigo: a.cod,
        fecha: new Date(a.fecha),
        tipo_actividad: a.tipo,
        descripcion: a.desc,
        responsable_tecnico: a.resp,
        prioridad: a.prioridad,
        estado: a.estado,
        jornales: a.jornales,
        hora_inicio: '07:30',
        hora_fin: '16:30',
        duracion_estimada: '8 horas',
        cultivo_id: cultivos[a.cultivo]?.id ?? cultivos[0].id,
      },
    });
    total++;
  }
  console.log(`  Actividades: ${total}`);
}

// ==================== Inspecciones ====================
const INSPECCIONES = [
  { cod: 'INS-0001', fecha: '2025-09-15', inspector: 'María García', estado: 'APROBADA' as const, resultado: 'CONFORME' as const, cultivo: 0, obs: 'Cultivo en buen estado, sin presencia de plagas.' },
  { cod: 'INS-0002', fecha: '2025-09-22', inspector: 'María García', estado: 'APROBADA' as const, resultado: 'CONFORME_CON_OBSERVACIONES' as const, cultivo: 1, obs: 'Se observó leve presencia de malezas en el sector norte.' },
  { cod: 'INS-0003', fecha: '2025-10-01', inspector: 'María García', estado: 'NO_CONFORME' as const, resultado: 'NO_CONFORME' as const, cultivo: 5, obs: 'Presencia de tizón tardío. Se requiere aplicación inmediata de fungicida.' },
  { cod: 'INS-0004', fecha: '2025-10-10', inspector: 'Carlos Mendoza', estado: 'APROBADA' as const, resultado: 'CONFORME' as const, cultivo: 2, obs: 'Parcela con buena estructura y manejo agroecológico.' },
  { cod: 'INS-0005', fecha: '2025-10-18', inspector: 'María García', estado: 'PENDIENTE' as const, resultado: null, cultivo: 3, obs: '' },
  { cod: 'INS-0006', fecha: '2025-10-25', inspector: 'María García', estado: 'APROBADA' as const, resultado: 'CONFORME_CON_OBSERVACIONES' as const, cultivo: 4, obs: 'Revisar sistema de riego antes de la floración.' },
  { cod: 'INS-0007', fecha: '2025-11-02', inspector: 'Carlos Mendoza', estado: 'PENDIENTE' as const, resultado: null, cultivo: 6, obs: '' },
  { cod: 'INS-0008', fecha: '2025-11-10', inspector: 'María García', estado: 'APROBADA' as const, resultado: 'CONFORME' as const, cultivo: 7, obs: 'Cumple con los criterios de producción orgánica.' },
  { cod: 'INS-0009', fecha: '2025-11-18', inspector: 'María García', estado: 'NO_CONFORME' as const, resultado: 'NO_CONFORME' as const, cultivo: 8, obs: 'Deficiencia en la trazabilidad documental de insumos.' },
  { cod: 'INS-0010', fecha: '2025-11-25', inspector: 'Carlos Mendoza', estado: 'PENDIENTE' as const, resultado: null, cultivo: 9, obs: '' },
];

async function crearInspecciones() {
  console.log('Creando inspecciones...');
  const cultivos = await prisma.cultivo.findMany({ orderBy: { id: 'asc' } });
  const criterios = await prisma.catalogos.findMany({ where: { tipo: 'criterios-checklist' } });
  let total = 0, totalCheck = 0;
  for (const ins of INSPECCIONES) {
    const existe = await prisma.inspecciones.findUnique({ where: { codigo: ins.cod } });
    if (existe) continue;
    const creada = await prisma.inspecciones.create({
      data: {
        codigo: ins.cod,
        fecha: new Date(ins.fecha),
        inspector: ins.inspector,
        estado: ins.estado,
        resultado: ins.resultado,
        observaciones: ins.obs,
        cultivo_id: cultivos[ins.cultivo]?.id ?? cultivos[0].id,
        riesgo_general: ins.estado === 'NO_CONFORME' ? 'ALTO' : ins.estado === 'APROBADA' ? 'BAJO' : 'MEDIO',
      },
    });
    total++;
    for (let i = 0; i < Math.min(criterios.length, 5); i++) {
      await prisma.inspeccion_checklist.create({
        data: {
          inspeccion_id: creada.id,
          criterio: criterios[i].nombre,
          cumplimiento: ins.estado === 'NO_CONFORME' && i === 1 ? 'NO_CUMPLE' : 'CUMPLE',
          observacion: '',
        },
      });
      totalCheck++;
    }
  }
  console.log(`  Inspecciones: ${total} · Checklist: ${totalCheck}`);
}

// ==================== Acopios ====================
async function crearAcopios() {
  console.log('Creando acopios...');
  const cultivos = await prisma.cultivo.findMany({ orderBy: { id: 'asc' } });
  const productores = await prisma.productor.findMany({ orderBy: { id: 'asc' } });
  const parcelas = await prisma.parcela.findMany({ orderBy: { id: 'asc' } });
  const estados = ['EN_CAMPO', 'EN_TRANSITO', 'RECIBIDO'] as const;
  let totalAcopios = 0, totalSacos = 0;

  for (let i = 0; i < 8; i++) {
    const cod = `ACO-2025-${String(i + 1).padStart(3, '0')}`;
    const existe = await prisma.acopio.findUnique({ where: { codigo: cod } });
    if (existe) continue;
    const sacos = 20 + i * 5;
    const pesoPorSaco = 65 + (i % 3) * 3;
    const pesoTotal = sacos * pesoPorSaco;
    const acopio = await prisma.acopio.create({
      data: {
        codigo: cod,
        fecha: new Date(2025, 9 + (i % 3), 5 + i * 3),
        acopiador: ['Juan Pérez', 'Rosa Mamani', 'Carlos Mendoza'][i % 3],
        vehiculo: `Placa ${['ABC-123', 'DEF-456', 'GHI-789'][i % 3]}`,
        ruta_acopio: `Ruta ${['Santo Tomás - Cusco', 'San Pedro - Cusco', 'Ayaviri - Puno'][i % 3]}`,
        total_sacos: sacos,
        peso_total: pesoTotal,
        peso_bruto: pesoTotal + 45,
        tara: 45,
        peso_neto: pesoTotal,
        estado: estados[i % 3],
        observaciones: 'Acopio de temporada con control de humedad.',
      },
    });
    totalAcopios++;

    const detalle = await prisma.acopio_detalle.create({
      data: {
        acopio_id: acopio.id,
        productor_id: productores[i % productores.length].id,
        cultivo_id: cultivos[i % cultivos.length].id,
        parcela_id: parcelas[i % parcelas.length]?.id ?? null,
        total_sacos: sacos,
        peso_total: pesoTotal,
        observaciones: 'Lote conformado por producto de la campaña activa.',
      },
    });

    for (let s = 0; s < Math.min(sacos, 6); s++) {
      await prisma.saco.create({
        data: {
          codigo: `${cod}-S${String(s + 1).padStart(3, '0')}`,
          peso: pesoPorSaco,
          acopio_detalle_id: detalle.id,
        },
      });
      totalSacos++;
    }
  }
  console.log(`  Acopios: ${totalAcopios} · Sacos: ${totalSacos}`);
}

// ==================== Recepciones ====================
async function crearRecepciones() {
  console.log('Creando recepciones...');
  const acopios = await prisma.acopio.findMany({ orderBy: { id: 'asc' } });
  const estados = ['PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA'] as const;
  let total = 0, totalSacos = 0;

  for (let i = 0; i < 8; i++) {
    const cod = `RCP-2025-${String(i + 1).padStart(2, '0')}`;
    const existe = await prisma.recepcion.findUnique({ where: { codigo: cod } });
    if (existe) continue;
    const sacos = 15 + i * 3;
    const pesoCampo = sacos * 68;
    const pesoBruto = sacos * 66;
    const tara = 42;
    const pesoNeto = pesoBruto - tara;
    const recepcion = await prisma.recepcion.create({
      data: {
        codigo: cod,
        acopio_id: acopios[i % acopios.length]?.id ?? null,
        lote_productor: `LP-2025-${String(i + 1).padStart(3, '0')}`,
        fecha: new Date(2025, 10 + (i % 2), 3 + i * 2),
        responsable: ['Juan Pérez', 'Rosa Mamani'][i % 2],
        planta: ['Planta San Juan', 'Planta Chuschi'][i % 2],
        sacos,
        peso_campo: pesoCampo,
        peso_bruto: pesoBruto,
        tara,
        peso_neto: pesoNeto,
        diferencia: pesoCampo - pesoNeto,
        merma: Number((((pesoCampo - pesoNeto) / pesoCampo) * 100).toFixed(2)),
        humedad: 11 + (i % 4),
        impurezas: 0.8 + (i % 3) * 0.3,
        color: 'Dorado',
        olor: 'Característico',
        presencia_insectos: 'No se observan',
        estado_producto: i % 4 === 3 ? 'REGULAR' : 'BUENO',
        categoria: i % 3 === 0 ? 'PRIMERA' : i % 3 === 1 ? 'SEGUNDA' : 'INDUSTRIAL',
        destino: 'PROCESAMIENTO',
        resultado: i % 4 === 3 ? 'RECHAZADO' : 'ACEPTADO',
        estado: estados[i % 4],
        observaciones: 'Recepción con control de humedad e impurezas.',
        documento_firmado: i % 2 === 0,
      },
    });
    total++;

    for (let s = 0; s < Math.min(sacos, 5); s++) {
      await prisma.recepcion_saco.create({
        data: {
          recepcion_id: recepcion.id,
          codigo: `${cod}-S${String(s + 1).padStart(3, '0')}`,
          peso: Number((pesoNeto / sacos).toFixed(2)),
          observaciones: '',
        },
      });
      totalSacos++;
    }
  }
  console.log(`  Recepciones: ${total} · Sacos: ${totalSacos}`);
}

// ==================== Procesamiento ====================
const PROCESAMIENTOS = [
  { cod: 'OP-0001', producto: 'Quinua orgánica', responsable: 'Ing. Carlos Mendoza', planta: 'Planta San Juan', linea: 'GRANOS' as const, tipo: 'LIMPIEZA' as const, estado: 'FINALIZADO' as const, entrada: 1200, salida: 1140, base: 'Quinua Pasankalla', calidad: 'PRIMERA' as const, final: 1100 },
  { cod: 'OP-0002', producto: 'Papa nativa', responsable: 'Ing. María García', planta: 'Planta Chuschi', linea: 'TUBERCULOS' as const, tipo: 'LIMPIEZA' as const, estado: 'EN_PROCESO' as const, entrada: 2500, salida: 2380, base: 'Papa Yungay', calidad: 'SEGUNDA' as const, final: 2300 },
  { cod: 'OP-0003', producto: 'Café orgánico', responsable: 'Ing. Elena Yana', planta: 'Planta San Juan', linea: 'GRANOS' as const, tipo: 'SECADO' as const, estado: 'EN_PROCESO' as const, entrada: 800, salida: 720, base: 'Café Typica', calidad: 'PRIMERA' as const, final: 700 },
  { cod: 'OP-0004', producto: 'Quinua orgánica', responsable: 'Ing. Carlos Mendoza', planta: 'Planta San Juan', linea: 'GRANOS' as const, tipo: 'EMPAQUE' as const, estado: 'REGISTRADA' as const, entrada: 1100, salida: 1080, base: 'Quinua Real', calidad: 'PRIMERA' as const, final: 1050 },
  { cod: 'OP-0005', producto: 'Cacao Vraem', responsable: 'Ing. Roberto Neyra', planta: 'Planta Chuschi', linea: 'LEGUMBRES' as const, tipo: 'SECADO' as const, estado: 'REGISTRADA' as const, entrada: 600, salida: 560, base: 'Cacao fino de aroma', calidad: 'PRIMERA' as const, final: 540 },
];

async function crearProcesamientos() {
  console.log('Creando procesamientos...');
  const recepciones = await prisma.recepcion.findMany({ orderBy: { id: 'asc' } });
  let total = 0;
  for (let i = 0; i < PROCESAMIENTOS.length; i++) {
    const p = PROCESAMIENTOS[i];
    const existe = await prisma.procesamiento.findUnique({ where: { codigo: p.cod } });
    if (existe) continue;
    await prisma.procesamiento.create({
      data: {
        codigo: p.cod,
        fecha_inicio: new Date(2025, 10, 1 + i * 3),
        fecha_fin: new Date(2025, 10, 3 + i * 3),
        producto: p.producto,
        responsable: p.responsable,
        planta: p.planta,
        linea_procesamiento: p.linea,
        tipo_proceso: p.tipo,
        estado: p.estado,
        peso_entrada: p.entrada,
        peso_salida: p.salida,
        merma: p.entrada - p.salida,
        rendimiento: Number(((p.salida / p.entrada) * 100).toFixed(2)),
        producto_base: p.base,
        calidad_producto: p.calidad,
        peso_final: p.final,
        humedad_final: 11.5,
        recepcion_id: recepciones[i]?.id ?? null,
        observaciones: 'Proceso con control de calidad y trazabilidad.',
      },
    });
    total++;
  }
  console.log(`  Procesamientos: ${total}`);
}

// ==================== Kardex ====================
// Catalogo de cultivos del sistema (granos andinos, cereales y leguminosas)
const CULTIVOS_SISTEMA = [
  { nombre: 'Quinua', genero: 'f' },
  { nombre: 'Kiwicha', genero: 'f' },
  { nombre: 'Chia', genero: 'f' },
  { nombre: 'Frejol rojo', genero: 'm' },
  { nombre: 'Frejol negro', genero: 'm' },
  { nombre: 'Frejol panamito', genero: 'm' },
  { nombre: 'Frejol canario', genero: 'm' },
  { nombre: 'Avena', genero: 'f' },
  { nombre: 'Trigo', genero: 'm' },
  { nombre: 'Centeno', genero: 'm' },
  { nombre: 'Garbanzo', genero: 'm' },
  { nombre: 'Lenteja', genero: 'f' },
];

function nombreTrillado(cultivo: string, genero: string): string {
  return `${cultivo} ${genero === 'f' ? 'trillada' : 'trillado'}`;
}

function nombreProcesado(cultivo: string, genero: string): string {
  return `${cultivo} ${genero === 'f' ? 'procesada' : 'procesado'}`;
}

const KARDEX = [
  { cod: 'KAR-0001', prod: 'Quinua trillada', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 8500, min: 1000, max: 15000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 8.5 },
  { cod: 'KAR-0002', prod: 'Kiwicha trillada', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 3200, min: 500, max: 8000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 12.0 },
  { cod: 'KAR-0003', prod: 'Chia trillada', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 2100, min: 300, max: 6000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 15.5 },
  { cod: 'KAR-0004', prod: 'Frejol rojo trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 4800, min: 800, max: 10000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 9.2 },
  { cod: 'KAR-0005', prod: 'Frejol negro trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 3600, min: 600, max: 8000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 9.8 },
  { cod: 'KAR-0006', prod: 'Frejol panamito trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 2200, min: 400, max: 5000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 10.5 },
  { cod: 'KAR-0007', prod: 'Frejol canario trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 1800, min: 300, max: 4000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 11.0 },
  { cod: 'KAR-0008', prod: 'Avena trillada', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 5200, min: 800, max: 12000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 4.8 },
  { cod: 'KAR-0009', prod: 'Trigo trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 6800, min: 1000, max: 15000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 5.2 },
  { cod: 'KAR-0010', prod: 'Centeno trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 1500, min: 200, max: 4000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 6.0 },
  { cod: 'KAR-0011', prod: 'Garbanzo trillado', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 2900, min: 500, max: 7000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 11.5 },
  { cod: 'KAR-0012', prod: 'Lenteja trillada', cat: 'PRODUCTO_CAMPO' as const, origen: 'CAMPO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 2400, min: 400, max: 6000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 10.8 },
  { cod: 'KAR-0013', prod: 'Quinua procesada', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 5200, min: 500, max: 10000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 14.5 },
  { cod: 'KAR-0014', prod: 'Kiwicha procesada', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 1800, min: 300, max: 5000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 18.0 },
  { cod: 'KAR-0015', prod: 'Chia procesada', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 1200, min: 200, max: 4000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 22.0 },
  { cod: 'KAR-0016', prod: 'Frejol rojo procesado', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 3200, min: 400, max: 8000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 12.5 },
  { cod: 'KAR-0017', prod: 'Avena procesada', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 3800, min: 500, max: 9000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 7.2 },
  { cod: 'KAR-0018', prod: 'Harina de quinua', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'SECUNDARIA' as const, unidad: 'KG', actual: 1500, min: 200, max: 4000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 22.5 },
  { cod: 'KAR-0019', prod: 'Hojuelas de quinua', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'SECUNDARIA' as const, unidad: 'KG', actual: 800, min: 100, max: 2500, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 28.0 },
  { cod: 'KAR-0020', prod: 'Pop de quinua', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'SECUNDARIA' as const, unidad: 'KG', actual: 600, min: 100, max: 2000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 35.0 },
  { cod: 'KAR-0021', prod: 'Harina de avena', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'SECUNDARIA' as const, unidad: 'KG', actual: 950, min: 150, max: 3000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 11.5 },
  { cod: 'KAR-0022', prod: 'Harina de trigo', cat: 'PRODUCTO_PROCESADO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'SECUNDARIA' as const, unidad: 'KG', actual: 2100, min: 300, max: 5000, ubi: 'Almacen de producto', estado: 'DISPONIBLE' as const, costo: 8.5 },
  { cod: 'KAR-0023', prod: 'Merma de procesamiento', cat: 'SUBPRODUCTO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 420, min: 0, max: 1000, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 0 },
  { cod: 'KAR-0024', prod: 'Piedras (despedrado)', cat: 'SUBPRODUCTO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 280, min: 0, max: 800, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 0 },
  { cod: 'KAR-0025', prod: 'Saponina (desaponificado)', cat: 'SUBPRODUCTO' as const, origen: 'PROCESAMIENTO' as const, etapa: 'PRIMARIA' as const, unidad: 'KG', actual: 150, min: 0, max: 500, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 0 },
  { cod: 'KAR-0026', prod: 'Costal de 50 kg', cat: 'ENVASE' as const, origen: 'OTRO' as const, etapa: null, unidad: 'UNIDAD', actual: 350, min: 50, max: 800, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 3.5 },
  { cod: 'KAR-0027', prod: 'Bolsa de 25 kg', cat: 'ENVASE' as const, origen: 'OTRO' as const, etapa: null, unidad: 'UNIDAD', actual: 280, min: 40, max: 600, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 1.8 },
  { cod: 'KAR-0028', prod: 'Bolsa de 5 kg', cat: 'ENVASE' as const, origen: 'OTRO' as const, etapa: null, unidad: 'UNIDAD', actual: 420, min: 60, max: 1000, ubi: 'Bodega tecnica', estado: 'DISPONIBLE' as const, costo: 0.9 },
];

const MOVIMIENTOS_POR_ITEM: Array<Array<{ tipo: 'ENTRADA' | 'SALIDA' | 'BAJA'; cant: number; fecha: string; resp: string; origen: 'CAMPO' | 'PROCESAMIENTO' | 'AJUSTE' | 'OTRO'; refTipo: string; obs: string }>> = KARDEX.map((k) => {
  const entrada = Math.round(k.actual * 1.2);
  const salida = Math.round(k.actual * 0.2);
  return [
    { tipo: 'ENTRADA' as const, cant: entrada, fecha: '2025-08-15', resp: 'Juan Perez', origen: k.origen, refTipo: k.origen === 'CAMPO' ? 'RECEPCION' : k.origen === 'PROCESAMIENTO' ? 'ORDEN_PROCESAMIENTO' : 'AJUSTE', obs: k.origen === 'CAMPO' ? 'Ingreso de producto de campo.' : k.origen === 'PROCESAMIENTO' ? 'Salida de orden de procesamiento.' : 'Ingreso a almacen.' },
    { tipo: 'SALIDA' as const, cant: salida, fecha: '2025-10-20', resp: 'Maria Garcia', origen: k.origen, refTipo: 'VENTA', obs: 'Salida para venta/despacho.' },
  ];
});

async function crearKardex() {
  console.log('Creando kardex y movimientos...');
  let totalItems = 0, totalMovs = 0;
  for (let i = 0; i < KARDEX.length; i++) {
    const k = KARDEX[i];
    const existe = await prisma.kardex.findUnique({ where: { codigo: k.cod } });
    if (existe) continue;
    const item = await prisma.kardex.create({
      data: {
        codigo: k.cod,
        producto: k.prod,
        categoria: k.cat,
        origen: k.origen,
        etapa: k.etapa,
        unidad: k.unidad,
        cantidad_actual: k.actual,
        cantidad_minima: k.min,
        cantidad_maxima: k.max,
        ubicacion: k.ubi,
        estado: k.estado,
        costo_unitario: k.costo,
        fecha_ingreso: new Date('2025-08-01'),
        observaciones: 'Item de inventario de almacen.',
      },
    });
    totalItems++;

    let saldo = 0;
    for (const m of MOVIMIENTOS_POR_ITEM[i] ?? []) {
      const esEntrada = m.tipo === 'ENTRADA';
      const esBaja = m.tipo === 'BAJA';
      saldo = esEntrada ? saldo + m.cant : saldo - m.cant;
      await prisma.kardex_movimiento.create({
        data: {
          kardex_id: item.id,
          tipo: m.tipo,
          cantidad: m.cant,
          saldo_anterior: esEntrada ? saldo - m.cant : saldo + m.cant,
          saldo_posterior: saldo,
          origen: m.origen,
          referencia_tipo: m.refTipo,
          referencia_id: null,
          responsable: m.resp,
          fecha: new Date(m.fecha),
          observaciones: m.obs,
        },
      });
      totalMovs++;
    }
  }
  console.log(`  Kardex: ${totalItems} · Movimientos: ${totalMovs}`);
}

// ==================== Main ====================
async function main() {
  console.log('=== Seed de datos de prueba AgroData ===\n');
  await crearUsuarios();
  await crearCatalogos();
  await crearOperaciones();
  await crearRecetas();
  const productores = await crearProductores();
  await crearFamiliaresYDocumentos(productores);
  await crearParcelas(productores);
  const campanias = await crearCampanias();
  await crearCultivos(campanias);
  await crearActividades();
  await crearInspecciones();
  await crearAcopios();
  await crearRecepciones();
  await crearProcesamientos();
  await crearKardex();
  await importarUbigeos();
  console.log('\n=== Seed completado ===');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
