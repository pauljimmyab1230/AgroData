import type { Response, NextFunction } from 'express';
import * as ordenesService from '../services/ordenes.service';
import type { AuthRequest } from '../middleware/auth.middleware';

// ==================== CRUD ====================
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordenesService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      etapa: req.query.etapa as string | undefined,
      formato_salida: req.query.formato_salida as string | undefined,
      receta_id: req.query.receta_id ? Number(req.query.receta_id) : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.getById(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Orden de procesamiento creada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.update(Number(req.params.id), req.body);
    res.status(200).json({
      success: true,
      message: 'Orden actualizada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordenesService.remove(Number(req.params.id));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// ==================== Operaciones ejecutadas ====================
export const addOperacion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.addOperacion(Number(req.params.id), req.body);
    res.status(201).json({
      success: true,
      message: 'Operación registrada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOperacion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.updateOperacion(
      Number(req.params.id),
      Number(req.params.operacionOrdenId),
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Operación actualizada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const removeOperacion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordenesService.removeOperacion(
      Number(req.params.id),
      Number(req.params.operacionOrdenId),
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// ==================== Salidas pesadas ====================
export const addSalida = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.addSalida(Number(req.params.id), req.body);
    res.status(201).json({
      success: true,
      message: 'Salida registrada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSalida = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.updateSalida(
      Number(req.params.id),
      Number(req.params.salidaId),
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Salida actualizada exitosamente',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSalida = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordenesService.removeSalida(
      Number(req.params.id),
      Number(req.params.salidaId),
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// ==================== Balance y finalización ====================
export const getBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.getBalance(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const finalizar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const data = await ordenesService.finalizar(Number(req.params.id), userId);
    res.status(200).json({
      success: true,
      message: 'Orden finalizada y balance validado',
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Encadenamiento ====================
export const encadenar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const data = await ordenesService.encadenar(Number(req.params.id), req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Orden siguiente creada desde la orden de origen',
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Trazabilidad y estadísticas ====================
export const getTrazabilidad = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.getTrazabilidad(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await ordenesService.getStats();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
