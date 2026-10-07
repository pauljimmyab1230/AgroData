import { Router } from 'express';
import * as operacionesController from '../controllers/operaciones.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createOperacionSchema,
  updateOperacionSchema,
} from '../validators/ordenes.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/activas', operacionesController.getActivas);
router.get('/', operacionesController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), operacionesController.getById);
router.post('/', adminMiddleware, validate(createOperacionSchema), operacionesController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateOperacionSchema), operacionesController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), operacionesController.remove);

export default router;
