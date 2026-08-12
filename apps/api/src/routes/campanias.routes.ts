import { Router } from 'express';
import * as campaniasController from '../controllers/campanias.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCampaniaSchema,
  updateCampaniaSchema,
  getAllCampaniasSchema,
} from '../validators/campanias.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllCampaniasSchema), campaniasController.getAll);
router.get('/:id', campaniasController.getById);
router.post('/', validate(createCampaniaSchema), campaniasController.create);
router.put('/:id', validate(updateCampaniaSchema), campaniasController.update);
router.delete('/:id', campaniasController.remove);

export default router;
