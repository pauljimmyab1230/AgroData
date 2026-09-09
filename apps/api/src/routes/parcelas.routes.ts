import { Router } from 'express';
import * as parcelasController from '../controllers/parcelas.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createParcelaSchema,
  updateParcelaSchema,
  createParcelaDocumentoSchema,
  updateParcelaDocumentoSchema,
  createParcelaFotoSchema,
  updateParcelaFotoSchema,
  getAllParcelasSchema,
} from '../validators/parcelas.validator';
import { idParamSchema, idDocumentoParamSchema, idFotoParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// ─── Parcelas ───────────────────────────────────────────────

router.get('/stats', validate(getAllParcelasSchema, 'query'), parcelasController.getStats);
router.get('/', validate(getAllParcelasSchema, 'query'), parcelasController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), parcelasController.getById);
router.get('/:id/historial', validate(idParamSchema, 'params'), parcelasController.getHistorial);
router.post('/', adminMiddleware, validate(createParcelaSchema), parcelasController.create);
router.put('/:id', adminMiddleware, validate(idParamSchema, 'params'), validate(updateParcelaSchema), parcelasController.update);
router.delete('/:id', adminMiddleware, validate(idParamSchema, 'params'), parcelasController.remove);

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', validate(idParamSchema, 'params'), parcelasController.getDocumentos);
router.post('/:id/documentos', adminMiddleware, validate(idParamSchema, 'params'), validate(createParcelaDocumentoSchema), parcelasController.createDocumento);
router.put('/:id/documentos/:documentoId', adminMiddleware, validate(idParamSchema, 'params'), validate(idDocumentoParamSchema, 'params'), validate(updateParcelaDocumentoSchema), parcelasController.updateDocumento);
router.delete('/:id/documentos/:documentoId', adminMiddleware, validate(idParamSchema, 'params'), validate(idDocumentoParamSchema, 'params'), parcelasController.removeDocumento);

// ─── Fotos ──────────────────────────────────────────────────

router.get('/:id/fotos', validate(idParamSchema, 'params'), parcelasController.getFotos);
router.post('/:id/fotos', adminMiddleware, validate(idParamSchema, 'params'), validate(createParcelaFotoSchema), parcelasController.createFoto);
router.put('/:id/fotos/:fotoId', adminMiddleware, validate(idParamSchema, 'params'), validate(idFotoParamSchema, 'params'), validate(updateParcelaFotoSchema), parcelasController.updateFoto);
router.delete('/:id/fotos/:fotoId', adminMiddleware, validate(idParamSchema, 'params'), validate(idFotoParamSchema, 'params'), parcelasController.removeFoto);

export default router;
