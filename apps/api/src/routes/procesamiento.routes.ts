import { Router } from 'express';
import * as procesamientoController from '../controllers/procesamiento.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createProcesamientoSchema,
  updateProcesamientoSchema,
  getAllProcesamientosSchema,
  addLoteSchema,
  addOperacionSchema,
  updateOperacionSchema,
} from '../validators/procesamiento.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllProcesamientosSchema), procesamientoController.getAll);
router.get('/:id', procesamientoController.getById);
router.post('/', validate(createProcesamientoSchema), procesamientoController.create);
router.put('/:id', validate(updateProcesamientoSchema), procesamientoController.update);
router.delete('/:id', procesamientoController.remove);

router.post('/:id/lotes', validate(addLoteSchema), procesamientoController.addLote);
router.delete('/:id/lotes/:loteId', procesamientoController.removeLote);

router.post('/:id/operaciones', validate(addOperacionSchema), procesamientoController.addOperacion);
router.put('/:id/operaciones/:operacionId', validate(updateOperacionSchema), procesamientoController.updateOperacion);

export default router;
