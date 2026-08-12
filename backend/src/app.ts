import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productoresRoutes from './routes/productores.routes';
import parcelasRoutes from './routes/parcelas.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
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

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

app.use(errorHandler);

export default app;
