import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos de prueba...');

  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const passwordHashDemo = await bcrypt.hash('Demo123!', 10);

  const admin = await prisma.usuarios.upsert({
    where: { email: 'admin@agrodata.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@agrodata.com',
      password: passwordHash,
      rol: 'ADMIN',
      activo: true,
    },
  });

  const usuario1 = await prisma.usuarios.upsert({
    where: { email: 'carlos.mendoza@agrodata.com' },
    update: {},
    create: {
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@agrodata.com',
      password: passwordHashDemo,
      rol: 'USER',
      activo: true,
    },
  });

  const usuario2 = await prisma.usuarios.upsert({
    where: { email: 'maria.garcia@agrodata.com' },
    update: {},
    create: {
      nombre: 'María García',
      email: 'maria.garcia@agrodata.com',
      password: passwordHashDemo,
      rol: 'USER',
      activo: true,
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`   - Admin: ${admin.email} (Admin123!)`);
  console.log(`   - Usuario 1: ${usuario1.email} (Demo123!)`);
  console.log(`   - Usuario 2: ${usuario2.email} (Demo123!)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🎉 Seed completado exitosamente.');
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
