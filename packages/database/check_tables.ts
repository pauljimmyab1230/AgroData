import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const r = await p.$queryRawUnsafe('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?', 'agrodata');
  console.log((r as any[]).map(t => t.TABLE_NAME).join('\n'));
  await p.$disconnect();
})();
