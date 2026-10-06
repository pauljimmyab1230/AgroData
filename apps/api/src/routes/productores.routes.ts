import { Router } from 'express';
import * as productoresController from '../controllers/productores.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createProductorSchema,
  updateProductorSchema,
  createFamiliarSchema,
  updateFamiliarSchema,
  createDocumentoSchema,
  updateDocumentoEstadoSchema,
  getAllProductoresSchema,
  cleanupOrphanDocumentosSchema,
} from '../validators/productores.validator';
import { idParamSchema, idFamiliarParamSchema, idDocumentoParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// ─── Stats ────────────────────────────────────────────────

router.get('/stats', productoresController.getStats);

// ─── Productores ────────────────────────────────────────────

router.get('/comunidades', productoresController.getComunidades);
router.get('/', validate(getAllProductoresSchema, 'query'), productoresController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), productoresController.getById);
router.post('/', adminMiddleware, validate(createProductorSchema), productoresController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateProductorSchema), productoresController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), productoresController.remove);

// ─── Familiares ─────────────────────────────────────────────

router.get('/:id/familiares', validate(idParamSchema, 'params'), productoresController.getFamiliares);
router.post('/:id/familiares', adminMiddleware, validate(idParamSchema, 'params'), validate(createFamiliarSchema), productoresController.createFamiliar);

router.put('/:id/familiares/:familiarId', adminMiddleware, validate(idFamiliarParamSchema, 'params'), validate(updateFamiliarSchema), productoresController.updateFamiliar);

router.delete('/:id/familiares/:familiarId', adminMiddleware, validate(idFamiliarParamSchema, 'params'), productoresController.removeFamiliar);

// ─── Parcelas ───────────────────────────────────────────────
// Las parcelas se gestionan desde /api/parcelas con filtro ?productor_id=

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', validate(idParamSchema, 'params'), productoresController.getDocumentos);
router.post('/:id/documentos', adminMiddleware, validate(idParamSchema, 'params'), validate(createDocumentoSchema), productoresController.createDocumento);
router.put('/:id/documentos/:documentoId/estado', adminMiddleware, validate(idDocumentoParamSchema, 'params'), validate(updateDocumentoEstadoSchema), productoresController.updateDocumentoEstado);
router.delete('/:id/documentos/:documentoId', adminMiddleware, validate(idDocumentoParamSchema, 'params'), productoresController.removeDocumento);

router.post('/:id/documentos/cleanup', adminMiddleware, validate(idParamSchema, 'params'), validate(cleanupOrphanDocumentosSchema, 'body'), productoresController.removeOrphanDocumentos);

export default router;
