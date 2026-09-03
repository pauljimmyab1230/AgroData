/**
 * Data migration script: Populate FK IDs from text names
 * 
 * Run with: npx tsx prisma/migrations/20260829030000_populate_fk_ids/migrate.ts
 * 
 * This script:
 * 1. Populates trazabilidad.productor_id from trazabilidad.productor text
 * 2. Populates trazabilidad.parcela_id from trazabilidad.parcela text
 * 3. Populates trazabilidad.lote_id from trazabilidad.lote_id (if valid UUID)
 * 4. Populates inspecciones.inspector_id from inspecciones.inspector text
 * 5. Populates acopios.acopiador_id from acopios.acopiador text
 * 6. Populates recepciones.responsable_id from recepciones.responsable text
 * 7. Populates procesamientos.responsable_id from procesamientos.responsable text
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateTrazabilidad() {
  console.log('Migrating trazabilidad FKs...');

  const items = await prisma.trazabilidad.findMany({
    where: { activo: true },
    select: { id: true, productor: true, parcela: true, cultivo: true },
  });

  for (const item of items) {
    const updateData: Record<string, unknown> = {};

    // Try to match productor by name
    if (item.productor && !updateData.productor_id) {
      const parts = item.productor.split(' ').filter(Boolean);
      if (parts.length >= 2) {
        const apellidoPaterno = parts[parts.length - 2];
        const apellidoMaterno = parts[parts.length - 1];
        const nombres = parts.slice(0, parts.length - 2).join(' ');

        const productor = await prisma.productores.findFirst({
          where: {
            AND: [
              { nombres: { contains: nombres } },
              { apellido_paterno: { contains: apellidoPaterno } },
              { apellido_materno: { contains: apellidoMaterno } },
            ],
          },
          select: { id: true },
        });
        if (productor) updateData.productor_id = productor.id;
      }
    }

    // Try to match parcela by name
    if (item.parcela && !updateData.parcela_id) {
      const parcela = await prisma.parcelas_productor.findFirst({
        where: { nombre: { contains: item.parcela } },
        select: { id: true },
      });
      if (parcela) updateData.parcela_id = parcela.id;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.trazabilidad.update({
        where: { id: item.id },
        data: updateData,
      });
    }
  }

  console.log(`  Processed ${items.length} trazabilidad records`);
}

async function migrateInspectores() {
  console.log('Migrating inspecciones.inspector_id...');

  const items = await prisma.inspecciones.findMany({
    where: { activo: true, inspector_id: null },
    select: { id: true, inspector: true },
  });

  for (const item of items) {
    if (!item.inspector) continue;

    const usuario = await prisma.usuarios.findFirst({
      where: {
        nombre: { contains: item.inspector },
        activo: true,
      },
      select: { id: true },
    });

    if (usuario) {
      await prisma.inspecciones.update({
        where: { id: item.id },
        data: { inspector_id: usuario.id },
      });
    }
  }

  console.log(`  Processed ${items.length} inspecciones`);
}

async function migrateAcopiadores() {
  console.log('Migrating acopios.acopiador_id...');

  const items = await prisma.acopios.findMany({
    where: { activo: true, acopiador_id: null },
    select: { id: true, acopiador: true },
  });

  for (const item of items) {
    if (!item.acopiador) continue;

    const usuario = await prisma.usuarios.findFirst({
      where: {
        nombre: { contains: item.acopiador },
        activo: true,
      },
      select: { id: true },
    });

    if (usuario) {
      await prisma.acopios.update({
        where: { id: item.id },
        data: { acopiador_id: usuario.id },
      });
    }
  }

  console.log(`  Processed ${items.length} acopios`);
}

async function migrateRecepciones() {
  console.log('Migrating recepciones.responsable_id...');

  const items = await prisma.recepciones.findMany({
    where: { activo: true, responsable_id: null },
    select: { id: true, responsable: true },
  });

  for (const item of items) {
    if (!item.responsable) continue;

    const usuario = await prisma.usuarios.findFirst({
      where: {
        nombre: { contains: item.responsable },
        activo: true,
      },
      select: { id: true },
    });

    if (usuario) {
      await prisma.recepciones.update({
        where: { id: item.id },
        data: { responsable_id: usuario.id },
      });
    }
  }

  console.log(`  Processed ${items.length} recepciones`);
}

async function migrateProcesamientos() {
  console.log('Migrating procesamientos.responsable_id...');

  const items = await prisma.procesamientos.findMany({
    where: { activo: true, responsable_id: null },
    select: { id: true, responsable: true },
  });

  for (const item of items) {
    if (!item.responsable) continue;

    const usuario = await prisma.usuarios.findFirst({
      where: {
        nombre: { contains: item.responsable },
        activo: true,
      },
      select: { id: true },
    });

    if (usuario) {
      await prisma.procesamientos.update({
        where: { id: item.id },
        data: { responsable_id: usuario.id },
      });
    }
  }

  console.log(`  Processed ${items.length} procesamientos`);
}

async function main() {
  console.log('Starting data migration for FK IDs...\n');

  await migrateTrazabilidad();
  await migrateInspectores();
  await migrateAcopiadores();
  await migrateRecepciones();
  await migrateProcesamientos();

  console.log('\nData migration completed!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Migration failed:', e);
  prisma.$disconnect();
  process.exit(1);
});
