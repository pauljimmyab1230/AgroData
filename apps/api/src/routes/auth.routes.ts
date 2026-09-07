import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/upload.middleware';

const router = Router();

const authRateLimit = rateLimit(15 * 60 * 1000, 20);

router.post('/login', authRateLimit, validate(loginSchema), authController.login);
router.post('/register', authRateLimit, validate(registerSchema), authController.register);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
