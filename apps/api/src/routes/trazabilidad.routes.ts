import { Router } from 'express';
import * as trazabilidadController from '../controllers/trazabilidad.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createTrazabilidadSchema,
  updateTrazabilidadSchema,
  getAllTrazabilidadSchema,
  addEventoSchema,
} from '../validators/trazabilidad.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllTrazabilidadSchema, 'query'), trazabilidadController.getAll);
router.get('/:id', trazabilidadController.getById);
router.post('/', validate(createTrazabilidadSchema), trazabilidadController.create);
router.put('/:id', validate(updateTrazabilidadSchema), trazabilidadController.update);
router.delete('/:id', trazabilidadController.remove);
router.post('/:id/eventos', validate(addEventoSchema), trazabilidadController.addEvento);
router.delete('/:id/eventos/:eventoId', trazabilidadController.removeEvento);

export default router;
