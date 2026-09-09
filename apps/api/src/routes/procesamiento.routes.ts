import { Router } from 'express';
import * as procesamientoController from '../controllers/procesamiento.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createProcesamientoSchema,
  updateProcesamientoSchema,
  getAllProcesamientosSchema,
} from '../validators/procesamiento.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllProcesamientosSchema, 'query'), procesamientoController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), procesamientoController.getById);
router.post('/', adminMiddleware, validate(createProcesamientoSchema), procesamientoController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateProcesamientoSchema), procesamientoController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), procesamientoController.remove);

export default router;
