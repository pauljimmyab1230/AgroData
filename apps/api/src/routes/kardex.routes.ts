import { Router } from 'express';
import * as kardexController from '../controllers/kardex.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createKardexSchema,
  updateKardexSchema,
  getAllKardexSchema,
  addMovimientoSchema,
  getMovimientosSchema,
} from '../validators/kardex.validator';
import { idParamSchema } from '../validators/common.validator';
import Joi from 'joi';

const router = Router();

router.use(authMiddleware);

const movimientoIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  movimientoId: Joi.number().integer().positive().required(),
});

router.get('/', validate(getAllKardexSchema, 'query'), kardexController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), kardexController.getById);
router.post('/', validate(createKardexSchema), kardexController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateKardexSchema), kardexController.update);
router.delete('/:id', validate(idParamSchema, 'params'), kardexController.remove);

router.get('/:id/movimientos', validate(idParamSchema, 'params'), validate(getMovimientosSchema, 'query'), kardexController.getMovimientos);
router.post('/:id/movimientos', validate(idParamSchema, 'params'), validate(addMovimientoSchema), kardexController.addMovimiento);
router.delete('/:id/movimientos/:movimientoId', validate(movimientoIdParamSchema, 'params'), kardexController.removeMovimiento);

router.post('/:id/recompute', validate(idParamSchema, 'params'), kardexController.recomputeStock);

export default router;
