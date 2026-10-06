import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, changePasswordSchema, refreshTokenSchema } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/upload.middleware';

const router = Router();

const authRateLimit = rateLimit(15 * 60 * 1000, 20);
const loginRateLimit = rateLimit(15 * 60 * 1000, 10);

// Login: rate limit más agresivo que el resto de rutas de auth
router.post('/login', loginRateLimit, validate(loginSchema), authController.login);

// Registro público eliminado: los usuarios los crea un administrador
// vía POST /api/usuarios (protegido con adminMiddleware).

// Refresh token rotativo (opción A: Bearer + refresh en memoria/localStorage)
router.post('/refresh', authRateLimit, validate(refreshTokenSchema), authController.refresh);

// Logout: revoca el refresh token actual
router.post('/logout', authMiddleware, authController.logout);

// Cambio de contraseña: exige la contraseña actual
router.patch('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

router.get('/profile', authMiddleware, authController.getProfile);

export default router;
