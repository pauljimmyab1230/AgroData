import { Router } from 'express';
import * as acopiosController from '../controllers/acopios.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createAcopioSchema,
  updateAcopioSchema,
  getAllAcopiosSchema,
} from '../validators/acopios.validator';

const router = Router();

router.use(authMiddleware);

router.get('/stats', acopiosController.getStats);
router.get('/', validate(getAllAcopiosSchema), acopiosController.getAll);
router.get('/:id', acopiosController.getById);
router.post('/', validate(createAcopioSchema), acopiosController.create);
router.put('/:id', validate(updateAcopioSchema), acopiosController.update);
router.delete('/:id', acopiosController.remove);

export default router;
