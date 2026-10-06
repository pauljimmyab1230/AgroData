import { Router } from 'express';
import * as recepcionController from '../controllers/recepcion.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createRecepcionSchema,
  updateRecepcionSchema,
  getAllRecepcionesSchema,
} from '../validators/recepcion.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/stats', recepcionController.getStats);
router.get('/', validate(getAllRecepcionesSchema, 'query'), recepcionController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), recepcionController.getById);
router.post('/', adminMiddleware, validate(createRecepcionSchema), recepcionController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateRecepcionSchema), recepcionController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), recepcionController.remove);

export default router;
