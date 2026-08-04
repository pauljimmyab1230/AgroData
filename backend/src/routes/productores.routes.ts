import { Router, NextFunction, Response } from 'express';
import * as productoresController from '../controllers/productores.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import {
  createProductorSchema,
  updateProductorSchema,
  createFamiliarSchema,
  updateFamiliarSchema,
  createParcelaSchema,
  updateParcelaSchema,
} from '../validators/productores.validator';

const router = Router();

router.use(authMiddleware);

// ─── Productores ────────────────────────────────────────────

router.get('/', productoresController.getAll);
router.get('/:id', productoresController.getById);
router.post('/', validate(createProductorSchema), productoresController.create);
router.put('/:id', validate(updateProductorSchema), productoresController.update);
router.delete('/:id', productoresController.remove);

// ─── Familiares ─────────────────────────────────────────────

router.get('/:id/familiares', productoresController.getFamiliares);
router.post('/:id/familiares', validate(createFamiliarSchema), productoresController.createFamiliar);

router.put('/:id/familiares/:familiarId', (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.familiarId = req.params.familiarId;
  next();
}, validate(updateFamiliarSchema), productoresController.updateFamiliar);

router.delete('/:id/familiares/:familiarId', (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.familiarId = req.params.familiarId;
  next();
}, productoresController.removeFamiliar);

// ─── Parcelas ───────────────────────────────────────────────

router.get('/:id/parcelas', productoresController.getParcelas);
router.post('/:id/parcelas', validate(createParcelaSchema), productoresController.createParcela);

router.put('/:id/parcelas/:parcelaId', (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.parcelaId = req.params.parcelaId;
  next();
}, validate(updateParcelaSchema), productoresController.updateParcela);

router.delete('/:id/parcelas/:parcelaId', (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.parcelaId = req.params.parcelaId;
  next();
}, productoresController.removeParcela);

// ─── Documentos ─────────────────────────────────────────────

router.get('/:id/documentos', productoresController.getDocumentos);
router.post('/:id/documentos', productoresController.createDocumento);
router.put('/:id/documentos/:documentoId/estado', productoresController.updateDocumentoEstado);
router.delete('/:id/documentos/:documentoId', productoresController.removeDocumento);

export default router;
