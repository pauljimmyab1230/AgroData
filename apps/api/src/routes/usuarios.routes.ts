import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller';
import { validate } from '../middleware/validate.middleware';
import {
  usuarioIdParamSchema,
  listUsuariosQuerySchema,
  createUsuarioSchema,
  updateUsuarioSchema,
  updateMeSchema,
} from '../validators/usuarios.validator';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// ─── List & Basic (must come before /:id) ─────────────────
router.get('/', adminMiddleware, validate(listUsuariosQuerySchema, 'query'), usuariosController.getAll);
router.get('/basic', usuariosController.getBasic);

// Autoupdate del propio usuario (sin campos de rol/activo). Debe ir antes de /:id
router.patch('/me', validate(updateMeSchema), usuariosController.updateMe);

// ─── CRUD by ID ───────────────────────────────────────────
router.get('/:id', adminMiddleware, validate(usuarioIdParamSchema, 'params'), usuariosController.getById);
router.post('/', adminMiddleware, validate(createUsuarioSchema), usuariosController.create);
router.put(
  '/:id',
  adminMiddleware,
  validate(usuarioIdParamSchema, 'params'),
  validate(updateUsuarioSchema),
  usuariosController.update,
);
router.delete(
  '/:id',
  validate(usuarioIdParamSchema, 'params'),
  adminMiddleware,
  usuariosController.remove,
);

export default router;
