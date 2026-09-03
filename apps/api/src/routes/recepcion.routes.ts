import { Router } from 'express';
import * as recepcionController from '../controllers/recepcion.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createRecepcionSchema,
  updateRecepcionSchema,
  getAllRecepcionesSchema,
} from '../validators/recepcion.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getAllRecepcionesSchema), recepcionController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), recepcionController.getById);
router.post('/', validate(createRecepcionSchema), recepcionController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateRecepcionSchema), recepcionController.update);
router.delete('/:id', validate(idParamSchema, 'params'), recepcionController.remove);

router.post('/:id/evidencias', validate(idParamSchema, 'params'), recepcionController.addEvidencia);
router.delete('/:id/evidencias/:evidenciaId', recepcionController.removeEvidencia);

export default router;
