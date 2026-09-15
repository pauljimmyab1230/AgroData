import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const c = await p.productor.count();
  console.log('Productores:', c);
  await p.$disconnect();
})();
