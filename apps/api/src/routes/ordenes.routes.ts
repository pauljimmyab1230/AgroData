import { Router } from 'express';
import * as ordenesController from '../controllers/ordenes.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createOrdenSchema,
  updateOrdenSchema,
  listOrdenesQuerySchema,
  createOperacionEjecutadaSchema,
  updateOperacionEjecutadaSchema,
  createSalidaSchema,
  updateSalidaSchema,
  idSalidaParamSchema,
  idOperacionOrdenParamSchema,
} from '../validators/ordenes.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// Estadísticas (antes de /:id)
router.get('/stats', ordenesController.getStats);

// Listado y detalle
router.get('/', validate(listOrdenesQuerySchema, 'query'), ordenesController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), ordenesController.getById);
router.get('/:id/balance', validate(idParamSchema, 'params'), ordenesController.getBalance);
router.get('/:id/trazabilidad', validate(idParamSchema, 'params'), ordenesController.getTrazabilidad);

// CRUD
router.post('/', validate(createOrdenSchema), ordenesController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateOrdenSchema), ordenesController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), ordenesController.remove);

// Operaciones ejecutadas
router.post('/:id/operaciones', validate(idParamSchema, 'params'), validate(createOperacionEjecutadaSchema), ordenesController.addOperacion);
router.put('/:id/operaciones/:operacionOrdenId', validate(idOperacionOrdenParamSchema, 'params'), validate(updateOperacionEjecutadaSchema), ordenesController.updateOperacion);
router.delete('/:id/operaciones/:operacionOrdenId', validate(idOperacionOrdenParamSchema, 'params'), ordenesController.removeOperacion);

// Salidas pesadas
router.post('/:id/salidas', validate(idParamSchema, 'params'), validate(createSalidaSchema), ordenesController.addSalida);
router.put('/:id/salidas/:salidaId', validate(idSalidaParamSchema, 'params'), validate(updateSalidaSchema), ordenesController.updateSalida);
router.delete('/:id/salidas/:salidaId', validate(idSalidaParamSchema, 'params'), ordenesController.removeSalida);

// Finalización (valida balance, registra en kardex)
router.post('/:id/finalizar', validate(idParamSchema, 'params'), ordenesController.finalizar);

// Encadenamiento de etapas
router.post('/:id/encadenar', validate(idParamSchema, 'params'), validate(createOrdenSchema), ordenesController.encadenar);

export default router;
