import { Response, NextFunction } from 'express';
import * as kardexService from '../services/kardex.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await kardexService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      categoria: req.query.categoria as string | undefined,
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
    const item = await kardexService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await kardexService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Item de kardex registrado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await kardexService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Item de kardex actualizado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await kardexService.remove(req.params.id);
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
    const movimiento = await kardexService.addMovimiento(req.params.id, req.body);
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
    const result = await kardexService.removeMovimiento(req.params.id, req.params.movimientoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
