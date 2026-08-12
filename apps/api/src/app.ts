import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
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
import lotesRoutes from './routes/lotes.routes';
import inventarioRoutes from './routes/inventario.routes';
import trazabilidadRoutes from './routes/trazabilidad.routes';

const app = express();

const allowedOrigins = new Set<string>([env.FRONTEND_URL, ...env.FRONTEND_URLS]);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AgroData API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
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
app.use('/api/lotes', lotesRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/trazabilidad', trazabilidadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

app.use(errorHandler);

export default app;
