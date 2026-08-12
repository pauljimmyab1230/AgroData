import { Router } from 'express';
import * as inspeccionesController from '../controllers/inspecciones.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createInspeccionSchema,
  updateInspeccionSchema,
  getAllInspeccionesSchema,
} from '../validators/inspecciones.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllInspeccionesSchema), inspeccionesController.getAll);
router.get('/:id', inspeccionesController.getById);
router.post('/', validate(createInspeccionSchema), inspeccionesController.create);
router.put('/:id', validate(updateInspeccionSchema), inspeccionesController.update);
router.delete('/:id', inspeccionesController.remove);

export default router;
