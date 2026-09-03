import { Router } from 'express';
import * as cultivosController from '../controllers/cultivos.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCultivoSchema,
  updateCultivoSchema,
  getAllCultivosSchema,
} from '../validators/cultivos.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllCultivosSchema), cultivosController.getAll);
router.get('/stats', cultivosController.getGlobalStats);
router.get('/:id', validate(idParamSchema, 'params'), cultivosController.getById);
router.post('/', validate(createCultivoSchema), cultivosController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateCultivoSchema), cultivosController.update);
router.delete('/:id', validate(idParamSchema, 'params'), cultivosController.remove);

export default router;
