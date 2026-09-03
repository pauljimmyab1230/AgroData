import { Router } from 'express';
import * as lotesController from '../controllers/lotes.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createLoteSchema,
  updateLoteSchema,
  getAllLotesSchema,
  addMovimientoSchema,
} from '../validators/lotes.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllLotesSchema, 'query'), lotesController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), lotesController.getById);
router.post('/', validate(createLoteSchema), lotesController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateLoteSchema), lotesController.update);
router.delete('/:id', validate(idParamSchema, 'params'), lotesController.remove);
router.post('/:id/movimientos', validate(idParamSchema, 'params'), validate(addMovimientoSchema), lotesController.addMovimiento);
router.delete('/:id/movimientos/:movimientoId', lotesController.removeMovimiento);

export default router;
