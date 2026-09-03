import { Router } from 'express';
import * as ubigeoController from '../controllers/ubigeo.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/departamentos', ubigeoController.getDepartamentos);
router.get('/departamentos/:dpto/provincias', ubigeoController.getProvincias);
router.get('/departamentos/:dpto/provincias/:prov/distritos', ubigeoController.getDistritos);
router.get('/codigo/:codigo', ubigeoController.getByCodigo);
router.get('/', ubigeoController.getAll);

export default router;
