import { Router } from 'express';
import * as catalogosController from '../controllers/catalogos.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createCatalogoSchema,
  updateCatalogoSchema,
  getAllCatalogosSchema,
  catalogoTipoSchema,
  catalogoIdSchema,
} from '../validators/catalogos.validator';

const router = Router();

router.use(authMiddleware);

// GET /api/catalogos/:tipo - Listar items de un catálogo
router.get('/:tipo', validate(catalogoTipoSchema, 'params'), validate(getAllCatalogosSchema, 'query'), catalogosController.getAll);

// GET /api/catalogos/:tipo/activos - Solo activos (para dropdowns)
router.get('/:tipo/activos', validate(catalogoTipoSchema, 'params'), catalogosController.getActivos);

// GET /api/catalogos/item/:id - Obtener un item por ID
router.get('/item/:id', validate(catalogoIdSchema, 'params'), catalogosController.getById);

// POST /api/catalogos/:tipo - Crear item
router.post('/:tipo', validate(catalogoTipoSchema, 'params'), validate(createCatalogoSchema), catalogosController.create);

// PUT /api/catalogos/item/:id - Actualizar item
router.put('/item/:id', validate(catalogoIdSchema, 'params'), validate(updateCatalogoSchema), catalogosController.update);

// PATCH /api/catalogos/item/:id/toggle - Toggle activo/inactivo
router.patch('/item/:id/toggle', validate(catalogoIdSchema, 'params'), catalogosController.toggleActivo);

// DELETE /api/catalogos/item/:id - Eliminar item
router.delete('/item/:id', validate(catalogoIdSchema, 'params'), catalogosController.remove);

export default router;
