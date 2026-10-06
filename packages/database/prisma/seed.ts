import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function importarUbigeos(): Promise<void> {
  console.log('🗺️  Importando ubigeos de Perú...');

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
    rows.push({
      ubigeo: match[1],
      dpto: match[2],
      prov: match[3],
      distrito: match[4],
    });
  }

  console.log(`  Total filas parseadas: ${rows.length}`);

  if (rows.length === 0) {
    console.error('No se pudieron parsear filas del SQL');
    process.exit(1);
  }

  // Upsert idempotente: no borra (evita anular FKs) y omite duplicados.
  console.log('  Insertando ubigeos (skipDuplicates)...');
  const BATCH_SIZE = 100;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await prisma.ubigeo.createMany({ data: batch, skipDuplicates: true });
  }

  const total = await prisma.ubigeo.count();
  console.log(`  Importación completada: ${total} ubigeos de Perú`);
}

async function crearUsuarioAdmin(): Promise<void> {
  console.log('👤  Asegurando usuario ADMIN inicial...');

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@agrodata.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Administrador AgroData';

  const existente = await prisma.usuarios.findUnique({ where: { email } });
  if (existente) {
    console.log(`  Usuario admin ya existe (${email}), se omite.`);
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.usuarios.create({
    data: { nombre, email, password: hash, rol: 'ADMIN', activo: true },
  });

  console.log(`  Admin creado: ${email}`);
  console.log('  ⚠️  Cambia la contraseña en el primer inicio de sesión.');
}

async function main(): Promise<void> {
  await crearUsuarioAdmin();
  await importarUbigeos();

  const departamentos = await prisma.ubigeo.findMany({
    select: { dpto: true },
    distinct: ['dpto'],
    orderBy: { dpto: 'asc' },
  });
  console.log(`\nDepartamentos (${departamentos.length}):`);
  departamentos.forEach((d) => console.log(`   - ${d.dpto}`));
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
