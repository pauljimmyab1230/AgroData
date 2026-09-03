import { Router } from 'express';
import * as parcelasController from '../controllers/parcelas.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createParcelaSchema,
  updateParcelaSchema,
  createParcelaDocumentoSchema,
  updateParcelaDocumentoSchema,
  createParcelaFotoSchema,
  updateParcelaFotoSchema,
  getAllParcelasSchema,
} from '../validators/parcelas.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);

// ─── Parcelas ───────────────────────────────────────────────

router.get('/', validate(getAllParcelasSchema), parcelasController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), parcelasController.getById);
router.post('/', validate(createParcelaSchema), parcelasController.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateParcelaSchema), parcelasController.update);
router.delete('/:id', validate(idParamSchema, 'params'), parcelasController.remove);

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', validate(idParamSchema, 'params'), parcelasController.getDocumentos);
router.post('/:id/documentos', validate(idParamSchema, 'params'), validate(createParcelaDocumentoSchema), parcelasController.createDocumento);
router.put('/:id/documentos/:documentoId', validate(idParamSchema, 'params'), validate(updateParcelaDocumentoSchema), parcelasController.updateDocumento);
router.delete('/:id/documentos/:documentoId', validate(idParamSchema, 'params'), parcelasController.removeDocumento);

// ─── Fotos ──────────────────────────────────────────────────

router.get('/:id/fotos', validate(idParamSchema, 'params'), parcelasController.getFotos);
router.post('/:id/fotos', validate(idParamSchema, 'params'), validate(createParcelaFotoSchema), parcelasController.createFoto);
router.put('/:id/fotos/:fotoId', validate(idParamSchema, 'params'), validate(updateParcelaFotoSchema), parcelasController.updateFoto);
router.delete('/:id/fotos/:fotoId', validate(idParamSchema, 'params'), parcelasController.removeFoto);

export default router;
