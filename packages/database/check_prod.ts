import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const productores = await p.productor.findMany({
    where: { activo: true },
    select: { id: true, codigo: true, nombres: true, apellido_paterno: true, apellido_materno: true }
  });
  console.log('Productores activos:', JSON.stringify(productores, null, 2));
  await p.$disconnect();
})();
