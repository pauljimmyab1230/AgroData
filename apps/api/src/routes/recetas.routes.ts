import { Router } from 'express';
import * as recetasController from '../controllers/recetas.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createRecetaSchema,
  updateRecetaSchema,
} from '../validators/ordenes.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/activas', recetasController.getActivas);
router.get('/', recetasController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), recetasController.getById);
router.post('/', adminMiddleware, validate(createRecetaSchema), recetasController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateRecetaSchema), recetasController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), recetasController.remove);

export default router;
