import { Response, NextFunction } from 'express';
import * as inventarioService from '../services/inventario.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await inventarioService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      categoria: req.query.categoria as string | undefined,
      lote_id: req.query.lote_id as string | undefined,
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
    const item = await inventarioService.getById(req.params.id);
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
    const item = await inventarioService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Item de inventario registrado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await inventarioService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Item de inventario actualizado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await inventarioService.remove(req.params.id);
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
    const movimiento = await inventarioService.addMovimiento(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Movimiento registrado exitosamente',
      data: movimiento,
    });
  } catch (error) {
    next(error);
  }
};
