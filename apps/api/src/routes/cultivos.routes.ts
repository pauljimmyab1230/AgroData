import { Router } from 'express';
import * as cultivosController from '../controllers/cultivos.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCultivoSchema,
  updateCultivoSchema,
  getAllCultivosSchema,
} from '../validators/cultivos.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllCultivosSchema), cultivosController.getAll);
router.get('/:id', cultivosController.getById);
router.post('/', validate(createCultivoSchema), cultivosController.create);
router.put('/:id', validate(updateCultivoSchema), cultivosController.update);
router.delete('/:id', cultivosController.remove);

export default router;
