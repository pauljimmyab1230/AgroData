import { Router } from 'express';
import * as cultivosController from '../controllers/cultivos.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createCultivoSchema,
  updateCultivoSchema,
  getAllCultivosSchema,
  getStatsCultivosSchema,
} from '../validators/cultivos.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllCultivosSchema), cultivosController.getAll);
router.get('/stats', validate(getStatsCultivosSchema), cultivosController.getGlobalStats);
router.get('/:id', validate(idParamSchema, 'params'), cultivosController.getById);
router.post('/', adminMiddleware, validate(createCultivoSchema), cultivosController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateCultivoSchema), cultivosController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), cultivosController.remove);

export default router;
