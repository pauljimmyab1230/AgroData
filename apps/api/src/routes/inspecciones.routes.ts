import { Router } from 'express';
import * as inspeccionesController from '../controllers/inspecciones.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createInspeccionSchema,
  updateInspeccionSchema,
  getAllInspeccionesSchema,
  getStatsInspeccionesSchema,
} from '../validators/inspecciones.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllInspeccionesSchema, 'query'), inspeccionesController.getAll);
router.get('/stats', validate(getStatsInspeccionesSchema, 'query'), inspeccionesController.getGlobalStats);
router.get('/:id', validate(idParamSchema, 'params'), inspeccionesController.getById);
router.post('/', validate(createInspeccionSchema), inspeccionesController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateInspeccionSchema), inspeccionesController.update);
router.delete('/:id', validate(idParamSchema, 'params'), inspeccionesController.remove);

export default router;
