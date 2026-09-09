import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🗺️  Importando ubigeos de Perú...');

  const sqlPath = path.resolve(__dirname, '..', '..', '..', 'ubigeo.sql');
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

  console.log(`  📋 Total filas parseadas: ${rows.length}`);

  if (rows.length === 0) {
    console.error('No se pudieron parsear filas del SQL');
    process.exit(1);
  }

  console.log('  🗑️  Limpiando tabla ubigeo...');
  await prisma.ubigeo.deleteMany();

  console.log('  💾 Insertando ubigeos...');
  const BATCH_SIZE = 100;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await prisma.ubigeo.createMany({ data: batch });
    if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= rows.length) {
      console.log(`  ✅ Insertados ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length}`);
    }
  }

  const total = await prisma.ubigeo.count();
  console.log(`\n✅ Importación completada: ${total} ubigeos de Perú`);

  const departamentos = await prisma.ubigeo.findMany({
    select: { dpto: true },
    distinct: ['dpto'],
    orderBy: { dpto: 'asc' },
  });
  console.log(`\n📍 Departamentos (${departamentos.length}):`);
  departamentos.forEach((d) => console.log(`   - ${d.dpto}`));
}

main()
  .catch((e) => {
    console.error('Error durante la importación:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
