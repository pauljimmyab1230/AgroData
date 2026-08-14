import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller';
import { validate } from '../middleware/validate.middleware';
import { createUsuarioSchema, updateUsuarioSchema } from '../validators/usuarios.validator';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', usuariosController.getAll);
router.get('/:id', usuariosController.getById);
router.post('/', adminMiddleware, validate(createUsuarioSchema), usuariosController.create);
router.put('/:id', validate(updateUsuarioSchema), usuariosController.update);
router.delete('/:id', adminMiddleware, usuariosController.remove);

export default router;
