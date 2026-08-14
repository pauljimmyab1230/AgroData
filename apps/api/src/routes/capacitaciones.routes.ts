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

const router = Router();

router.use(authMiddleware);

// ─── Capacitaciones ──────────────────────────────────────────

router.get('/', validate(getAllCapacitacionesSchema, 'query'), capacitacionesController.getAll);
router.get('/:id', capacitacionesController.getById);
router.post('/', validate(createCapacitacionSchema), capacitacionesController.create);
router.put('/:id', validate(updateCapacitacionSchema), capacitacionesController.update);
router.delete('/:id', capacitacionesController.remove);

// ─── Participantes ───────────────────────────────────────────

router.post('/:id/participantes', validate(addParticipanteSchema), capacitacionesController.addParticipante);
router.put('/:id/participantes/:participanteId', validate(updateParticipanteSchema), capacitacionesController.updateParticipante);
router.delete('/:id/participantes/:participanteId', capacitacionesController.removeParticipante);

export default router;
