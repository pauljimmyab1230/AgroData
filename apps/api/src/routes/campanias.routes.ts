import { Router } from 'express';
import * as campaniasController from '../controllers/campanias.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCampaniaSchema,
  updateCampaniaSchema,
  getAllCampaniasSchema,
} from '../validators/campanias.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllCampaniasSchema), campaniasController.getAll);
router.get('/stats', campaniasController.getGlobalStats);
router.get('/:id', validate(idParamSchema, 'params'), campaniasController.getById);
router.get('/:id/stats', validate(idParamSchema, 'params'), campaniasController.getStats);
router.post('/', validate(createCampaniaSchema), campaniasController.create);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateCampaniaSchema), campaniasController.update);
router.delete('/:id', validate(idParamSchema, 'params'), campaniasController.remove);

export default router;
