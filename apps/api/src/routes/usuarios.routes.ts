import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller';
import { validate } from '../middleware/validate.middleware';
import {
  usuarioIdParamSchema,
  listUsuariosQuerySchema,
  createUsuarioSchema,
  updateUsuarioSchema,
} from '../validators/usuarios.validator';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// ─── List & Basic (must come before /:id) ─────────────────
router.get('/', validate(listUsuariosQuerySchema, 'query'), usuariosController.getAll);
router.get('/basic', usuariosController.getBasic);

// ─── CRUD by ID ───────────────────────────────────────────
router.get('/:id', validate(usuarioIdParamSchema, 'params'), usuariosController.getById);
router.post('/', adminMiddleware, validate(createUsuarioSchema), usuariosController.create);
router.put(
  '/:id',
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
