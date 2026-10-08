import { Router } from 'express';
import * as kardexController from '../controllers/kardex.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createKardexSchema,
  updateKardexSchema,
  getAllKardexSchema,
  addMovimientoSchema,
  getMovimientosSchema,
} from '../validators/kardex.validator';
import { idParamSchema } from '../validators/common.validator';
import Joi from 'joi';

const router = Router();

router.use(authMiddleware);

const movimientoIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  movimientoId: Joi.number().integer().positive().required(),
});

router.get('/', validate(getAllKardexSchema, 'query'), kardexController.getAll);

// Rutas fijas antes de /:id para evitar conflicto de parámetros
router.get('/inventario', kardexController.getInventario);
router.get('/alertas', kardexController.getAlertas);
router.get('/movimientos', kardexController.getMovimientosGlobales);
router.get('/stats', kardexController.getStats);
router.post('/salidas', kardexController.registrarSalida);

router.get('/:id', validate(idParamSchema, 'params'), kardexController.getById);
router.post('/', adminMiddleware, validate(createKardexSchema), kardexController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateKardexSchema), kardexController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), kardexController.remove);

router.get('/:id/movimientos', validate(idParamSchema, 'params'), validate(getMovimientosSchema, 'query'), kardexController.getMovimientos);
router.post('/:id/movimientos', adminMiddleware, validate(idParamSchema, 'params'), validate(addMovimientoSchema), kardexController.addMovimiento);
router.delete('/:id/movimientos/:movimientoId', adminMiddleware, validate(movimientoIdParamSchema, 'params'), kardexController.removeMovimiento);

router.post('/:id/recompute', adminMiddleware, validate(idParamSchema, 'params'), kardexController.recomputeStock);
router.post('/:id/baja', validate(idParamSchema, 'params'), kardexController.darDeBaja);

export default router;
