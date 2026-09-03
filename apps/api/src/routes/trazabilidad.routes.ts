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
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllTrazabilidadSchema, 'query'), trazabilidadController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), trazabilidadController.getById);
router.post('/', validate(createTrazabilidadSchema), trazabilidadController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateTrazabilidadSchema), trazabilidadController.update);
router.delete('/:id', validate(idParamSchema, 'params'), trazabilidadController.remove);
router.post('/:id/eventos', validate(idParamSchema, 'params'), validate(addEventoSchema), trazabilidadController.addEvento);
router.delete('/:id/eventos/:eventoId', trazabilidadController.removeEvento);

export default router;
