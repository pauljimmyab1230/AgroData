import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import prisma from './config/database';
import { errorHandler, createError } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { rateLimit } from './middleware/upload.middleware';
import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productoresRoutes from './routes/productores.routes';
import parcelasRoutes from './routes/parcelas.routes';
import uploadRoutes from './routes/upload.routes';
import campaniasRoutes from './routes/campanias.routes';
import cultivosRoutes from './routes/cultivos.routes';
import actividadesRoutes from './routes/actividades.routes';
import inspeccionesRoutes from './routes/inspecciones.routes';
import acopiosRoutes from './routes/acopios.routes';
import recepcionRoutes from './routes/recepcion.routes';
import procesamientoRoutes from './routes/procesamiento.routes';
import kardexRoutes from './routes/kardex.routes';
import catalogosRoutes from './routes/catalogos.routes';
import ubigeoRoutes from './routes/ubigeo.routes';

const app = express();

// Detrás de un proxy/load balancer: necesario para que req.ip sea la IP real.
app.set('trust proxy', 1);

const allowedOrigins = new Set<string>([env.FRONTEND_URL, ...env.FRONTEND_URLS]);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (env.NODE_ENV === 'development' && /\.devtunnels\.ms$/i.test(origin)) return true;
  return false;
};

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(createError('Origen no permitido por CORS', 403));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limit global: 300 peticiones por minuto por IP.
app.use('/api', rateLimit(60 * 1000, 300));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'AgroData API funcionando correctamente',
      database: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'La base de datos no está disponible',
      database: 'error',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productores', productoresRoutes);
app.use('/api/parcelas', parcelasRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/campanias', campaniasRoutes);
app.use('/api/cultivos', cultivosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/inspecciones', inspeccionesRoutes);
app.use('/api/acopios', acopiosRoutes);
app.use('/api/recepciones', recepcionRoutes);
app.use('/api/procesamientos', procesamientoRoutes);
app.use('/api/kardex', kardexRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/ubigeo', ubigeoRoutes);
// /uploads solo accesible autenticado (documentos personales, fotos y firmas)
app.use('/uploads', authMiddleware, express.static(path.join(__dirname, '..', 'uploads')));

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

app.use(errorHandler);

export default app;
