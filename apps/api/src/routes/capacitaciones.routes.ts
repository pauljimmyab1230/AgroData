import { Router } from 'express';
import * as capacitacionesController from '../controllers/capacitaciones.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCapacitacionSchema,
  updateCapacitacionSchema,
  addParticipanteSchema,
  updateParticipanteSchema,
  getAllCapacitacionesSchema,
} from '../validators/capacitaciones.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// ─── Capacitaciones ──────────────────────────────────────────

router.get('/', validate(getAllCapacitacionesSchema, 'query'), capacitacionesController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), capacitacionesController.getById);
router.post('/', validate(createCapacitacionSchema), capacitacionesController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateCapacitacionSchema), capacitacionesController.update);
router.delete('/:id', validate(idParamSchema, 'params'), capacitacionesController.remove);

// ─── Participantes ───────────────────────────────────────────

router.post('/:id/participantes', validate(idParamSchema, 'params'), validate(addParticipanteSchema), capacitacionesController.addParticipante);
router.put('/:id/participantes/:participanteId', validate(idParamSchema, 'params'), validate(updateParticipanteSchema), capacitacionesController.updateParticipante);
router.delete('/:id/participantes/:participanteId', validate(idParamSchema, 'params'), capacitacionesController.removeParticipante);

export default router;
