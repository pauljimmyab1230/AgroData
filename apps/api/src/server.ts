import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const PORT = env.PORT;

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`AgroData API ejecutándose en puerto ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown: cierra el servidor y las conexiones de BD.
let cerrando = false;
const apagar = async (senal: string): Promise<void> => {
  if (cerrando) return;
  cerrando = true;
  console.log(`\nRecibida ${senal}. Cerrando servidor...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Conexiones de base de datos cerradas.');
    } catch (e) {
      console.error('Error al desconectar Prisma:', e);
    } finally {
      process.exit(0);
    }
  });

  // Fuerza el cierre si el servidor no termina en 10s.
  setTimeout(() => {
    console.error('Timeout al cerrar el servidor. Forzando salida.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => void apagar('SIGTERM'));
process.on('SIGINT', () => void apagar('SIGINT'));
