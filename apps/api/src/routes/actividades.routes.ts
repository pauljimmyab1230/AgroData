import { Router } from 'express';
import * as actividadesController from '../controllers/actividades.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createActividadSchema,
  updateActividadSchema,
  getAllActividadesSchema,
} from '../validators/actividades.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllActividadesSchema), actividadesController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), actividadesController.getById);
router.post('/', validate(createActividadSchema), actividadesController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateActividadSchema), actividadesController.update);
router.delete('/:id', validate(idParamSchema, 'params'), actividadesController.remove);

export default router;
