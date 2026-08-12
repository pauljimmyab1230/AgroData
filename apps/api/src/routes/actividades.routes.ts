import { Router } from 'express';
import * as actividadesController from '../controllers/actividades.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createActividadSchema,
  updateActividadSchema,
  getAllActividadesSchema,
} from '../validators/actividades.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllActividadesSchema), actividadesController.getAll);
router.get('/:id', actividadesController.getById);
router.post('/', validate(createActividadSchema), actividadesController.create);
router.put('/:id', validate(updateActividadSchema), actividadesController.update);
router.delete('/:id', actividadesController.remove);

export default router;
