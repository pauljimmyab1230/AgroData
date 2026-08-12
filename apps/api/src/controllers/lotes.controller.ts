import { Response, NextFunction } from 'express';
import * as lotesService from '../services/lotes.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await lotesService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      campania_id: req.query.campania_id as string | undefined,
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
    const lote = await lotesService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: lote,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lote = await lotesService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Lote registrado exitosamente',
      data: lote,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lote = await lotesService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Lote actualizado exitosamente',
      data: lote,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await lotesService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const addMovimiento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const movimiento = await lotesService.addMovimiento(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Movimiento registrado exitosamente',
      data: movimiento,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMovimiento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await lotesService.removeMovimiento(req.params.id, req.params.movimientoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
