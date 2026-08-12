import { Response, NextFunction } from 'express';
import * as procesamientoService from '../services/procesamiento.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await procesamientoService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const procesamiento = await procesamientoService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const procesamiento = await procesamientoService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Procesamiento registrado exitosamente',
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const procesamiento = await procesamientoService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Procesamiento actualizado exitosamente',
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await procesamientoService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const addLote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lote = await procesamientoService.addLote(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Lote agregado exitosamente',
      data: lote,
    });
  } catch (error) {
    next(error);
  }
};

export const removeLote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await procesamientoService.removeLote(req.params.id, req.params.loteId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const addOperacion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const operacion = await procesamientoService.addOperacion(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Operación agregada exitosamente',
      data: operacion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOperacion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const operacion = await procesamientoService.updateOperacion(req.params.id, req.params.operacionId, req.body);
    res.status(200).json({
      success: true,
      message: 'Operación actualizada exitosamente',
      data: operacion,
    });
  } catch (error) {
    next(error);
  }
};
