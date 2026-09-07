import { Router } from 'express';
import * as acopiosController from '../controllers/acopios.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createAcopioSchema,
  updateAcopioSchema,
  getAllAcopiosSchema,
} from '../validators/acopios.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/stats', acopiosController.getStats);
router.get('/buscar/:codigo', acopiosController.getByCodigo);
router.get('/', validate(getAllAcopiosSchema), acopiosController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), acopiosController.getById);
router.post('/', adminMiddleware, validate(createAcopioSchema), acopiosController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateAcopioSchema), acopiosController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), acopiosController.remove);

export default router;
