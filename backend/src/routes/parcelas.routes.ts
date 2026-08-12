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
} from '../validators/parcelas.validator';

const router = Router();

router.use(authMiddleware);

// ─── Parcelas ───────────────────────────────────────────────

router.get('/', parcelasController.getAll);
router.get('/:id', parcelasController.getById);
router.post('/', validate(createParcelaSchema), parcelasController.create);
router.put('/:id', validate(updateParcelaSchema), parcelasController.update);
router.delete('/:id', parcelasController.remove);

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', parcelasController.getDocumentos);
router.post('/:id/documentos', validate(createParcelaDocumentoSchema), parcelasController.createDocumento);
router.put('/:id/documentos/:documentoId', validate(updateParcelaDocumentoSchema), parcelasController.updateDocumento);
router.delete('/:id/documentos/:documentoId', parcelasController.removeDocumento);

// ─── Fotos ──────────────────────────────────────────────────

router.get('/:id/fotos', parcelasController.getFotos);
router.post('/:id/fotos', validate(createParcelaFotoSchema), parcelasController.createFoto);
router.put('/:id/fotos/:fotoId', validate(updateParcelaFotoSchema), parcelasController.updateFoto);
router.delete('/:id/fotos/:fotoId', parcelasController.removeFoto);

export default router;
