import { Router } from 'express';
import * as productoresController from '../controllers/productores.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createProductorSchema,
  updateProductorSchema,
  createFamiliarSchema,
  updateFamiliarSchema,
  createDocumentoSchema,
  updateDocumentoEstadoSchema,
  getAllProductoresSchema,
} from '../validators/productores.validator';
import { idParamSchema, idFamiliarParamSchema, idDocumentoParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// ─── Productores ────────────────────────────────────────────

router.get('/comunidades', productoresController.getComunidades);
router.get('/', validate(getAllProductoresSchema), productoresController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), productoresController.getById);
router.post('/', validate(createProductorSchema), productoresController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateProductorSchema), productoresController.update);
router.delete('/:id', validate(idParamSchema, 'params'), productoresController.remove);

// ─── Familiares ─────────────────────────────────────────────

router.get('/:id/familiares', validate(idParamSchema, 'params'), productoresController.getFamiliares);
router.post('/:id/familiares', validate(idParamSchema, 'params'), validate(createFamiliarSchema), productoresController.createFamiliar);

router.put('/:id/familiares/:familiarId', validate(idParamSchema, 'params'), validate(idFamiliarParamSchema, 'params'), validate(updateFamiliarSchema), productoresController.updateFamiliar);

router.delete('/:id/familiares/:familiarId', validate(idParamSchema, 'params'), validate(idFamiliarParamSchema, 'params'), productoresController.removeFamiliar);

// ─── Parcelas ───────────────────────────────────────────────
// Las parcelas se gestionan desde /api/parcelas con filtro ?productor_id=

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', validate(idParamSchema, 'params'), productoresController.getDocumentos);
router.post('/:id/documentos', validate(idParamSchema, 'params'), validate(createDocumentoSchema), productoresController.createDocumento);
router.put('/:id/documentos/:documentoId/estado', validate(idParamSchema, 'params'), validate(idDocumentoParamSchema, 'params'), validate(updateDocumentoEstadoSchema), productoresController.updateDocumentoEstado);
router.delete('/:id/documentos/:documentoId', validate(idParamSchema, 'params'), validate(idDocumentoParamSchema, 'params'), productoresController.removeDocumento);

export default router;
