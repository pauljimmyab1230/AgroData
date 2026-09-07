import { Router } from 'express';
import * as kardexController from '../controllers/kardex.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createKardexSchema,
  updateKardexSchema,
  getAllKardexSchema,
  addMovimientoSchema,
} from '../validators/kardex.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllKardexSchema, 'query'), kardexController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), kardexController.getById);
router.post('/', validate(createKardexSchema), kardexController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateKardexSchema), kardexController.update);
router.delete('/:id', validate(idParamSchema, 'params'), kardexController.remove);
router.post('/:id/movimientos', validate(idParamSchema, 'params'), validate(addMovimientoSchema), kardexController.addMovimiento);
router.delete('/:id/movimientos/:movimientoId', kardexController.removeMovimiento);

export default router;
