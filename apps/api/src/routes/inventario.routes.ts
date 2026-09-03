import { Router } from 'express';
import * as inventarioController from '../controllers/inventario.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createInventarioSchema,
  updateInventarioSchema,
  getAllInventarioSchema,
  addMovimientoSchema,
} from '../validators/inventario.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllInventarioSchema, 'query'), inventarioController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), inventarioController.getById);
router.post('/', validate(createInventarioSchema), inventarioController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateInventarioSchema), inventarioController.update);
router.delete('/:id', validate(idParamSchema, 'params'), inventarioController.remove);
router.post('/:id/movimientos', validate(idParamSchema, 'params'), validate(addMovimientoSchema), inventarioController.addMovimiento);

export default router;
